import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BackLink } from '@/components/app/BackLink';
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

                <section className="space-y-4">
                <BackLink href="/" />

                <Card className="mx-auto max-w-md border-border/80 bg-card/95 shadow-sm">
                    <CardHeader>
                        <CardDescription className="font-semibold uppercase tracking-[0.2em]">Login</CardDescription>
                        <CardTitle className="text-3xl font-bold">Masuk dengan email</CardTitle>
                        <CardDescription>Gunakan akun demo untuk admin atau bidder.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {(errors.email || errors.password) && (
                            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                                {errors.email ?? errors.password}
                            </div>
                        )}
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
                    <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">Akun demo</p>
                        <p>Admin: admin@jawara.test</p>
                        <p>Bidder: bidder@jawara.test</p>
                        <p>Password: password</p>
                    </div>
                </CardContent>
            </Card>
            </section>
        </AppShell>
    );
}
