import { Head, Link } from '@inertiajs/react';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { AppShell } from '../../Layouts/AppShell';

export default function Login() {
    return (
        <AppShell>
            <Head title="Login" />

            <Card className="mx-auto max-w-md border-white/10 bg-white/[0.04] text-white">
                <CardHeader>
                    <CardDescription className="font-semibold uppercase tracking-[0.2em] text-lime-200">Login</CardDescription>
                    <CardTitle className="text-3xl font-bold">Masuk dengan Google</CardTitle>
                    <CardDescription className="leading-6 text-stone-400">Akun baru otomatis menjadi bidder dan mendapat wallet internal kosong.</CardDescription>
                </CardHeader>
                <CardContent>
                <a className={cn(buttonVariants({ size: 'lg' }), 'min-h-11 w-full rounded-2xl bg-lime-300 font-semibold text-stone-950 hover:bg-lime-200')} href="/auth/google">
                    Continue with Google
                </a>
                <Link className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'mt-4 min-h-11 w-full rounded-2xl border-white/15 bg-transparent font-semibold text-white hover:bg-white/10')} href="/">
                    Kembali
                </Link>
                </CardContent>
            </Card>
        </AppShell>
    );
}
