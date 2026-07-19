import { Head } from '@inertiajs/react';

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

            <section className="space-y-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Account</p>
                    <h1 className="mt-1 text-3xl font-bold text-white">Profile</h1>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-lg font-semibold text-white">{user?.name}</p>
                    <p className="mt-1 text-sm text-stone-300">{user?.email}</p>
                    <p className="mt-4 inline-flex rounded-full bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-200">{user?.role}</p>
                </div>
            </section>
        </AppShell>
    );
}
