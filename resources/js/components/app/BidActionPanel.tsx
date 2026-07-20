import { Gavel, WalletCards } from 'lucide-react';

import { BidConfirmationDialog } from '@/components/app/BidConfirmationDialog';
import { PriceText } from '@/components/app/PriceText';
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
        <Card className={cn('rounded-lg border-primary/30 bg-background shadow-sm', className)}>
            <CardContent className="p-4 md:p-5">
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                                <Gavel aria-hidden="true" className="size-4 text-primary" />
                                Place bid
                            </p>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <WalletCards aria-hidden="true" className="size-3.5" />
                                Minimal berikutnya: <PriceText className="inline-block max-w-[8rem] align-bottom text-muted-foreground" value={nextBid} />
                            </p>
                        </div>
                        <Button className="rounded-md" disabled={disabled || processing} onClick={() => onAmountChange(nextBid)} type="button" variant="outline">
                            Pakai minimum
                        </Button>
                    </div>

                    <Input
                        aria-invalid={Boolean(error)}
                        min={nextBid}
                        onChange={(event) => onAmountChange(Number(event.target.value))}
                        type="number"
                        className="rounded-md"
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
