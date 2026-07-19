<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\AuctionWinnerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['auction_id', 'user_id', 'bid_id', 'winning_amount', 'determined_at'])]
final class AuctionWinner extends Model
{
    /** @use HasFactory<AuctionWinnerFactory> */
    use HasFactory;

    /** @return BelongsTo<Auction, $this> */
    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Bid, $this> */
    public function bid(): BelongsTo
    {
        return $this->belongsTo(Bid::class);
    }

    protected function casts(): array
    {
        return [
            'winning_amount' => 'integer',
            'determined_at' => 'datetime',
        ];
    }
}
