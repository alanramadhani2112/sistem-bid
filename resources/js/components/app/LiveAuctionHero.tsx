import { Link } from '@inertiajs/react';

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
        green_bean: { name: string; origin: string; process?: string };
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
        <Card className="overflow-hidden border-primary/40 bg-primary/5">
            <CardContent className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={auction.status} />
                        <span className="text-sm font-medium text-primary">{title}</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black leading-tight text-foreground md:text-5xl">{auction.title}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {auction.green_bean.name} · {auction.green_bean.origin} {auction.green_bean.process ? `· ${auction.green_bean.process}` : ''}
                        </p>
                    </div>
                    <Link className={cn(buttonVariants({ size: 'lg' }), 'min-h-11')} href={`/auctions/${auction.id}/room`}>
                        Masuk live room
                    </Link>
                </div>

                <div className="grid gap-3">
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
