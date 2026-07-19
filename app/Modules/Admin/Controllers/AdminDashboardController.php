<?php

declare(strict_types=1);

namespace App\Modules\Admin\Controllers;

use App\Models\Auction;
use App\Modules\Admin\Services\AdminDashboardService;
use Inertia\Inertia;
use Inertia\Response;

final class AdminDashboardController
{
    public function dashboard(AdminDashboardService $service): Response
    {
        return Inertia::render('Admin/Dashboard', $service->dashboard());
    }

    public function monitor(Auction $auction, AdminDashboardService $service): Response
    {
        return Inertia::render('Admin/Auctions/Monitor', $service->monitor($auction));
    }

    public function users(AdminDashboardService $service): Response
    {
        return Inertia::render('Admin/Users/Index', $service->users());
    }

    public function winners(AdminDashboardService $service): Response
    {
        return Inertia::render('Admin/Winners/Index', $service->winners());
    }
}
