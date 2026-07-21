<?php

declare(strict_types=1);

namespace App\Modules\Wallet\Events;

use App\Models\WalletTransaction;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class WalletUpdated implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(public WalletTransaction $transaction)
    {
        $this->transaction->loadMissing('wallet:id,user_id,balance');
    }

    /** @return array<int, PrivateChannel> */
    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.'.$this->transaction->wallet->user_id)];
    }

    public function broadcastAs(): string
    {
        return 'WalletUpdated';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return [
            'wallet' => [
                'balance' => $this->transaction->wallet->balance,
            ],
            'transaction' => [
                'type' => $this->transaction->type->value,
                'amount' => $this->transaction->amount,
                'balance_before' => $this->transaction->balance_before,
                'balance_after' => $this->transaction->balance_after,
                'reference' => $this->transaction->reference,
                'notes' => $this->transaction->notes,
                'created_at' => $this->transaction->created_at?->toIso8601String(),
            ],
        ];
    }
}
