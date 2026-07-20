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
            className={cn('min-h-[360px] rounded-xl border shadow-[0_18px_52px_rgba(2,2,2,0.12)]', className)}
            imagePath={imagePath}
            overlay
        >
            <div className="relative flex min-h-[360px] flex-col justify-end p-5">
                {eyebrow && <p className="w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">{eyebrow}</p>}
                <h2 className="mt-3 max-w-sm text-3xl font-black tracking-tight text-white">{title}</h2>
                {meta && <p className="mt-2 max-w-sm text-sm font-medium text-white/80">{meta}</p>}
            </div>
        </AuctionImage>
    );
}
