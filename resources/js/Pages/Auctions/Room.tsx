import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

import { AuctionSoundToggle } from '@/components/app/AuctionSoundToggle';
import { AuctionStateBanner } from '@/components/app/AuctionStateBanner';
import { BackLink } from '@/components/app/BackLink';
import { BidActionPanel } from '@/components/app/BidActionPanel';
import { BidderPositionBanner } from '@/components/app/BidderPositionBanner';
import { BidHistoryFeed } from '@/components/app/BidHistoryFeed';
import { CurrentPriceCard } from '@/components/app/CurrentPriceCard';
import { LeaderboardPanel } from '@/components/app/LeaderboardPanel';
import { LiveCountdownPanel } from '@/components/app/LiveCountdownPanel';
import { PageShell } from '@/components/app/PageShell';
import { ReadinessChecklist } from '@/components/app/ReadinessChecklist';
import { RealtimeConnectionBadge } from '@/components/app/RealtimeConnectionBadge';
import { StatusBadge } from '@/components/app/StatusBadge';
import { formatRupiah } from '@/lib/format';
import { useAuctionSoundEffects } from '@/Hooks/useAuctionSoundEffects';
import { useAuctionRoom } from '../../Hooks/useAuctionRoom';
import type { BidRow } from '../../Hooks/useAuctionRoom';
import { AppShell } from '../../Layouts/AppShell';

type AuctionRoomProps = {
    auction: {
        id: number;
        title: string;
        current_price: number;
        starts_at: string;
        ends_at: string;
        status: string;
        green_bean: {
            name: string;
            origin: string;
            bid_increment: number;
        };
    };
    bidHistory: BidRow[];
    leaderboard: BidRow[];
    userHighestBid: number | null;
};

type SharedProps = {
    auth?: {
        user?: {
            name?: string;
        } | null;
    };
};

export default function AuctionRoom({ auction, bidHistory, leaderboard, userHighestBid }: AuctionRoomProps) {
    const { props } = usePage<SharedProps>();
    const room = useAuctionRoom(auction.id, auction.current_price, leaderboard, bidHistory, auction.status);
    const nextBid = room.currentPrice + auction.green_bean.bid_increment;
    const canBid = room.auctionStatus === 'live';
    const leader = room.leaderboard[0]?.bidder_name ?? null;
    const leaderAmount = room.leaderboard[0]?.amount ?? null;
    const sound = useAuctionSoundEffects({
        auctionStatus: room.auctionStatus,
        bidHistory: room.bidHistory,
        endsAt: auction.ends_at,
        winner: room.winner,
    });
    const { data, errors, post, processing, setData } = useForm({
        amount: nextBid,
    });

    const submitBid = () => {
        post(`/auctions/${auction.id}/bids`, { preserveScroll: true });
    };

    useEffect(() => {
        if (data.amount < nextBid) setData('amount', nextBid);
    }, [data.amount, nextBid, setData]);

    return (
        <AppShell>
            <Head title={`Live Room · ${auction.title}`} />

            <PageShell>
                <BackLink href={`/auctions/${auction.id}`} />

                <AuctionStateBanner endsAt={auction.ends_at} startsAt={auction.starts_at} status={room.auctionStatus} />

                <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
                    <div className="min-w-0 space-y-4">
                        <div className="min-w-0 space-y-4 rounded-2xl border border-primary/30 bg-card/95 p-4 shadow-sm sm:p-5">
                            <div className="flex items-center justify-between gap-3">
                                <StatusBadge status={room.auctionStatus} />
                                <div className="flex flex-wrap justify-end gap-2">
                                    <AuctionSoundToggle enabled={sound.enabled} onToggle={sound.toggleSound} />
                                    <RealtimeConnectionBadge />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl">{auction.title}</h1>
                                <p className="text-sm text-muted-foreground">
                                {auction.green_bean.name} · {auction.green_bean.origin}
                                </p>
                            </div>
                        </div>
                        <CurrentPriceCard
                            bidCount={room.bidHistory.length}
                            formatPrice={formatRupiah}
                            leader={leader}
                            nextBid={nextBid}
                            price={room.currentPrice}
                        />
                        <p aria-live="polite" className="sr-only">
                            Harga saat ini {formatRupiah(room.currentPrice)}
                        </p>
                        <BidderPositionBanner
                            currentUserName={props.auth?.user?.name}
                            formatPrice={formatRupiah}
                            leaderAmount={leaderAmount}
                            leaderName={leader}
                            userHighestBid={userHighestBid}
                        />
                    </div>

                    <div className="min-w-0 space-y-4">
                        <LiveCountdownPanel mode="ends" status={room.auctionStatus} target={auction.ends_at} />
                        <BidActionPanel
                            amount={data.amount}
                            auctionId={auction.id}
                            auctionTitle={auction.title}
                            className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] z-10 lg:static"
                            currentPrice={room.currentPrice}
                            disabled={!canBid}
                            error={errors.amount}
                            formatPrice={formatRupiah}
                            helper={canBid ? 'Cek nominal sebelum kirim. Server tetap validasi saldo dan minimum bid.' : 'Auction sudah tidak menerima bid.'}
                            nextBid={nextBid}
                            onAmountChange={(value) => setData('amount', value)}
                            onConfirm={submitBid}
                            processing={processing}
                        />
                        <ReadinessChecklist
                            items={[
                                { description: canBid ? 'Auction sedang live.' : 'Auction sudah selesai.', label: 'Status live', ready: canBid },
                                { description: `Minimal bid berikutnya ${formatRupiah(nextBid)}.`, label: 'Bid berikutnya jelas', ready: true },
                                { description: 'Sistem validasi saldo saat submit bid.', label: 'Wallet dicek otomatis', ready: true },
                            ]}
                        />
                    </div>
                </div>

                <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
                    <LeaderboardPanel formatPrice={formatRupiah} rows={room.leaderboard} />
                    <BidHistoryFeed formatPrice={formatRupiah} rows={room.bidHistory} />
                </div>
            </PageShell>
        </AppShell>
    );
}
