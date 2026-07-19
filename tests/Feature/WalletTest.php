<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Models\Wallet;
use App\Modules\Shared\Enums\TransactionType;
use App\Modules\Wallet\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class WalletTest extends TestCase
{
    use RefreshDatabase;

    public function test_wallet_service_creates_internal_topup_ledger(): void
    {
        $user = User::factory()->create();
        Wallet::factory()->create(['user_id' => $user->id, 'balance' => 100_000]);

        $transaction = app(WalletService::class)->topUp($user, 250_000);

        $this->assertSame(TransactionType::TopUp, $transaction->type);
        $this->assertSame(100_000, $transaction->balance_before);
        $this->assertSame(350_000, $transaction->balance_after);
        $this->assertSame(350_000, $user->wallet()->firstOrFail()->balance);
    }

    public function test_wallet_page_requires_auth(): void
    {
        $this->get('/wallet')->assertRedirect('/login');
    }

    public function test_user_can_open_wallet_page_and_topup(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/wallet')->assertOk();
        $this->actingAs($user)->post('/wallet/topup', ['amount' => 500_000])->assertRedirect();

        $this->assertDatabaseHas('wallets', [
            'user_id' => $user->id,
            'balance' => 500_000,
        ]);
        $this->assertDatabaseHas('wallet_transactions', [
            'type' => TransactionType::TopUp->value,
            'amount' => 500_000,
            'balance_before' => 0,
            'balance_after' => 500_000,
        ]);
    }

    public function test_topup_amount_is_validated(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/wallet/topup', ['amount' => 9_999])->assertSessionHasErrors('amount');
    }
}
