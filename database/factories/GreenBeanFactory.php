<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\GreenBean;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GreenBean>
 */
final class GreenBeanFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'origin' => fake()->randomElement(['Gayo', 'Kintamani', 'Toraja', 'Flores Bajawa']),
            'process' => fake()->randomElement(['Washed', 'Natural', 'Honey']),
            'weight_gram' => fake()->randomElement([5_000, 10_000, 20_000]),
            'description' => fake()->sentence(12),
            'image_path' => null,
            'starting_price' => fake()->numberBetween(500_000, 2_000_000),
            'bid_increment' => 100_000,
        ];
    }
}
