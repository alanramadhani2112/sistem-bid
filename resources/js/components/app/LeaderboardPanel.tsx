import { EmptyState } from '@/components/app/EmptyState';
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
        <SectionCard className={className} title={title}>
            {rows.length === 0 ? (
                <EmptyState description="Ranking muncul setelah bid pertama masuk." title="Belum ada leader" />
            ) : (
                <div className="space-y-3">
                    {rows.map((row, index) => (
                        <div
                            className={cn(
                                'flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3',
                                index === 0 && 'border-primary/40 bg-primary/5',
                            )}
                            key={`${row.id}-${index}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                                    #{index + 1}
                                </span>
                                <div>
                                    <p className="font-semibold text-foreground">{row.bidder_name}</p>
                                    {index === 0 && <p className="text-xs text-primary">Temporary leader</p>}
                                </div>
                            </div>
                            <p className="text-right font-bold tabular-nums text-foreground">{formatPrice(row.amount)}</p>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
