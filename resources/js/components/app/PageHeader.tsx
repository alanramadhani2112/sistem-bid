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
        <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6', className)}>
            <div className="min-w-0 space-y-2">
                {accent && <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary/80">{accent}</p>}
                <h1 className="text-balance text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl">{title}</h1>
                {subtitle && <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0 self-start sm:self-end">{action}</div>}
        </div>
    );
}
