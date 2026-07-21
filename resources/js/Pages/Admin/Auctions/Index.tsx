import { Head, Link, router } from '@inertiajs/react';
import { CircleStop, Edit, PlayCircle, Radio, RotateCcw, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CategoryTab } from '@/components/app/CategoryTab';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { EmptyState } from '@/components/app/EmptyState';
import { FilterPanel } from '@/components/app/FilterPanel';
import { ListItemCard } from '@/components/app/ListItemCard';
import { PageHeader } from '@/components/app/PageHeader';
import { PageShell } from '@/components/app/PageShell';
import { PriceText } from '@/components/app/PriceText';
import { StatusBadge } from '@/components/app/StatusBadge';
import { AppShell } from '../../../Layouts/AppShell';

type Auction = {
    id: number;
    title: string;
    status: string;
    current_price: number;
    starts_at: string;
    ends_at: string;
    green_bean: {
        id: number;
        name: string;
        origin: string;
    };
};

type AuctionsIndexProps = {
    auctions: Auction[];
};

function ActionButtons({ auction }: { auction: Auction }) {
    function patchStatus(status: string) {
        if (window.confirm(`Ubah status "${auction.title}" ke "${status}"?\n\nPerubahan ini memengaruhi akses bidder dan winner.`)) {
            router.patch(
                `/admin/auctions/${auction.id}/status`,
                { status },
                { preserveScroll: true },
            );
        }
    }

    return (
        <div className="grid gap-2 sm:grid-cols-4">
            {auction.status === 'draft' && (
                <>
                    <Button className="w-full" onClick={() => patchStatus('published')} size="sm">
                        <PlayCircle data-icon="inline-start" />
                        Publish
                    </Button>
                    <Link href={`/admin/auctions/${auction.id}/edit`}>
                        <Button className="w-full" size="sm" variant="outline"><Edit data-icon="inline-start" />Edit</Button>
                    </Link>
                    <Link as="button" href={`/admin/auctions/${auction.id}`} method="delete" onClick={(event) => { if (!window.confirm(`Hapus auction "${auction.title}"?`)) event.preventDefault(); }} preserveScroll>
                        <Button className="w-full" size="sm" variant="destructive"><Trash2 data-icon="inline-start" />Hapus</Button>
                    </Link>
                </>
            )}

            {auction.status === 'published' && (
                <>
                    <Button className="w-full" onClick={() => patchStatus('live')} size="sm">
                        <PlayCircle data-icon="inline-start" />
                        Start Live
                    </Button>
                    <Button className="w-full" onClick={() => patchStatus('draft')} size="sm" variant="outline">
                        <RotateCcw data-icon="inline-start" />
                        Revert Draft
                    </Button>
                    <Link href={`/admin/auctions/${auction.id}/edit`}>
                        <Button className="w-full" size="sm" variant="outline"><Edit data-icon="inline-start" />Edit</Button>
                    </Link>
                    <Link as="button" href={`/admin/auctions/${auction.id}`} method="delete" onClick={(event) => { if (!window.confirm(`Hapus auction "${auction.title}"?`)) event.preventDefault(); }} preserveScroll>
                        <Button className="w-full" size="sm" variant="destructive"><Trash2 data-icon="inline-start" />Hapus</Button>
                    </Link>
                </>
            )}

            {auction.status === 'live' && (
                <>
                    <Button className="w-full" onClick={() => patchStatus('closed')} size="sm" variant="destructive">
                        <CircleStop data-icon="inline-start" />
                        Close
                    </Button>
                    <Link href={`/admin/auctions/${auction.id}/monitor`}>
                        <Button className="w-full" size="sm" variant="outline"><Radio data-icon="inline-start" />Monitor</Button>
                    </Link>
                </>
            )}

            {auction.status === 'closed' && (
                <Link href={`/admin/auctions/${auction.id}/monitor`}>
                    <Button className="w-full" size="sm" variant="outline"><Radio data-icon="inline-start" />Monitor</Button>
                </Link>
            )}
        </div>
    );
}

export default function AuctionsIndex({ auctions }: AuctionsIndexProps) {
    const [status, setStatus] = useState('all');
    const [query, setQuery] = useState('');
    const hasFilter = status !== 'all' || query.length > 0;
    const filteredAuctions = useMemo(() => {
        const q = query.toLowerCase();

        return auctions.filter((auction) => {
            const matchesStatus = status === 'all' || auction.status === status;
            const matchesQuery = [auction.title, auction.green_bean.name, auction.green_bean.origin]
                .join(' ')
                .toLowerCase()
                .includes(q);

            return matchesStatus && matchesQuery;
        });
    }, [auctions, query, status]);

    return (
        <AppShell>
            <Head title="Admin Auctions" />

            <PageShell spacing="lg">
                <PageHeader
                    accent="Admin"
                    action={
                        <Link href="/admin/auctions/create">
                            <Button size="sm">Tambah auction</Button>
                        </Link>
                    }
                    subtitle="Kelola lifecycle auction: draft, published, live, closed."
                    title="Auctions"
                />

                <FilterPanel contentClassName="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <Badge variant="secondary">{filteredAuctions.length} auction</Badge>
                        {hasFilter && (
                            <Button className="h-8 px-2 text-xs" onClick={() => { setStatus('all'); setQuery(''); }} size="sm" type="button" variant="ghost">
                                Reset filter
                            </Button>
                        )}
                    </div>
                    <div className="space-y-3">
                        <Input
                            aria-label="Cari auction admin"
                            className="min-h-11"
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cari auction, green bean, origin..."
                            type="search"
                            value={query}
                        />
                        <CategoryTab
                            onChange={setStatus}
                            options={[
                                { label: 'Semua', value: 'all' },
                                { label: 'Draft', value: 'draft' },
                                { label: 'Published', value: 'published' },
                                { label: 'Live', value: 'live' },
                                { label: 'Closed', value: 'closed' },
                            ]}
                            value={status}
                        />
                    </div>
                </FilterPanel>

                <div className="space-y-4">
                    {filteredAuctions.map((auction) => (
                        <ListItemCard contentClassName="flex flex-col gap-4" key={auction.id}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 space-y-1.5">
                                        <h2 className="text-lg font-semibold text-foreground">{auction.title}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {auction.green_bean.name} · {auction.green_bean.origin}
                                        </p>
                                    </div>
                                    <StatusBadge className="shrink-0" status={auction.status} />
                                </div>

                                <div className="grid gap-2 rounded-xl border border-border/70 bg-muted/25 p-3 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
                                    <p className="flex min-w-0 items-center gap-1 text-muted-foreground">Current <PriceText className="inline-block max-w-[10rem] text-foreground" value={auction.current_price} /></p>
                                    <p className="text-xs text-muted-foreground">
                                        {auction.starts_at} — {auction.ends_at}
                                    </p>
                                </div>

                                <ActionButtons auction={auction} />
                        </ListItemCard>
                    ))}

                    {filteredAuctions.length === 0 && (
                        <EmptyState
                            action={hasFilter ? (
                                <Button onClick={() => { setStatus('all'); setQuery(''); }} type="button" variant="outline">
                                    Reset filter
                                </Button>
                            ) : undefined}
                            description="Coba ubah filter status atau pencarian."
                            title="Auction tidak ditemukan"
                        />
                    )}
                </div>
            </PageShell>
        </AppShell>
    );
}
