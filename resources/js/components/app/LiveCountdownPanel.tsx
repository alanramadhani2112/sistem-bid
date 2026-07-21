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

function urgencyLabel(timeLeft: TimeLeft, status: AuctionStatus): string {
    if (status === 'closed' || timeLeft.total === 0) return 'Auction selesai';
    if (timeLeft.total <= 60_000) return 'Kurang dari 1 menit';
    if (timeLeft.total <= 300_000) return 'Kurang dari 5 menit';

    return 'Waktu auction berjalan';
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
    const progress = isDone ? 100 : Math.max(8, Math.min(100, Math.round((timeLeft.minutes * 60 + timeLeft.seconds) / 36)));

    return (
        <Card className={cn('border', toneClass(timeLeft, status), className)}>
            <CardContent className={cn('p-4', variant === 'hero' && 'md:p-5')}>
                <div className={cn('grid gap-4', variant === 'hero' && 'md:grid-cols-[auto_minmax(0,1fr)] md:items-center')}>
                    {variant === 'hero' && (
                        <div
                            aria-hidden="true"
                            className="grid size-20 place-items-center rounded-full border bg-background/70 shadow-sm md:size-24"
                            style={{
                                background: `conic-gradient(currentColor ${progress}%, transparent ${progress}% 100%)`,
                            }}
                        >
                            <div className="grid size-16 place-items-center rounded-full bg-card text-xs font-semibold uppercase tracking-[0.16em] md:size-20">
                                Live
                            </div>
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{isDone ? 'Status waktu' : label}</p>
                        <p
                            aria-live="polite"
                            className={cn('mt-2 truncate font-sans font-black tabular-nums leading-none', variant === 'hero' ? 'text-[clamp(2.25rem,7vw,3.25rem)]' : 'text-2xl')}
                        >
                            {value}
                        </p>
                        <p className="mt-2 text-xs font-medium opacity-80">{urgencyLabel(timeLeft, status)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
