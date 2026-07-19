import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Countdown } from '@/components/app/Countdown';
import { FormField } from '@/components/app/FormField';
import { SectionCard } from '@/components/app/SectionCard';
import { StatusBadge } from '@/components/app/StatusBadge';
import { formatRupiah } from '@/lib/format';
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
                <Link className="text-sm font-medium text-muted-foreground hover:text-foreground" href={`/auctions/${auction.id}`}>
                    ← Kembali
                </Link>

                <Card className="bg-primary/5">
                    <CardContent className="flex flex-col gap-3 p-6">
                        <StatusBadge status="live" />
                        <h1 className="text-2xl font-bold text-foreground">{auction.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            {auction.green_bean.name} · {auction.green_bean.origin}
                        </p>
                        <p className="text-4xl font-bold text-foreground">{formatRupiah(room.currentPrice)}</p>
                        <Countdown className="text-primary" mode="ends" target={auction.ends_at} />
                        <p aria-live="polite" className="sr-only">
                            Harga saat ini {formatRupiah(room.currentPrice)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5">
                        <form onSubmit={submitBid}>
                            <FormField error={errors.amount} label="Bid berikutnya" name="amount">
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
                        </form>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    <SectionCard title="Leaderboard">
                        <div className="space-y-3">
                            {room.leaderboard.map((bid, index) => (
                                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm" key={bid.id}>
                                    <span className="text-foreground">#{index + 1} {bid.bidder_name}</span>
                                    <span className="font-bold text-foreground">{formatRupiah(bid.amount)}</span>
                                </div>
                            ))}
                            {room.leaderboard.length === 0 && <p className="text-sm text-muted-foreground">Belum ada bid.</p>}
                        </div>
                    </SectionCard>

                    <SectionCard title="Bid History">
                        <div className="space-y-3">
                            {room.bidHistory.map((bid) => (
                                <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-4" key={bid.id}>
                                    <div>
                                        <p className="font-semibold text-foreground">{bid.bidder_name}</p>
                                        <p className="text-xs text-muted-foreground">{bid.placed_at}</p>
                                    </div>
                                    <p className="font-bold text-foreground">{formatRupiah(bid.amount)}</p>
                                </div>
                            ))}
                            {room.bidHistory.length === 0 && <p className="text-sm text-muted-foreground">Belum ada bid.</p>}
                        </div>
                    </SectionCard>
                </div>
            </section>
        </AppShell>
    );
}
