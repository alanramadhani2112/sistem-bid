import { Head, Link } from '@inertiajs/react';
import { Coffee, Radio, Trophy, User } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { EmptyState } from '@/components/app/EmptyState';
import { ListItemCard } from '@/components/app/ListItemCard';
import { PageHeader } from '@/components/app/PageHeader';
import { PageShell } from '@/components/app/PageShell';
import { PriceText } from '@/components/app/PriceText';
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

            <PageShell>
                <PageHeader
                    accent="Admin"
                    subtitle="Winner dibuat otomatis ketika auction ditutup dan ada bid valid."
                    title="Winners"
                />

                <div className="space-y-3.5">
                    {winners.length === 0 && (
                        <EmptyState
                            action={(
                                <Link href="/admin/auctions">
                                    <Button>Kelola auction</Button>
                                </Link>
                            )}
                            description="Winner muncul setelah auction live ditutup dan bid tertinggi valid."
                            title="Belum ada winner"
                        />
                    )}
                    {winners.map((winner) => (
                        <ListItemCard contentClassName="flex flex-col gap-3" key={winner.id}>
                                <div className="flex min-w-0 items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h2 className="inline-flex max-w-full items-center gap-2 truncate font-semibold text-foreground" title={winner.auction.title}>
                                            <Trophy aria-hidden="true" className="size-4 text-primary" />
                                            {winner.auction.title}
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            <Coffee aria-hidden="true" className="mr-1 inline size-4" />
                                            {winner.auction.green_bean.name} · {winner.auction.green_bean.origin}
                                        </p>
                                    </div>
                                    <PriceText className="max-w-[10rem] shrink-0 text-right text-foreground" prefixLabel="Winning amount" value={winner.winning_amount} />
                                </div>
                                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                    <User aria-hidden="true" className="size-4" />
                                    {winner.user.name} · {winner.user.email}
                                </p>
                                <p className="text-xs text-muted-foreground">Determined {winner.determined_at}</p>
                                <Link href={`/admin/auctions/${winner.auction.id}/monitor`}>
                                    <Button size="sm" variant="outline"><Radio data-icon="inline-start" />Monitor auction</Button>
                                </Link>
                        </ListItemCard>
                    ))}
                </div>
            </PageShell>
        </AppShell>
    );
}
