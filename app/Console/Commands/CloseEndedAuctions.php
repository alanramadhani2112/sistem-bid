<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Modules\Auctions\Services\AuctionWinnerService;
use Illuminate\Console\Command;

final class CloseEndedAuctions extends Command
{
    protected $signature = 'auctions:close-ended';

    protected $description = 'Close ended live auctions and determine winners.';

    public function handle(AuctionWinnerService $auctionWinnerService): int
    {
        $closed = $auctionWinnerService->closeDueAuctions();

        $this->info("Closed {$closed} auction(s).");

        return self::SUCCESS;
    }
}
