import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type DataListItem = {
    id: number;
    content: ReactNode;
};

type DataListProps = {
    items: DataListItem[];
    emptyMessage?: string;
    className?: string;
};

export function DataList({ items, emptyMessage = 'Tidak ada data', className }: DataListProps) {
    if (items.length === 0) {
        return (
            <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
        );
    }

    return (
        <div className={cn('space-y-2', className)}>
            {items.map((item) => (
                <div className="rounded-xl border border-border bg-card p-4 text-card-foreground" key={item.id}>
                    {item.content}
                </div>
            ))}
        </div>
    );
}
