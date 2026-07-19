import { Head, Link } from '@inertiajs/react';

import { PageHeader } from '@/components/app/PageHeader';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { AppShell } from '../Layouts/AppShell';

export default function Home() {
    const actions = [
        {
            description: 'Lihat lot green beans yang sudah publish dan siap live bidding.',
            href: '/auctions',
            title: 'Cari auction',
        },
        {
            description: 'Cek saldo sebelum masuk room. Bid hanya diterima jika saldo cukup.',
            href: '/wallet',
            title: 'Siapkan wallet',
        },
        {
            description: 'Pantau riwayat bid dan hasil auction dari akun bidder.',
            href: '/history',
            title: 'Lihat aktivitas',
        },
    ];

    return (
        <AppShell>
            <Head title="Home" />

            <section className="space-y-6">
                <PageHeader accent="Jawara Green Beans" title="Live auction kopi hijau" />

                <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardContent className="p-6">
                        <Badge variant="default">Bidder View</Badge>
                        <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">Temukan lot, cek saldo, masuk room.</h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                            Fokus utama: pilih auction green beans, pastikan wallet cukup, lalu ikut live bid realtime dari HP.
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
                    {actions.map((item) => (
                        <Card key={item.href}>
                            <CardContent className="p-4">
                                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                                <Link className="mt-4 inline-flex text-sm font-medium text-primary hover:underline" href={item.href}>
                                    Buka
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </AppShell>
    );
}
