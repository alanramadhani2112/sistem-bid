import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

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
                <div className="rounded-3xl border border-lime-300/20 bg-lime-300/10 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Wallet</p>
                    <h1 className="mt-3 text-4xl font-bold text-white">{formatRupiah(wallet.balance)}</h1>
                    <p className="mt-2 text-sm text-stone-300">Saldo internal untuk validasi bid. Payment gateway belum aktif.</p>
                </div>

                <form className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" onSubmit={submit}>
                    <label className="block text-sm font-medium text-stone-200" htmlFor="amount">
                        Tambah saldo manual
                    </label>
                    <input
                        className="mt-3 h-12 w-full rounded-2xl border border-white/10 bg-stone-900 px-4 text-base text-white outline-none focus:border-lime-300"
                        id="amount"
                        inputMode="numeric"
                        min="10000"
                        name="amount"
                        onChange={(event) => setData('amount', event.target.value)}
                        type="number"
                        value={data.amount}
                    />
                    {errors.amount ? <p className="mt-2 text-sm text-red-300">{errors.amount}</p> : null}
                    <button
                        className="mt-4 min-h-11 w-full rounded-2xl bg-lime-300 px-4 py-3 text-sm font-bold text-stone-950 disabled:opacity-50"
                        disabled={processing}
                        type="submit"
                    >
                        Tambah saldo
                    </button>
                </form>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 className="text-lg font-semibold text-white">Transaksi terakhir</h2>
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
                </div>
            </section>
        </AppShell>
    );
}
