import { History, Radio } from 'lucide-react';

import { EmptyState } from '@/components/app/EmptyState';
import { PriceText } from '@/components/app/PriceText';
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
        <SectionCard className={className} title={<span className="inline-flex items-center gap-2"><History aria-hidden="true" className="size-4 text-primary" />{title}</span>}>
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
                            <div className="flex min-w-0 items-center justify-between gap-3">
                                <p className="inline-flex min-w-0 items-center gap-2 truncate font-semibold text-foreground" title={row.bidder_name}>
                                    {index === 0 && <Radio aria-hidden="true" className="size-4 text-primary" />}
                                    {row.bidder_name}
                                </p>
                                <PriceText className="max-w-[9rem] shrink-0 text-right text-foreground" prefixLabel="Bid amount" value={row.amount} />
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{index === 0 ? 'Bid terbaru' : row.placed_at ?? 'Realtime bid'}</p>
                        </div>
                    ))
                )}
            </div>
        </SectionCard>
    );
}
