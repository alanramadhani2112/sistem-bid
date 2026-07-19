import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { EmptyState } from '@/components/app/EmptyState';
import { MetricCard } from '@/components/app/MetricCard';
import { PageHeader } from '@/components/app/PageHeader';
import { SectionCard } from '@/components/app/SectionCard';
import { StatusBadge } from '@/components/app/StatusBadge';
import { formatRupiah } from '@/lib/format';
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

const metricRoutes: Record<string, string> = {
    auctions: '/admin/auctions',
    bids: '/admin/auctions',
    greenBeans: '/admin/green-beans',
    users: '/admin/users',
    winners: '/admin/winners',
};

export default function AdminDashboard({ stats, auctionsByStatus, recentAuctions }: DashboardProps) {
    return (
        <AppShell>
            <Head title="Admin Dashboard" />

            <section className="space-y-5">
                <PageHeader
                    accent="Admin"
                    subtitle="Ringkasan operasional auction. Klik metrik untuk masuk ke modul terkait."
                    title="Dashboard"
                />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {Object.entries(stats).map(([label, value]) => (
                        <Link className="block transition-transform hover:-translate-y-0.5" href={metricRoutes[label] ?? '/admin/dashboard'} key={label}>
                            <MetricCard label={label} value={value} />
                        </Link>
                    ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                    {Object.entries(auctionsByStatus).map(([status, count]) => (
                        <Link href="/admin/auctions" key={status}>
                        <Card className="transition-colors hover:bg-accent/30">
                            <CardContent className="flex flex-col gap-2 p-5">
                                <StatusBadge status={status} />
                                <p className="text-2xl font-bold text-foreground">{count}</p>
                            </CardContent>
                        </Card>
                        </Link>
                    ))}
                </div>

                <SectionCard
                    action={
                        <Link href="/admin/auctions">
                            <Button size="sm" variant="outline">Kelola</Button>
                        </Link>
                    }
                    title="Auction terbaru"
                >
                    <div className="space-y-3">
                        {recentAuctions.map((auction) => (
                            <Link className="block rounded-lg border border-border p-4 hover:bg-accent/30 transition-colors" href={`/admin/auctions/${auction.id}/monitor`} key={auction.id}>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-foreground">{auction.title}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {auction.green_bean.name} · {auction.green_bean.origin}
                                        </p>
                                    </div>
                                    <StatusBadge status={auction.status} />
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">{formatRupiah(auction.current_price)}</p>
                            </Link>
                        ))}
                        {recentAuctions.length === 0 && (
                            <EmptyState description="Buat auction dari menu Auctions setelah green bean tersedia." title="Belum ada auction" />
                        )}
                    </div>
                </SectionCard>
            </section>
        </AppShell>
    );
}
