import { Head } from '@inertiajs/react';

import { AppShell } from '../../../Layouts/AppShell';

type BidRow = {
    id: number;
    amount: number;
    created_at: string;
    user: { id: number; name: string };
};

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

type MonitorProps = {
    auction: Auction;
    leaderboard: BidRow[];
    bidHistory: BidRow[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        currency: 'IDR',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(value);

export default function AuctionMonitor({ auction, leaderboard, bidHistory }: MonitorProps) {
    return (
        <AppShell>
            <Head title={`Monitor ${auction.title}`} />

            <section className="space-y-5">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Monitor</p>
                    <h1 className="mt-1 text-3xl font-bold text-white">{auction.title}</h1>
                    <p className="mt-2 text-sm text-stone-300">
                        {auction.green_bean.name} · {auction.green_bean.origin} · {auction.green_bean.process}
                    </p>
                </div>

                <div className="rounded-3xl border border-lime-300/20 bg-lime-300/5 p-5">
                    <p className="text-sm text-lime-100">Current price</p>
                    <p className="mt-2 text-4xl font-black text-white">{formatRupiah(auction.current_price)}</p>
                    <p className="mt-2 text-sm text-stone-300">
                        {auction.status} · ends {auction.ends_at}
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Panel rows={leaderboard} title="Leaderboard" />
                    <Panel rows={bidHistory} title="Bid history" />
                </div>
            </section>
        </AppShell>
    );
}

function Panel({ rows, title }: { rows: BidRow[]; title: string }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <div className="mt-4 space-y-3">
                {rows.map((bid) => (
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 p-4" key={bid.id}>
                        <div>
                            <p className="font-semibold text-white">{bid.user.name}</p>
                            <p className="text-xs text-stone-400">{bid.created_at}</p>
                        </div>
                        <p className="font-bold text-lime-200">{formatRupiah(bid.amount)}</p>
                    </div>
                ))}

                {rows.length === 0 ? <p className="text-sm text-stone-400">Belum ada bid.</p> : null}
            </div>
        </div>
    );
}
