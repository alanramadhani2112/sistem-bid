<?php

declare(strict_types=1);

namespace App\Modules\Users\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ProfileController
{
    public function show(Request $request): Response
    {
        return Inertia::render('Profile/Show', [
            'user' => $request->user()?->only('id', 'name', 'email', 'avatar', 'role'),
        ]);
    }
}
