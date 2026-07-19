<?php

declare(strict_types=1);

namespace App\Modules\Users\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class HistoryController
{
    public function index(Request $request): Response
    {
        return Inertia::render('History/Index', [
            'bids' => $request->user()
                ?->bids()
                ->with('auction:id,title,status,current_price')
                ->latest()
                ->limit(20)
                ->get(['id', 'auction_id', 'amount', 'created_at']) ?? [],
        ]);
    }
}
