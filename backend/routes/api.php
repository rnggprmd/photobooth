<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'online',
        'message' => 'Laravel Backend Photobooth siap digunakan!',
        'timestamp' => now()->toIso8601String(),
        'php_version' => PHP_VERSION,
        'laravel_version' => app()->version(),
    ]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

