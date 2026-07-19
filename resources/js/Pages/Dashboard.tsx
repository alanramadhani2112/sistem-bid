import { Head, Link, usePage } from '@inertiajs/react';

import { PageHeader } from '@/components/app/PageHeader';
import { SectionCard } from '@/components/app/SectionCard';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { AppShell } from '../Layouts/AppShell';

type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        } | null;
    };
};

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const actions = [
        { description: 'Cari auction publish/live dan masuk room saat status live.', href: '/auctions', title: 'Auction tersedia' },
        { description: 'Pastikan saldo cukup sebelum bid. Saldo tidak dipotong saat bid.', href: '/wallet', title: 'Wallet' },
        { description: 'Lihat bid yang pernah kamu pasang dan status auction terkait.', href: '/history', title: 'Riwayat bid' },
    ];

    return (
        <AppShell>
            <Head title="Dashboard" />

            <section className="space-y-5">
                <PageHeader
                    accent="Bidder Dashboard"
                    subtitle="Akses cepat ke auction, wallet, dan riwayat bid."
                    title={`Halo, ${auth.user?.name ?? 'Bidder'}`}
                />

                <Card>
                    <CardContent className="p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Akun aktif</p>
                        <h2 className="mt-3 text-2xl font-bold text-foreground">{auth.user?.email}</h2>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">Role: {auth.user?.role}. Gunakan menu bawah untuk navigasi cepat.</p>
                    </CardContent>
                </Card>

                <div className="grid gap-3 md:grid-cols-3">
                    {actions.map((action) => (
                        <SectionCard key={action.href} title={action.title}>
                            <p className="text-sm leading-6 text-muted-foreground">{action.description}</p>
                            <Link className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 min-h-11 w-full')} href={action.href}>
                                Buka
                            </Link>
                        </SectionCard>
                    ))}
                </div>
            </section>
        </AppShell>
    );
}
