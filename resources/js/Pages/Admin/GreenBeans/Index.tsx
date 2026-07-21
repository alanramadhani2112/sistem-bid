import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { EmptyState } from '@/components/app/EmptyState';
import { PageHeader } from '@/components/app/PageHeader';
import { PriceText } from '@/components/app/PriceText';
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

export default function GreenBeansIndex({ greenBeans }: GreenBeansIndexProps) {
    return (
        <AppShell>
            <Head title="Admin Green Beans" />

            <section className="space-y-5">
                <PageHeader
                    accent="Admin"
                    action={
                        <Link href="/admin/green-beans/create">
                            <Button size="sm">Tambah bean</Button>
                        </Link>
                    }
                    subtitle="Kelola lot mentah sebelum dijadikan auction."
                    title="Green Beans"
                />

                <div className="space-y-3.5">
                    {greenBeans.map((greenBean) => (
                        <Card className="border-border/80 bg-card/95 shadow-sm transition-colors hover:bg-accent/20" key={greenBean.id}>
                            <CardContent className="flex flex-col gap-3 p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm">
                                        {greenBean.image_path ? (
                                            <img
                                                alt={greenBean.name}
                                                className="h-full w-full object-cover"
                                                src={`/storage/${greenBean.image_path}`}
                                            />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No img</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <h2 className="text-lg font-semibold text-foreground">{greenBean.name}</h2>
                                            <Badge className="max-w-[9rem]" variant="outline">
                                                <PriceText value={greenBean.starting_price} />
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {greenBean.origin} · {greenBean.process} · {greenBean.weight_gram}g
                                        </p>
                                    </div>
                                </div>
                                <p className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">Increment <PriceText className="inline-block max-w-[9rem] text-muted-foreground" value={greenBean.bid_increment} /></p>
                                <div className="flex gap-2">
                                    <Link className="flex-1" href={`/admin/green-beans/${greenBean.id}/edit`}>
                                        <Button className="w-full" size="sm" variant="outline">Edit</Button>
                                    </Link>
                                     <Link
                                         as="button"
                                        className={buttonVariants({ className: 'flex-1', size: 'sm', variant: 'destructive' })}
                                         href={`/admin/green-beans/${greenBean.id}`}
                                         method="delete"
                                         onClick={(event) => { if (!window.confirm(`Hapus green bean "${greenBean.name}"?`)) event.preventDefault(); }}
                                         preserveScroll
                                     >
                                        Hapus
                                     </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {greenBeans.length === 0 && (
                        <EmptyState
                            action={(
                                <Link href="/admin/green-beans/create">
                                    <Button>Tambah bean</Button>
                                </Link>
                            )}
                            description="Tambahkan green bean dulu sebelum membuat auction."
                            title="Tidak ada green beans"
                        />
                    )}
                </div>
            </section>
        </AppShell>
    );
}
