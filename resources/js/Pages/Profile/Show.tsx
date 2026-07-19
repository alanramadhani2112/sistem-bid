import { Head } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { PageHeader } from '@/components/app/PageHeader';
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

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">
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
                            <Badge className="mt-2 w-fit" variant="secondary">{user?.role}</Badge>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </AppShell>
    );
}
