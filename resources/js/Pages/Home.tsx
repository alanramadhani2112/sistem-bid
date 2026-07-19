import { Head, Link } from '@inertiajs/react';
import { Gavel, History, Wallet } from 'lucide-react';

import { ActionTile } from '@/components/app/ActionTile';
import { AuctionBoard } from '@/components/app/AuctionBoard';
import { BidHistoryFeed } from '@/components/app/BidHistoryFeed';
import { LiveAuctionHero } from '@/components/app/LiveAuctionHero';
import { MarketStatusStrip } from '@/components/app/MarketStatusStrip';
import { PageHeader } from '@/components/app/PageHeader';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatRupiah } from '@/lib/format';
import { cn } from '@/lib/utils';

import { AppShell } from '../Layouts/AppShell';

type LobbyAuction = {
    id: number;
    title: string;
    status: string;
    current_price: number;
    starts_at: string;
    ends_at: string;
    bid_count?: number;
    leader_name?: string | null;
    green_bean: {
        name: string;
        origin: string;
        process: string;
        weight_gram?: number;
        image_path?: string | null;
    };
};

type LatestBid = {
    id: number;
    amount: number;
    bidder_name?: string | null;
    auction_title?: string | null;
    placed_at?: string | null;
};

type HomeProps = {
    auctions: LobbyAuction[];
    liveAuction: LobbyAuction | null;
    latestBids: LatestBid[];
};

export default function Home({ auctions, liveAuction, latestBids }: HomeProps) {
    const liveCount = auctions.filter((auction) => auction.status === 'live').length;
    const upcomingCount = auctions.filter((auction) => auction.status === 'published').length;
    const latestBid = latestBids[0] ? formatRupiah(latestBids[0].amount) : undefined;
    const activeBids = auctions.reduce((sum, auction) => sum + (auction.bid_count ?? 0), 0);
    const actions = [
        {
            description: 'Lihat lot green beans yang sudah publish dan siap live bidding.',
            href: '/auctions',
            icon: Gavel,
            title: 'Cari auction',
        },
        {
            description: 'Cek saldo sebelum masuk room. Bid hanya diterima jika saldo cukup.',
            href: '/wallet',
            icon: Wallet,
            title: 'Siapkan wallet',
        },
        {
            description: 'Pantau riwayat bid dan hasil auction dari akun bidder.',
            href: '/history',
            icon: History,
            title: 'Lihat aktivitas',
        },
    ];

    return (
        <AppShell>
            <Head title="Home" />

            <section className="space-y-6">
                <PageHeader
                    accent="Jawara Green Beans"
                    subtitle="Auction lobby untuk green beans. Lihat live lot, cek harga, lalu masuk room saat siap bid."
                    title="Live auction kopi hijau"
                />

                <LiveAuctionHero auction={liveAuction} formatPrice={formatRupiah} />

                <MarketStatusStrip activeBids={activeBids} latestBid={latestBid} liveCount={liveCount} upcomingCount={upcomingCount} />

                <Card>
                    <CardContent className="p-5">
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Cara ikut live bid</h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                    Pilih lot, pastikan saldo cukup, masuk live room, lalu bid sebelum countdown habis.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Link className={cn(buttonVariants({ size: 'lg' }), 'min-h-11')} href="/auctions">
                                    <Gavel data-icon="inline-start" />
                                    Buka Auction Board
                                </Link>
                                <Link className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'min-h-11')} href="/wallet">
                                    <Wallet data-icon="inline-start" />
                                    Cek Wallet
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <AuctionBoard auctions={auctions} formatPrice={formatRupiah} />

                <BidHistoryFeed
                    formatPrice={formatRupiah}
                    rows={latestBids.map((bid) => ({
                        amount: bid.amount,
                        bidder_name: `${bid.bidder_name ?? 'Bidder'} · ${bid.auction_title ?? 'Auction'}`,
                        id: bid.id,
                        placed_at: bid.placed_at,
                    }))}
                    title="Recent bid activity"
                />

                <div className="grid gap-3 md:grid-cols-3">
                    {actions.map((item) => (
                        <ActionTile description={item.description} href={item.href} icon={item.icon} key={item.href} title={item.title} />
                    ))}
                </div>
            </section>
        </AppShell>
    );
}
