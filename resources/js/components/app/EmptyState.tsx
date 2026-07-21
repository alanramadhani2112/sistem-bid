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
        <div className={cn('flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/70 px-5 py-12 text-center shadow-sm', className)}>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {description && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
