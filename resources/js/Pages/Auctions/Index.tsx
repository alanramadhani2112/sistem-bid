import { Head, Link } from '@inertiajs/react';

import { Card, CardContent } from '@/components/ui/card';

import { EmptyState } from '@/components/app/EmptyState';
import { PageHeader } from '@/components/app/PageHeader';
import { StatusBadge } from '@/components/app/StatusBadge';
import { AppShell } from '../../Layouts/AppShell';

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

type AuctionsIndexProps = {
    auctions: Auction[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export default function AuctionsIndex({ auctions }: AuctionsIndexProps) {
    return (
        <AppShell>
            <Head title="Auctions" />

            <section className="space-y-5">
                <PageHeader accent="Live Bid" title="Auctions" />

                <div className="space-y-3">
                    {auctions.map((auction) => (
                        <Link href={`/auctions/${auction.id}`} key={auction.id}>
                            <Card className="hover:bg-accent/30 transition-colors">
                                <CardContent className="flex flex-col gap-3 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-semibold text-foreground">{auction.title}</h2>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {auction.green_bean.name} · {auction.green_bean.origin} · {auction.green_bean.process}
                                            </p>
                                        </div>
                                        <StatusBadge status={auction.status} />
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{formatRupiah(auction.current_price)}</p>
                                    <p className="text-xs text-muted-foreground">Ends {auction.ends_at}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}

                    {auctions.length === 0 && (
                        <EmptyState description="Belum ada auction aktif." title="Tidak ada auction" />
                    )}
                </div>
            </section>
        </AppShell>
    );
}
