import { AuctionImage } from '@/components/app/AuctionImage';
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
    return (
        <AuctionImage
            alt={alt}
            className={cn('min-h-[280px] rounded-[2rem] border shadow-sm', className)}
            imagePath={imagePath}
            overlay
        >
            <div className="relative flex min-h-[280px] flex-col justify-end p-6 md:p-8">
                {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">{eyebrow}</p>}
                <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
                {meta && <p className="mt-3 max-w-xl text-sm font-medium text-white/80 md:text-base">{meta}</p>}
            </div>
        </AuctionImage>
    );
}
