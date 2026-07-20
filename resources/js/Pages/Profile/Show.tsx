import { Head } from '@inertiajs/react';
import { Coffee, History, ShieldCheck, Wallet } from 'lucide-react';

import { ActionTile } from '@/components/app/ActionTile';
import { PageHeader } from '@/components/app/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { AppShell } from '../../Layouts/AppShell';

type ProfileShowProps = {
    user: {
        name: string;
        email: string;
        avatar: string | null;
        role: string;
    } | null;
};

export default function ProfileShow({ user }: ProfileShowProps) {
    const initials = user?.name
        ?.split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <AppShell>
            <Head title="Profile" />

            <section className="space-y-5">
                <PageHeader accent="Account" subtitle="Identitas akun yang dipakai untuk live bidding." title="Profile" />

                <Card className="overflow-hidden">
                    <CardContent className="space-y-5 p-5">
                        <div className="flex items-center gap-4">
                            {user?.avatar ? (
                                <img alt="Avatar pengguna" className="size-16 rounded-full object-cover" src={user.avatar} />
                            ) : (
                                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                    {initials ?? 'JW'}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-lg font-semibold text-foreground">{user?.name}</p>
                                <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
                                <Badge className="mt-2 w-fit" variant="secondary">
                                    {user?.role}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid gap-3 text-sm">
                            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                                <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
                                <span className="text-muted-foreground">Akun dipakai untuk akses live bidding dan validasi wallet.</span>
                            </div>
                            <ActionTile description="Cari lot live dan upcoming." href="/auctions" icon={Coffee} title="Auction lots" />
                            <ActionTile description="Cek bid power sebelum masuk room." href="/wallet" icon={Wallet} title="Wallet" />
                            <ActionTile description="Lihat aktivitas bid akun ini." href="/history" icon={History} title="Activity" />
                        </div>
                    </CardContent>
                </Card>
            </section>
        </AppShell>
    );
}
