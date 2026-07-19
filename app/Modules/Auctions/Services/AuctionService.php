<?php

declare(strict_types=1);

namespace App\Modules\Auctions\Services;

use App\Models\Auction;
use App\Models\GreenBean;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class AuctionService
{
    /** @param array<string, mixed> $data */
    public function create(array $data): Auction
    {
        $greenBean = GreenBean::query()->findOrFail($data['green_bean_id']);
        $data['current_price'] = $greenBean->starting_price;

        return Auction::query()->create($data);
    }

    /** @param array<string, mixed> $data */
    public function update(Auction $auction, array $data): Auction
    {
        $this->ensureEditable($auction);

        if ((int) $data['green_bean_id'] !== $auction->green_bean_id) {
            $greenBean = GreenBean::query()->findOrFail($data['green_bean_id']);
            $data['current_price'] = $greenBean->starting_price;
        }

        $auction->update($data);

        return $auction->refresh();
    }

    public function changeStatus(Auction $auction, AuctionStatus $status): Auction
    {
        return DB::transaction(function () use ($auction, $status): Auction {
            $lockedAuction = Auction::query()->lockForUpdate()->findOrFail($auction->id);

            $this->ensureStatusTransitionAllowed($lockedAuction, $status);
            $lockedAuction->update(['status' => $status]);

            return $lockedAuction->refresh();
        });
    }

    public function delete(Auction $auction): void
    {
        $this->ensureEditable($auction);
        $auction->delete();
    }

    private function ensureEditable(Auction $auction): void
    {
        if (! $auction->status->isEditableByAdmin()) {
            throw ValidationException::withMessages([
                'status' => 'Auction live/closed tidak bisa diedit.',
            ]);
        }
    }

    private function ensureStatusTransitionAllowed(Auction $auction, AuctionStatus $target): void
    {
        $allowed = match ($auction->status) {
            AuctionStatus::Draft => [AuctionStatus::Draft, AuctionStatus::Published],
            AuctionStatus::Published => [AuctionStatus::Published, AuctionStatus::Live, AuctionStatus::Draft],
            AuctionStatus::Live => [AuctionStatus::Live, AuctionStatus::Closed],
            AuctionStatus::Closed => [AuctionStatus::Closed],
        };

        if (! in_array($target, $allowed, true)) {
            throw ValidationException::withMessages([
                'status' => "Transisi {$auction->status->value} ke {$target->value} tidak valid.",
            ]);
        }
    }
}
