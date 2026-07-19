import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { AppShell } from '../Layouts/AppShell';

export default function Home() {
    return (
        <AppShell>
            <Head title="Home" />

            <section className="space-y-6">
                <Card className="border-lime-300/20 bg-gradient-to-br from-lime-400/20 to-emerald-700/20 text-white shadow-2xl shadow-emerald-950/40">
                    <CardContent className="p-6">
                        <Badge className="border-lime-300/30 bg-lime-300/10 text-lime-100" variant="outline">
                            Green Beans Auction
                        </Badge>
                        <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">Live bid kopi hijau, cepat, mobile-first.</h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-stone-300">Core MVP siap untuk auth, wallet internal, katalog green beans, auction lifecycle, dan live room realtime.</p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link className={cn(buttonVariants({ size: 'lg' }), 'min-h-11 rounded-2xl bg-lime-300 font-semibold text-stone-950 hover:bg-lime-200')} href="/auctions">
                            Lihat Auctions
                        </Link>
                        <Link className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'min-h-11 rounded-2xl border-white/15 bg-transparent font-semibold text-white hover:bg-white/10')} href="/wallet">
                            Cek Wallet
                        </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-3 md:grid-cols-3">
                    {['Auth Google', 'Wallet internal', 'Live auction'].map((item) => (
                        <Card className="border-white/10 bg-white/[0.04] text-white" key={item}>
                            <CardContent className="p-4">
                                <p className="text-sm font-semibold text-lime-200">{item}</p>
                                <p className="mt-2 text-sm leading-6 text-stone-400">Fondasi core, tanpa Midtrans dulu.</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </AppShell>
    );
}
