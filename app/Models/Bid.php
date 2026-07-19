<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\BidFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['auction_id', 'user_id', 'amount'])]
final class Bid extends Model
{
    /** @use HasFactory<BidFactory> */
    use HasFactory;

    public const UPDATED_AT = null;

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

    /** @return HasOne<AuctionWinner, $this> */
    public function winner(): HasOne
    {
        return $this->hasOne(AuctionWinner::class);
    }

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
        ];
    }
}
