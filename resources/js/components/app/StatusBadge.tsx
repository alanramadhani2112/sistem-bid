import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusBadgeProps = {
    status: string;
    className?: string;
};

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    draft: { label: 'Draft', variant: 'secondary' },
    published: { label: 'Published', variant: 'outline' },
    live: { label: 'Live', variant: 'default' },
    closed: { label: 'Closed', variant: 'destructive' },
    pending: { label: 'Pending', variant: 'secondary' },
    completed: { label: 'Completed', variant: 'default' },
    failed: { label: 'Failed', variant: 'destructive' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = STATUS_MAP[status] ?? { label: status, variant: 'outline' as const };

    return (
        <Badge className={cn(status === 'live' && 'animate-pulse', className)} variant={config.variant}>
            {config.label}
        </Badge>
    );
}
