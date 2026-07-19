import { Head } from '@inertiajs/react';

import { AppShell } from '../../../Layouts/AppShell';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    wallet?: { balance: number } | null;
};

type UsersProps = {
    stats: Record<string, number>;
    users: UserRow[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        currency: 'IDR',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(value);

export default function AdminUsers({ stats, users }: UsersProps) {
    return (
        <AppShell>
            <Head title="Admin Users" />

            <section className="space-y-5">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Admin</p>
                    <h1 className="mt-1 text-3xl font-bold text-white">Users</h1>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(stats).map(([label, value]) => (
                        <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" key={label}>
                            <p className="text-sm text-stone-400">{label}</p>
                            <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                        </article>
                    ))}
                </div>

                <div className="space-y-3">
                    {users.map((user) => (
                        <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" key={user.id}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="font-semibold text-white">{user.name}</h2>
                                    <p className="mt-1 text-sm text-stone-300">{user.email}</p>
                                </div>
                                <span className="rounded-full bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-200">{user.role}</span>
                            </div>
                            <p className="mt-3 text-sm text-stone-300">Wallet {formatRupiah(user.wallet?.balance ?? 0)}</p>
                        </article>
                    ))}
                </div>
            </section>
        </AppShell>
    );
}
