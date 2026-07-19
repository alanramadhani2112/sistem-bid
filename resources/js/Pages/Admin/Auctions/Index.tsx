import { Head, Link, router } from '@inertiajs/react';

import { AppShell } from '../../../Layouts/AppShell';

type Auction = {
    id: number;
    title: string;
    status: string;
    current_price: number;
    starts_at: string;
    ends_at: string;
    green_bean: {
        id: number;
        name: string;
        origin: string;
    };
};

type AuctionsIndexProps = {
    auctions: Auction[];
    statuses: string[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        currency: 'IDR',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(value);

export default function AuctionsIndex({ auctions, statuses }: AuctionsIndexProps) {
    const destroy = (auction: Auction) => {
        if (confirm(`Hapus ${auction.title}?`)) {
            router.delete(`/admin/auctions/${auction.id}`, { preserveScroll: true });
        }
    };

    return (
        <AppShell>
            <Head title="Admin Auctions" />

            <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Admin</p>
                        <h1 className="mt-1 text-3xl font-bold text-white">Auctions</h1>
                    </div>
                    <Link className="min-h-11 rounded-2xl bg-lime-300 px-4 py-3 text-sm font-bold text-stone-950" href="/admin/auctions/create">
                        Tambah
                    </Link>
                </div>

                <div className="space-y-3">
                    {auctions.map((auction) => (
                        <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" key={auction.id}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{auction.title}</h2>
                                    <p className="mt-1 text-sm text-stone-300">
                                        {auction.green_bean.name} · {auction.green_bean.origin}
                                    </p>
                                </div>
                                <span className="rounded-full bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-200">{auction.status}</span>
                            </div>

                            <p className="mt-3 text-sm text-stone-300">Current {formatRupiah(auction.current_price)}</p>
                            <p className="mt-1 text-xs text-stone-400">
                                {auction.starts_at} — {auction.ends_at}
                            </p>

                            <div className="mt-4 grid gap-2 sm:grid-cols-4">
                                <Link
                                    className="min-h-11 rounded-2xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-stone-100"
                                    href={`/admin/auctions/${auction.id}/edit`}
                                >
                                    Edit
                                </Link>
                                <Link
                                    className="min-h-11 rounded-2xl border border-lime-300/30 px-4 py-3 text-center text-sm font-semibold text-lime-200"
                                    href={`/admin/auctions/${auction.id}/monitor`}
                                >
                                    Monitor
                                </Link>
                                <select
                                    className="field-input"
                                    onChange={(event) =>
                                        router.patch(
                                            `/admin/auctions/${auction.id}/status`,
                                            { status: event.target.value },
                                            { preserveScroll: true },
                                        )
                                    }
                                    value={auction.status}
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="min-h-11 rounded-2xl border border-red-300/30 px-4 py-3 text-sm font-semibold text-red-200"
                                    onClick={() => destroy(auction)}
                                    type="button"
                                >
                                    Hapus
                                </button>
                            </div>
                        </article>
                    ))}

                    {auctions.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-stone-300">Belum ada auction.</div>
                    ) : null}
                </div>
            </section>
        </AppShell>
    );
}
