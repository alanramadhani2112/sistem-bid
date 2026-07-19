<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Modules\Shared\Enums\TransactionType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WalletTransaction>
 */
final class WalletTransactionFactory extends Factory
{
    public function definition(): array
    {
        $amount = fake()->numberBetween(100_000, 5_000_000);

        return [
            'wallet_id' => Wallet::factory(),
            'type' => TransactionType::TopUp,
            'amount' => $amount,
            'balance_before' => 0,
            'balance_after' => $amount,
            'reference' => fake()->uuid(),
            'notes' => 'Seeder topup',
        ];
    }
}
