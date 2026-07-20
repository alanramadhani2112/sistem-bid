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
        <Card className="overflow-hidden rounded-xl border-primary/40 bg-primary/5 shadow-[0_20px_60px_rgba(1,45,29,0.16)]">
            <CardContent className="grid gap-3 p-0">
                <AuctionImage
                    alt={`${auction.green_bean.name} green beans`}
                    className="min-h-[240px]"
                    imagePath={auction.green_bean.image_path}
                    overlay
                >
                    <div className="relative flex min-h-[240px] flex-col justify-end p-5 text-white">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">Today's Featured Auction</p>
                        <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{auction.title}</h2>
                    </div>
                </AuctionImage>
                <div className="space-y-3">
                    <div className="space-y-3 px-5 pt-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={auction.status} />
                            <span className="text-sm font-medium text-primary">{title}</span>
                        </div>
                        <div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {auction.green_bean.name} · {auction.green_bean.origin} {auction.green_bean.process ? `· ${auction.green_bean.process}` : ''}
                            </p>
                        </div>
                        <Link className={cn(buttonVariants({ size: 'lg' }), 'min-h-11')} href={`/auctions/${auction.id}/room`}>
                            Masuk live room
                        </Link>
                    </div>
                    <div className="grid gap-3 px-5 pb-5">
                        <CurrentPriceCard
                            bidCount={auction.bid_count}
                            formatPrice={formatPrice}
                            leader={auction.leader_name}
                            nextBid={undefined}
                            price={auction.current_price}
                        />
                        <LiveCountdownPanel mode="ends" status={auction.status} target={auction.ends_at} variant="compact" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
