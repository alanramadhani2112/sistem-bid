import { Head, Link } from '@inertiajs/react';
import { CalendarClock, Coffee, Gavel, MapPin, Scale, Sprout, TrendingUp } from 'lucide-react';

import { AuctionHeroMedia } from '@/components/app/AuctionHeroMedia';
import { AuctionStateBanner } from '@/components/app/AuctionStateBanner';
import { LiveCountdownPanel } from '@/components/app/LiveCountdownPanel';
import { ReadinessChecklist } from '@/components/app/ReadinessChecklist';
import { SectionCard } from '@/components/app/SectionCard';
import { StatusBadge } from '@/components/app/StatusBadge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatRupiah } from '@/lib/format';
import { cn } from '@/lib/utils';
import { AppShell } from '../../Layouts/AppShell';

type AuctionShowProps = {
    auction: {
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
            description: string | null;
            image_path?: string | null;
            starting_price: number;
            bid_increment: number;
        };
    };
};

export default function AuctionShow({ auction }: AuctionShowProps) {
    const canEnterRoom = auction.status === 'live';
    const nextBid = auction.current_price + auction.green_bean.bid_increment;

    return (
        <AppShell>
            <Head title={auction.title} />

            <section className="space-y-5">
                <Link className="text-sm font-medium text-muted-foreground hover:text-foreground" href="/auctions">
                    ← Kembali
                </Link>

                <AuctionHeroMedia
                    alt={`${auction.green_bean.name} green beans`}
                    eyebrow={`Lot preview · ${auction.green_bean.origin}`}
                    imagePath={auction.green_bean.image_path}
                    meta={`${auction.green_bean.name} · ${auction.green_bean.process} · ${auction.green_bean.weight_gram}g`}
                    title={auction.title}
                />

                <AuctionStateBanner endsAt={auction.ends_at} startsAt={auction.starts_at} status={auction.status} />

                <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                    <Card className="bg-primary/5">
                        <CardContent className="space-y-4 p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <StatusBadge status={auction.status} />
                                <p className="text-sm font-medium text-muted-foreground">Minimum berikutnya {formatRupiah(nextBid)}</p>
                            </div>
                            <div>
                                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                    <TrendingUp aria-hidden="true" className="size-4" />
                                    Harga saat ini
                                </p>
                                <p className="mt-2 font-mono text-4xl font-black tracking-tight text-foreground md:text-6xl">
                                    {formatRupiah(auction.current_price)}
                                </p>
                            </div>
                            {auction.status === 'published' && <LiveCountdownPanel mode="starts" status={auction.status} target={auction.starts_at} variant="compact" />}
                            {auction.status === 'live' && <LiveCountdownPanel mode="ends" status={auction.status} target={auction.ends_at} variant="compact" />}
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <ReadinessChecklist
                            items={[
                                { description: canEnterRoom ? 'Auction sedang live.' : 'Room aktif saat status live.', label: 'Status auction', ready: canEnterRoom },
                                { description: `Bid berikutnya mulai ${formatRupiah(nextBid)}.`, label: 'Minimum bid jelas', ready: true },
                                { description: 'Saldo dicek server saat bid dikirim.', label: 'Wallet validation', ready: true },
                            ]}
                        />
                        {canEnterRoom ? (
                            <Link className={cn(buttonVariants({ size: 'lg' }), 'w-full min-h-11')} href={`/auctions/${auction.id}/room`}>
                                <Gavel data-icon="inline-start" />
                                Masuk live room
                            </Link>
                        ) : (
                            <Card>
                                <CardContent className="p-5 text-sm text-muted-foreground">
                                    Live room dibuka saat auction live. Pantau countdown dan siapkan wallet sebelum mulai.
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                <SectionCard title="Lot specifications">
                    <dl className="grid gap-3 text-sm sm:grid-cols-2">
                        <div className="rounded-2xl border border-border bg-card p-3">
                            <dt className="flex items-center gap-2 text-muted-foreground"><MapPin aria-hidden="true" className="size-4" /> Origin</dt>
                            <dd className="mt-1 font-medium text-foreground">{auction.green_bean.origin}</dd>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-3">
                            <dt className="flex items-center gap-2 text-muted-foreground"><Sprout aria-hidden="true" className="size-4" /> Process</dt>
                            <dd className="mt-1 font-medium text-foreground">{auction.green_bean.process}</dd>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-3">
                            <dt className="flex items-center gap-2 text-muted-foreground"><Scale aria-hidden="true" className="size-4" /> Weight</dt>
                            <dd className="mt-1 font-medium text-foreground">{auction.green_bean.weight_gram}g</dd>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-3">
                            <dt className="flex items-center gap-2 text-muted-foreground"><Gavel aria-hidden="true" className="size-4" /> Increment</dt>
                            <dd className="mt-1 font-medium text-foreground">{formatRupiah(auction.green_bean.bid_increment)}</dd>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-3">
                            <dt className="flex items-center gap-2 text-muted-foreground"><Coffee aria-hidden="true" className="size-4" /> Starting price</dt>
                            <dd className="mt-1 font-medium text-foreground">{formatRupiah(auction.green_bean.starting_price)}</dd>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-3">
                            <dt className="flex items-center gap-2 text-muted-foreground"><CalendarClock aria-hidden="true" className="size-4" /> Auction window</dt>
                            <dd className="mt-1 font-medium text-foreground">{auction.starts_at} → {auction.ends_at}</dd>
                        </div>
                    </dl>
                    {auction.green_bean.description && <p className="mt-4 text-sm text-muted-foreground">{auction.green_bean.description}</p>}
                </SectionCard>
            </section>
        </AppShell>
    );
}
