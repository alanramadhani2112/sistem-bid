import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { CategoryTab } from '@/components/app/CategoryTab';
import { Card, CardContent } from '@/components/ui/card';

import { EmptyState } from '@/components/app/EmptyState';
import { PageHeader } from '@/components/app/PageHeader';
import { StatusBadge } from '@/components/app/StatusBadge';
import { formatRupiah } from '@/lib/format';
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

                <div className="space-y-3">
                    {filteredBids.map((bid) => (
                        <Link href={`/auctions/${bid.auction.id}`} key={bid.id}>
                            <Card className="hover:bg-accent/30 transition-colors">
                                <CardContent className="flex flex-col gap-2 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <h2 className="text-base font-semibold text-foreground">{bid.auction.title}</h2>
                                        <StatusBadge status={bid.auction.status} />
                                    </div>
                                    <p className="text-xl font-bold text-foreground">{formatRupiah(bid.amount)}</p>
                                    <p className="text-xs text-muted-foreground">{bid.created_at}</p>
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
