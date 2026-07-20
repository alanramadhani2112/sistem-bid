import { Gavel, Radio, TrendingUp, Trophy } from 'lucide-react';

import { PriceText } from '@/components/app/PriceText';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MarketStatusStripProps = {
    liveCount: number;
    upcomingCount: number;
    latestBid?: string | number;
    activeBids?: number;
};

export function MarketStatusStrip({ activeBids = 0, latestBid = '-', liveCount, upcomingCount }: MarketStatusStripProps) {
    const items = [
        { className: 'bg-primary text-primary-foreground', icon: Radio, label: 'Live', value: liveCount },
        { className: 'bg-accent text-accent-foreground', icon: Gavel, label: 'Upcoming', value: upcomingCount },
        { className: 'bg-card text-card-foreground', icon: TrendingUp, label: 'Latest bid', value: latestBid },
        { className: 'bg-secondary text-secondary-foreground', icon: Trophy, label: 'Active bids', value: activeBids },
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <Card className={cn('overflow-hidden border-border shadow-sm', item.className)} key={item.label}>
                        <CardContent className="min-h-24 p-3">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-75">{item.label}</p>
                                <Icon aria-hidden="true" className="size-4 opacity-70" />
                            </div>
                            {typeof item.value === 'number' && item.label === 'Latest bid' ? (
                                <PriceText className="mt-3" prefixLabel={item.label} value={item.value} variant="metric" />
                            ) : (
                                <p className="mt-3 min-w-0 truncate font-sans text-2xl font-black leading-none tabular-nums tracking-tight" title={String(item.value)}>{item.value}</p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
