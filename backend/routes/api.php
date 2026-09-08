<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SuperAdmin\TenantController;
use App\Http\Controllers\Api\SuperAdmin\SubscriptionPlanController;
use App\Http\Controllers\Api\BusinessProfileController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\TemplateVersionController;
use App\Http\Controllers\Api\TemplatePhotoSlotController;
use App\Http\Controllers\Api\PhotoSessionController;
use App\Http\Controllers\Api\SessionPhotoController;
use App\Http\Controllers\Api\PhotoResultController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\NotificationController;

// =============================================================================
// PUBLIC ROUTES (no auth required)
// =============================================================================

// Authentication
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);       // UC-001
    Route::post('/login', [AuthController::class, 'login'])->name('login');             // UC-002
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']); // UC-004
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);   // UC-004
});

// Online Photobooth public access (via event slug + optional token)
Route::get('/booth/online/{slug}', [PhotoSessionController::class, 'publicOnlineInfo']);
Route::post('/booth/online/{slug}/start', [PhotoSessionController::class, 'startOnlineSession']);

// Public gallery result access via result token (QR scan)
Route::get('/results/{result_token}', [PhotoResultController::class, 'publicView']); // UC-027

// =============================================================================
// AUTHENTICATED ROUTES
// =============================================================================

Route::middleware(['auth:sanctum'])->group(function () {

    // -------------------------------------------------------------------------
    // Auth
    // -------------------------------------------------------------------------
    Route::post('/auth/logout', [AuthController::class, 'logout']); // UC-003
    Route::get('/auth/me', [AuthController::class, 'me']);

    // =========================================================================
    // SUPER ADMIN ROUTES (no tenant context required)
    // =========================================================================
    Route::middleware(['role:super_admin'])->prefix('superadmin')->group(function () {
        // UC-005: Manage Tenants
        Route::apiResource('tenants', TenantController::class);
        Route::patch('tenants/{tenant}/status', [TenantController::class, 'updateStatus']);

        // UC-006: Manage Subscription Plans
        Route::apiResource('subscription-plans', SubscriptionPlanController::class);
    });

    // =========================================================================
    // TENANT-SCOPED ROUTES (requires auth + active tenant)
    // =========================================================================
    Route::middleware(['tenant'])->group(function () {

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']); // UC-017

        // Business Profile — UC-007
        Route::get('/business', [BusinessProfileController::class, 'show']);
        Route::put('/business', [BusinessProfileController::class, 'update']);

        // User Management — UC-008
        Route::apiResource('users', UserController::class);

        // Subscription — UC-016
        Route::prefix('subscription')->group(function () {
            Route::get('/', [SubscriptionPlanController::class, 'tenantSubscription']);
            Route::post('/select', [SubscriptionPlanController::class, 'selectPlan']);
            Route::get('/plans', [SubscriptionPlanController::class, 'availablePlans']);
        });

        // Package Management — UC-009
        Route::apiResource('packages', PackageController::class);

        // Event Management — UC-010
        Route::apiResource('events', EventController::class);
        Route::patch('events/{event}/status', [EventController::class, 'updateStatus']);
        Route::post('events/{event}/templates', [EventController::class, 'assignTemplates']); // UC-014
        Route::post('events/{event}/operators', [EventController::class, 'assignOperators']); // UC-015
        Route::delete('events/{event}/operators/{user}', [EventController::class, 'removeOperator']);

        // Template / Design Management — UC-012
        Route::apiResource('templates', TemplateController::class);
        Route::patch('templates/{template}/status', [TemplateController::class, 'updateStatus']);

        // Template Versions — UC-013
        Route::post('templates/{template}/versions', [TemplateVersionController::class, 'store']);
        Route::get('templates/{template}/versions', [TemplateVersionController::class, 'index']);
        Route::get('templates/{template}/versions/{version}', [TemplateVersionController::class, 'show']);

        // Template Photo Slots — UC-013
        Route::apiResource('template-versions.slots', TemplatePhotoSlotController::class)->shallow();

        // Photo Sessions
        Route::prefix('sessions')->group(function () {
            Route::get('/', [PhotoSessionController::class, 'index']);   // UC-006 (admin view)
            Route::get('/{session}', [PhotoSessionController::class, 'show']);
        });

        // Customer Management — UC-029
        Route::apiResource('customers', CustomerController::class);

        // Transaction Management — UC-030
        Route::get('transactions', [TransactionController::class, 'index']);
        Route::get('transactions/{transaction}', [TransactionController::class, 'show']);

        // Gallery — UC-028
        Route::get('gallery', [GalleryController::class, 'index']);
        Route::get('gallery/{result}', [GalleryController::class, 'show']);
        Route::delete('gallery/{result}', [GalleryController::class, 'destroy']);

        // Reports — UC-018
        Route::prefix('reports')->group(function () {
            Route::get('/events', [ReportController::class, 'events']);
            Route::get('/sessions', [ReportController::class, 'sessions']);
            Route::get('/transactions', [ReportController::class, 'transactions']);
            Route::get('/business', [ReportController::class, 'business']);
        });

        // Notifications — UC-032
        Route::apiResource('notifications', NotificationController::class)->only(['index', 'show', 'update', 'destroy']);
        Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllRead']);

        // Media Upload — UC-033
        Route::post('media', [MediaController::class, 'store']);
        Route::delete('media/{media}', [MediaController::class, 'destroy']);
        Route::get('media/{media}', [MediaController::class, 'show']);

        // =====================================================================
        // OPERATOR ROUTES (within tenant context)
        // =====================================================================
        Route::middleware(['role:tenant_admin,operator'])->prefix('booth')->group(function () {
            // On-Site Photobooth — UC-035, UC-019
            Route::get('/onsite/events', [PhotoSessionController::class, 'operatorEvents']);
            Route::post('/onsite/start', [PhotoSessionController::class, 'startOnsiteSession']); // UC-019
        });

        // =====================================================================
        // PHOTOBOOTH SESSION ROUTES (operator + customer in session)
        // =====================================================================
        Route::prefix('booth/session')->group(function () {
            Route::get('/{token}', [PhotoSessionController::class, 'sessionStatus']);
            Route::post('/{token}/capture', [SessionPhotoController::class, 'capture']);   // UC-021
            Route::post('/{token}/retake', [SessionPhotoController::class, 'retake']);     // UC-022
            Route::post('/{token}/template', [PhotoSessionController::class, 'selectTemplate']); // UC-023
            Route::post('/{token}/generate', [PhotoResultController::class, 'generate']); // UC-024
            Route::get('/{token}/result', [PhotoResultController::class, 'sessionResult']); // UC-025
        });
    });

    // Health check (authenticated version with user info)
    Route::get('/health', function () {
        return response()->json([
            'status'  => 'ok',
            'user'    => request()->user()?->email,
            'version' => app()->version(),
        ]);
    });
});

// =============================================================================
// PUBLIC HEALTH CHECK
// =============================================================================
Route::get('/health', function () {
    return response()->json([
        'status'  => 'ok',
        'version' => app()->version(),
    ]);
});
