import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MetricCardProps = {
    label: string;
    value: string | number;
    className?: string;
};

export function MetricCard({ label, value, className }: MetricCardProps) {
    return (
        <Card className={cn('text-center', className)}>
            <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{value}</p>
            </CardContent>
        </Card>
    );
}
