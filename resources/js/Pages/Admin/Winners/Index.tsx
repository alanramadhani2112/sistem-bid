import { Head, Link } from '@inertiajs/react';

import { AppShell } from '../../../Layouts/AppShell';

type Winner = {
    id: number;
    winning_amount: number;
    determined_at: string;
    auction: {
        id: number;
        title: string;
        green_bean: { name: string; origin: string };
    };
    user: { name: string; email: string };
    bid: { amount: number; created_at: string };
};

type WinnersProps = {
    winners: Winner[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        currency: 'IDR',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(value);

export default function AdminWinners({ winners }: WinnersProps) {
    return (
        <AppShell>
            <Head title="Admin Winners" />

            <section className="space-y-5">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Admin</p>
                    <h1 className="mt-1 text-3xl font-bold text-white">Winners</h1>
                </div>

                <div className="space-y-3">
                    {winners.map((winner) => (
                        <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" key={winner.id}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="font-semibold text-white">{winner.auction.title}</h2>
                                    <p className="mt-1 text-sm text-stone-300">
                                        {winner.auction.green_bean.name} · {winner.auction.green_bean.origin}
                                    </p>
                                </div>
                                <p className="font-bold text-lime-200">{formatRupiah(winner.winning_amount)}</p>
                            </div>
                            <p className="mt-3 text-sm text-stone-300">
                                {winner.user.name} · {winner.user.email}
                            </p>
                            <p className="mt-1 text-xs text-stone-400">Determined {winner.determined_at}</p>
                            <Link className="mt-4 inline-flex min-h-11 items-center rounded-2xl border border-lime-300/30 px-4 text-sm font-semibold text-lime-200" href={`/admin/auctions/${winner.auction.id}/monitor`}>
                                Monitor auction
                            </Link>
                        </article>
                    ))}

                    {winners.length === 0 ? <p className="rounded-3xl border border-white/10 p-5 text-sm text-stone-400">Belum ada winner.</p> : null}
                </div>
            </section>
        </AppShell>
    );
}
