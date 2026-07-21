import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type PageShellProps = {
    children: ReactNode;
    className?: string;
    spacing?: 'sm' | 'md' | 'lg';
};

const spacingClass = {
    sm: 'space-y-4',
    md: 'space-y-5',
    lg: 'space-y-6',
};

export function PageShell({ children, className, spacing = 'md' }: PageShellProps) {
    return (
        <section className={cn('min-w-0 overflow-hidden', spacingClass[spacing], className)}>
            {children}
        </section>
    );
}
