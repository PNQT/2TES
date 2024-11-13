<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class EnsureTokenIsValid
{
    public function handle(Request $request, Closure $next): Response
    {
        // Log the request headers
        Log::info('Request Headers:', $request->headers->all());

        // Check if the token is valid
        $token = $request->header('Authorization');

        if ($token !== 'your-valid-token') {
            Log::warning('Unauthorized access attempt with token:', ['token' => $token]);
            return response()->json(['message' => 'This action is unauthorized.'], 403);
        }

        return $next($request);
    }
}