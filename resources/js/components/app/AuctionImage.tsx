import { Coffee } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { cn } from '@/lib/utils';

type AuctionImageProps = {
    alt: string;
    imagePath?: string | null;
    className?: string;
    children?: ReactNode;
    overlay?: boolean;
};

export function AuctionImage({ alt, children, className, imagePath, overlay = false }: AuctionImageProps) {
    const [failed, setFailed] = useState(false);
    const src = imagePath && !failed ? `/storage/${imagePath}` : null;

    return (
        <div className={cn('relative overflow-hidden bg-primary text-primary-foreground', className)}>
            {src ? (
                <img
                    alt={alt}
                    className="absolute inset-0 size-full object-cover"
                    loading="lazy"
                    onError={() => setFailed(true)}
                    src={src}
                />
            ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(233,195,73,0.38),transparent_35%),linear-gradient(135deg,var(--primary),var(--secondary))]" />
            )}
            {overlay && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />}
            {!src && !children && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-white/15 text-white shadow-sm backdrop-blur">
                        <Coffee aria-hidden="true" className="size-7" />
                    </div>
                </div>
            )}
            {children}
        </div>
    );
}
