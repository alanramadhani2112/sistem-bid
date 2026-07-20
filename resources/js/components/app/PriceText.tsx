import { formatCompactRupiah, formatRupiah } from '@/lib/format';
import { cn } from '@/lib/utils';

type PriceTextProps = {
    value: number;
    variant?: 'hero' | 'inline' | 'metric';
    className?: string;
    prefixLabel?: string;
};

export function PriceText({ className, prefixLabel, value, variant = 'inline' }: PriceTextProps) {
    const fullValue = formatRupiah(value);
    const displayValue = variant === 'metric' ? formatCompactRupiah(value) : fullValue;
    const ariaLabel = prefixLabel ? `${prefixLabel}: ${fullValue}` : fullValue;

    return (
        <span
            aria-label={ariaLabel}
            className={cn(
                'block min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-sans tabular-nums',
                variant === 'hero' && 'text-[clamp(2rem,11vw,3.25rem)] font-black leading-none tracking-tight',
                variant === 'inline' && 'font-bold',
                variant === 'metric' && 'text-[clamp(1.25rem,7vw,1.75rem)] font-black leading-none tracking-tight',
                className,
            )}
            title={fullValue}
        >
            {displayValue}
        </span>
    );
}
