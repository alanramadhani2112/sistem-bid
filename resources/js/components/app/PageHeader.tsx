import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type PageHeaderProps = {
    title: string;
    subtitle?: string;
    accent?: string;
    action?: ReactNode;
    className?: string;
};

export function PageHeader({ title, subtitle, accent, action, className }: PageHeaderProps) {
    return (
        <div className={cn('flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3', className)}>
            <div>
                {accent && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{accent}</p>}
                <h1 className={cn('text-2xl font-bold text-foreground sm:text-3xl', accent && 'mt-1')}>{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
