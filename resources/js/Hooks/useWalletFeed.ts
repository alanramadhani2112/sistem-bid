import { useEffect } from 'react';

export type WalletTransactionPayload = {
    type: string;
    amount: number;
    balance_before: number;
    balance_after: number;
    reference: string | null;
    notes: string | null;
    created_at: string;
};

type WalletUpdatedPayload = {
    wallet: {
        balance: number;
    };
    transaction: WalletTransactionPayload;
};

export function useWalletFeed(userId: number | undefined, onChange: (payload: WalletUpdatedPayload) => void) {
    useEffect(() => {
        if (!userId) return;

        const channelName = `user.${userId}`;
        const channel = window.Echo.private(channelName).listen('.WalletUpdated', onChange);

        return () => {
            channel.stopListening('.WalletUpdated');
            window.Echo.leave(channelName);
        };
    }, [onChange, userId]);
}
