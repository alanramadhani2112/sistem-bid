import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type AuctionStatus = 'draft' | 'published' | 'live' | 'closed' | string;
type CountdownMode = 'starts' | 'ends';
type CountdownVariant = 'hero' | 'compact';

type LiveCountdownPanelProps = {
    target: string;
    status: AuctionStatus;
    mode?: CountdownMode;
    variant?: CountdownVariant;
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

function twoDigits(value: number): string {
    return value.toString().padStart(2, '0');
}

function formatClock(timeLeft: TimeLeft): string {
    const hours = timeLeft.days * 24 + timeLeft.hours;

    return `${twoDigits(hours)}:${twoDigits(timeLeft.minutes)}:${twoDigits(timeLeft.seconds)}`;
}

function toneClass(timeLeft: TimeLeft, status: AuctionStatus): string {
    if (status === 'closed' || timeLeft.total === 0) return 'border-muted bg-muted/30 text-muted-foreground';
    if (timeLeft.total <= 60_000) return 'border-destructive/50 bg-destructive/10 text-destructive motion-safe:animate-pulse';
    if (timeLeft.total <= 300_000) return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';

    return 'border-primary/40 bg-primary/5 text-primary';
}

export function LiveCountdownPanel({ target, status, mode = 'ends', variant = 'hero', className }: LiveCountdownPanelProps) {
    const targetDate = useMemo(() => new Date(target), [target]);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate));

    useEffect(() => {
        const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1_000);

        return () => clearInterval(id);
    }, [targetDate]);

    const label = mode === 'starts' ? 'Mulai dalam' : 'Berakhir dalam';
    const isDone = status === 'closed' || timeLeft.total === 0;
    const value = isDone ? 'Auction selesai' : formatClock(timeLeft);

    return (
        <Card className={cn('border', toneClass(timeLeft, status), className)}>
            <CardContent className={cn('p-4', variant === 'hero' && 'p-5 md:p-6')}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{isDone ? 'Status waktu' : label}</p>
                <p
                    aria-live="polite"
                    className={cn('mt-2 font-mono font-black tabular-nums leading-none', variant === 'hero' ? 'text-4xl md:text-6xl' : 'text-2xl')}
                >
                    {value}
                </p>
                {!isDone && <p className="mt-2 text-xs opacity-80">Countdown realtime. Monitor bid sebelum waktu habis.</p>}
            </CardContent>
        </Card>
    );
}
