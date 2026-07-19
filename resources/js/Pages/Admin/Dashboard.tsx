import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { MetricCard } from '@/components/app/MetricCard';
import { PageHeader } from '@/components/app/PageHeader';
import { SectionCard } from '@/components/app/SectionCard';
import { StatusBadge } from '@/components/app/StatusBadge';
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
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export default function AdminDashboard({ stats, auctionsByStatus, recentAuctions }: DashboardProps) {
    return (
        <AppShell>
            <Head title="Admin Dashboard" />

            <section className="space-y-5">
                <PageHeader accent="Admin" title="Dashboard" />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {Object.entries(stats).map(([label, value]) => (
                        <MetricCard key={label} label={label} value={value} />
                    ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                    {Object.entries(auctionsByStatus).map(([status, count]) => (
                        <Card key={status}>
                            <CardContent className="flex flex-col gap-2 p-5">
                                <StatusBadge status={status} />
                                <p className="text-2xl font-bold text-foreground">{count}</p>
                            </CardContent>
                        </Card>
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
                    </div>
                </SectionCard>
            </section>
        </AppShell>
    );
}
