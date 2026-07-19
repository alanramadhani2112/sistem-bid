import { Head, useForm } from '@inertiajs/react';
import { Gavel, WalletCards } from 'lucide-react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { EmptyState } from '@/components/app/EmptyState';
import { FormField } from '@/components/app/FormField';
import { PageHeader } from '@/components/app/PageHeader';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/format';
import { AppShell } from '../../Layouts/AppShell';

type WalletTransaction = {
    type: string;
    amount: number;
    balance_before: number;
    balance_after: number;
    reference: string | null;
    notes: string | null;
    created_at: string;
};

type WalletPageProps = {
    wallet: {
        balance: number;
        transactions: WalletTransaction[];
    };
};

export default function WalletIndex({ wallet }: WalletPageProps) {
    const { data, errors, post, processing, setData } = useForm({ amount: '500000' });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/wallet/topup', { preserveScroll: true });
    };

    return (
        <AppShell>
            <Head title="Wallet" />

            <section className="space-y-5">
                <PageHeader accent="Bid Power" subtitle="Saldo ini menentukan kemampuan kamu ikut live auction." title="Bid Power" />

                <Card className="overflow-hidden border-primary/30 bg-primary/5">
                    <CardContent className="flex flex-col gap-3 p-6">
                        <Badge className="w-fit" variant="default">
                            <WalletCards data-icon="inline-start" />
                            Available Bid Power
                        </Badge>
                        <h1 className="font-mono text-5xl font-black tabular-nums text-foreground">{formatRupiah(wallet.balance)}</h1>
                        <p className="text-sm text-muted-foreground">Masuk live room hanya saat saldo cukup untuk minimum bid berikutnya.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5">
                        <form onSubmit={submit}>
                            <FormField error={errors.amount} label="Tambah bid power" name="amount">
                                <Input
                                    id="amount"
                                    inputMode="numeric"
                                    min="10000"
                                    name="amount"
                                    onChange={(event) => setData('amount', event.target.value)}
                                    type="number"
                                    value={data.amount}
                                />
                            </FormField>
                            <Button className="mt-4 min-h-11 w-full font-bold" disabled={processing} type="submit">
                                <Gavel data-icon="inline-start" />
                                {processing ? 'Memproses...' : 'Tambah bid power'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaksi terakhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {wallet.transactions.length === 0 ? (
                                <EmptyState description="Penambahan bid power akan muncul di sini." title="Belum ada transaksi" />
                            ) : (
                                wallet.transactions.map((transaction) => (
                                    <div className="rounded-lg bg-muted/50 p-4" key={`${transaction.reference}-${transaction.created_at}`}>
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-foreground">{transaction.type}</p>
                                            <p className="text-sm font-bold text-foreground">{formatRupiah(transaction.amount)}</p>
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">Penambahan bid power untuk ikut live auction.</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </section>
        </AppShell>
    );
}
