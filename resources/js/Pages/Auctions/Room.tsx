import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

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

                <div className="rounded-3xl border border-lime-300/30 bg-lime-300/10 p-6">
                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">LIVE</span>
                    <h1 className="mt-4 text-2xl font-bold text-white">{auction.title}</h1>
                    <p className="mt-1 text-sm text-stone-300">
                        {auction.green_bean.name} · {auction.green_bean.origin}
                    </p>
                    <p className="mt-5 text-4xl font-bold text-white">{formatRupiah(room.currentPrice)}</p>
                    <p className="mt-2 text-sm text-stone-300">End: {auction.ends_at}</p>
                </div>

                <form className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" onSubmit={submitBid}>
                    <label className="text-sm font-semibold text-stone-200" htmlFor="amount">
                        Bid berikutnya
                    </label>
                    <input
                        className="field-input mt-2 w-full"
                        id="amount"
                        inputMode="numeric"
                        min={1}
                        name="amount"
                        onChange={(event) => setData('amount', Number(event.target.value))}
                        type="number"
                        value={data.amount}
                    />
                    {errors.amount ? <p className="mt-2 text-sm text-red-300">{errors.amount}</p> : null}
                    <button
                        className="mt-4 min-h-11 w-full rounded-2xl bg-lime-300 px-4 py-3 text-sm font-bold text-stone-950 disabled:opacity-60"
                        disabled={processing}
                        type="submit"
                    >
                        {processing ? 'Memasang bid...' : 'Pasang Bid'}
                    </button>
                </form>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                        <h2 className="text-lg font-bold text-white">Leaderboard</h2>
                        <div className="mt-4 space-y-3">
                            {room.leaderboard.map((bid) => (
                                <div className="flex items-center justify-between rounded-2xl bg-white/5 p-3 text-sm" key={bid.id}>
                                    <span className="text-stone-200">{bid.bidder_name}</span>
                                    <span className="font-bold text-lime-200">{formatRupiah(bid.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                        <h2 className="text-lg font-bold text-white">Bid History</h2>
                        <div className="mt-4 space-y-3">
                            {room.bidHistory.map((bid) => (
                                <div className="rounded-2xl bg-white/5 p-3 text-sm" key={bid.id}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-stone-200">{bid.bidder_name}</span>
                                        <span className="font-bold text-white">{formatRupiah(bid.amount)}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-stone-500">{bid.placed_at}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
