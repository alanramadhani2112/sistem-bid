import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/app/FormField';

import { AppShell } from '../../Layouts/AppShell';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post('/login');
    }

    return (
        <AppShell>
            <Head title="Login" />

            <Card className="mx-auto max-w-md">
                <CardHeader>
                    <CardDescription className="font-semibold uppercase tracking-[0.2em]">Login</CardDescription>
                    <CardTitle className="text-3xl font-bold">Masuk dengan email</CardTitle>
                    <CardDescription>Google login sedang di-hold. Pakai akun seed lokal dulu.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={submit}>
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
                            autoComplete="current-password"
                            error={errors.password}
                            label="Password"
                            name="password"
                            onChange={(event) => setData('password', event.target.value)}
                            required
                            type="password"
                            value={data.password}
                        />
                        <Button className="min-h-11 w-full text-base" disabled={processing} size="lg" type="submit">
                            Masuk
                        </Button>
                    </form>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Demo: <span className="font-medium text-foreground">admin@jawara.test</span> atau{' '}
                        <span className="font-medium text-foreground">bidder@jawara.test</span> / password{' '}
                        <span className="font-medium text-foreground">password</span>
                    </p>
                    <Link className="mt-4 block" href="/">
                        <Button className="min-h-11 w-full text-base" size="lg" variant="outline">Kembali</Button>
                    </Link>
                </CardContent>
            </Card>
        </AppShell>
    );
}
