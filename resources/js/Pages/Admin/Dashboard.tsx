import { Head, Link } from '@inertiajs/react';

import { AppShell } from '../../Layouts/AppShell';

type Auction = {
    id: number;
    title: string;
    status: string;
    current_price: number;
    starts_at: string;
    ends_at: string;
    green_bean: { name: string; origin: string };
};

type DashboardProps = {
    stats: Record<string, number>;
    auctionsByStatus: Record<string, number>;
    recentAuctions: Auction[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        currency: 'IDR',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(value);

export default function AdminDashboard({ stats, auctionsByStatus, recentAuctions }: DashboardProps) {
    return (
        <AppShell>
            <Head title="Admin Dashboard" />

            <section className="space-y-5">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Admin</p>
                    <h1 className="mt-1 text-3xl font-bold text-white">Dashboard</h1>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {Object.entries(stats).map(([label, value]) => (
                        <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" key={label}>
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{label}</p>
                            <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                        </article>
                    ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                    {Object.entries(auctionsByStatus).map(([status, count]) => (
                        <article className="rounded-3xl border border-lime-300/20 bg-lime-300/5 p-5" key={status}>
                            <p className="text-sm font-semibold text-lime-200">{status}</p>
                            <p className="mt-2 text-2xl font-bold text-white">{count}</p>
                        </article>
                    ))}
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-bold text-white">Auction terbaru</h2>
                        <Link className="text-sm font-semibold text-lime-200" href="/admin/auctions">
                            Kelola
                        </Link>
                    </div>

                    <div className="mt-4 space-y-3">
                        {recentAuctions.map((auction) => (
                            <Link className="block rounded-2xl border border-white/10 p-4" href={`/admin/auctions/${auction.id}/monitor`} key={auction.id}>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-white">{auction.title}</p>
                                        <p className="mt-1 text-sm text-stone-300">
                                            {auction.green_bean.name} · {auction.green_bean.origin}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-200">{auction.status}</span>
                                </div>
                                <p className="mt-2 text-sm text-stone-300">{formatRupiah(auction.current_price)}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
