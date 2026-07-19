<?php

declare(strict_types=1);

namespace App\Models;

use App\Modules\Shared\Enums\AuctionStatus;
use Database\Factories\AuctionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['green_bean_id', 'title', 'status', 'current_price', 'starts_at', 'ends_at'])]
final class Auction extends Model
{
    /** @use HasFactory<AuctionFactory> */
    use HasFactory;

    /** @return BelongsTo<GreenBean, $this> */
    public function greenBean(): BelongsTo
    {
        return $this->belongsTo(GreenBean::class);
    }

    /** @return HasMany<Bid, $this> */
    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }

    /** @return HasOne<AuctionWinner, $this> */
    public function winner(): HasOne
    {
        return $this->hasOne(AuctionWinner::class);
    }

    protected function casts(): array
    {
        return [
            'status' => AuctionStatus::class,
            'current_price' => 'integer',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }
}
