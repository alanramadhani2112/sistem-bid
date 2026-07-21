import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type MetricGridProps = {
    children: ReactNode;
    className?: string;
    columns?: 'two' | 'three' | 'auto';
};

const columnClass = {
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    three: 'grid-cols-1 md:grid-cols-3',
    two: 'grid-cols-1 sm:grid-cols-2',
};

export function MetricGrid({ children, className, columns = 'auto' }: MetricGridProps) {
    return (
        <div className={cn('grid gap-3', columnClass[columns], className)}>
            {children}
        </div>
    );
}
