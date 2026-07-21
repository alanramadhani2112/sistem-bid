import { Link } from '@inertiajs/react';

import { AuctionImage } from '@/components/app/AuctionImage';
import { CurrentPriceCard } from '@/components/app/CurrentPriceCard';
import { LiveCountdownPanel } from '@/components/app/LiveCountdownPanel';
import { StatusBadge } from '@/components/app/StatusBadge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type LiveAuctionHeroProps = {
    auction: {
        id: number;
        title: string;
        status: string;
        current_price: number;
        starts_at: string;
        ends_at: string;
        bid_count?: number;
        leader_name?: string | null;
        green_bean: { name: string; origin: string; process?: string; image_path?: string | null };
    } | null;
    formatPrice: (value: number) => string;
    title?: string;
};

export function LiveAuctionHero({ auction, formatPrice, title = 'Live Now' }: LiveAuctionHeroProps) {
    if (!auction) {
        return (
            <Card className="border-dashed bg-muted/20">
                <CardContent className="p-6">
                    <p className="text-sm font-semibold text-muted-foreground">{title}</p>
                    <h2 className="mt-2 text-2xl font-bold text-foreground">Belum ada auction live</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Cek upcoming lots atau login sebagai admin untuk menjadwalkan auction.</p>
                    <Link className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 min-h-11')} href="/auctions">
                        Lihat auction board
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden rounded-xl border-primary/40 bg-primary/5 pt-0 shadow-[0_22px_58px_rgba(136,26,29,0.18)]">
            <CardContent className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 p-0">
                <AuctionImage
                    alt={`${auction.green_bean.name} green beans`}
                    className="aspect-[1.6] w-full"
                    imagePath={auction.green_bean.image_path}
                    overlay
                >
                    <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                        <div className="flex items-center justify-between gap-3">
                            <p className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">Live featured</p>
                            <StatusBadge status={auction.status} />
                        </div>
                        <div>
                            <h2 className="max-w-sm text-2xl font-black leading-tight sm:text-3xl">{auction.title}</h2>
                            <p className="mt-2 text-sm font-medium text-white/80">{auction.green_bean.name} · {auction.green_bean.origin}</p>
                        </div>
                    </div>
                </AuctionImage>
                <div className="-mt-6 space-y-4 rounded-t-xl bg-card px-4 pb-4 pt-5 shadow-[0_-18px_38px_rgba(2,2,2,0.10)]">
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{title}</p>
                        <p className="text-sm text-muted-foreground">
                            {auction.green_bean.process ? `${auction.green_bean.process} process` : 'Green beans lot'} · harga bergerak realtime.
                        </p>
                    </div>
                    <Link className={cn(buttonVariants({ size: 'lg' }), 'min-h-11 w-full')} href={`/auctions/${auction.id}/room`}>
                        Masuk live room
                    </Link>
                    <CurrentPriceCard
                        bidCount={auction.bid_count}
                        formatPrice={formatPrice}
                        leader={auction.leader_name}
                        nextBid={undefined}
                        price={auction.current_price}
                    />
                    <LiveCountdownPanel mode="ends" status={auction.status} target={auction.ends_at} variant="compact" />
                </div>
            </CardContent>
        </Card>
    );
}
