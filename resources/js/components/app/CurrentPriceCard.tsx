import { Trophy, TrendingUp, Users, WalletCards } from 'lucide-react';

import { PriceText } from '@/components/app/PriceText';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type CurrentPriceCardProps = {
    price: number;
    formatPrice: (value: number) => string;
    nextBid?: number;
    leader?: string | null;
    bidCount?: number;
    label?: string;
    className?: string;
};

export function CurrentPriceCard({ price, formatPrice, nextBid, leader, bidCount, label = 'Current Price', className }: CurrentPriceCardProps) {
    return (
        <Card className={cn('min-w-0 rounded-2xl border-primary/35 bg-primary/5 shadow-sm', className)}>
            <CardContent className="min-w-0 space-y-4 p-4 md:p-5">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    <TrendingUp aria-hidden="true" className="size-4" />
                    {label}
                </p>
                <PriceText className="text-[clamp(1.8rem,7vw,2.75rem)] leading-none text-foreground" prefixLabel={label} value={price} variant="hero" />
                <div className="grid min-w-0 grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                    <div className="min-w-0 space-y-1">
                        <p className="flex items-center gap-1 text-muted-foreground"><WalletCards aria-hidden="true" className="size-3.5" /> Next bid</p>
                        {nextBid ? <PriceText className="text-foreground" prefixLabel="Next bid" value={nextBid} /> : <p className="truncate font-semibold text-foreground">Belum tersedia</p>}
                    </div>
                    <div className="min-w-0 space-y-1">
                        <p className="flex items-center gap-1 text-muted-foreground"><Trophy aria-hidden="true" className="size-3.5" /> Leader</p>
                        <p className="truncate font-semibold text-foreground" title={leader ?? 'Belum ada bid'}>{leader ?? 'Belum ada bid'}</p>
                    </div>
                    <div className="min-w-0 space-y-1">
                        <p className="flex items-center gap-1 text-muted-foreground"><Users aria-hidden="true" className="size-3.5" /> Bid masuk</p>
                        <p className="font-semibold text-foreground">{bidCount ?? 0}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
