<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Auction;
use App\Models\GreenBean;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Auction>
 */
final class AuctionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'green_bean_id' => GreenBean::factory(),
            'title' => 'Auction '.fake()->words(3, true),
            'status' => AuctionStatus::Draft,
            'current_price' => 1_000_000,
            'starts_at' => now()->addDay(),
            'ends_at' => now()->addDays(2),
        ];
    }

    public function live(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AuctionStatus::Live,
            'starts_at' => now()->subMinute(),
            'ends_at' => now()->addHour(),
        ]);
    }
}
