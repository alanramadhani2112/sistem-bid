import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, CircleDollarSign, ClipboardList, Gavel, MonitorCheck, Package, Radio, ShieldCheck, Trophy, Users, Wallet } from 'lucide-react';

import { PageHeader } from '@/components/app/PageHeader';
import { SectionCard } from '@/components/app/SectionCard';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { AppShell } from '../Layouts/AppShell';

type Audience = 'admin' | 'bidder';

type UsageGuideProps = {
    audience: Audience;
};

type GuideStep = {
    description: string;
    icon: typeof ShieldCheck;
    title: string;
};

const bidderSteps = [
    {
        description: 'Masuk dengan akun bidder agar bisa akses wallet, room auction, dan riwayat bid.',
        icon: ShieldCheck,
        title: 'Login akun bidder',
    },
    {
        description: 'Buka Wallet, top up saldo, lalu pastikan saldo cukup sebelum masuk auction live.',
        icon: Wallet,
        title: 'Siapkan saldo wallet',
    },
    {
        description: 'Pantau daftar Auctions. Auction publish bisa dilihat, auction live bisa dimasuki untuk bidding.',
        icon: Gavel,
        title: 'Pilih auction',
    },
    {
        description: 'Masuk room auction, cek harga berjalan, isi nominal bid, lalu konfirmasi. Bid harus lebih tinggi dari harga saat ini.',
        icon: CircleDollarSign,
        title: 'Pasang bid',
    },
    {
        description: 'Cek History untuk melihat bid yang pernah dipasang dan status auction terkait.',
        icon: ClipboardList,
        title: 'Pantau riwayat',
    },
];

const adminSteps = [
    {
        description: 'Buka Admin Dashboard untuk melihat metrik, auction live, antrean auction, bid terbaru, dan pemenang.',
        icon: MonitorCheck,
        title: 'Pantau dashboard',
    },
    {
        description: 'Kelola data Green Beans lebih dulu: nama, origin, process, berat, dan gambar produk.',
        icon: Package,
        title: 'Input green beans',
    },
    {
        description: 'Buat auction dari green beans, atur harga awal, waktu mulai, waktu selesai, lalu publish saat siap.',
        icon: Radio,
        title: 'Buat dan publish auction',
    },
    {
        description: 'Gunakan monitor auction untuk melihat leaderboard, bid feed, countdown, dan harga berjalan secara real-time.',
        icon: Gavel,
        title: 'Monitor auction live',
    },
    {
        description: 'Tutup auction setelah selesai, validasi pemenang, lalu cek menu Winners untuk rekap hasil.',
        icon: Trophy,
        title: 'Tutup dan rekap pemenang',
    },
    {
        description: 'Kelola user, role admin/bidder, dan saldo wallet bidder bila butuh koreksi operasional.',
        icon: Users,
        title: 'Kelola user dan wallet',
    },
];

const bidderNotes = ['Saldo tidak dipotong saat bid dipasang.', 'Nominal bid harus melewati harga berjalan.', 'Auction live bisa berubah cepat karena update real-time.'];
const adminNotes = ['Draft belum tampil untuk bidder.', 'Publish auction hanya saat data dan jadwal sudah benar.', 'Close auction mengunci hasil dan menentukan pemenang.'];

function GuideSteps({ items }: { items: GuideStep[] }) {
    return (
        <ol className="space-y-3">
            {items.map((item, index) => {
                const Icon = item.icon;

                return (
                    <li className="flex gap-3" key={item.title}>
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {index + 1}
                        </span>
                        <div className="min-w-0 rounded-xl border border-border/70 bg-background/70 p-3 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Icon aria-hidden="true" className="size-4 text-primary" />
                                <h3 className="font-semibold text-foreground">{item.title}</h3>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

function NoteList({ items }: { items: string[] }) {
    return (
        <ul className="space-y-2">
            {items.map((item) => (
                <li className="flex gap-2 text-sm leading-6 text-muted-foreground" key={item}>
                    <CheckCircle2 aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

export default function UsageGuide({ audience }: UsageGuideProps) {
    const isAdminGuide = audience === 'admin';
    const title = isAdminGuide ? 'Panduan Admin' : 'Panduan Bidder';
    const subtitle = isAdminGuide
        ? 'Halaman stand-alone untuk admin mengelola data, auction, user, wallet, dan pemenang.'
        : 'Halaman stand-alone untuk bidder mengikuti auction, menyiapkan wallet, memasang bid, dan membaca riwayat.';
    const steps = isAdminGuide ? adminSteps : bidderSteps;
    const notes = isAdminGuide ? adminNotes : bidderNotes;
    const backHref = isAdminGuide ? '/admin/dashboard' : '/';
    const backLabel = isAdminGuide ? 'Kembali ke Admin Dashboard' : 'Kembali ke Lobby';

    return (
        <AppShell>
            <Head title={title} />

            <section className="space-y-5">
                <PageHeader
                    accent="Panduan Sistem"
                    subtitle={subtitle}
                    title={title}
                    action={
                        <Link className={cn(buttonVariants({ variant: 'outline' }), 'min-h-11')} href={backHref}>
                            {backLabel}
                        </Link>
                    }
                />

                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                    <CardContent className="p-5">
                        <p className="text-sm leading-6 text-muted-foreground">
                            {isAdminGuide
                                ? 'Ikuti alur ini untuk menjalankan auction dari input green beans sampai rekap pemenang.'
                                : 'Ikuti alur ini untuk masuk auction live, memasang bid, dan memantau riwayat bid.'}
                        </p>
                    </CardContent>
                </Card>

                <SectionCard title={isAdminGuide ? 'Alur Admin' : 'Alur Bidder'} contentClassName="space-y-5">
                    <GuideSteps items={steps} />
                    <div className="rounded-xl bg-muted/50 p-4">
                        <h3 className="mb-3 text-sm font-semibold text-foreground">Catatan penting {isAdminGuide ? 'admin' : 'bidder'}</h3>
                        <NoteList items={notes} />
                    </div>
                    {isAdminGuide ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                            <Link className={cn(buttonVariants({ variant: 'secondary' }), 'min-h-11')} href="/admin/dashboard">
                                Buka Admin Dashboard
                            </Link>
                            <Link className={cn(buttonVariants({ variant: 'outline' }), 'min-h-11')} href="/admin/auctions">
                                Kelola Auctions
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-2 sm:grid-cols-3">
                            <Link className={cn(buttonVariants({ variant: 'secondary' }), 'min-h-11')} href="/auctions">
                                Buka Auctions
                            </Link>
                            <Link className={cn(buttonVariants({ variant: 'outline' }), 'min-h-11')} href="/wallet">
                                Buka Wallet
                            </Link>
                            <Link className={cn(buttonVariants({ variant: 'outline' }), 'min-h-11')} href="/history">
                                Buka History
                            </Link>
                        </div>
                    )}
                </SectionCard>
            </section>
        </AppShell>
    );
}
