import { Head, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { Countdown } from '@/components/app/Countdown';
import { EmptyState } from '@/components/app/EmptyState';
import { PageHeader } from '@/components/app/PageHeader';
import { SectionCard } from '@/components/app/SectionCard';
import { StatusBadge } from '@/components/app/StatusBadge';
import { useAuctionRoom } from '@/Hooks/useAuctionRoom';
import { formatRupiah } from '@/lib/format';
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

const serverToHookRow = (r: BidRow) => ({ id: r.id, amount: r.amount, bidder_name: r.user.name });

export default function AuctionMonitor({ auction: initial, leaderboard: lb, bidHistory: bh }: MonitorProps) {
    const { currentPrice, leaderboard, bidHistory } = useAuctionRoom(
        initial.id,
        initial.current_price,
        lb.map(serverToHookRow),
        bh.map(serverToHookRow),
    );
    const latestBid = bidHistory[0];

    const handleClose = () => {
        if (!window.confirm('Close this auction now and determine the winner?')) return;
        router.post(`/admin/auctions/${initial.id}/close`, {}, { preserveScroll: true });
    };

    return (
        <AppShell>
            <Head title={`Monitor ${initial.title}`} />

            <section className="space-y-5">
                <PageHeader
                    accent="Monitor"
                    subtitle={`${initial.green_bean.name} · ${initial.green_bean.origin} · ${initial.green_bean.process}`}
                    title={initial.title}
                />

                <Card className="bg-primary/5">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Current price</p>
                                <p className="mt-2 text-4xl font-black text-foreground">{formatRupiah(currentPrice)}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <StatusBadge status={initial.status} />
                                    {initial.status === 'live' ? (
                                        <Countdown className="text-primary" mode="ends" target={initial.ends_at} />
                                    ) : (
                                        <p className="text-sm text-muted-foreground">ends {initial.ends_at}</p>
                                    )}
                                </div>
                                {latestBid && (
                                    <p aria-live="polite" className="mt-3 text-sm text-muted-foreground">
                                        Bid terbaru: {latestBid.bidder_name} · {formatRupiah(latestBid.amount)}
                                    </p>
                                )}
                            </div>
                            {initial.status === 'live' && (
                                <Button onClick={handleClose} variant="destructive">Close Now</Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-2">
                    <SectionCard title="Leaderboard">
                        <div className="space-y-3">
                            {leaderboard.map((bid, i) => (
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4" key={`${bid.id}-${i}`}>
                                    <div>
                                        <p className="font-semibold text-foreground">{bid.bidder_name}</p>
                                        <p className="text-xs text-muted-foreground">#{i + 1}</p>
                                    </div>
                                    <p className="font-bold text-foreground">{formatRupiah(bid.amount)}</p>
                                </div>
                            ))}
                            {leaderboard.length === 0 && <EmptyState description="Leaderboard akan terisi saat bid pertama masuk." title="Belum ada bid" />}
                        </div>
                    </SectionCard>

                    <SectionCard title="Bid history">
                        <div className="space-y-3">
                            {bidHistory.map((bid, i) => (
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4" key={`${bid.id}-${i}`}>
                                    <div>
                                        <p className="font-semibold text-foreground">{bid.bidder_name}</p>
                                    </div>
                                    <p className="font-bold text-foreground">{formatRupiah(bid.amount)}</p>
                                </div>
                            ))}
                            {bidHistory.length === 0 && <EmptyState description="Bid realtime akan muncul di sini." title="Belum ada bid" />}
                        </div>
                    </SectionCard>
                </div>
            </section>
        </AppShell>
    );
}
