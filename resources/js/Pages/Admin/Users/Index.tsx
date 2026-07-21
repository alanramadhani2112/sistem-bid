import { Head, Link, router, useForm } from '@inertiajs/react';
import { ShieldCheck, User, Wallet } from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { EmptyState } from '@/components/app/EmptyState';
import { FilterPanel } from '@/components/app/FilterPanel';
import { FormField } from '@/components/app/FormField';
import { ListItemCard } from '@/components/app/ListItemCard';
import { MetricCard } from '@/components/app/MetricCard';
import { MetricGrid } from '@/components/app/MetricGrid';
import { PageHeader } from '@/components/app/PageHeader';
import { PageShell } from '@/components/app/PageShell';
import { PriceText } from '@/components/app/PriceText';
import { SectionCard } from '@/components/app/SectionCard';
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

type NewUserForm = {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'bidder';
};

const roles = ['admin', 'bidder'] as const;

export default function AdminUsers({ stats, users }: UsersProps) {
    const [query, setQuery] = useState('');
    const { data, errors, post, processing, reset, setData } = useForm<NewUserForm>({
        name: '',
        email: '',
        password: '',
        role: 'bidder',
    });
    const filteredUsers = useMemo(() => {
        const q = query.toLowerCase();

        return users.filter((user) => [user.name, user.email, user.role].join(' ').toLowerCase().includes(q));
    }, [query, users]);

    const submitNewUser = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => reset('name', 'email', 'password'),
        });
    };

    return (
        <AppShell>
            <Head title="Admin Users" />

            <PageShell>
                <PageHeader accent="Admin" subtitle="Cari user, cek saldo, dan ubah role bila diperlukan." title="Users" />

                <MetricGrid columns="two">
                    {Object.entries(stats).map(([label, value]) => (
                        <MetricCard key={label} label={label} value={value} />
                    ))}
                </MetricGrid>

                <SectionCard description="Buat akun admin atau bidder secara manual. User langsung punya wallet kosong." title="Tambah user">
                    <form className="grid gap-4 lg:grid-cols-[1fr_1fr_12rem_10rem_auto] lg:items-end" onSubmit={submitNewUser}>
                        <FormField
                            autoComplete="name"
                            error={errors.name}
                            label="Nama"
                            name="name"
                            onChange={(event) => setData('name', event.target.value)}
                            required
                            value={data.name}
                        />
                        <FormField
                            autoComplete="email"
                            error={errors.email}
                            label="Email"
                            name="email"
                            onChange={(event) => setData('email', event.target.value)}
                            required
                            type="email"
                            value={data.email}
                        />
                        <FormField
                            autoComplete="new-password"
                            error={errors.password}
                            label="Password"
                            name="password"
                            onChange={(event) => setData('password', event.target.value)}
                            required
                            type="password"
                            value={data.password}
                        />
                        <FormField error={errors.role} label="Role" name="role" required>
                            <Select value={data.role} onValueChange={(role) => setData('role', role as NewUserForm['role'])}>
                                <SelectTrigger className="min-h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                        <Button className="min-h-11" disabled={processing} type="submit">
                            Tambah
                        </Button>
                    </form>
                </SectionCard>

                <FilterPanel>
                    <Input
                        aria-label="Cari user"
                        className="min-h-11"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Cari nama, email, role..."
                        type="search"
                        value={query}
                    />
                </FilterPanel>

                <div className="space-y-3.5">
                    {filteredUsers.length === 0 && (
                        <EmptyState
                            action={query ? (
                                <Button onClick={() => setQuery('')} type="button" variant="outline">
                                    Reset pencarian
                                </Button>
                            ) : undefined}
                            description="Coba ubah kata kunci pencarian."
                            title="User tidak ditemukan"
                        />
                    )}
                    {filteredUsers.map((user) => (
                        <ListItemCard contentClassName="flex flex-col gap-3" key={user.id}>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="inline-flex items-center gap-2 font-semibold text-foreground">
                                            <User aria-hidden="true" className="size-4 text-primary" />
                                            {user.name}
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <StatusBadge status={user.role} />
                                </div>
                                <p className="inline-flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                                    <Wallet aria-hidden="true" className="size-4" />
                                    Wallet <PriceText className="inline-block max-w-[10rem] text-muted-foreground" value={user.wallet?.balance ?? 0} />
                                </p>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Link href={`/admin/users/${user.id}/wallet`}>
                                        <Button size="sm" variant="outline"><Wallet data-icon="inline-start" />Kelola wallet</Button>
                                    </Link>
                                    <Select
                                        defaultValue={user.role}
                                        onValueChange={(role) => {
                                            if (
                                                role !== user.role
                                                && window.confirm(`Ubah role ${user.name} ke ${role}?\n\nAkses menu user akan berubah setelah disimpan.`)
                                            ) {
                                                router.patch(
                                                    `/admin/users/${user.id}/role`,
                                                    { role },
                                                    { preserveScroll: true },
                                                );
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="h-9 w-36 text-xs">
                                            <ShieldCheck aria-hidden="true" className="size-3.5 text-muted-foreground" />
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
                        </ListItemCard>
                    ))}
                </div>
            </PageShell>
        </AppShell>
    );
}
