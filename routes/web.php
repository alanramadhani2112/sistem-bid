<?php

use App\Modules\Admin\Controllers\AdminDashboardController;
use App\Modules\Auctions\Controllers\AuctionBrowseController;
use App\Modules\Auctions\Controllers\AuctionController;
use App\Modules\Authentication\Controllers\GoogleAuthController;
use App\Modules\Bidding\Controllers\BiddingController;
use App\Modules\GreenBeans\Controllers\GreenBeanController;
use App\Modules\Users\Controllers\HistoryController;
use App\Modules\Users\Controllers\ProfileController;
use App\Modules\Wallet\Controllers\WalletController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest')->name('login');

Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])->middleware('guest')->name('auth.google.redirect');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->middleware('guest')->name('auth.google.callback');
Route::post('/logout', [GoogleAuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware('auth')->name('dashboard');

Route::get('/auctions', [AuctionBrowseController::class, 'index'])->name('auctions.index');
Route::get('/auctions/{auction}', [AuctionBrowseController::class, 'show'])->name('auctions.show');
Route::get('/auctions/{auction}/room', [AuctionBrowseController::class, 'room'])->middleware('auth')->name('auctions.room');
Route::post('/auctions/{auction}/bids', [BiddingController::class, 'store'])->middleware('auth')->name('auctions.bids.store');

Route::get('/wallet', [WalletController::class, 'index'])->middleware('auth')->name('wallet.index');
Route::post('/wallet/topup', [WalletController::class, 'topUp'])->middleware('auth')->name('wallet.topup');
Route::get('/history', [HistoryController::class, 'index'])->middleware('auth')->name('history.index');
Route::get('/profile', [ProfileController::class, 'show'])->middleware('auth')->name('profile.show');

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/dashboard', [AdminDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/auctions/{auction}/monitor', [AdminDashboardController::class, 'monitor'])->name('auctions.monitor');
    Route::get('/users', [AdminDashboardController::class, 'users'])->name('users.index');
    Route::get('/winners', [AdminDashboardController::class, 'winners'])->name('winners.index');
    Route::resource('green-beans', GreenBeanController::class)->except('show');
    Route::patch('auctions/{auction}/status', [AuctionController::class, 'status'])->name('auctions.status');
    Route::resource('auctions', AuctionController::class)->except('show');
});
