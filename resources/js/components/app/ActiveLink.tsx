import { Link, usePage } from '@inertiajs/react';
import type { ComponentProps } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ActiveLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
    href: string;
    exact?: boolean;
};

export function ActiveLink({ className, exact = false, href, ...props }: ActiveLinkProps) {
    const { url } = usePage();
    const target = href;
    const isActive = exact ? url === target : url === target || url.startsWith(`${target}/`);

    return (
        <Link
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                buttonVariants({ size: 'lg', variant: isActive ? 'secondary' : 'ghost' }),
                'w-full justify-start min-h-11',
                isActive ? 'text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                className,
            )}
            href={href}
            {...props}
        />
    );
}
