<?php

use App\Modules\Admin\Controllers\AdminDashboardController;
use App\Modules\Auctions\Controllers\AuctionBrowseController;
use App\Modules\Auctions\Controllers\AuctionController;
use App\Modules\Auctions\Controllers\PublicLiveMonitorController;
use App\Modules\Auctions\Services\AuctionBrowseService;
use App\Modules\Authentication\Controllers\AuthController;
use App\Modules\Bidding\Controllers\BiddingController;
use App\Modules\GreenBeans\Controllers\GreenBeanController;
use App\Modules\Users\Controllers\HistoryController;
use App\Modules\Users\Controllers\ProfileController;
use App\Modules\Wallet\Controllers\WalletController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (AuctionBrowseService $auctionBrowseService) {
    return Inertia::render('Home', $auctionBrowseService->liveAuctionLobby());
})->name('home');

Route::get('/panduan-bidder', function () {
    return Inertia::render('UsageGuide', ['audience' => 'bidder']);
})->name('usage-guide.bidder');

Route::get('/panduan-admin', function () {
    return Inertia::render('UsageGuide', ['audience' => 'admin']);
})->name('usage-guide.admin');

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest')->name('login');

Route::post('/login', [AuthController::class, 'login'])->middleware('guest')->name('login.store');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware('auth')->name('dashboard');

Route::get('/auctions', [AuctionBrowseController::class, 'index'])->name('auctions.index');
Route::get('/auctions/{auction}', [AuctionBrowseController::class, 'show'])->name('auctions.show');
Route::get('/auctions/{auction}/room', [AuctionBrowseController::class, 'room'])->middleware('auth')->name('auctions.room');
Route::post('/auctions/{auction}/bids', [BiddingController::class, 'store'])->middleware('auth')->name('auctions.bids.store');
Route::get('/live/{auction}/monitor', [PublicLiveMonitorController::class, 'show'])->name('live.monitor');

Route::get('/wallet', [WalletController::class, 'index'])->middleware('auth')->name('wallet.index');
Route::post('/wallet/topup', [WalletController::class, 'topUp'])->middleware('auth')->name('wallet.topup');
Route::get('/history', [HistoryController::class, 'index'])->middleware('auth')->name('history.index');
Route::get('/profile', [ProfileController::class, 'show'])->middleware('auth')->name('profile.show');

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/dashboard', [AdminDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/auctions/{auction}/monitor', [AdminDashboardController::class, 'monitor'])->name('auctions.monitor');
    Route::post('/auctions/{auction}/close', [AdminDashboardController::class, 'closeAuction'])->name('auctions.close');
    Route::get('/users', [AdminDashboardController::class, 'users'])->name('users.index');
    Route::get('/users/{user}/wallet', [AdminDashboardController::class, 'userWallet'])->name('users.wallet');
    Route::patch('/users/{user}/role', [AdminDashboardController::class, 'updateRole'])->name('users.role');
    Route::get('/winners', [AdminDashboardController::class, 'winners'])->name('winners.index');
    Route::resource('green-beans', GreenBeanController::class)->except('show');
    Route::patch('auctions/{auction}/status', [AuctionController::class, 'status'])->name('auctions.status');
    Route::resource('auctions', AuctionController::class)->except('show');
});
