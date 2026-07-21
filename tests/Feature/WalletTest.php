<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Models\Wallet;
use App\Modules\Shared\Enums\TransactionType;
use App\Modules\Wallet\Events\WalletUpdated;
use App\Modules\Wallet\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

final class WalletTest extends TestCase
{
    use RefreshDatabase;

    public function test_wallet_service_creates_internal_topup_ledger(): void
    {
        $user = User::factory()->create();
        Wallet::factory()->create(['user_id' => $user->id, 'balance' => 100_000]);
        Event::fake([WalletUpdated::class]);

        $transaction = app(WalletService::class)->topUp($user, 250_000);

        $this->assertSame(TransactionType::TopUp, $transaction->type);
        $this->assertSame(100_000, $transaction->balance_before);
        $this->assertSame(350_000, $transaction->balance_after);
        $this->assertSame(350_000, $user->wallet()->firstOrFail()->balance);
        Event::assertDispatched(WalletUpdated::class, fn (WalletUpdated $event): bool => $event->transaction->is($transaction));
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

    public function test_wallet_updated_event_payload_targets_user_channel(): void
    {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->create(['user_id' => $user->id, 'balance' => 500_000]);
        $transaction = $wallet->transactions()->create([
            'type' => TransactionType::TopUp,
            'amount' => 500_000,
            'balance_before' => 0,
            'balance_after' => 500_000,
            'reference' => 'test-wallet-event',
            'notes' => 'Test wallet event payload.',
        ]);

        $event = new WalletUpdated($transaction);
        $payload = $event->broadcastWith();

        $this->assertSame('private-user.'.$user->id, $event->broadcastOn()[0]->name);
        $this->assertSame(500_000, $payload['wallet']['balance']);
        $this->assertSame(TransactionType::TopUp->value, $payload['transaction']['type']);
        $this->assertSame(500_000, $payload['transaction']['amount']);
    }

    public function test_topup_amount_is_validated(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/wallet/topup', ['amount' => 9_999])->assertSessionHasErrors('amount');
    }
}
