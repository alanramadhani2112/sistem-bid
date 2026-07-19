import { Head, Link, useForm } from '@inertiajs/react';

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
                <div className="rounded-3xl border border-lime-300/20 bg-lime-300/10 p-6">
                    <span className="rounded-full bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-200">{auction.status}</span>
                    <h1 className="mt-4 text-3xl font-bold text-white">{auction.title}</h1>
                    <p className="mt-2 text-sm text-stone-300">
                        {auction.green_bean.name} · {auction.green_bean.origin} · {auction.green_bean.process}
                    </p>
                    <p className="mt-5 text-4xl font-bold text-white">{formatRupiah(auction.current_price)}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm text-stone-300">
                    <p>Weight: {auction.green_bean.weight_gram}g</p>
                    <p>Starting: {formatRupiah(auction.green_bean.starting_price)}</p>
                    <p>Increment: {formatRupiah(auction.green_bean.bid_increment)}</p>
                    <p>Start: {auction.starts_at}</p>
                    <p>End: {auction.ends_at}</p>
                    {auction.green_bean.description ? <p className="mt-3">{auction.green_bean.description}</p> : null}
                </div>

                <Link
                    className={`block min-h-11 rounded-2xl px-4 py-3 text-center text-sm font-bold ${canEnterRoom ? 'bg-lime-300 text-stone-950' : 'bg-white/10 text-stone-400'}`}
                    href={canEnterRoom ? `/auctions/${auction.id}/room` : '#'}
                >
                    {canEnterRoom ? 'Masuk Live Room' : 'Live room aktif saat auction live'}
                </Link>

                {canEnterRoom ? (
                    <form className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" onSubmit={submitBid}>
                        <label className="text-sm font-semibold text-stone-200" htmlFor="amount">
                            Bid sekarang
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
                        <p className="mt-2 text-xs text-stone-400">Saldo hanya dicek. Belum ada hold/deduct di MVP core.</p>
                    </form>
                ) : null}
            </section>
        </AppShell>
    );
}
