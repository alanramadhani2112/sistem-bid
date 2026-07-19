import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
        <div className="min-h-dvh bg-background text-foreground">
            <a
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href="#main-content"
            >
                Skip ke konten
            </a>

            <header className="fixed inset-x-0 top-0 z-30 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
                    <Link className="font-semibold tracking-tight text-primary" href="/">
                        Jawara
                    </Link>
                    <Badge variant="default">Live Bid</Badge>
                </div>
            </header>

            <div className="mx-auto flex max-w-6xl pt-14 md:pl-60">
                <aside className="fixed bottom-0 left-0 top-14 hidden w-60 border-r border-border bg-muted/30 p-4 md:block">
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                className={cn(
                                    buttonVariants({ size: 'lg', variant: 'ghost' }),
                                    'w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                )}
                                href={item.href}
                                key={item.href}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 px-4 py-6 md:px-6 md:py-8" id="main-content">
                    {children}
                </main>
            </div>

            <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
                {navItems.map((item) => (
                    <Link
                        className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground min-h-16 justify-center"
                        href={item.href}
                        key={item.href}
                    >
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="h-16 md:hidden" />
        </div>
    );
}
