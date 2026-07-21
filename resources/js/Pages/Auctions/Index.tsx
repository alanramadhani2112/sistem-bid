import { Head } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';

import { AuctionCard } from '@/components/app/AuctionCard';
import { CategoryTab } from '@/components/app/CategoryTab';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { EmptyState } from '@/components/app/EmptyState';
import { PageHeader } from '@/components/app/PageHeader';
import { useAuctionStatusFeed } from '@/Hooks/useAuctionStatusFeed';
import { formatRupiah } from '@/lib/format';
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
        image_path?: string | null;
    };
};

type AuctionsIndexProps = {
    auctions: Auction[];
};

export default function AuctionsIndex({ auctions }: AuctionsIndexProps) {
    const [auctionItems, setAuctionItems] = useState(auctions);
    const [status, setStatus] = useState('all');
    const [query, setQuery] = useState('');
    const hasFilter = status !== 'all' || query.length > 0;
    const handleAuctionStatus = useCallback((auction: Auction) => {
        setAuctionItems((current) => {
            if (auction.status === 'draft') return current.filter((item) => item.id !== auction.id);

            const exists = current.some((item) => item.id === auction.id);
            if (!exists) return [auction, ...current];

            return current.map((item) => (item.id === auction.id ? { ...item, ...auction, green_bean: { ...item.green_bean, ...auction.green_bean } } : item));
        });
    }, []);

    useAuctionStatusFeed<Auction>(handleAuctionStatus);

    const filteredAuctions = useMemo(() => {
        const q = query.toLowerCase();

        return auctionItems.filter((auction) => {
            const matchesStatus = status === 'all' || auction.status === status;
            const matchesQuery = [auction.title, auction.green_bean.name, auction.green_bean.origin, auction.green_bean.process]
                .join(' ')
                .toLowerCase()
                .includes(q);

            return matchesStatus && matchesQuery;
        });
    }, [auctionItems, query, status]);

    return (
        <AppShell>
            <Head title="Auctions" />

            <section className="space-y-5">
                <PageHeader accent="Auction Board" subtitle="Cari lot, cek harga, dan masuk room saat status live." title="Coffee lots" />

                <Card className="sticky top-16 z-10 border-primary/20 bg-card/95 shadow-md backdrop-blur">
                    <CardContent className="space-y-3 p-3">
                        <div className="flex items-center justify-between gap-3">
                            <Badge variant="secondary">{filteredAuctions.length} lot</Badge>
                            {hasFilter ? (
                                <Button className="h-8 px-2 text-xs" onClick={() => { setStatus('all'); setQuery(''); }} size="sm" type="button" variant="ghost">
                                    Reset filter
                                </Button>
                            ) : (
                                <p className="text-xs font-medium text-muted-foreground">Live first</p>
                            )}
                        </div>
                        <Input
                            aria-label="Cari auction"
                            className="min-h-11"
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cari nama lot, origin, proses..."
                            type="search"
                            value={query}
                        />
                        <CategoryTab
                            onChange={setStatus}
                            options={[
                                { label: 'Semua', value: 'all' },
                                { label: 'Live', value: 'live' },
                                { label: 'Akan datang', value: 'published' },
                                { label: 'Selesai', value: 'closed' },
                            ]}
                            value={status}
                        />
                    </CardContent>
                </Card>

                <div className="space-y-3.5">
                    {filteredAuctions.map((auction) => (
                        <AuctionCard auction={auction} formatPrice={formatRupiah} key={auction.id} />
                    ))}

                    {filteredAuctions.length === 0 && (
                        <EmptyState
                            action={hasFilter ? (
                                <Button onClick={() => { setStatus('all'); setQuery(''); }} type="button" variant="outline">
                                    Reset filter
                                </Button>
                            ) : undefined}
                            description="Coba ubah filter status atau kata kunci pencarian."
                            title="Auction tidak ditemukan"
                        />
                    )}
                </div>
            </section>
        </AppShell>
    );
}
