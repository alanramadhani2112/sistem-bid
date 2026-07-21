import { useState } from 'react';

import { PriceText } from '@/components/app/PriceText';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type BidConfirmationDialogProps = {
    amount: number;
    auctionTitle: string;
    currentPrice: number;
    disabled?: boolean;
    formatPrice: (value: number) => string;
    nextBid: number;
    onConfirm: () => void;
    processing?: boolean;
};

export function BidConfirmationDialog({
    amount,
    auctionTitle,
    currentPrice,
    disabled = false,
    formatPrice,
    nextBid,
    onConfirm,
    processing = false,
}: BidConfirmationDialogProps) {
    const isBelowNextBid = amount < nextBid;
    const [confirmed, setConfirmed] = useState(false);

    return (
        <Dialog>
            <DialogTrigger disabled={disabled || processing || isBelowNextBid} render={<Button className="min-h-11 w-full rounded-md" disabled={disabled || processing || isBelowNextBid} />}>
                {processing ? 'Memproses...' : 'Review bid sebelum kirim'}
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-2xl border-border/80 bg-card p-0 shadow-2xl sm:max-w-md" showCloseButton={false}>
                <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-primary/15" />
                <DialogHeader className="px-4 pt-5 text-center sm:px-5">
                    <DialogTitle className="text-xl font-black tracking-tight">Konfirmasi bid</DialogTitle>
                    <DialogDescription className="mx-auto max-w-sm leading-5">{auctionTitle} · cek nominal sebelum dikirim.</DialogDescription>
                </DialogHeader>
                <div className="min-w-0 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                    <div className="min-w-0 rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Bid amount</p>
                        <PriceText className="mt-2 overflow-visible text-clip whitespace-normal break-all text-[clamp(1.9rem,9vw,2.5rem)] leading-tight text-primary" prefixLabel="Bid amount" value={amount} variant="hero" />
                    </div>
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div className="min-w-0 rounded-xl border bg-background p-3">
                            <p className="text-muted-foreground">Harga saat ini</p>
                            <PriceText value={currentPrice} />
                        </div>
                        <div className="min-w-0 rounded-xl border bg-background p-3">
                            <p className="text-muted-foreground">Minimum berikutnya</p>
                            <PriceText value={nextBid} />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Bid akan dikirim ke live auction. Validasi saldo dan increment tetap dilakukan server.
                    </p>
                    <label className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3 text-sm">
                        <input
                            checked={confirmed}
                            className="mt-1 size-4 accent-primary"
                            onChange={(event) => setConfirmed(event.target.checked)}
                            type="checkbox"
                        />
                        <span className="text-muted-foreground">
                            Saya paham bid ini masuk ke auction live dan tidak bisa dibatalkan setelah terkirim.
                        </span>
                    </label>
                </div>
                <DialogFooter className="m-0 flex-col gap-2 rounded-none border-t bg-background/95 p-4 sm:flex-row sm:justify-end">
                    <Button className="min-h-11 w-full rounded-md sm:w-auto" disabled={processing || isBelowNextBid || !confirmed} onClick={onConfirm}>
                        {processing ? 'Mengirim bid...' : 'Kirim bid'}
                    </Button>
                    <DialogClose render={<Button className="min-h-11 w-full rounded-md sm:w-auto" variant="outline" />}>Batal</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
