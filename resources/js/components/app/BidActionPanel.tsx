import { BidConfirmationDialog } from '@/components/app/BidConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type BidActionPanelProps = {
    amount: number;
    auctionTitle: string;
    currentPrice: number;
    error?: string;
    formatPrice: (value: number) => string;
    nextBid: number;
    onAmountChange: (value: number) => void;
    onConfirm: () => void;
    processing?: boolean;
    disabled?: boolean;
    helper?: string;
    className?: string;
};

export function BidActionPanel({
    amount,
    auctionTitle,
    className,
    currentPrice,
    disabled = false,
    error,
    formatPrice,
    helper,
    nextBid,
    onAmountChange,
    onConfirm,
    processing = false,
}: BidActionPanelProps) {
    return (
        <Card className={cn('border-primary/30 bg-background shadow-sm', className)}>
            <CardContent className="p-4 md:p-5">
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Place bid</p>
                            <p className="text-xs text-muted-foreground">Minimal berikutnya: {formatPrice(nextBid)}</p>
                        </div>
                        <Button disabled={disabled || processing} onClick={() => onAmountChange(nextBid)} type="button" variant="outline">
                            Pakai minimum
                        </Button>
                    </div>

                    <Input
                        aria-invalid={Boolean(error)}
                        min={nextBid}
                        onChange={(event) => onAmountChange(Number(event.target.value))}
                        type="number"
                        value={amount}
                    />
                    {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
                    {error && <p className="text-xs font-medium text-destructive">{error}</p>}
                    <BidConfirmationDialog
                        amount={amount}
                        auctionTitle={auctionTitle}
                        currentPrice={currentPrice}
                        disabled={disabled}
                        formatPrice={formatPrice}
                        nextBid={nextBid}
                        onConfirm={onConfirm}
                        processing={processing}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
