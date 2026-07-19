<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Modules\Shared\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureUserHasRole
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if ($user === null) {
            abort(Response::HTTP_FORBIDDEN);
        }

        $allowedRoles = array_map(
            static fn (string $role): UserRole => UserRole::from($role),
            $roles,
        );

        if (! $user->hasAnyRole($allowedRoles)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
