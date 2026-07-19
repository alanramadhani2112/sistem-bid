import { Card, CardContent } from '@/components/ui/card';

type WinnerPreviewCardProps = {
    bidderName?: string | null;
    amount?: number | null;
    bidCount: number;
    formatPrice: (value: number) => string;
};

export function WinnerPreviewCard({ amount, bidCount, bidderName, formatPrice }: WinnerPreviewCardProps) {
    return (
        <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Winner preview</p>
                {bidderName && amount ? (
                    <div className="mt-3 space-y-2">
                        <p className="text-2xl font-black text-foreground">{bidderName}</p>
                        <p className="text-3xl font-black tabular-nums text-primary">{formatPrice(amount)}</p>
                        <p className="text-sm text-muted-foreground">
                            Jika auction ditutup sekarang, bid tertinggi ini menjadi winner. Tie-break mengikuti bid paling awal.
                        </p>
                    </div>
                ) : (
                    <div className="mt-3 space-y-2">
                        <p className="text-xl font-bold text-foreground">Belum ada winner</p>
                        <p className="text-sm text-muted-foreground">Auction akan ditutup tanpa winner jika belum ada bid valid.</p>
                    </div>
                )}
                <p className="mt-3 text-xs text-muted-foreground">Total bid masuk: {bidCount}</p>
            </CardContent>
        </Card>
    );
}
