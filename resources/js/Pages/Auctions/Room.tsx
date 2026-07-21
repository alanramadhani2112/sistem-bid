import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

import { AuctionStateBanner } from '@/components/app/AuctionStateBanner';
import { BidActionPanel } from '@/components/app/BidActionPanel';
import { BidderPositionBanner } from '@/components/app/BidderPositionBanner';
import { BidHistoryFeed } from '@/components/app/BidHistoryFeed';
import { CurrentPriceCard } from '@/components/app/CurrentPriceCard';
import { LeaderboardPanel } from '@/components/app/LeaderboardPanel';
import { LiveCountdownPanel } from '@/components/app/LiveCountdownPanel';
import { ReadinessChecklist } from '@/components/app/ReadinessChecklist';
import { RealtimeConnectionBadge } from '@/components/app/RealtimeConnectionBadge';
import { StatusBadge } from '@/components/app/StatusBadge';
import { formatRupiah } from '@/lib/format';
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

            <section className="space-y-4">
                <Link className="text-sm font-medium text-muted-foreground hover:text-foreground" href={`/auctions/${auction.id}`}>
                    ← Kembali
                </Link>

                <AuctionStateBanner endsAt={auction.ends_at} startsAt={auction.starts_at} status={room.auctionStatus} />

                <div className="grid gap-4">
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-primary/30 bg-card/95 p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <StatusBadge status={room.auctionStatus} />
                                <RealtimeConnectionBadge />
                            </div>
                            <h1 className="mt-4 text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl">{auction.title}</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {auction.green_bean.name} · {auction.green_bean.origin}
                            </p>
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

                    <div className="space-y-4">
                        <LiveCountdownPanel mode="ends" status={room.auctionStatus} target={auction.ends_at} />
                        <BidActionPanel
                            amount={data.amount}
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

                <div className="grid gap-4 md:grid-cols-2">
                    <LeaderboardPanel formatPrice={formatRupiah} rows={room.leaderboard} />
                    <BidHistoryFeed formatPrice={formatRupiah} rows={room.bidHistory} />
                </div>
            </section>
        </AppShell>
    );
}
