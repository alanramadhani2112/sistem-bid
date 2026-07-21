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
        <Card className={cn('border-border/80 bg-card/95 text-center shadow-sm', className)}>
            <CardContent className="space-y-2 p-4 sm:p-5">
                <p className="inline-flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {Icon && <Icon aria-hidden="true" className="size-3.5" />}
                    {label}
                </p>
                <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{value}</p>
            </CardContent>
        </Card>
    );
}
