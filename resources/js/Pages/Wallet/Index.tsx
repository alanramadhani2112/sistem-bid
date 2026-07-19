import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/app/FormField';
import { PageHeader } from '@/components/app/PageHeader';
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
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

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
                <Card className="bg-primary/5">
                    <CardContent className="flex flex-col gap-3 p-6">
                        <Badge className="w-fit" variant="default">Wallet</Badge>
                        <h1 className="text-4xl font-bold text-foreground">{formatRupiah(wallet.balance)}</h1>
                        <p className="text-sm text-muted-foreground">Saldo internal untuk validasi bid. Payment gateway belum aktif.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5">
                        <form onSubmit={submit}>
                            <FormField error={errors.amount} label="Tambah saldo manual" name="amount">
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
                                Tambah saldo
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
                                <p className="text-sm text-muted-foreground">Belum ada transaksi.</p>
                            ) : (
                                wallet.transactions.map((transaction) => (
                                    <div className="rounded-lg bg-muted/50 p-4" key={`${transaction.reference}-${transaction.created_at}`}>
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-foreground">{transaction.type}</p>
                                            <p className="text-sm font-bold text-foreground">{formatRupiah(transaction.amount)}</p>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{transaction.notes}</span>
                                            <span>{transaction.reference}</span>
                                        </div>
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
