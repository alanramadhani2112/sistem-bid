import type { ReactNode } from 'react';

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SectionCardProps = {
    title?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    description?: ReactNode;
};

export function SectionCard({ title, action, children, className, contentClassName, description }: SectionCardProps) {
    return (
        <Card className={cn('gap-0 overflow-hidden border-border/80 bg-card/95 shadow-sm', className)}>
            {(title || description || action) && (
                <CardHeader className="border-b border-border/70 px-4 py-3.5 sm:px-5">
                    <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                        <div className="min-w-0 space-y-1">
                            {title && <CardTitle>{title}</CardTitle>}
                            {description && <CardDescription>{description}</CardDescription>}
                        </div>
                        {action && <CardAction>{action}</CardAction>}
                    </div>
                </CardHeader>
            )}
            <CardContent className={cn('p-4 sm:p-5', contentClassName)}>
                {children}
            </CardContent>
        </Card>
    );
}
