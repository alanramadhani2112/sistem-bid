import { Head, Link, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { EmptyState } from '@/components/app/EmptyState';
import { PageHeader } from '@/components/app/PageHeader';
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

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

function ActionButtons({ auction }: { auction: Auction }) {
    function patchStatus(status: string) {
        if (window.confirm(`Change status to "${status}"?`)) {
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
                        Publish
                    </Button>
                    <Link href={`/admin/auctions/${auction.id}/edit`}>
                        <Button className="w-full" size="sm" variant="outline">Edit</Button>
                    </Link>
                    <Link as="button" href={`/admin/auctions/${auction.id}`} method="delete" preserveScroll>
                        <Button className="w-full" size="sm" variant="destructive">Hapus</Button>
                    </Link>
                </>
            )}

            {auction.status === 'published' && (
                <>
                    <Button className="w-full" onClick={() => patchStatus('live')} size="sm">
                        Start Live
                    </Button>
                    <Button className="w-full" onClick={() => patchStatus('draft')} size="sm" variant="outline">
                        Revert Draft
                    </Button>
                    <Link href={`/admin/auctions/${auction.id}/edit`}>
                        <Button className="w-full" size="sm" variant="outline">Edit</Button>
                    </Link>
                    <Link as="button" href={`/admin/auctions/${auction.id}`} method="delete" preserveScroll>
                        <Button className="w-full" size="sm" variant="destructive">Hapus</Button>
                    </Link>
                </>
            )}

            {auction.status === 'live' && (
                <>
                    <Button className="w-full" onClick={() => patchStatus('closed')} size="sm" variant="destructive">
                        Close
                    </Button>
                    <Link href={`/admin/auctions/${auction.id}/monitor`}>
                        <Button className="w-full" size="sm" variant="outline">Monitor</Button>
                    </Link>
                </>
            )}

            {auction.status === 'closed' && (
                <Link href={`/admin/auctions/${auction.id}/monitor`}>
                    <Button className="w-full" size="sm" variant="outline">Monitor</Button>
                </Link>
            )}
        </div>
    );
}

export default function AuctionsIndex({ auctions }: AuctionsIndexProps) {
    return (
        <AppShell>
            <Head title="Admin Auctions" />

            <section className="space-y-5">
                <PageHeader
                    accent="Admin"
                    action={
                        <Link href="/admin/auctions/create">
                            <Button size="sm">Tambah</Button>
                        </Link>
                    }
                    title="Auctions"
                />

                <div className="space-y-3">
                    {auctions.map((auction) => (
                        <Card key={auction.id}>
                            <CardContent className="flex flex-col gap-3 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-foreground">{auction.title}</h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {auction.green_bean.name} · {auction.green_bean.origin}
                                        </p>
                                    </div>
                                    <StatusBadge status={auction.status} />
                                </div>

                                <p className="text-sm text-muted-foreground">Current {formatRupiah(auction.current_price)}</p>
                                <p className="text-xs text-muted-foreground">
                                    {auction.starts_at} — {auction.ends_at}
                                </p>

                                <ActionButtons auction={auction} />
                            </CardContent>
                        </Card>
                    ))}

                    {auctions.length === 0 && (
                        <EmptyState description="Belum ada auction." title="Tidak ada auction" />
                    )}
                </div>
            </section>
        </AppShell>
    );
}
