import { Link } from '@inertiajs/react';
import { Coffee, Gavel, MapPin, Timer, TrendingUp } from 'lucide-react';

import { AuctionImage } from '@/components/app/AuctionImage';
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
            image_path?: string | null;
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
                'overflow-hidden rounded-xl border-border bg-card shadow-[0_18px_48px_rgba(2,2,2,0.08)] transition-colors hover:border-primary/30 hover:bg-accent/25',
                isLive && 'border-primary/55 bg-primary/5 shadow-[0_20px_52px_rgba(136,26,29,0.16)]',
                isClosed && 'opacity-75',
            )}
        >
            <div className="relative">
                <AuctionImage alt={`${auction.green_bean.name} green beans`} className="aspect-[1.55]" imagePath={auction.green_bean.image_path} />
                <div className="absolute left-3 top-3">
                    <StatusBadge className="shadow-sm" status={auction.status} />
                </div>
            </div>
            <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="line-clamp-2 text-xl font-black leading-tight text-foreground">{auction.title}</h2>
                        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                                <Coffee aria-hidden="true" className="size-3.5" />
                                {auction.green_bean.name}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                                <MapPin aria-hidden="true" className="size-3.5" />
                                {auction.green_bean.origin}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-primary/20 bg-background/80 p-3 shadow-sm">
                    <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                        <TrendingUp aria-hidden="true" className="size-3.5" />
                        Harga saat ini
                    </p>
                    <p className="mt-1 text-2xl font-black tabular-nums text-foreground">{formatPrice(auction.current_price)}</p>
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
                        {isLive ? <Gavel data-icon="inline-start" /> : <Timer data-icon="inline-start" />}
                        {isLive ? 'Masuk room' : 'Lihat detail'}
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
