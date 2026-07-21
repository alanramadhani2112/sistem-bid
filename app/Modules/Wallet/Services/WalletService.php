<?php

declare(strict_types=1);

namespace App\Modules\Wallet\Services;

use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Modules\Shared\Enums\TransactionType;
use App\Modules\Wallet\Events\WalletUpdated;
use Illuminate\Support\Facades\DB;

final class WalletService
{
    public function walletFor(User $user): Wallet
    {
        return Wallet::query()->firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0],
        );
    }

    public function topUp(User $user, int $amount): WalletTransaction
    {
        $transaction = DB::transaction(function () use ($amount, $user): WalletTransaction {
            $wallet = Wallet::query()->where('user_id', $user->id)->lockForUpdate()->first();
            $wallet ??= Wallet::query()->create(['user_id' => $user->id, 'balance' => 0]);

            $balanceBefore = $wallet->balance;
            $balanceAfter = $balanceBefore + $amount;

            $wallet->forceFill(['balance' => $balanceAfter])->save();

            return WalletTransaction::query()->create([
                'wallet_id' => $wallet->id,
                'type' => TransactionType::TopUp,
                'amount' => $amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'reference' => 'manual-'.now()->format('YmdHis').'-'.$wallet->id,
                'notes' => 'Manual core top-up tanpa payment gateway.',
            ]);
        });

        WalletUpdated::dispatch($transaction);

        return $transaction;
    }
}
