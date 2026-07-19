import { AuctionCard } from '@/components/app/AuctionCard';
import { EmptyState } from '@/components/app/EmptyState';
import { SectionCard } from '@/components/app/SectionCard';

type BoardAuction = {
    id: number;
    title: string;
    status: string;
    current_price: number;
    starts_at: string;
    ends_at: string;
    green_bean: {
        name: string;
        origin: string;
        process: string;
        weight_gram?: number;
        image_path?: string | null;
    };
};

type AuctionBoardProps = {
    auctions: BoardAuction[];
    formatPrice: (value: number) => string;
};

const sections = [
    { description: 'Auction sedang berjalan. Countdown dan harga harus dipantau sekarang.', status: 'live', title: 'Live auction' },
    { description: 'Lot sudah publish dan menunggu waktu mulai.', status: 'published', title: 'Upcoming lots' },
    { description: 'Auction selesai untuk referensi harga final.', status: 'closed', title: 'Closed auctions' },
];

export function AuctionBoard({ auctions, formatPrice }: AuctionBoardProps) {
    return (
        <div className="space-y-4">
            {sections.map((section) => {
                const items = auctions.filter((auction) => auction.status === section.status);

                return (
                    <SectionCard key={section.status} title={section.title}>
                        <p className="mb-4 text-sm text-muted-foreground">{section.description}</p>
                        {items.length === 0 ? (
                            <EmptyState description="Belum ada lot pada status ini." title="Kosong" />
                        ) : (
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {items.map((auction) => (
                                    <AuctionCard auction={auction} formatPrice={formatPrice} key={auction.id} />
                                ))}
                            </div>
                        )}
                    </SectionCard>
                );
            })}
        </div>
    );
}
