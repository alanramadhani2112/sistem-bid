<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->restrictOnDelete();
            $table->unsignedBigInteger('balance')->default(0);
            $table->timestamps();
        });

        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained()->restrictOnDelete();
            $table->string('type');
            $table->bigInteger('amount');
            $table->unsignedBigInteger('balance_before');
            $table->unsignedBigInteger('balance_after');
            $table->string('reference')->nullable()->index();
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('wallet_id');
        });

        Schema::create('green_beans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('origin');
            $table->string('process');
            $table->unsignedInteger('weight_gram');
            $table->text('description')->nullable();
            $table->string('image_path')->nullable();
            $table->unsignedBigInteger('starting_price');
            $table->unsignedBigInteger('bid_increment')->default(100_000);
            $table->timestamps();
        });

        Schema::create('auctions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('green_bean_id')->constrained()->restrictOnDelete();
            $table->string('title');
            $table->string('status')->default('draft')->index();
            $table->unsignedBigInteger('current_price');
            $table->timestamp('starts_at')->index();
            $table->timestamp('ends_at')->index();
            $table->timestamps();

            $table->index(['status', 'ends_at']);
        });

        Schema::create('bids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->unsignedBigInteger('amount');
            $table->timestamp('created_at')->useCurrent();

            $table->index(['auction_id', 'user_id']);
            $table->index(['auction_id', 'amount']);
        });

        Schema::create('auction_winners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_id')->unique()->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('bid_id')->constrained()->restrictOnDelete();
            $table->unsignedBigInteger('winning_amount');
            $table->timestamp('determined_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auction_winners');
        Schema::dropIfExists('bids');
        Schema::dropIfExists('auctions');
        Schema::dropIfExists('green_beans');
        Schema::dropIfExists('wallet_transactions');
        Schema::dropIfExists('wallets');
    }
};
