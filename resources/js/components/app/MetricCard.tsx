import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MetricCardProps = {
    label: string;
    value: string | number;
    className?: string;
    icon?: LucideIcon;
};

export function MetricCard({ label, value, className, icon: Icon }: MetricCardProps) {
    return (
        <Card className={cn('text-center', className)}>
            <CardContent className="p-4">
                <p className="inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {Icon && <Icon aria-hidden="true" className="size-3.5" />}
                    {label}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{value}</p>
            </CardContent>
        </Card>
    );
}
