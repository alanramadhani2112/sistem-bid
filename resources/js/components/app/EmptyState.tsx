import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type EmptyStateProps = {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn('flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/70 px-5 py-10 text-center shadow-sm', className)}>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {description && <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
