import { Link } from '@inertiajs/react';

import { Countdown } from '@/components/app/Countdown';
import { StatusBadge } from '@/components/app/StatusBadge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type AuctionCardProps = {
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
            weight_gram?: number;
        };
    };
    formatPrice: (value: number) => string;
};

export function AuctionCard({ auction, formatPrice }: AuctionCardProps) {
    const isLive = auction.status === 'live';
    const isPublished = auction.status === 'published';
    const isClosed = auction.status === 'closed';
    const href = isLive ? `/auctions/${auction.id}/room` : `/auctions/${auction.id}`;

    return (
        <Card
            className={cn(
                'transition-colors hover:bg-accent/30',
                isLive && 'border-primary/40 bg-primary/5',
                isClosed && 'opacity-75',
            )}
        >
            <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="line-clamp-2 text-lg font-semibold text-foreground">{auction.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {auction.green_bean.name} · {auction.green_bean.origin} · {auction.green_bean.process}
                        </p>
                    </div>
                    <StatusBadge className="shrink-0" status={auction.status} />
                </div>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Harga saat ini</p>
                    <p className="text-2xl font-bold text-foreground">{formatPrice(auction.current_price)}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {isPublished && <Countdown mode="starts" target={auction.starts_at} />}
                    {isLive && <Countdown className="text-primary" mode="ends" target={auction.ends_at} />}
                    {isClosed && <span className="text-xs font-medium text-muted-foreground">Auction selesai</span>}

                    <Link
                        className={cn(
                            buttonVariants({ variant: isLive ? 'default' : 'outline' }),
                            'min-h-11 sm:w-auto',
                        )}
                        href={href}
                    >
                        {isLive ? 'Masuk room' : 'Lihat detail'}
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
