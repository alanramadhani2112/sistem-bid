import { EmptyState } from '@/components/app/EmptyState';
import { SectionCard } from '@/components/app/SectionCard';

export type BidHistoryRow = {
    id: number;
    bidder_name: string;
    amount: number;
    placed_at?: string | null;
};

type BidHistoryFeedProps = {
    rows: BidHistoryRow[];
    formatPrice: (value: number) => string;
    title?: string;
    className?: string;
};

export function BidHistoryFeed({ rows, formatPrice, title = 'Bid History', className }: BidHistoryFeedProps) {
    return (
        <SectionCard className={className} title={title}>
            <div aria-live="polite" className="space-y-3">
                {rows.length === 0 ? (
                    <EmptyState description="Bid terbaru tampil realtime di sini." title="Belum ada bid" />
                ) : (
                    rows.map((row, index) => (
                        <div
                            className={
                                index === 0
                                    ? 'rounded-xl border border-primary/40 bg-primary/10 p-3 motion-safe:animate-pulse'
                                    : 'rounded-xl border border-border bg-muted/40 p-3'
                            }
                            key={`${row.id}-${index}`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold text-foreground">{row.bidder_name}</p>
                                <p className="font-bold tabular-nums text-foreground">{formatPrice(row.amount)}</p>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{index === 0 ? 'Bid terbaru' : row.placed_at ?? 'Realtime bid'}</p>
                        </div>
                    ))
                )}
            </div>
        </SectionCard>
    );
}
