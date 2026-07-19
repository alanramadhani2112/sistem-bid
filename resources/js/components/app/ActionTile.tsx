import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ActionTileProps = {
    href: string;
    icon: LucideIcon;
    title: string;
    description: string;
    badge?: string;
    className?: string;
    disabled?: boolean;
};

export function ActionTile({ badge, className, description, disabled = false, href, icon: Icon, title }: ActionTileProps) {
    const content = (
        <>
            <div className="flex items-start justify-between gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15">
                    <Icon aria-hidden="true" className="size-5" />
                </span>
                {badge && <Badge variant="secondary">{badge}</Badge>}
            </div>
            <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
        </>
    );

    const classes = cn(
                    'group flex min-h-36 flex-col justify-between rounded-xl border border-border bg-card p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-accent/30 hover:shadow-md',
        disabled && 'pointer-events-none opacity-60',
        className,
    );

    if (disabled) {
        return <div className={classes}>{content}</div>;
    }

    return (
        <Link className={classes} href={href}>
            {content}
        </Link>
    );
}
