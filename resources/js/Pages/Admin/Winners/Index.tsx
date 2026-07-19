import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { EmptyState } from '@/components/app/EmptyState';
import { PageHeader } from '@/components/app/PageHeader';
import { formatRupiah } from '@/lib/format';
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

export default function AdminWinners({ winners }: WinnersProps) {
    return (
        <AppShell>
            <Head title="Admin Winners" />

            <section className="space-y-5">
                <PageHeader
                    accent="Admin"
                    subtitle="Winner dibuat otomatis ketika auction ditutup dan ada bid valid."
                    title="Winners"
                />

                <div className="space-y-3">
                    {winners.length === 0 && (
                        <EmptyState description="Winner akan muncul setelah auction live ditutup dan bid tertinggi ditemukan." title="Belum ada winner" />
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
                </div>
            </section>
        </AppShell>
    );
}
