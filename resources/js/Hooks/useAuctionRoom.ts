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

export function useAuctionRoom(auctionId: number, initialPrice: number, initialLeaderboard: BidRow[], initialHistory: BidRow[]) {
    const [currentPrice, setCurrentPrice] = useState(initialPrice);
    const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
    const [bidHistory, setBidHistory] = useState(initialHistory);

    useEffect(() => {
        const channel = window.Echo.channel(`auction.${auctionId}`).listen('.BidPlaced', (payload: BidPlacedPayload) => {
            setCurrentPrice(payload.auction.current_price);
            setLeaderboard(payload.auction.leaderboard);
            setBidHistory((current) => [payload.bid, ...current].slice(0, 20));
        });

        return () => {
            channel.stopListening('.BidPlaced');
            window.Echo.leave(`auction.${auctionId}`);
        };
    }, [auctionId]);

    return { bidHistory, currentPrice, leaderboard };
}
