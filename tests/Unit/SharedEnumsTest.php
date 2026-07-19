<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Modules\Shared\Enums\AuctionStatus;
use App\Modules\Shared\Enums\UserRole;
use PHPUnit\Framework\TestCase;

final class SharedEnumsTest extends TestCase
{
    public function test_roles_and_auction_statuses_match_core_contract(): void
    {
        $this->assertSame('admin', UserRole::Admin->value);
        $this->assertSame('bidder', UserRole::Bidder->value);

        $this->assertTrue(AuctionStatus::Live->canAcceptBids());
        $this->assertFalse(AuctionStatus::Published->canAcceptBids());
        $this->assertTrue(AuctionStatus::Draft->isEditableByAdmin());
        $this->assertFalse(AuctionStatus::Closed->isEditableByAdmin());
    }
}
