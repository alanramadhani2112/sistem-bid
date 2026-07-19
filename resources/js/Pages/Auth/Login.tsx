import { Head, Link } from '@inertiajs/react';

import { AppShell } from '../../Layouts/AppShell';

export default function Login() {
    return (
        <AppShell>
            <Head title="Login" />

            <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Login</p>
                <h1 className="mt-3 text-3xl font-bold text-white">Masuk dengan Google</h1>
                <p className="mt-3 text-sm leading-6 text-stone-400">
                    Akun baru otomatis menjadi bidder dan mendapat wallet internal kosong.
                </p>
                <a className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-lime-300 px-5 font-semibold text-stone-950" href="/auth/google">
                    Continue with Google
                </a>
                <Link className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-white/15 px-5 font-semibold text-white" href="/">
                    Kembali
                </Link>
            </section>
        </AppShell>
    );
}
