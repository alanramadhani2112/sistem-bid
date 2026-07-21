<?php

declare(strict_types=1);

namespace App\Modules\Admin\Controllers;

use App\Models\Auction;
use App\Models\User;
use App\Modules\Admin\Requests\StoreUserRequest;
use App\Modules\Admin\Requests\UserRoleRequest;
use App\Modules\Admin\Services\AdminDashboardService;
use App\Modules\Auctions\Services\AuctionWinnerService;
use App\Modules\Shared\Enums\AuctionStatus;
use App\Modules\Shared\Enums\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
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

    public function createUser(): Response
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function storeUser(StoreUserRequest $request): RedirectResponse
    {
        $user = User::query()->create([
            'name' => $request->string('name')->toString(),
            'email' => $request->string('email')->toString(),
            'password' => Hash::make($request->string('password')->toString()),
            'role' => UserRole::from($request->string('role')->toString()),
            'email_verified_at' => now(),
        ]);

        $user->wallet()->create(['balance' => 0]);

        return redirect()->route('admin.users.index')->with('success', "User {$user->name} created.");
    }

    public function winners(AdminDashboardService $service): Response
    {
        return Inertia::render('Admin/Winners/Index', $service->winners());
    }

    public function closeAuction(Auction $auction, AuctionWinnerService $winnerService): RedirectResponse
    {
        if ($auction->status !== AuctionStatus::Live) {
            return back()->withErrors(['status' => 'Only live auctions can be closed manually.']);
        }

        $winnerService->closeAuction($auction);

        return back()->with('success', 'Auction closed. Winner determined.');
    }

    public function updateRole(User $user, UserRoleRequest $request): RedirectResponse
    {
        $role = UserRole::from($request->validated('role'));

        // Prevent self-demotion
        if ($user->id === $request->user()?->id) {
            return back()->withErrors(['role' => 'Cannot change your own role.']);
        }

        $user->update(['role' => $role]);

        return back()->with('success', "Role for {$user->name} changed to {$role->label()}.");
    }

    public function userWallet(User $user, AdminDashboardService $service): Response
    {
        return Inertia::render('Admin/Users/Wallet', $service->userWallet($user));
    }
}
