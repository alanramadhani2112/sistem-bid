import { Head } from '@inertiajs/react';

import { Card, CardContent } from '@/components/ui/card';

import { PageHeader } from '@/components/app/PageHeader';
import { SectionCard } from '@/components/app/SectionCard';
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
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export default function AuctionMonitor({ auction, leaderboard, bidHistory }: MonitorProps) {
    return (
        <AppShell>
            <Head title={`Monitor ${auction.title}`} />

            <section className="space-y-5">
                <PageHeader
                    accent="Monitor"
                    subtitle={`${auction.green_bean.name} · ${auction.green_bean.origin} · ${auction.green_bean.process}`}
                    title={auction.title}
                />

                <Card className="bg-primary/5">
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground">Current price</p>
                        <p className="mt-2 text-4xl font-black text-foreground">{formatRupiah(auction.current_price)}</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {auction.status} · ends {auction.ends_at}
                        </p>
                    </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-2">
                    <SectionCard title="Leaderboard">
                        <div className="space-y-3">
                            {leaderboard.map((bid) => (
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4" key={bid.id}>
                                    <div>
                                        <p className="font-semibold text-foreground">{bid.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{bid.created_at}</p>
                                    </div>
                                    <p className="font-bold text-foreground">{formatRupiah(bid.amount)}</p>
                                </div>
                            ))}
                            {leaderboard.length === 0 && <p className="text-sm text-muted-foreground">Belum ada bid.</p>}
                        </div>
                    </SectionCard>

                    <SectionCard title="Bid history">
                        <div className="space-y-3">
                            {bidHistory.map((bid) => (
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4" key={bid.id}>
                                    <div>
                                        <p className="font-semibold text-foreground">{bid.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{bid.created_at}</p>
                                    </div>
                                    <p className="font-bold text-foreground">{formatRupiah(bid.amount)}</p>
                                </div>
                            ))}
                            {bidHistory.length === 0 && <p className="text-sm text-muted-foreground">Belum ada bid.</p>}
                        </div>
                    </SectionCard>
                </div>
            </section>
        </AppShell>
    );
}
