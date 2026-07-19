import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { AuctionCard } from '@/components/app/AuctionCard';
import { CategoryTab } from '@/components/app/CategoryTab';
import { Input } from '@/components/ui/input';

import { EmptyState } from '@/components/app/EmptyState';
import { PageHeader } from '@/components/app/PageHeader';
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
    };
};

type AuctionsIndexProps = {
    auctions: Auction[];
};

export default function AuctionsIndex({ auctions }: AuctionsIndexProps) {
    const [status, setStatus] = useState('all');
    const [query, setQuery] = useState('');
    const filteredAuctions = useMemo(() => {
        const q = query.toLowerCase();

        return auctions.filter((auction) => {
            const matchesStatus = status === 'all' || auction.status === status;
            const matchesQuery = [auction.title, auction.green_bean.name, auction.green_bean.origin, auction.green_bean.process]
                .join(' ')
                .toLowerCase()
                .includes(q);

            return matchesStatus && matchesQuery;
        });
    }, [auctions, query, status]);

    return (
        <AppShell>
            <Head title="Auctions" />

            <section className="space-y-5">
                <PageHeader accent="Live Bid" subtitle="Cari lot, cek status, lalu masuk room saat auction live." title="Auctions" />

                <div className="space-y-3">
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
                </div>

                <div className="space-y-3">
                    {filteredAuctions.map((auction) => (
                        <AuctionCard auction={auction} formatPrice={formatRupiah} key={auction.id} />
                    ))}

                    {filteredAuctions.length === 0 && (
                        <EmptyState description="Coba ubah filter status atau kata kunci pencarian." title="Auction tidak ditemukan" />
                    )}
                </div>
            </section>
        </AppShell>
    );
}
