import { Link, usePage } from '@inertiajs/react';
import { Bell, Coffee, Gavel, History, LayoutDashboard, Package, Radio, Trophy, User, Users, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';

import { ActiveLink } from '@/components/app/ActiveLink';
import { DarkModeToggle } from '@/components/app/DarkModeToggle';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AppShellProps = {
    children: ReactNode;
};

type SharedProps = {
    auth?: {
        user?: {
            name?: string;
            role?: string;
        } | null;
    };
};

const bidderNavItems = [
    { href: '/', icon: Coffee, label: 'Lobby' },
    { href: '/auctions', icon: Gavel, label: 'Auctions' },
    { href: '/wallet', icon: Wallet, label: 'Wallet' },
    { href: '/history', icon: History, label: 'History' },
    { href: '/profile', icon: User, label: 'Profile' },
];

const adminNavItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Control' },
    { href: '/admin/auctions', icon: Radio, label: 'Auctions' },
    { href: '/admin/green-beans', icon: Package, label: 'Beans' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/winners', icon: Trophy, label: 'Winners' },
];

export function AppShell({ children }: AppShellProps) {
    const { props, url } = usePage<SharedProps>();
    const isAdmin = props.auth?.user?.role === 'admin';
    const user = props.auth?.user;
    const navItems = isAdmin ? adminNavItems : bidderNavItems;

    return (
        <div className="app-surface min-h-dvh text-foreground">
            <a
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href="#main-content"
            >
                Skip ke konten
            </a>

            <header
                className={cn(
                    'fixed inset-x-0 top-0 z-30 h-14 border-b border-border bg-background/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/75',
                    isAdmin && 'md:left-60',
                    !isAdmin && 'md:left-1/2 md:right-auto md:w-[448px] md:-translate-x-1/2 md:rounded-b-2xl md:border-x md:shadow-md',
                )}
            >
                <div className={cn('mx-auto flex h-full items-center justify-between px-4', isAdmin ? 'max-w-6xl' : 'max-w-md')}>
                    <div className={cn('flex items-center gap-3', isAdmin && 'md:hidden')}>
                        <Link className="flex items-center gap-2 font-semibold tracking-tight text-primary" href={isAdmin ? '/admin/dashboard' : '/'}>
                            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                                {isAdmin ? <LayoutDashboard aria-hidden="true" className="size-4" /> : <Coffee aria-hidden="true" className="size-4" />}
                            </span>
                            <span className="hidden sm:inline">Jawara</span>
                        </Link>
                        <Badge variant={isAdmin ? 'secondary' : 'default'}>{isAdmin ? 'Admin Console' : 'Live Auction'}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isAdmin && (
                            <Link
                                aria-label="Notifikasi live auction"
                                className={cn(buttonVariants({ size: 'icon', variant: 'ghost' }), 'min-h-9')}
                                href="/history"
                            >
                                <Bell aria-hidden="true" className="size-4" />
                            </Link>
                        )}
                        <DarkModeToggle />
                        {user && (
                            <Link
                                as="button"
                                className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'min-h-9')}
                                href="/logout"
                                method="post"
                            >
                                Logout
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <div className={cn('mx-auto flex pt-14', isAdmin ? 'max-w-6xl md:pl-60' : 'w-full max-w-md min-w-0')}>
                {isAdmin && (
                    <aside className="fixed bottom-0 left-0 top-0 hidden w-60 border-r border-border bg-card/90 p-4 shadow-sm backdrop-blur md:block">
                        <Link className="mb-6 flex h-10 items-center gap-2 font-semibold tracking-tight text-primary" href="/admin/dashboard">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                                <LayoutDashboard aria-hidden="true" className="size-4" />
                            </span>
                            <span>Jawara</span>
                            <Badge variant="secondary">Admin Console</Badge>
                        </Link>
                        <nav className="space-y-1.5">
                            {navItems.map((item) => (
                                <ActiveLink exact={item.href === '/'} href={item.href} key={`${item.label}-${item.href}`}>
                                    <item.icon data-icon="inline-start" />
                                    {item.label}
                                </ActiveLink>
                            ))}
                        </nav>
                        {user && (
                            <div className="absolute inset-x-4 bottom-4 space-y-2">
                                <p className="truncate text-xs text-muted-foreground">Login sebagai {user.name ?? 'User'}</p>
                                <Link
                                    as="button"
                                    className={cn(buttonVariants({ variant: 'outline' }), 'min-h-11 w-full')}
                                    href="/logout"
                                    method="post"
                                >
                                    Logout
                                </Link>
                            </div>
                        )}
                    </aside>
                )}

                <main className={cn('min-w-0 flex-1 px-4 py-5', isAdmin ? 'md:px-6 md:py-8' : 'pb-32 pt-5 md:py-6 md:pb-32')} id="main-content">
                    {children}
                </main>
            </div>

            <nav
                className={cn(
                    'fixed inset-x-0 bottom-0 z-30 mx-auto flex border-t border-border bg-background/90 shadow-[0_-12px_32px_rgba(2,2,2,0.08)] backdrop-blur supports-[backdrop-filter]:bg-background/70',
                    isAdmin ? 'md:hidden' : 'w-full max-w-md md:left-1/2 md:right-auto md:w-[448px] md:-translate-x-1/2 md:rounded-t-2xl md:border-x md:shadow-md',
                )}
            >
                {navItems.map((item) => {
                    const active = url === item.href || (item.href !== '/' && url.startsWith(`${item.href}/`));
                    const Icon = item.icon;

                    return (
                        <Link
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'relative flex min-h-16 flex-1 flex-col items-center justify-center gap-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 text-[10px] font-semibold transition-colors hover:text-foreground',
                                active ? 'text-foreground' : 'text-muted-foreground',
                            )}
                            href={item.href}
                            key={`${item.label}-${item.href}`}
                        >
                            <span
                                className={cn(
                                    'absolute top-0 h-1 w-7 rounded-b-full transition-colors',
                                    active ? 'bg-primary' : 'bg-transparent',
                                )}
                            />
                            <span
                                className={cn(
                                    'flex size-8 items-center justify-center rounded-lg transition-colors',
                                    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
                                )}
                            >
                                <Icon aria-hidden="true" className="size-4" />
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={cn('h-[calc(4rem+env(safe-area-inset-bottom))]', isAdmin && 'md:hidden')} />
        </div>
    );
}
