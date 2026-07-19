import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
                        <Card className="border-white/10 bg-white/[0.04] text-white" key={label}>
                            <CardContent className="p-5">
                                <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{label}</p>
                                <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                    {Object.entries(auctionsByStatus).map(([status, count]) => (
                        <Card className="border-lime-300/20 bg-lime-300/5 text-white" key={status}>
                            <CardContent className="p-5">
                                <Badge className="border-lime-300/30 bg-lime-300/10 text-lime-100" variant="outline">{status}</Badge>
                                <p className="mt-2 text-2xl font-bold text-white">{count}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="border-white/10 bg-white/[0.04] text-white">
                    <CardHeader className="flex-row items-center justify-between gap-3">
                        <CardTitle>Auction terbaru</CardTitle>
                        <Link className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'border-white/15 bg-transparent text-lime-100 hover:bg-white/10')} href="/admin/auctions">
                            Kelola
                        </Link>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {recentAuctions.map((auction) => (
                            <Link className="block rounded-2xl border border-white/10 p-4" href={`/admin/auctions/${auction.id}/monitor`} key={auction.id}>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-white">{auction.title}</p>
                                        <p className="mt-1 text-sm text-stone-300">
                                            {auction.green_bean.name} · {auction.green_bean.origin}
                                        </p>
                                    </div>
                                    <Badge className="border-lime-300/30 bg-lime-300/10 text-lime-100" variant="outline">{auction.status}</Badge>
                                </div>
                                <p className="mt-2 text-sm text-stone-300">{formatRupiah(auction.current_price)}</p>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </section>
        </AppShell>
    );
}
