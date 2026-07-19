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
        <div className={cn('flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center', className)}>
            <h3 className="text-base font-medium text-foreground">{title}</h3>
            {description && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
