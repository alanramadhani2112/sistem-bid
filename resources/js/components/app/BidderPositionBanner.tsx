import { PriceText } from '@/components/app/PriceText';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type BidderPositionBannerProps = {
    currentUserName?: string | null;
    formatPrice: (value: number) => string;
    leaderName?: string | null;
    leaderAmount?: number | null;
    userHighestBid?: number | null;
    className?: string;
};

export function BidderPositionBanner({
    className,
    currentUserName,
    formatPrice,
    leaderAmount,
    leaderName,
    userHighestBid,
}: BidderPositionBannerProps) {
    const normalizedUser = currentUserName?.trim().toLowerCase();
    const normalizedLeader = leaderName?.trim().toLowerCase();
    const isLeading = Boolean(normalizedUser && normalizedLeader && normalizedUser === normalizedLeader);
    const hasBid = typeof userHighestBid === 'number';
    const gap = hasBid && leaderAmount ? Math.max(leaderAmount - userHighestBid, 0) : null;

    const tone = isLeading
        ? 'border-primary/40 bg-primary/5'
        : hasBid
          ? 'border-yellow-500/40 bg-yellow-500/10'
          : 'border-border bg-muted/30';

    const title = isLeading ? 'Kamu sementara memimpin' : hasBid ? 'Kamu tertinggal' : 'Belum ikut bid';
    const description = isLeading
        ? 'Pertahankan posisi sampai countdown selesai.'
        : hasBid && gap !== null
          ? `Naikkan minimal ${formatPrice(gap)} untuk mengejar leader saat ini.`
          : 'Masukkan bid saat sudah siap. Sistem akan cek saldo dan increment.';

    return (
        <Card className={cn('border', tone, className)}>
            <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                {leaderName && leaderAmount && (
                    <p className="mt-2 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                        Leader: <span className="truncate font-semibold text-foreground" title={leaderName}>{leaderName}</span> · <PriceText className="inline-block max-w-[8rem] text-muted-foreground" value={leaderAmount} />
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
