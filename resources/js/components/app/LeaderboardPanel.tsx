import { Trophy, Users } from 'lucide-react';

import { EmptyState } from '@/components/app/EmptyState';
import { PriceText } from '@/components/app/PriceText';
import { SectionCard } from '@/components/app/SectionCard';
import { cn } from '@/lib/utils';

export type LeaderboardRow = {
    id: number;
    bidder_name: string;
    amount: number;
};

type LeaderboardPanelProps = {
    rows: LeaderboardRow[];
    formatPrice: (value: number) => string;
    title?: string;
    className?: string;
};

export function LeaderboardPanel({ rows, formatPrice, title = 'Leaderboard', className }: LeaderboardPanelProps) {
    return (
        <SectionCard className={className} title={<span className="inline-flex items-center gap-2"><Trophy aria-hidden="true" className="size-4 text-primary" />{title}</span>}>
            {rows.length === 0 ? (
                <EmptyState description="Ranking muncul setelah bid pertama masuk." title="Belum ada leader" />
            ) : (
                <div className="space-y-3">
                    {rows.map((row, index) => (
                        <div
                            className={cn(
                                'flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-background p-3',
                                index === 0 && 'border-primary/40 bg-primary/5',
                            )}
                            key={`${row.id}-${index}`}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                                    {index === 0 ? <Trophy aria-hidden="true" className="size-4 text-primary" /> : <Users aria-hidden="true" className="size-4" />}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-foreground" title={row.bidder_name}>{row.bidder_name}</p>
                                    {index === 0 && <p className="text-xs text-primary">Temporary leader</p>}
                                </div>
                            </div>
                            <PriceText className="max-w-[9rem] shrink-0 text-right text-foreground" prefixLabel="Leader amount" value={row.amount} />
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
