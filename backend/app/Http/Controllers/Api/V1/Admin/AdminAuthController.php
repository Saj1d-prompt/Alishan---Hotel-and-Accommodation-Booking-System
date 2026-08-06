<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function login(
        Request $request
    ): JsonResponse {
        $credentials = $request->validate([
            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'password' => [
                'required',
                'string',
            ],
        ]);

        $user = User::query()
            ->where(
                'email',
                strtolower(
                    trim($credentials['email'])
                )
            )
            ->first();

        if (
            ! $user
            || ! Hash::check(
                $credentials['password'],
                $user->password
            )
        ) {
            throw ValidationException::withMessages([
                'email' => [
                    'The provided credentials are incorrect.',
                ],
            ]);
        }

        if (! $user->hasRole('admin')) {
            abort(
                403,
                'This account does not have administrator access.'
            );
        }

        /*
         * Remove older Admin-panel tokens for
         * this account.
         */
        $user->tokens()
            ->where(
                'name',
                'admin-panel'
            )
            ->delete();

        $token = $user
            ->createToken(
                'admin-panel',
                ['admin']
            )
            ->plainTextToken;

        return response()->json([
            'message' =>
                'Login successful.',

            'data' => [
                'token' => $token,

                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ],
        ]);
    }

    public function me(
        Request $request
    ): JsonResponse {
        $user = $request->user();

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function logout(
        Request $request
    ): JsonResponse {
        $request
            ->user()
            ?->currentAccessToken()
            ?->delete();

        return response()->json([
            'message' =>
                'Logged out successfully.',
        ]);
    }
}