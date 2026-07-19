import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
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
        ends_at: string;
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
    const room = useAuctionRoom(auction.id, auction.current_price, leaderboard, bidHistory);
    const nextBid = room.currentPrice + auction.green_bean.bid_increment;
    const leader = room.leaderboard[0]?.bidder_name ?? null;
    const leaderAmount = room.leaderboard[0]?.amount ?? null;
    const { data, errors, post, processing, setData } = useForm({
        amount: nextBid,
    });

    const submitBid = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/auctions/${auction.id}/bids`, { preserveScroll: true });
    };

    useEffect(() => {
        if (data.amount < nextBid) setData('amount', nextBid);
    }, [data.amount, nextBid, setData]);

    return (
        <AppShell>
            <Head title={`Live Room · ${auction.title}`} />

            <section className="space-y-4 pb-28 lg:pb-0">
                <Link className="text-sm font-medium text-muted-foreground hover:text-foreground" href={`/auctions/${auction.id}`}>
                    ← Kembali
                </Link>

                <AuctionStateBanner endsAt={auction.ends_at} status="live" />

                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
                            <StatusBadge status="live" />
                            <h1 className="mt-3 text-3xl font-black leading-tight text-foreground md:text-5xl">{auction.title}</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {auction.green_bean.name} · {auction.green_bean.origin}
                            </p>
                            <div className="mt-4">
                                <RealtimeConnectionBadge />
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

                    <div className="space-y-4">
                        <LiveCountdownPanel mode="ends" status="live" target={auction.ends_at} />
                        <BidActionPanel
                            amount={data.amount}
                            className="sticky bottom-20 z-10 lg:static"
                            error={errors.amount}
                            formatPrice={formatRupiah}
                            helper="Bid hanya diterima kalau saldo cukup dan increment valid."
                            nextBid={nextBid}
                            onAmountChange={(value) => setData('amount', value)}
                            onSubmit={submitBid}
                            processing={processing}
                        />
                        <ReadinessChecklist
                            items={[
                                { description: 'Auction sedang live.', label: 'Status live', ready: true },
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
