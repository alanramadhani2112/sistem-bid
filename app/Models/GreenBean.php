<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\GreenBeanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'origin', 'process', 'weight_gram', 'description', 'image_path', 'starting_price', 'bid_increment'])]
final class GreenBean extends Model
{
    /** @use HasFactory<GreenBeanFactory> */
    use HasFactory;

    /** @return HasMany<Auction, $this> */
    public function auctions(): HasMany
    {
        return $this->hasMany(Auction::class);
    }

    protected function casts(): array
    {
        return [
            'weight_gram' => 'integer',
            'starting_price' => 'integer',
            'bid_increment' => 'integer',
        ];
    }
}
