<?php

declare(strict_types=1);

namespace App\Modules\Shared\Enums;

enum TransactionType: string
{
    case TopUp = 'topup';
    case BidHold = 'bid_hold';
    case BidRelease = 'bid_release';
    case BidDeduct = 'bid_deduct';
}
