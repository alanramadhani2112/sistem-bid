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
        <Card className={cn('border-primary/40 bg-primary/5', className)}>
            <CardContent className="p-5 md:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{label}</p>
                <p className="mt-3 text-4xl font-black leading-none tracking-tight text-foreground md:text-6xl">{formatPrice(price)}</p>
                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                        <p className="text-muted-foreground">Next bid</p>
                        <p className="font-semibold text-foreground">{nextBid ? formatPrice(nextBid) : 'Belum tersedia'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Leader</p>
                        <p className="font-semibold text-foreground">{leader ?? 'Belum ada bid'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Bid masuk</p>
                        <p className="font-semibold text-foreground">{bidCount ?? 0}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
