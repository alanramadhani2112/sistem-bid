import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        currency: 'IDR',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(value);

export default function WalletIndex({ wallet }: WalletPageProps) {
    const { data, errors, post, processing, setData } = useForm({ amount: '500000' });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/wallet/topup', { preserveScroll: true });
    };

    return (
        <AppShell>
            <Head title="Wallet" />

            <section className="space-y-4">
                <Card className="border-lime-300/20 bg-lime-300/10 text-white">
                    <CardContent className="p-6">
                    <Badge className="border-lime-300/30 bg-lime-300/10 text-lime-100" variant="outline">Wallet</Badge>
                    <h1 className="mt-3 text-4xl font-bold text-white">{formatRupiah(wallet.balance)}</h1>
                    <p className="mt-2 text-sm text-stone-300">Saldo internal untuk validasi bid. Payment gateway belum aktif.</p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.04] text-white">
                    <CardContent className="p-5">
                <form onSubmit={submit}>
                    <Label className="text-stone-200" htmlFor="amount">
                        Tambah saldo manual
                    </Label>
                    <Input
                        className="mt-3 h-12 rounded-2xl border-white/10 bg-stone-900 text-base text-white"
                        id="amount"
                        inputMode="numeric"
                        min="10000"
                        name="amount"
                        onChange={(event) => setData('amount', event.target.value)}
                        type="number"
                        value={data.amount}
                    />
                    {errors.amount ? <p className="mt-2 text-sm text-red-300">{errors.amount}</p> : null}
                    <Button className="mt-4 min-h-11 w-full rounded-2xl bg-lime-300 font-bold text-stone-950 hover:bg-lime-200" disabled={processing} type="submit">
                        Tambah saldo
                    </Button>
                </form>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.04] text-white">
                    <CardHeader>
                        <CardTitle>Transaksi terakhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="mt-4 space-y-3">
                        {wallet.transactions.length === 0 ? (
                            <p className="text-sm text-stone-400">Belum ada transaksi.</p>
                        ) : (
                            wallet.transactions.map((transaction) => (
                                <div className="rounded-2xl bg-stone-900/80 p-4" key={`${transaction.reference}-${transaction.created_at}`}>
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-white">{transaction.type}</p>
                                        <p className="text-sm font-bold text-lime-200">{formatRupiah(transaction.amount)}</p>
                                    </div>
                                    <p className="mt-1 text-xs text-stone-400">
                                        {formatRupiah(transaction.balance_before)} ke {formatRupiah(transaction.balance_after)}
                                    </p>
                                    {transaction.notes ? <p className="mt-1 text-xs text-stone-500">{transaction.notes}</p> : null}
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
