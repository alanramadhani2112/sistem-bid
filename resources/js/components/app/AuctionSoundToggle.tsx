import { Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AuctionSoundToggleProps = {
    enabled: boolean;
    onToggle: () => void;
    className?: string;
};

export function AuctionSoundToggle({ className, enabled, onToggle }: AuctionSoundToggleProps) {
    const Icon = enabled ? Volume2 : VolumeX;

    return (
        <Button
            aria-label={enabled ? 'Matikan suara auction' : 'Nyalakan suara auction'}
            aria-pressed={enabled}
            className={cn('min-h-9 gap-2 rounded-full px-3', className)}
            onClick={onToggle}
            type="button"
            variant={enabled ? 'default' : 'outline'}
        >
            <Icon aria-hidden="true" className="size-4" />
            <span className="text-xs font-bold">Sound {enabled ? 'On' : 'Off'}</span>
        </Button>
    );
}
