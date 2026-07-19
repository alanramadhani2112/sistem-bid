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
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardContent className="p-6">
                        <Badge variant="default">Green Beans Auction</Badge>
                        <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">Live bid kopi hijau, cepat, mobile-first.</h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                            Core MVP siap untuk auth, wallet internal, katalog green beans, auction lifecycle, dan live room realtime.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Link className={cn(buttonVariants({ size: 'lg' }), 'min-h-11')} href="/auctions">
                                Lihat Auctions
                            </Link>
                            <Link className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'min-h-11')} href="/wallet">
                                Cek Wallet
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-3 md:grid-cols-3">
                    {['Auth Google', 'Wallet internal', 'Live auction'].map((item) => (
                        <Card key={item}>
                            <CardContent className="p-4">
                                <p className="text-sm font-semibold text-foreground">{item}</p>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">Fondasi core, tanpa Midtrans dulu.</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </AppShell>
    );
}
