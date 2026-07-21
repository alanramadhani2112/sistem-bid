import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { BackLink } from '@/components/app/BackLink';
import { FormField } from '@/components/app/FormField';
import { FormPageShell } from '@/components/app/FormPageShell';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppShell } from '../../../Layouts/AppShell';

type NewUserForm = {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'bidder';
};

const roles = ['admin', 'bidder'] as const;

export default function AdminUsersCreate() {
    const { data, errors, post, processing, setData } = useForm<NewUserForm>({
        name: '',
        email: '',
        password: '',
        role: 'bidder',
    });

    const submitNewUser = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/admin/users');
    };

    return (
        <AppShell>
            <Head title="Tambah User" />

            <FormPageShell
                backHref="/admin/users"
                cardDescription="Isi data akun baru. Email harus unik dan password minimal 8 karakter."
                cardTitle="Data user"
                subtitle="Buat akun admin atau bidder secara manual. User langsung punya wallet kosong."
                title="Tambah user"
            >
                <form className="grid gap-4" onSubmit={submitNewUser}>
                    <div className="grid gap-4 md:grid-cols-2">
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
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            autoComplete="new-password"
                            description="Minimal 8 karakter. Admin bisa mengganti password di DB jika diperlukan."
                            error={errors.password}
                            label="Password"
                            name="password"
                            onChange={(event) => setData('password', event.target.value)}
                            required
                            type="password"
                            value={data.password}
                        />
                        <FormField description="Bidder untuk peserta lelang, admin untuk pengelola sistem." error={errors.role} label="Role" name="role" required>
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
                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <BackLink className="justify-center sm:justify-start" href="/admin/users" label="Batal" />
                        <Button className="min-h-11" disabled={processing} type="submit">
                            {processing ? 'Menyimpan...' : 'Tambah user'}
                        </Button>
                    </div>
                </form>
            </FormPageShell>
        </AppShell>
    );
}
