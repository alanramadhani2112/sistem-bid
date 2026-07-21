import { useEffect, useState } from 'react';

export type BidRow = {
    id: number;
    amount: number;
    bidder_name: string;
    placed_at?: string | null;
};

type BidPlacedPayload = {
    bid: BidRow;
    auction: {
        current_price: number;
        leaderboard: BidRow[];
    };
};

type AuctionStatusPayload = {
    auction: {
        current_price: number;
        ends_at?: string | null;
        status: string;
    };
};

type AuctionClosedPayload = AuctionStatusPayload & {
    winner: {
        bidder_name: string;
        winning_amount: number;
    } | null;
};

export function useAuctionRoom(auctionId: number, initialPrice: number, initialLeaderboard: BidRow[], initialHistory: BidRow[], initialStatus = 'live') {
    const [auctionStatus, setAuctionStatus] = useState(initialStatus);
    const [currentPrice, setCurrentPrice] = useState(initialPrice);
    const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
    const [bidHistory, setBidHistory] = useState(initialHistory);
    const [winner, setWinner] = useState<AuctionClosedPayload['winner']>(null);

    useEffect(() => {
        const channel = window.Echo.channel(`auction.${auctionId}`)
            .listen('.BidPlaced', (payload: BidPlacedPayload) => {
                setCurrentPrice(payload.auction.current_price);
                setLeaderboard(payload.auction.leaderboard);
                setBidHistory((current) => [payload.bid, ...current].slice(0, 20));
            })
            .listen('.AuctionStatusChanged', (payload: AuctionStatusPayload) => {
                setAuctionStatus(payload.auction.status);
                setCurrentPrice(payload.auction.current_price);
            })
            .listen('.AuctionClosed', (payload: AuctionClosedPayload) => {
                setAuctionStatus(payload.auction.status);
                setCurrentPrice(payload.auction.current_price);
                setWinner(payload.winner);
            });

        return () => {
            channel.stopListening('.BidPlaced');
            channel.stopListening('.AuctionStatusChanged');
            channel.stopListening('.AuctionClosed');
            window.Echo.leave(`auction.${auctionId}`);
        };
    }, [auctionId]);

    return { auctionStatus, bidHistory, currentPrice, leaderboard, winner };
}
