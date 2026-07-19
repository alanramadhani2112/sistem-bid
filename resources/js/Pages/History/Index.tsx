import { Head, Link } from '@inertiajs/react';

import { AppShell } from '../../Layouts/AppShell';

type Bid = {
    id: number;
    amount: number;
    created_at: string;
    auction: {
        id: number;
        title: string;
        status: string;
        current_price: number;
    };
};

type HistoryIndexProps = {
    bids: Bid[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export default function HistoryIndex({ bids }: HistoryIndexProps) {
    return (
        <AppShell>
            <Head title="History" />

            <section className="space-y-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Bidder</p>
                    <h1 className="mt-1 text-3xl font-bold text-white">History</h1>
                </div>

                <div className="space-y-3">
                    {bids.map((bid) => (
                        <Link className="block rounded-3xl border border-white/10 bg-white/[0.04] p-5" href={`/auctions/${bid.auction.id}`} key={bid.id}>
                            <h2 className="text-base font-semibold text-white">{bid.auction.title}</h2>
                            <p className="mt-2 text-xl font-bold text-white">{formatRupiah(bid.amount)}</p>
                            <p className="mt-1 text-xs text-stone-400">{bid.created_at}</p>
                        </Link>
                    ))}
                    {bids.length === 0 ? <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-stone-300">Belum ada bid.</div> : null}
                </div>
            </section>
        </AppShell>
    );
}
