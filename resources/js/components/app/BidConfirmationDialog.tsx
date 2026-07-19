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

    return (
        <Drawer showSwipeHandle>
            <DrawerTrigger disabled={disabled || processing || isBelowNextBid} render={<Button className="w-full min-h-11" disabled={disabled || processing || isBelowNextBid} />}>
                {processing ? 'Memproses...' : 'Review bid'}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Confirm Your Bid</DrawerTitle>
                    <DrawerDescription>{auctionTitle}</DrawerDescription>
                </DrawerHeader>
                <div className="space-y-4 px-4 pb-4">
                    <div className="rounded-2xl border bg-primary/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Bid amount</p>
                        <p className="mt-2 font-mono text-4xl font-black tabular-nums text-primary">{formatPrice(amount)}</p>
                    </div>
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div className="rounded-xl border bg-card p-3">
                            <p className="text-muted-foreground">Harga saat ini</p>
                            <p className="font-semibold">{formatPrice(currentPrice)}</p>
                        </div>
                        <div className="rounded-xl border bg-card p-3">
                            <p className="text-muted-foreground">Minimum berikutnya</p>
                            <p className="font-semibold">{formatPrice(nextBid)}</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Bid akan dikirim ke live auction. Validasi saldo dan increment tetap dilakukan server.
                    </p>
                </div>
                <DrawerFooter>
                    <Button disabled={processing || isBelowNextBid} onClick={onConfirm}>
                        {processing ? 'Mengirim bid...' : 'Confirm bid'}
                    </Button>
                    <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
