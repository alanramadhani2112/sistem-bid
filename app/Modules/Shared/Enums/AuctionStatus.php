<?php

declare(strict_types=1);

namespace App\Modules\Shared\Enums;

enum AuctionStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Live = 'live';
    case Closed = 'closed';

    public function canAcceptBids(): bool
    {
        return $this === self::Live;
    }

    public function isEditableByAdmin(): bool
    {
        return in_array($this, [self::Draft, self::Published], true);
    }
}
