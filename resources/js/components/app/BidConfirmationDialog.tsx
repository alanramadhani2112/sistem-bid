import { useState } from 'react';

import { PriceText } from '@/components/app/PriceText';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

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
        <Drawer showSwipeHandle>
            <DrawerTrigger disabled={disabled || processing || isBelowNextBid} render={<Button className="min-h-11 w-full rounded-md" disabled={disabled || processing || isBelowNextBid} />}>
                {processing ? 'Memproses...' : 'Review bid sebelum kirim'}
            </DrawerTrigger>
            <DrawerContent className="mx-auto max-w-md rounded-t-xl md:bottom-auto md:left-1/2 md:right-auto md:top-1/2 md:w-[520px] md:max-w-[calc(100vw-2rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:border">
                <DrawerHeader className="text-left">
                    <DrawerTitle className="text-xl font-black">Konfirmasi bid</DrawerTitle>
                    <DrawerDescription>{auctionTitle} · cek nominal sebelum dikirim.</DrawerDescription>
                </DrawerHeader>
                <div className="space-y-4 px-4 pb-4">
                    <div className="rounded-lg border bg-primary/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Bid amount</p>
                        <PriceText className="mt-2 text-primary" prefixLabel="Bid amount" value={amount} variant="hero" />
                    </div>
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div className="min-w-0 rounded-lg border bg-card p-3">
                            <p className="text-muted-foreground">Harga saat ini</p>
                            <PriceText value={currentPrice} />
                        </div>
                        <div className="min-w-0 rounded-lg border bg-card p-3">
                            <p className="text-muted-foreground">Minimum berikutnya</p>
                            <PriceText value={nextBid} />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Bid akan dikirim ke live auction. Validasi saldo dan increment tetap dilakukan server.
                    </p>
                    <label className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3 text-sm">
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
                <DrawerFooter className="gap-2 md:flex-row md:justify-end">
                    <Button className="rounded-md md:order-2" disabled={processing || isBelowNextBid || !confirmed} onClick={onConfirm}>
                        {processing ? 'Mengirim bid...' : 'Kirim bid'}
                    </Button>
                    <DrawerClose render={<Button className="rounded-md md:order-1" variant="outline" />}>Batal</DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
