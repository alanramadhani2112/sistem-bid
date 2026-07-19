import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuctionRoom } from '../../Hooks/useAuctionRoom';
import type { BidRow } from '../../Hooks/useAuctionRoom';
import { AppShell } from '../../Layouts/AppShell';

type AuctionRoomProps = {
    auction: {
        id: number;
        title: string;
        current_price: number;
        ends_at: string;
        green_bean: {
            name: string;
            origin: string;
            bid_increment: number;
        };
    };
    bidHistory: BidRow[];
    leaderboard: BidRow[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export default function AuctionRoom({ auction, bidHistory, leaderboard }: AuctionRoomProps) {
    const room = useAuctionRoom(auction.id, auction.current_price, leaderboard, bidHistory);
    const { data, errors, post, processing, setData } = useForm({
        amount: auction.current_price + auction.green_bean.bid_increment,
    });

    const submitBid = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/auctions/${auction.id}/bids`, { preserveScroll: true });
    };

    return (
        <AppShell>
            <Head title={`Live Room · ${auction.title}`} />

            <section className="space-y-4">
                <Link className="text-sm font-semibold text-lime-200" href={`/auctions/${auction.id}`}>
                    Kembali
                </Link>

                <Card className="border-lime-300/30 bg-lime-300/10 text-white">
                    <CardContent className="p-6">
                    <Badge className="bg-red-500 text-white">LIVE</Badge>
                    <h1 className="mt-4 text-2xl font-bold text-white">{auction.title}</h1>
                    <p className="mt-1 text-sm text-stone-300">
                        {auction.green_bean.name} · {auction.green_bean.origin}
                    </p>
                    <p className="mt-5 text-4xl font-bold text-white">{formatRupiah(room.currentPrice)}</p>
                    <p className="mt-2 text-sm text-stone-300">End: {auction.ends_at}</p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.04] text-white">
                    <CardContent className="p-5">
                <form onSubmit={submitBid}>
                    <Label className="text-stone-200" htmlFor="amount">
                        Bid berikutnya
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
                </form>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-white/10 bg-white/[0.04] text-white">
                        <CardHeader>
                            <CardTitle>Leaderboard</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {room.leaderboard.map((bid) => (
                                <div className="flex items-center justify-between rounded-2xl bg-white/5 p-3 text-sm" key={bid.id}>
                                    <span className="text-stone-200">{bid.bidder_name}</span>
                                    <span className="font-bold text-lime-200">{formatRupiah(bid.amount)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/[0.04] text-white">
                        <CardHeader>
                            <CardTitle>Bid History</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {room.bidHistory.map((bid) => (
                                <div className="rounded-2xl bg-white/5 p-3 text-sm" key={bid.id}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-stone-200">{bid.bidder_name}</span>
                                        <span className="font-bold text-white">{formatRupiah(bid.amount)}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-stone-500">{bid.placed_at}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </AppShell>
    );
}
