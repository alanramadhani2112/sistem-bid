import { cn } from '@/lib/utils';

type AuctionHeroMediaProps = {
    alt: string;
    imagePath?: string | null;
    eyebrow?: string;
    title: string;
    meta?: string;
    className?: string;
};

export function AuctionHeroMedia({ alt, className, eyebrow, imagePath, meta, title }: AuctionHeroMediaProps) {
    const imageUrl = imagePath ? `/storage/${imagePath}` : null;

    return (
        <div className={cn('relative min-h-[280px] overflow-hidden rounded-[2rem] border bg-primary text-primary-foreground shadow-sm', className)}>
            {imageUrl ? (
                <img alt={alt} className="absolute inset-0 size-full object-cover" src={imageUrl} />
            ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(233,195,73,0.35),transparent_35%),linear-gradient(135deg,var(--primary),var(--secondary))]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="relative flex min-h-[280px] flex-col justify-end p-6 md:p-8">
                {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">{eyebrow}</p>}
                <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
                {meta && <p className="mt-3 max-w-xl text-sm font-medium text-white/80 md:text-base">{meta}</p>}
            </div>
        </div>
    );
}
