import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { MetricCard } from '@/components/app/MetricCard';
import { PageHeader } from '@/components/app/PageHeader';
import { StatusBadge } from '@/components/app/StatusBadge';
import { AppShell } from '../../../Layouts/AppShell';

type Winner = {
    id: number;
    winning_amount: number;
    determined_at: string;
    auction: {
        id: number;
        title: string;
        green_bean: { name: string; origin: string };
    };
    user: { name: string; email: string };
    bid: { amount: number; created_at: string };
};

type WinnersProps = {
    winners: Winner[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export default function AdminWinners({ winners }: WinnersProps) {
    return (
        <AppShell>
            <Head title="Admin Winners" />

            <section className="space-y-5">
                <PageHeader accent="Admin" title="Winners" />

                <div className="space-y-3">
                    {winners.length === 0 && (
                        <p className="rounded-lg border border-dashed border-border bg-muted/20 px-5 py-8 text-center text-sm text-muted-foreground">
                            No winners yet. Winners are determined automatically when an auction ends.
                        </p>
                    )}
                    {winners.map((winner) => (
                        <Card key={winner.id}>
                            <CardContent className="flex flex-col gap-3 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="font-semibold text-foreground">{winner.auction.title}</h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {winner.auction.green_bean.name} · {winner.auction.green_bean.origin}
                                        </p>
                                    </div>
                                    <p className="font-bold text-foreground">{formatRupiah(winner.winning_amount)}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {winner.user.name} · {winner.user.email}
                                </p>
                                <p className="text-xs text-muted-foreground">Determined {winner.determined_at}</p>
                                <Link href={`/admin/auctions/${winner.auction.id}/monitor`}>
                                    <Button size="sm" variant="outline">Monitor auction</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}

                    {winners.length === 0 && (
                        <p className="rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center text-sm text-muted-foreground">
                            Belum ada winner.
                        </p>
                    )}
                </div>
            </section>
        </AppShell>
    );
}
