import { Trophy, TrendingUp, Users, WalletCards } from 'lucide-react';

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
        <Card className={cn('rounded-lg border-primary/35 bg-primary/5', className)}>
            <CardContent className="p-4 md:p-5">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    <TrendingUp aria-hidden="true" className="size-4" />
                    {label}
                </p>
                <p className="mt-3 text-4xl font-black leading-none tracking-tight text-foreground md:text-5xl">{formatPrice(price)}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div>
                        <p className="flex items-center gap-1 text-muted-foreground"><WalletCards aria-hidden="true" className="size-3.5" /> Next bid</p>
                        <p className="font-semibold text-foreground">{nextBid ? formatPrice(nextBid) : 'Belum tersedia'}</p>
                    </div>
                    <div>
                        <p className="flex items-center gap-1 text-muted-foreground"><Trophy aria-hidden="true" className="size-3.5" /> Leader</p>
                        <p className="font-semibold text-foreground">{leader ?? 'Belum ada bid'}</p>
                    </div>
                    <div>
                        <p className="flex items-center gap-1 text-muted-foreground"><Users aria-hidden="true" className="size-3.5" /> Bid masuk</p>
                        <p className="font-semibold text-foreground">{bidCount ?? 0}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
