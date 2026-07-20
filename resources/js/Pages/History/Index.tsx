import { Head, Link } from '@inertiajs/react';
import { Gavel } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CategoryTab } from '@/components/app/CategoryTab';
import { Card, CardContent } from '@/components/ui/card';

import { EmptyState } from '@/components/app/EmptyState';
import { PageHeader } from '@/components/app/PageHeader';
import { PriceText } from '@/components/app/PriceText';
import { StatusBadge } from '@/components/app/StatusBadge';
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

export default function HistoryIndex({ bids }: HistoryIndexProps) {
    const [status, setStatus] = useState('all');
    const filteredBids = useMemo(
        () => bids.filter((bid) => status === 'all' || bid.auction.status === status),
        [bids, status],
    );

    return (
        <AppShell>
            <Head title="History" />

            <section className="space-y-5">
                <PageHeader accent="Bidder" subtitle="Riwayat bid kamu per auction." title="History" />

                <CategoryTab
                    onChange={setStatus}
                    options={[
                        { label: 'Semua', value: 'all' },
                        { label: 'Live', value: 'live' },
                        { label: 'Selesai', value: 'closed' },
                        { label: 'Akan datang', value: 'published' },
                    ]}
                    value={status}
                />

                <div className="relative space-y-3 pl-5 before:absolute before:bottom-0 before:left-2 before:top-0 before:w-px before:bg-border">
                    {filteredBids.map((bid) => (
                        <Link className="block" href={`/auctions/${bid.auction.id}`} key={bid.id}>
                            <Card className="relative transition-colors hover:bg-accent/30">
                                <span className="absolute -left-[1.05rem] top-5 flex size-7 items-center justify-center rounded-full border bg-background text-primary shadow-sm">
                                    <Gavel aria-hidden="true" className="size-3.5" />
                                </span>
                                <CardContent className="flex flex-col gap-2 p-5">
                                    <div className="flex min-w-0 items-start justify-between gap-3">
                                        <h2 className="min-w-0 truncate text-base font-semibold text-foreground" title={bid.auction.title}>{bid.auction.title}</h2>
                                        <StatusBadge status={bid.auction.status} />
                                    </div>
                                    <PriceText className="text-foreground" prefixLabel="Bid amount" value={bid.amount} variant="metric" />
                                    <p className="text-xs font-medium text-muted-foreground">{bid.created_at}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {filteredBids.length === 0 && <EmptyState description="Bid kamu akan muncul setelah masuk live room." title="Tidak ada history" />}
                </div>
            </section>
        </AppShell>
    );
}
