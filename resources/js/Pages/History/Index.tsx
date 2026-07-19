import { Head, Link } from '@inertiajs/react';

import { Card, CardContent } from '@/components/ui/card';

import { EmptyState } from '@/components/app/EmptyState';
import { PageHeader } from '@/components/app/PageHeader';
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

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export default function HistoryIndex({ bids }: HistoryIndexProps) {
    return (
        <AppShell>
            <Head title="History" />

            <section className="space-y-5">
                <PageHeader accent="Bidder" title="History" />

                <div className="space-y-3">
                    {bids.map((bid) => (
                        <Link href={`/auctions/${bid.auction.id}`} key={bid.id}>
                            <Card className="hover:bg-accent/30 transition-colors">
                                <CardContent className="flex flex-col gap-2 p-5">
                                    <h2 className="text-base font-semibold text-foreground">{bid.auction.title}</h2>
                                    <p className="text-xl font-bold text-foreground">{formatRupiah(bid.amount)}</p>
                                    <p className="text-xs text-muted-foreground">{bid.created_at}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {bids.length === 0 && <EmptyState description="Belum ada bid." title="Tidak ada history" />}
                </div>
            </section>
        </AppShell>
    );
}
