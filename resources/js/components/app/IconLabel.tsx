import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type IconLabelProps = {
    icon: LucideIcon;
    label: string;
    description?: string;
    className?: string;
};

export function IconLabel({ className, description, icon: Icon, label }: IconLabelProps) {
    return (
        <div className={cn('flex items-start gap-3', className)}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-4" />
            </span>
            <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">{label}</span>
                {description && <span className="block text-xs leading-5 text-muted-foreground">{description}</span>}
            </span>
        </div>
    );
}
