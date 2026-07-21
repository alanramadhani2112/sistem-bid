import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BackLinkProps = {
    href: string;
    label?: string;
    className?: string;
};

export function BackLink({ className, href, label = 'Kembali' }: BackLinkProps) {
    return (
        <div className={cn('flex', className)}>
            <Link
                className={cn(
                    buttonVariants({ size: 'sm', variant: 'ghost' }),
                    '-ml-2 h-9 rounded-full px-2.5 text-muted-foreground hover:bg-background/80 hover:text-foreground',
                )}
                href={href}
            >
                <ArrowLeft aria-hidden="true" className="size-4" />
                <span className="text-sm font-semibold">{label}</span>
            </Link>
        </div>
    );
}
