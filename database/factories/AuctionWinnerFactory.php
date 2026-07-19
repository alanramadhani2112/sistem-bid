<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\AuctionWinner;
use App\Models\Bid;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuctionWinner>
 */
final class AuctionWinnerFactory extends Factory
{
    public function definition(): array
    {
        $bid = Bid::factory()->create();

        return [
            'auction_id' => $bid->auction_id,
            'user_id' => $bid->user_id,
            'bid_id' => $bid->id,
            'winning_amount' => $bid->amount,
            'determined_at' => now(),
        ];
    }
}
