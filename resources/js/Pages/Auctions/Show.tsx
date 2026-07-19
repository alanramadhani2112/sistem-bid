import { Head, Link, useForm } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { AppShell } from '../../Layouts/AppShell';

type AuctionShowProps = {
    auction: {
        id: number;
        title: string;
        status: string;
        current_price: number;
        starts_at: string;
        ends_at: string;
        green_bean: {
            name: string;
            origin: string;
            process: string;
            weight_gram: number;
            description: string | null;
            starting_price: number;
            bid_increment: number;
        };
    };
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export default function AuctionShow({ auction }: AuctionShowProps) {
    const canEnterRoom = auction.status === 'live';
    const { data, errors, post, processing, setData } = useForm({
        amount: auction.current_price + auction.green_bean.bid_increment,
    });

    const submitBid = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/auctions/${auction.id}/bids`, { preserveScroll: true });
    };

    return (
        <AppShell>
            <Head title={auction.title} />

            <section className="space-y-4">
                <Link className="text-sm font-semibold text-lime-200" href="/auctions">
                    Kembali
                </Link>
                <Card className="border-lime-300/20 bg-lime-300/10 text-white">
                    <CardContent className="p-6">
                    <Badge className="border-lime-300/30 bg-lime-300/10 text-lime-100" variant="outline">{auction.status}</Badge>
                    <h1 className="mt-4 text-3xl font-bold text-white">{auction.title}</h1>
                    <p className="mt-2 text-sm text-stone-300">
                        {auction.green_bean.name} · {auction.green_bean.origin} · {auction.green_bean.process}
                    </p>
                    <p className="mt-5 text-4xl font-bold text-white">{formatRupiah(auction.current_price)}</p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.04] text-stone-300">
                    <CardContent className="space-y-1 p-5 text-sm">
                    <p>Weight: {auction.green_bean.weight_gram}g</p>
                    <p>Starting: {formatRupiah(auction.green_bean.starting_price)}</p>
                    <p>Increment: {formatRupiah(auction.green_bean.bid_increment)}</p>
                    <p>Start: {auction.starts_at}</p>
                    <p>End: {auction.ends_at}</p>
                    {auction.green_bean.description ? <p className="mt-3">{auction.green_bean.description}</p> : null}
                    </CardContent>
                </Card>

                <Link
                    className={cn(buttonVariants({ size: 'lg', variant: canEnterRoom ? 'default' : 'secondary' }), 'min-h-11 w-full rounded-2xl font-bold', canEnterRoom ? 'bg-lime-300 text-stone-950 hover:bg-lime-200' : 'bg-white/10 text-stone-400')}
                    href={canEnterRoom ? `/auctions/${auction.id}/room` : '#'}
                >
                    {canEnterRoom ? 'Masuk Live Room' : 'Live room aktif saat auction live'}
                </Link>

                {canEnterRoom ? (
                    <Card className="border-white/10 bg-white/[0.04] text-white">
                        <CardContent className="p-5">
                    <form onSubmit={submitBid}>
                        <Label className="text-stone-200" htmlFor="amount">
                            Bid sekarang
                        </Label>
                        <Input
                            className="mt-2 h-12 rounded-2xl border-white/10 bg-stone-900 text-base text-white"
                            id="amount"
                            inputMode="numeric"
                            min={1}
                            name="amount"
                            onChange={(event) => setData('amount', Number(event.target.value))}
                            type="number"
                            value={data.amount}
                        />
                        {errors.amount ? <p className="mt-2 text-sm text-red-300">{errors.amount}</p> : null}
                        <Button className="mt-4 min-h-11 w-full rounded-2xl bg-lime-300 font-bold text-stone-950 hover:bg-lime-200" disabled={processing} type="submit">
                            {processing ? 'Memasang bid...' : 'Pasang Bid'}
                        </Button>
                        <p className="mt-2 text-xs text-stone-400">Saldo hanya dicek. Belum ada hold/deduct di MVP core.</p>
                    </form>
                        </CardContent>
                    </Card>
                ) : null}
            </section>
        </AppShell>
    );
}
