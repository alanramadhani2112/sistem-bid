import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { FormField } from '@/components/app/FormField';
import { StatusBadge } from '@/components/app/StatusBadge';
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
                <Link className="text-sm font-medium text-muted-foreground hover:text-foreground" href="/auctions">
                    ← Kembali
                </Link>

                <Card className="bg-primary/5">
                    <CardContent className="flex flex-col gap-3 p-6">
                        <StatusBadge status={auction.status} />
                        <h1 className="text-3xl font-bold text-foreground">{auction.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            {auction.green_bean.name} · {auction.green_bean.origin} · {auction.green_bean.process}
                        </p>
                        <p className="text-4xl font-bold text-foreground">{formatRupiah(auction.current_price)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-1 p-5 text-sm text-muted-foreground">
                        <p>Weight: {auction.green_bean.weight_gram}g</p>
                        <p>Starting: {formatRupiah(auction.green_bean.starting_price)}</p>
                        <p>Increment: {formatRupiah(auction.green_bean.bid_increment)}</p>
                        <p>Start: {auction.starts_at}</p>
                        <p>End: {auction.ends_at}</p>
                        {auction.green_bean.description && <p className="mt-3">{auction.green_bean.description}</p>}
                    </CardContent>
                </Card>

                <Link href={canEnterRoom ? `/auctions/${auction.id}/room` : '#'}>
                    <Button className="min-h-11 w-full font-bold" disabled={!canEnterRoom} size="lg" type="button" variant={canEnterRoom ? 'default' : 'secondary'}>
                        {canEnterRoom ? 'Masuk Live Room' : 'Live room aktif saat auction live'}
                    </Button>
                </Link>

                {canEnterRoom && (
                    <Card>
                        <CardContent className="p-5">
                            <form onSubmit={submitBid}>
                                <FormField error={errors.amount} label="Bid sekarang" name="amount">
                                    <Input
                                        id="amount"
                                        inputMode="numeric"
                                        min={1}
                                        name="amount"
                                        onChange={(event) => setData('amount', Number(event.target.value))}
                                        type="number"
                                        value={data.amount}
                                    />
                                </FormField>
                                <Button className="mt-4 min-h-11 w-full font-bold" disabled={processing} type="submit">
                                    {processing ? 'Memasang bid...' : 'Pasang Bid'}
                                </Button>
                                <p className="mt-2 text-xs text-muted-foreground">Saldo hanya dicek. Belum ada hold/deduct di MVP core.</p>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </section>
        </AppShell>
    );
}
