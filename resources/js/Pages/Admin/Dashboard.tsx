import { Head, Link } from '@inertiajs/react';
import { Gavel, LayoutDashboard, Package, Trophy, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { BidHistoryFeed } from '@/components/app/BidHistoryFeed';
import { ControlRoomCard } from '@/components/app/ControlRoomCard';
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
    bid_count?: number;
    leader_name?: string | null;
    green_bean: { name: string; origin: string };
};

type RecentBid = {
    id: number;
    amount: number;
    bidder_name: string;
    placed_at?: string | null;
};

type DashboardProps = {
    stats: Record<string, number>;
    auctionsByStatus: Record<string, number>;
    liveAuctions: Auction[];
    upcomingAuctions: Auction[];
    recentBids: RecentBid[];
    recentAuctions: Auction[];
};

const metricRoutes: Record<string, string> = {
    auctions: '/admin/auctions',
    bids: '/admin/auctions',
    greenBeans: '/admin/green-beans',
    users: '/admin/users',
    winners: '/admin/winners',
};

const metricIcons = {
    auctions: Gavel,
    bids: LayoutDashboard,
    greenBeans: Package,
    users: Users,
    winners: Trophy,
} as const;

export default function AdminDashboard({ auctionsByStatus, liveAuctions, recentAuctions, recentBids, stats, upcomingAuctions }: DashboardProps) {
    return (
        <AppShell>
            <Head title="Admin Dashboard" />

            <section className="space-y-5">
                <PageHeader
                    accent="Control Room"
                    subtitle="Pantau auction live dulu, lalu queue dan metrik operasional."
                    title="Admin Dashboard"
                />

                <SectionCard
                    action={
                        <Link href="/admin/auctions">
                            <Button size="sm" variant="outline">Kelola auctions</Button>
                        </Link>
                    }
                    title="Live control board"
                >
                    <div className="space-y-3">
                        {liveAuctions.map((auction) => (
                            <ControlRoomCard auction={auction} formatPrice={formatRupiah} key={auction.id} />
                        ))}
                        {liveAuctions.length === 0 && (
                            <EmptyState description="Auction live akan muncul paling atas saat status diubah ke live." title="Tidak ada auction live" />
                        )}
                    </div>
                </SectionCard>

                <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                    <SectionCard title="Upcoming queue">
                        <div className="space-y-3">
                            {upcomingAuctions.map((auction) => (
                                <ControlRoomCard auction={auction} formatPrice={formatRupiah} key={auction.id} />
                            ))}
                            {upcomingAuctions.length === 0 && (
                                <EmptyState description="Published auction yang menunggu start akan tampil di sini." title="Queue kosong" />
                            )}
                        </div>
                    </SectionCard>
                    <BidHistoryFeed formatPrice={formatRupiah} rows={recentBids} title="Recent bid activity" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {Object.entries(stats).map(([label, value]) => (
                        <Link className="block transition-transform hover:-translate-y-0.5" href={metricRoutes[label] ?? '/admin/dashboard'} key={label}>
                            <MetricCard icon={metricIcons[label as keyof typeof metricIcons]} label={label} value={value} />
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
