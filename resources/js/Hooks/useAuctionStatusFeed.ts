import { useEffect } from 'react';

type AuctionStatusPayload<T> = {
    auction: T & { id: number; status: string };
};

export function useAuctionStatusFeed<T extends { id: number; status: string }>(onChange: (auction: T) => void) {
    useEffect(() => {
        const update = (payload: AuctionStatusPayload<T>) => onChange(payload.auction);
        const channel = window.Echo.channel('auctions').listen('.AuctionStatusChanged', update).listen('.AuctionClosed', update);

        return () => {
            channel.stopListening('.AuctionStatusChanged');
            channel.stopListening('.AuctionClosed');
            window.Echo.leave('auctions');
        };
    }, [onChange]);
}
