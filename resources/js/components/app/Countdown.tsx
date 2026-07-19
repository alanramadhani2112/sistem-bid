import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

type CountdownMode = 'starts' | 'ends';

type CountdownProps = {
    target: string;
    mode?: CountdownMode;
    className?: string;
};

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
};

function calcTimeLeft(targetDate: Date): TimeLeft {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    return {
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
        total: diff,
    };
}

function formatTimeLeft(t: TimeLeft): string {
    if (t.total === 0) return '';
    const parts: string[] = [];
    if (t.days > 0) parts.push(`${t.days}h`);
    if (t.hours > 0) parts.push(`${t.hours}j`);
    if (t.minutes > 0) parts.push(`${t.minutes}m`);
    parts.push(`${t.seconds}d`);
    return parts.join(' ');
}

export function Countdown({ target, mode = 'ends', className }: CountdownProps) {
    const targetDate = useMemo(() => new Date(target), [target]);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate));

    useEffect(() => {
        const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1_000);
        return () => clearInterval(id);
    }, [targetDate]);

    if (timeLeft.total === 0) {
        return (
            <span className={cn('text-xs font-medium text-muted-foreground', className)}>
                {mode === 'starts' ? 'Sudah dimulai' : 'Sudah selesai'}
            </span>
        );
    }

    const label = mode === 'starts' ? 'Mulai dalam' : 'Berakhir dalam';

    return (
        <span aria-live="polite" className={cn('text-xs font-medium text-muted-foreground', className)}>
            {label} {formatTimeLeft(timeLeft)}
        </span>
    );
}
