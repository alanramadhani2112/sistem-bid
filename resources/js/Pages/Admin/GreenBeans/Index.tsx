import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { EmptyState } from '@/components/app/EmptyState';
import { PageHeader } from '@/components/app/PageHeader';
import { StatusBadge } from '@/components/app/StatusBadge';
import { AppShell } from '../../../Layouts/AppShell';

type GreenBean = {
    id: number;
    name: string;
    origin: string;
    process: string;
    weight_gram: number;
    starting_price: number;
    bid_increment: number;
    image_path: string | null;
};

type GreenBeansIndexProps = {
    greenBeans: GreenBean[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export default function GreenBeansIndex({ greenBeans }: GreenBeansIndexProps) {
    return (
        <AppShell>
            <Head title="Admin Green Beans" />

            <section className="space-y-5">
                <PageHeader
                    accent="Admin"
                    action={
                        <Link href="/admin/green-beans/create">
                            <Button size="sm">Tambah</Button>
                        </Link>
                    }
                    title="Green Beans"
                />

                <div className="space-y-3">
                    {greenBeans.map((greenBean) => (
                        <Card key={greenBean.id}>
                            <CardContent className="flex flex-col gap-3 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-foreground">{greenBean.name}</h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {greenBean.origin} · {greenBean.process} · {greenBean.weight_gram}g
                                        </p>
                                    </div>
                                    <StatusBadge status={formatRupiah(greenBean.starting_price)} />
                                </div>
                                <p className="text-sm text-muted-foreground">Increment {formatRupiah(greenBean.bid_increment)}</p>
                                <div className="flex gap-2">
                                    <Link className="flex-1" href={`/admin/green-beans/${greenBean.id}/edit`}>
                                        <Button className="w-full" size="sm" variant="outline">Edit</Button>
                                    </Link>
                                    <Link
                                        as="button"
                                        className="flex-1"
                                        href={`/admin/green-beans/${greenBean.id}`}
                                        method="delete"
                                        preserveScroll
                                    >
                                        <Button className="w-full" size="sm" variant="destructive">Hapus</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {greenBeans.length === 0 && (
                        <EmptyState description="Belum ada green beans." title="Tidak ada green beans" />
                    )}
                </div>
            </section>
        </AppShell>
    );
}
