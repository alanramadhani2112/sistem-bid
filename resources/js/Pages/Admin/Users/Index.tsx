import { Head, Link, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { MetricCard } from '@/components/app/MetricCard';
import { PageHeader } from '@/components/app/PageHeader';
import { StatusBadge } from '@/components/app/StatusBadge';
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
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

const roles = ['admin', 'bidder'] as const;

export default function AdminUsers({ stats, users }: UsersProps) {
    return (
        <AppShell>
            <Head title="Admin Users" />

            <section className="space-y-5">
                <PageHeader accent="Admin" title="Users" />

                <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(stats).map(([label, value]) => (
                        <MetricCard key={label} label={label} value={value} />
                    ))}
                </div>

                <div className="space-y-3">
                    {users.length === 0 && (
                        <p className="rounded-lg border border-dashed border-border bg-muted/20 px-5 py-8 text-center text-sm text-muted-foreground">
                            No users registered yet.
                        </p>
                    )}
                    {users.map((user) => (
                        <Card key={user.id}>
                            <CardContent className="flex flex-col gap-3 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="font-semibold text-foreground">{user.name}</h2>
                                        <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <StatusBadge status={user.role} />
                                </div>
                                <p className="text-sm text-muted-foreground">Wallet {formatRupiah(user.wallet?.balance ?? 0)}</p>

                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/users/${user.id}/wallet`}>
                                        <Button size="sm" variant="outline">View Wallet</Button>
                                    </Link>
                                    <Select
                                        defaultValue={user.role}
                                        onValueChange={(role) => {
                                            if (
                                                role !== user.role
                                                && window.confirm(`Change ${user.name} role to ${role}?`)
                                            ) {
                                                router.patch(
                                                    `/admin/users/${user.id}/role`,
                                                    { role },
                                                    { preserveScroll: true },
                                                );
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="h-9 w-32 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((r) => (
                                                <SelectItem key={r} value={r}>
                                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </AppShell>
    );
}
