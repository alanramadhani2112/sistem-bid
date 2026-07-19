import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

type AppShellProps = {
    children: ReactNode;
};

type SharedProps = {
    auth?: {
        user?: {
            role?: string;
        } | null;
    };
};

const bidderNavItems = [
    { href: '/', label: 'Home' },
    { href: '/auctions', label: 'Auctions' },
    { href: '/wallet', label: 'Wallet' },
    { href: '/history', label: 'History' },
    { href: '/profile', label: 'Profile' },
];

const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/green-beans', label: 'Beans' },
    { href: '/admin/auctions', label: 'Auctions' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/winners', label: 'Winners' },
];

export function AppShell({ children }: AppShellProps) {
    const { auth } = usePage<SharedProps>().props;
    const navItems = auth?.user?.role === 'admin' ? adminNavItems : bidderNavItems;

    return (
        <div className="min-h-dvh bg-stone-950 text-stone-50">
            <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-2xl focus:bg-lime-300 focus:px-4 focus:py-3 focus:font-semibold focus:text-stone-950" href="#main-content">
                Skip ke konten
            </a>

            <header className="fixed inset-x-0 top-0 z-30 h-14 border-b border-white/10 bg-stone-950/95 backdrop-blur">
                <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
                    <Link className="font-semibold tracking-tight text-lime-300" href="/">
                        Jawara
                    </Link>
                    <span className="rounded-full bg-lime-400/10 px-3 py-1 text-xs font-medium text-lime-200">
                        Live Bid
                    </span>
                </div>
            </header>

            <div className="mx-auto flex max-w-6xl pt-14 md:pl-60">
                <aside className="fixed bottom-0 left-0 top-14 hidden w-60 border-r border-white/10 bg-stone-900/60 p-4 md:block">
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                className="block rounded-xl px-4 py-3 text-sm font-medium text-stone-300 hover:bg-white/10 hover:text-white"
                                href={item.href}
                                key={item.href}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <main className="w-full px-4 pb-24 pt-6 md:px-8 md:pb-10" id="main-content">
                    {children}
                </main>
            </div>

            <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-5 border-t border-white/10 bg-stone-950/95 pb-safe-bottom backdrop-blur md:hidden">
                {navItems.map((item) => (
                    <Link
                        className="flex min-h-11 items-center justify-center text-xs font-medium text-stone-300 hover:text-lime-200"
                        href={item.href}
                        key={item.href}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
