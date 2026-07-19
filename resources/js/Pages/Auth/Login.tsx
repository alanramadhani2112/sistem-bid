import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { AppShell } from '../../Layouts/AppShell';

export default function Login() {
    return (
        <AppShell>
            <Head title="Login" />

            <Card className="mx-auto max-w-md">
                <CardHeader>
                    <CardDescription className="font-semibold uppercase tracking-[0.2em]">Login</CardDescription>
                    <CardTitle className="text-3xl font-bold">Masuk dengan Google</CardTitle>
                    <CardDescription>Akun baru otomatis menjadi bidder dan mendapat wallet internal kosong.</CardDescription>
                </CardHeader>
                <CardContent>
                    <a className="inline-flex min-h-11 w-full items-center justify-center" href="/auth/google">
                        <Button className="min-h-11 w-full text-base" size="lg">Continue with Google</Button>
                    </a>
                    <Link className="mt-4 block" href="/">
                        <Button className="min-h-11 w-full text-base" size="lg" variant="outline">Kembali</Button>
                    </Link>
                </CardContent>
            </Card>
        </AppShell>
    );
}
