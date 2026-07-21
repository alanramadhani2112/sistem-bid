import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SectionCardProps = {
    title?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
};

export function SectionCard({ title, action, children, className, contentClassName }: SectionCardProps) {
    return (
        <Card className={cn('gap-0 border-border/80 bg-card/95 shadow-sm', className)}>
            {(title || action) && (
                <CardHeader className="border-b border-border/70 px-4 py-3 sm:px-5">
                    <div className="flex items-center justify-between gap-3">
                        {title && <CardTitle>{title}</CardTitle>}
                        {action}
                    </div>
                </CardHeader>
            )}
            <CardContent className={cn('px-4 pb-4 sm:px-5 sm:pb-5', contentClassName)}>
                {children}
            </CardContent>
        </Card>
    );
}
