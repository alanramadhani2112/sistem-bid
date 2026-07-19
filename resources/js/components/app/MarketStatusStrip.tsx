import { MetricCard } from '@/components/app/MetricCard';

type MarketStatusStripProps = {
    liveCount: number;
    upcomingCount: number;
    latestBid?: string;
    activeBids?: number;
};

export function MarketStatusStrip({ activeBids = 0, latestBid = '-', liveCount, upcomingCount }: MarketStatusStripProps) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Live auctions" value={liveCount} />
            <MetricCard label="Upcoming lots" value={upcomingCount} />
            <MetricCard label="Latest bid" value={latestBid} />
            <MetricCard label="Active bids" value={activeBids} />
        </div>
    );
}
