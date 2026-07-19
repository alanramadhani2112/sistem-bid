<?php

declare(strict_types=1);

namespace App\Modules\Wallet\Controllers;

use App\Modules\Wallet\Requests\TopUpRequest;
use App\Modules\Wallet\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class WalletController
{
    public function index(Request $request, WalletService $walletService): Response
    {
        $wallet = $walletService->walletFor($request->user());

        return Inertia::render('Wallet/Index', [
            'wallet' => [
                'balance' => $wallet->balance,
                'transactions' => $wallet->transactions()
                    ->latest('created_at')
                    ->limit(10)
                    ->get(['type', 'amount', 'balance_before', 'balance_after', 'reference', 'notes', 'created_at']),
            ],
        ]);
    }

    public function topUp(TopUpRequest $request, WalletService $walletService): RedirectResponse
    {
        $walletService->topUp($request->user(), (int) $request->integer('amount'));

        return back()->with('success', 'Saldo wallet ditambahkan.');
    }
}
