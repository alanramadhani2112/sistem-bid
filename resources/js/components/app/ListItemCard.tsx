import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ListItemCardProps = {
    children: ReactNode;
    className?: string;
    contentClassName?: string;
};

export function ListItemCard({ children, className, contentClassName }: ListItemCardProps) {
    return (
        <Card className={cn('border-border/80 bg-card/95 shadow-sm transition-colors hover:bg-accent/20', className)}>
            <CardContent className={cn('p-4 sm:p-5', contentClassName)}>
                {children}
            </CardContent>
        </Card>
    );
}
