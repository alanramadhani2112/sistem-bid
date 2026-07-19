import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { PageHeader } from '@/components/app/PageHeader';
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

const formatRupiah = (v: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(v);

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

                <Card className="bg-primary/5">
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground">Balance</p>
                        <p className="mt-2 text-4xl font-black text-foreground">{formatRupiah(wallet.balance)}</p>
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
                            <div className="flex items-start justify-between gap-3 rounded-lg border border-border p-4" key={tx.id}>
                                <div>
                                    <p className="font-semibold text-foreground">{txLabel[tx.type] ?? tx.type}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{tx.reference ?? tx.notes}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-foreground">{formatRupiah(tx.amount)}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatRupiah(tx.balance_before)} → {formatRupiah(tx.balance_after)}
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
