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
    return (
        <AppShell>
            <Head title="Profile" />

            <section className="space-y-5">
                <PageHeader accent="Account" title="Profile" />

                <Card>
                    <CardContent className="flex flex-col gap-2 p-5">
                        <p className="text-lg font-semibold text-foreground">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <Badge className="w-fit" variant="secondary">{user?.role}</Badge>
                    </CardContent>
                </Card>
            </section>
        </AppShell>
    );
}
