import { Head, Link } from '@inertiajs/react';

import { AppShell } from '../Layouts/AppShell';

export default function Home() {
    return (
        <AppShell>
            <Head title="Home" />

            <section className="space-y-6">
                <div className="rounded-3xl border border-lime-300/20 bg-gradient-to-br from-lime-400/20 to-emerald-700/20 p-6 shadow-2xl shadow-emerald-950/40">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">
                        Green Beans Auction
                    </p>
                    <h1 className="mt-3 text-3xl font-bold leading-tight text-white md:text-5xl">
                        Live bid kopi hijau, cepat, mobile-first.
                    </h1>
                    <p className="mt-4 max-w-xl text-base leading-7 text-stone-300">
                        Core MVP siap untuk auth, wallet internal, katalog green beans, auction lifecycle, dan live room realtime.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-lime-300 px-5 font-semibold text-stone-950" href="/auctions">
                            Lihat Auctions
                        </Link>
                        <Link className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/15 px-5 font-semibold text-white" href="/wallet">
                            Cek Wallet
                        </Link>
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    {['Auth Google', 'Wallet internal', 'Live auction'].map((item) => (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={item}>
                            <p className="text-sm font-semibold text-lime-200">{item}</p>
                            <p className="mt-2 text-sm leading-6 text-stone-400">Fondasi core, tanpa Midtrans dulu.</p>
                        </div>
                    ))}
                </div>
            </section>
        </AppShell>
    );
}
