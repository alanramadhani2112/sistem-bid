import { Head, Link } from '@inertiajs/react';

import { AppShell } from '../../Layouts/AppShell';

type Auction = {
    id: number;
    title: string;
    status: string;
    current_price: number;
    starts_at: string;
    ends_at: string;
    green_bean: {
        name: string;
        origin: string;
        process: string;
        weight_gram: number;
    };
};

type AuctionsIndexProps = {
    auctions: Auction[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export default function AuctionsIndex({ auctions }: AuctionsIndexProps) {
    return (
        <AppShell>
            <Head title="Auctions" />

            <section className="space-y-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Live Bid</p>
                    <h1 className="mt-1 text-3xl font-bold text-white">Auctions</h1>
                </div>

                <div className="space-y-3">
                    {auctions.map((auction) => (
                        <Link className="block rounded-3xl border border-white/10 bg-white/[0.04] p-5" href={`/auctions/${auction.id}`} key={auction.id}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{auction.title}</h2>
                                    <p className="mt-1 text-sm text-stone-300">
                                        {auction.green_bean.name} · {auction.green_bean.origin} · {auction.green_bean.process}
                                    </p>
                                </div>
                                <span className="rounded-full bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-200">{auction.status}</span>
                            </div>
                            <p className="mt-4 text-2xl font-bold text-white">{formatRupiah(auction.current_price)}</p>
                            <p className="mt-1 text-xs text-stone-400">Ends {auction.ends_at}</p>
                        </Link>
                    ))}

                    {auctions.length === 0 ? <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-stone-300">Belum ada auction aktif.</div> : null}
                </div>
            </section>
        </AppShell>
    );
}
