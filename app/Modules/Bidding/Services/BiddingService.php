<?php

declare(strict_types=1);

namespace App\Modules\Bidding\Services;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\User;
use App\Models\Wallet;
use App\Modules\Bidding\Events\BidPlaced;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class BiddingService
{
    public function placeBid(Auction $auction, User $user, int $amount): Bid
    {
        $bid = DB::transaction(function () use ($auction, $user, $amount): Bid {
            /** @var Auction $lockedAuction */
            $lockedAuction = Auction::query()
                ->with('greenBean')
                ->lockForUpdate()
                ->findOrFail($auction->id);

            $this->validateAuction($lockedAuction, $amount);
            $this->validateWallet($user, $amount);

            $bid = Bid::query()->create([
                'auction_id' => $lockedAuction->id,
                'user_id' => $user->id,
                'amount' => $amount,
            ]);

            $lockedAuction->update(['current_price' => $amount]);

            return $bid;
        });

        BidPlaced::dispatch($bid->load(['auction', 'user']));

        return $bid;
    }

    private function validateAuction(Auction $auction, int $amount): void
    {
        if ($auction->status !== AuctionStatus::Live) {
            throw ValidationException::withMessages(['amount' => 'Auction belum live.']);
        }

        if (now()->greaterThanOrEqualTo($auction->ends_at)) {
            throw ValidationException::withMessages(['amount' => 'Auction sudah berakhir.']);
        }

        if ($amount <= $auction->current_price) {
            throw ValidationException::withMessages(['amount' => 'Bid harus lebih tinggi dari harga saat ini.']);
        }

        $startingPrice = $auction->greenBean->starting_price;
        $increment = $auction->greenBean->bid_increment;

        if (($amount - $startingPrice) % $increment !== 0) {
            throw ValidationException::withMessages(['amount' => 'Bid harus mengikuti kelipatan increment.']);
        }
    }

    private function validateWallet(User $user, int $amount): void
    {
        $wallet = Wallet::query()
            ->where('user_id', $user->id)
            ->lockForUpdate()
            ->first();

        if ($wallet === null || $wallet->balance < $amount) {
            throw ValidationException::withMessages(['amount' => 'Saldo wallet tidak cukup.']);
        }
    }
}
