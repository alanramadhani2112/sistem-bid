import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { PageHeader } from '@/components/app/PageHeader';
import { PriceText } from '@/components/app/PriceText';
import { SectionCard } from '@/components/app/SectionCard';
import { AppShell } from '../../../Layouts/AppShell';

type TxRow = {
    id: number;
    type: string;
    amount: number;
    balance_before: number;
    balance_after: number;
    reference: string | null;
    notes: string | null;
    created_at: string;
};

type WalletProps = {
    user: { id: number; name: string; email: string; role: string };
    wallet: { id: number | null; balance: number };
    transactions: TxRow[];
};

const txLabel: Record<string, string> = {
    topup: 'Top-up',
    bid_hold: 'Bid hold',
    bid_release: 'Bid release',
    bid_deduct: 'Bid deduct',
};

export default function AdminUserWallet({ user, wallet, transactions }: WalletProps) {
    return (
        <AppShell>
            <Head title={`Wallet ${user.name}`} />

            <section className="space-y-5">
                <PageHeader
                    accent="Admin"
                    subtitle={`${user.email} · ${user.role}`}
                    title={`Wallet — ${user.name}`}
                />

                <Card className="border-primary/30 bg-primary/5 shadow-[0_18px_44px_rgba(136,26,29,0.12)]">
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground">Balance</p>
                        <PriceText className="mt-2 text-foreground" prefixLabel="Wallet balance" value={wallet.balance} variant="hero" />
                    </CardContent>
                </Card>

                <div className="flex items-center gap-2">
                    <Link href="/admin/users">
                        <Button size="sm" variant="outline">← Back to users</Button>
                    </Link>
                </div>

                <SectionCard title="Ledger">
                    <div className="space-y-3">
                        {transactions.length === 0 && (
                            <p className="text-sm text-muted-foreground">No transactions yet.</p>
                        )}
                        {transactions.map((tx) => (
                            <div className="flex min-w-0 items-start justify-between gap-3 rounded-lg border border-border p-4" key={tx.id}>
                                <div className="min-w-0">
                                    <p className="font-semibold text-foreground">{txLabel[tx.type] ?? tx.type}</p>
                                    <p className="mt-1 truncate text-xs text-muted-foreground" title={tx.reference ?? tx.notes ?? ''}>{tx.reference ?? tx.notes}</p>
                                </div>
                                <div className="min-w-0 max-w-[12rem] shrink-0 text-right">
                                    <PriceText className="text-foreground" prefixLabel="Transaction amount" value={tx.amount} />
                                    <p className="mt-1 flex min-w-0 items-center justify-end gap-1 text-xs text-muted-foreground">
                                        <PriceText className="max-w-[5rem] text-muted-foreground" value={tx.balance_before} /> → <PriceText className="max-w-[5rem] text-muted-foreground" value={tx.balance_after} />
                                    </p>
                                    <p className="text-xs text-muted-foreground">{tx.created_at}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </section>
        </AppShell>
    );
}
