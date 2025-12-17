<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->withoutMiddleware([ValidateCsrfToken::class]);
    Route::post('/login', [AuthController::class, 'login'])->withoutMiddleware([ValidateCsrfToken::class]);
    Route::post('/logout', [AuthController::class, 'logout'])->withoutMiddleware([ValidateCsrfToken::class]);
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});
