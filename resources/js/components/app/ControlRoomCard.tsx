import { Link } from '@inertiajs/react';
import { Activity, Radio, Trophy, TrendingUp, Users } from 'lucide-react';

import { LiveCountdownPanel } from '@/components/app/LiveCountdownPanel';
import { PriceText } from '@/components/app/PriceText';
import { StatusBadge } from '@/components/app/StatusBadge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ControlRoomCardProps = {
    auction: {
        id: number;
        title: string;
        status: string;
        current_price: number;
        starts_at: string;
        ends_at: string;
        bid_count?: number;
        leader_name?: string | null;
        green_bean: { name: string; origin: string };
    };
    formatPrice: (value: number) => string;
};

export function ControlRoomCard({ auction, formatPrice }: ControlRoomCardProps) {
    const mode = auction.status === 'published' ? 'starts' : 'ends';
    const target = auction.status === 'published' ? auction.starts_at : auction.ends_at;

    return (
        <Card className={cn('transition-colors hover:bg-accent/30', auction.status === 'live' && 'border-primary/40 bg-primary/5')}>
            <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_240px] md:items-center">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={auction.status} />
                        <span className="text-xs font-medium text-muted-foreground">{auction.green_bean.name} · {auction.green_bean.origin}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{auction.title}</h3>
                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                        <div className="min-w-0">
                            <p className="flex items-center gap-1 text-muted-foreground"><TrendingUp aria-hidden="true" className="size-3.5" /> Harga</p>
                            <PriceText className="text-foreground" prefixLabel="Current price" value={auction.current_price} />
                        </div>
                        <div className="min-w-0">
                            <p className="flex items-center gap-1 text-muted-foreground"><Trophy aria-hidden="true" className="size-3.5" /> Leader</p>
                            <p className="truncate font-semibold text-foreground" title={auction.leader_name ?? 'Belum ada'}>{auction.leader_name ?? 'Belum ada'}</p>
                        </div>
                        <div>
                            <p className="flex items-center gap-1 text-muted-foreground"><Users aria-hidden="true" className="size-3.5" /> Bid</p>
                            <p className="font-semibold text-foreground">{auction.bid_count ?? 0}</p>
                        </div>
                    </div>
                    <Link className={cn(buttonVariants({ variant: 'outline' }), 'min-h-11')} href={`/admin/auctions/${auction.id}/monitor`}>
                        {auction.status === 'live' ? <Radio data-icon="inline-start" /> : <Activity data-icon="inline-start" />}
                        Buka monitor
                    </Link>
                </div>
                <LiveCountdownPanel mode={mode} status={auction.status} target={target} variant="compact" />
            </CardContent>
        </Card>
    );
}
