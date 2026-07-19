import { Head, usePage } from '@inertiajs/react';

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

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Dashboard</p>
                <h1 className="mt-3 text-3xl font-bold text-white">Halo, {auth.user?.name}</h1>
                <p className="mt-3 text-sm leading-6 text-stone-400">
                    Role: {auth.user?.role}. Modul wallet, green beans, dan auction lanjut task berikutnya.
                </p>
            </section>
        </AppShell>
    );
}
