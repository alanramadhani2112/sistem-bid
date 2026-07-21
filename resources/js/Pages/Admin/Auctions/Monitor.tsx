import { Head, router } from '@inertiajs/react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { AuctionStateBanner } from '@/components/app/AuctionStateBanner';
import { BidHistoryFeed } from '@/components/app/BidHistoryFeed';
import { CurrentPriceCard } from '@/components/app/CurrentPriceCard';
import { LeaderboardPanel } from '@/components/app/LeaderboardPanel';
import { LiveCountdownPanel } from '@/components/app/LiveCountdownPanel';
import { PageHeader } from '@/components/app/PageHeader';
import { PageShell } from '@/components/app/PageShell';
import { PriceText } from '@/components/app/PriceText';
import { RealtimeConnectionBadge } from '@/components/app/RealtimeConnectionBadge';
import { SectionCard } from '@/components/app/SectionCard';
import { StatusBadge } from '@/components/app/StatusBadge';
import { WinnerPreviewCard } from '@/components/app/WinnerPreviewCard';
import { useAuctionRoom } from '@/Hooks/useAuctionRoom';
import { formatRupiah } from '@/lib/format';
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

const serverToHookRow = (r: BidRow) => ({ id: r.id, amount: r.amount, bidder_name: r.user.name });

export default function AuctionMonitor({ auction: initial, leaderboard: lb, bidHistory: bh }: MonitorProps) {
    const { auctionStatus, currentPrice, leaderboard, bidHistory, winner } = useAuctionRoom(
        initial.id,
        initial.current_price,
        lb.map(serverToHookRow),
        bh.map(serverToHookRow),
        initial.status,
    );
    const latestBid = bidHistory[0];
    const leader = leaderboard[0]?.bidder_name ?? null;
    const nextBid = currentPrice + 100_000;

    const handleClose = () => {
        router.post(`/admin/auctions/${initial.id}/close`, {}, { preserveScroll: true });
    };

    return (
        <AppShell>
            <Head title={`Monitor ${initial.title}`} />

            <PageShell spacing="lg">
                <PageHeader
                    accent="Auction Command Center"
                    subtitle={`${initial.green_bean.name} · ${initial.green_bean.origin} · ${initial.green_bean.process}`}
                    title={initial.title}
                    action={(
                        <div className="flex flex-wrap items-center gap-2">
                            <a className={buttonVariants({ variant: 'outline' })} href={`/live/${initial.id}/monitor`} rel="noreferrer" target="_blank">
                                Buka layar publik
                            </a>
                            <RealtimeConnectionBadge />
                        </div>
                    )}
                />

                <AuctionStateBanner endsAt={initial.ends_at} startsAt={initial.starts_at} status={auctionStatus} />

                <div className="sticky top-16 z-10 grid gap-4 rounded-2xl border border-border bg-background/95 p-4 shadow-sm backdrop-blur lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
                    <CurrentPriceCard
                        bidCount={bidHistory.length}
                        formatPrice={formatRupiah}
                        leader={leader}
                        nextBid={nextBid}
                        price={currentPrice}
                    />
                    <LiveCountdownPanel
                        mode={auctionStatus === 'published' ? 'starts' : 'ends'}
                        status={auctionStatus}
                        target={auctionStatus === 'published' ? initial.starts_at : initial.ends_at}
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <WinnerPreviewCard
                        bidCount={bidHistory.length}
                        bidderName={winner?.bidder_name ?? leader}
                        amount={winner?.winning_amount ?? leaderboard[0]?.amount ?? null}
                        formatPrice={formatRupiah}
                    />
                    {auctionStatus === 'live' && (
                        <AlertDialog>
                            <AlertDialogTrigger render={<Button className="min-h-11 w-full" variant="destructive" />}>
                                Tutup auction
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tutup auction sekarang?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {initial.title} akan ditutup dan winner ditentukan dari bid tertinggi saat ini. Aksi ini tidak bisa dibatalkan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleClose} variant="destructive">
                                        Tutup dan tentukan winner
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                {latestBid && (
                    <p aria-live="polite" className="rounded-xl border border-border bg-muted/40 p-3.5 text-sm text-muted-foreground">
                        Bid terbaru: <span className="font-semibold text-foreground">{latestBid.bidder_name}</span> · <PriceText className="inline-block max-w-[10rem] align-bottom text-muted-foreground" value={latestBid.amount} />
                    </p>
                )}

                <div className="grid gap-5 lg:grid-cols-2">
                    <BidHistoryFeed formatPrice={formatRupiah} rows={bidHistory} title="Realtime bid feed" />
                    <LeaderboardPanel formatPrice={formatRupiah} rows={leaderboard} />
                </div>

                <SectionCard title="Lot information">
                    <div className="grid gap-4 text-sm sm:grid-cols-4">
                        <div>
                            <p className="text-muted-foreground">Green bean</p>
                            <p className="font-semibold text-foreground">{initial.green_bean.name}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Origin</p>
                            <p className="font-semibold text-foreground">{initial.green_bean.origin}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Process</p>
                            <p className="font-semibold text-foreground">{initial.green_bean.process}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Weight</p>
                            <p className="font-semibold text-foreground">{initial.green_bean.weight_gram} gram</p>
                        </div>
                    </div>
                </SectionCard>
            </PageShell>
        </AppShell>
    );
}
