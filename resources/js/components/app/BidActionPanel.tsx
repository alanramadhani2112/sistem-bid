import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type BidActionPanelProps = {
    amount: number;
    error?: string;
    formatPrice: (value: number) => string;
    nextBid: number;
    onAmountChange: (value: number) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    processing?: boolean;
    disabled?: boolean;
    helper?: string;
    className?: string;
};

export function BidActionPanel({
    amount,
    className,
    disabled = false,
    error,
    formatPrice,
    helper,
    nextBid,
    onAmountChange,
    onSubmit,
    processing = false,
}: BidActionPanelProps) {
    return (
        <Card className={cn('border-primary/30 bg-background shadow-sm', className)}>
            <CardContent className="p-4 md:p-5">
                <form className="space-y-3" onSubmit={onSubmit}>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Place bid</p>
                            <p className="text-xs text-muted-foreground">Minimal berikutnya: {formatPrice(nextBid)}</p>
                        </div>
                        <Button disabled={disabled || processing} type="submit">
                            {processing ? 'Memproses...' : 'Bid sekarang'}
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
                </form>
            </CardContent>
        </Card>
    );
}
