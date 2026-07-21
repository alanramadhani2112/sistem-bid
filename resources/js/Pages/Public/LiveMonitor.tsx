import { Head } from '@inertiajs/react';
import { Coffee, Radio, Trophy, Users } from 'lucide-react';

import { AuctionImage } from '@/components/app/AuctionImage';
import { AuctionSoundToggle } from '@/components/app/AuctionSoundToggle';
import { BidHistoryFeed } from '@/components/app/BidHistoryFeed';
import { LeaderboardPanel } from '@/components/app/LeaderboardPanel';
import { LiveCountdownPanel } from '@/components/app/LiveCountdownPanel';
import { PriceText } from '@/components/app/PriceText';
import { RealtimeConnectionBadge } from '@/components/app/RealtimeConnectionBadge';
import { StatusBadge } from '@/components/app/StatusBadge';
import { WinnerPreviewCard } from '@/components/app/WinnerPreviewCard';
import { Card, CardContent } from '@/components/ui/card';
import { useAuctionSoundEffects } from '@/Hooks/useAuctionSoundEffects';
import { useAuctionRoom } from '@/Hooks/useAuctionRoom';
import { formatRupiah } from '@/lib/format';

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
        image_path?: string | null;
        bid_increment: number;
    };
};

type LiveMonitorProps = {
    auction: Auction;
    leaderboard: BidRow[];
    bidHistory: BidRow[];
};

const serverToHookRow = (row: BidRow) => ({
    id: row.id,
    amount: row.amount,
    bidder_name: row.user.name,
    placed_at: row.created_at,
});

export default function PublicLiveMonitor({ auction: initial, leaderboard: lb, bidHistory: bh }: LiveMonitorProps) {
    const { auctionStatus, currentPrice, leaderboard, bidHistory, winner } = useAuctionRoom(
        initial.id,
        initial.current_price,
        lb.map(serverToHookRow),
        bh.map(serverToHookRow),
        initial.status,
    );

    const leader = winner?.bidder_name ?? leaderboard[0]?.bidder_name ?? null;
    const winnerAmount = winner?.winning_amount ?? leaderboard[0]?.amount ?? null;
    const nextBid = auctionStatus === 'live' ? currentPrice + initial.green_bean.bid_increment : undefined;
    const sound = useAuctionSoundEffects({
        auctionStatus,
        bidHistory,
        endsAt: initial.ends_at,
        winner,
    });

    return (
        <main className="min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(136,26,29,0.28),transparent_34%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)))] text-foreground">
            <Head title={`Live Monitor ${initial.title}`} />

            <section className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
                <header className="grid gap-4 rounded-3xl border border-border/80 bg-card/85 p-5 shadow-2xl shadow-primary/10 backdrop-blur lg:grid-cols-[minmax(0,1fr)_auto] lg:p-6">
                    <div className="min-w-0 space-y-3">
                        <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-primary">
                            <Radio aria-hidden="true" className="size-4" />
                            JCC Live Auction
                        </p>
                        <div className="min-w-0 space-y-2">
                            <h1 className="break-words text-[clamp(2rem,5vw,4.5rem)] font-black leading-none tracking-tight">{initial.title}</h1>
                            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground sm:text-base">
                                <Coffee aria-hidden="true" className="size-4" />
                                <span>{initial.green_bean.name}</span>
                                <span>·</span>
                                <span>{initial.green_bean.origin}</span>
                                <span>·</span>
                                <span>{initial.green_bean.process}</span>
                                <span>·</span>
                                <span>{initial.green_bean.weight_gram.toLocaleString('id-ID')} gram</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-start justify-start gap-2 lg:justify-end">
                        <StatusBadge status={auctionStatus} />
                        <AuctionSoundToggle enabled={sound.enabled} onToggle={sound.toggleSound} />
                        <RealtimeConnectionBadge />
                    </div>
                </header>

                <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(24rem,0.55fr)]">
                    <section className="min-w-0 space-y-4">
                        <AuctionImage
                            alt={initial.title}
                            className="min-h-[18rem] rounded-3xl border border-primary/30 shadow-2xl shadow-black/20 sm:min-h-[24rem] lg:min-h-[34rem]"
                            imagePath={initial.green_bean.image_path}
                            overlay
                        >
                            <div className="absolute inset-0 flex flex-col justify-end gap-6 p-5 sm:p-8 lg:p-10">
                                <div className="max-w-5xl space-y-3">
                                    <p className="inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                                        <Trophy aria-hidden="true" className="size-4 text-primary" />
                                        Harga tertinggi
                                    </p>
                                    <PriceText
                                        className="text-[clamp(2.6rem,9vw,8rem)] leading-none text-white drop-shadow-2xl"
                                        prefixLabel="Harga tertinggi"
                                        value={currentPrice}
                                        variant="hero"
                                    />
                                    <p className="text-[clamp(1rem,2vw,1.5rem)] font-semibold text-white/90">
                                        {leader ? `Dipimpin oleh ${leader}` : 'Bid pertama akan tampil di sini.'}
                                    </p>
                                </div>
                            </div>
                        </AuctionImage>

                        <div className="grid gap-4">
                            <LiveCountdownPanel
                                className="rounded-3xl shadow-xl shadow-primary/10"
                                mode={auctionStatus === 'published' ? 'starts' : 'ends'}
                                status={auctionStatus}
                                target={auctionStatus === 'published' ? initial.starts_at : initial.ends_at}
                                variant="stage"
                            />
                            <Card className="rounded-3xl border-primary/35 bg-primary/5 shadow-sm">
                                <CardContent className="grid gap-4 p-5 sm:grid-cols-3 lg:p-6">
                                    <div className="min-w-0 space-y-1">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Next bid</p>
                                        {nextBid ? <PriceText className="text-xl text-foreground" prefixLabel="Next bid" value={nextBid} /> : <p className="font-semibold">Auction tidak menerima bid.</p>}
                                    </div>
                                    <div className="min-w-0 space-y-1">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Leader</p>
                                        <p className="truncate text-xl font-black" title={leader ?? 'Belum ada bid'}>{leader ?? 'Belum ada bid'}</p>
                                    </div>
                                    <div className="min-w-0 space-y-1">
                                        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                                            <Users aria-hidden="true" className="size-4" /> Bid masuk
                                        </p>
                                        <p className="text-3xl font-black">{bidHistory.length}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <aside className="grid min-w-0 gap-4 lg:grid-cols-2 xl:grid-cols-1">
                        {auctionStatus === 'closed' && (
                            <WinnerPreviewCard
                                amount={winnerAmount}
                                bidderName={leader}
                                bidCount={bidHistory.length}
                                formatPrice={formatRupiah}
                            />
                        )}
                        <LeaderboardPanel className="min-h-0" formatPrice={formatRupiah} rows={leaderboard.slice(0, 10)} title="Top Leaderboard" />
                        <BidHistoryFeed className="min-h-0" formatPrice={formatRupiah} rows={bidHistory.slice(0, 12)} title="Live Bid Feed" />
                    </aside>
                </div>
            </section>
        </main>
    );
}
