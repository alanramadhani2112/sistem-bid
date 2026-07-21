import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type FilterPanelProps = {
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    sticky?: boolean;
};

export function FilterPanel({ children, className, contentClassName, sticky = false }: FilterPanelProps) {
    return (
        <Card
            className={cn(
                'border-border/80 bg-card/95 shadow-sm',
                sticky && 'sticky top-16 z-10 border-primary/20 shadow-md backdrop-blur',
                className,
            )}
        >
            <CardContent className={cn('space-y-3 p-3 sm:p-4', contentClassName)}>
                {children}
            </CardContent>
        </Card>
    );
}
