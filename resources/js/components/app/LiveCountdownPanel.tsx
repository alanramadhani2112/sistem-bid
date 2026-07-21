import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type AuctionStatus = 'draft' | 'published' | 'live' | 'closed' | string;
type CountdownMode = 'starts' | 'ends';
type CountdownVariant = 'hero' | 'compact' | 'stage';

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
    const progress = isDone ? 100 : Math.max(4, Math.min(100, Math.round(((timeLeft.seconds + 1) / 60) * 100)));
    const isStage = variant === 'stage';
    const showRing = variant === 'hero' || isStage;

    return (
        <Card className={cn('relative overflow-hidden border', toneClass(timeLeft, status), className)}>
            <CardContent className={cn('relative p-4', variant === 'hero' && 'md:p-5', isStage && 'p-5 sm:p-6 lg:p-8')}>
                <div className={cn('grid gap-4', variant === 'hero' && 'md:grid-cols-[auto_minmax(0,1fr)] md:items-center', isStage && 'sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-6 lg:gap-8')}>
                    {showRing && (
                        <div
                            aria-hidden="true"
                            className={cn(
                                'relative grid place-items-center rounded-full border bg-background/70 shadow-sm',
                                isStage ? 'size-28 sm:size-32 lg:size-36' : 'size-20 md:size-24',
                            )}
                            style={{
                                background: `conic-gradient(currentColor ${progress}%, transparent ${progress}% 100%)`,
                            }}
                        >
                            <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,currentColor_0_18deg,transparent_18deg_360deg)] opacity-45 motion-safe:animate-spin [animation-duration:5s]" />
                            <div className={cn('relative grid place-items-center rounded-full bg-card text-xs font-semibold uppercase tracking-[0.16em]', isStage ? 'size-24 sm:size-28 lg:size-32' : 'size-16 md:size-20')}>
                                Live
                            </div>
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className={cn('font-semibold uppercase tracking-[0.18em] opacity-80', isStage ? 'text-sm' : 'text-xs')}>{isDone ? 'Status waktu' : label}</p>
                        <p
                            aria-live="polite"
                            className={cn(
                                'mt-2 truncate font-sans font-black tabular-nums leading-none transition-transform duration-300 motion-safe:animate-pulse',
                                variant === 'hero' && 'text-[clamp(2.25rem,7vw,3.25rem)]',
                                variant === 'compact' && 'text-2xl',
                                isStage && 'text-[clamp(3.5rem,10vw,7rem)] tracking-[-0.08em]',
                            )}
                        >
                            {value}
                        </p>
                        <p className={cn('mt-2 font-medium opacity-80', isStage ? 'text-sm sm:text-base' : 'text-xs')}>{urgencyLabel(timeLeft, status)}</p>
                    </div>
                </div>
            </CardContent>
            {!isDone && (
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-current/10">
                    <div className="h-full bg-current transition-[width] duration-1000 ease-linear" style={{ width: `${progress}%` }} />
                </div>
            )}
        </Card>
    );
}
