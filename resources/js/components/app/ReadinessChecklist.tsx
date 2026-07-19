import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ReadinessItem = {
    label: string;
    ready: boolean;
    description?: string;
};

type ReadinessChecklistProps = {
    items: ReadinessItem[];
    className?: string;
};

export function ReadinessChecklist({ items, className }: ReadinessChecklistProps) {
    return (
        <Card className={className}>
            <CardContent className="space-y-3 p-4">
                <p className="text-sm font-semibold text-foreground">Bid readiness</p>
                <div className="space-y-2">
                    {items.map((item) => (
                        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3" key={item.label}>
                            <span
                                aria-hidden="true"
                                className={cn('mt-0.5 size-2.5 rounded-full', item.ready ? 'bg-primary' : 'bg-destructive')}
                            />
                            <div>
                                <p className="text-sm font-medium text-foreground">{item.label}</p>
                                {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
