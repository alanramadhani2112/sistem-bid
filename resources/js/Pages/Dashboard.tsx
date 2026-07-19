import { Head, usePage } from '@inertiajs/react';

import { Card, CardContent } from '@/components/ui/card';

import { AppShell } from '../Layouts/AppShell';

type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        } | null;
    };
};

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;

    return (
        <AppShell>
            <Head title="Dashboard" />

            <section>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Dashboard</p>
                        <h1 className="mt-3 text-3xl font-bold text-foreground">Halo, {auth.user?.name}</h1>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Role: {auth.user?.role}. Modul wallet, green beans, dan auction lanjut task berikutnya.
                        </p>
                    </CardContent>
                </Card>
            </section>
        </AppShell>
    );
}
