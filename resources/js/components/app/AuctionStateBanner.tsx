import { StatusBadge } from '@/components/app/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';

type AuctionStateBannerProps = {
    status: string;
    startsAt?: string;
    endsAt?: string;
    className?: string;
};

const copy: Record<string, string> = {
    closed: 'Auction selesai. Cek winner dan harga final.',
    draft: 'Auction masih draft. Belum terlihat oleh bidder.',
    live: 'Auction sedang live. Pantau harga, leaderboard, dan sisa waktu.',
    published: 'Auction sudah publish. Bidder dapat melihat lot sebelum live.',
};

export function AuctionStateBanner({ status, startsAt, endsAt, className }: AuctionStateBannerProps) {
    return (
        <Card className={cn(status === 'live' && 'border-primary/40 bg-primary/5', className)}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <StatusBadge status={status} />
                        <p className="text-sm font-semibold text-foreground">{copy[status] ?? 'Status auction terbaru.'}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {startsAt && `Mulai: ${formatDateTime(startsAt)}`} {endsAt && ` · Selesai: ${formatDateTime(endsAt)}`}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
