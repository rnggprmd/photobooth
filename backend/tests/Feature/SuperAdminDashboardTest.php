<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class SuperAdminDashboardTest extends TestCase
{
    /**
     * Test unauthenticated access to superadmin dashboard is rejected.
     */
    public function test_unauthenticated_user_cannot_access_superadmin_dashboard(): void
    {
        $response = $this->getJson('/api/superadmin/dashboard');

        $response->assertStatus(401);
    }

    /**
     * Test superadmin can retrieve dashboard metrics.
     */
    public function test_superadmin_can_retrieve_dashboard_metrics(): void
    {
        $superadmin = User::where('email', 'superadmin@photobooth.test')->first();

        if (!$superadmin) {
            $this->markTestSkipped('Superadmin user not seeded in current test DB.');
            return;
        }

        $response = $this->actingAs($superadmin, 'sanctum')
            ->getJson('/api/superadmin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'metrics' => [
                        'total_tenants',
                        'active_tenants',
                        'saas_mrr',
                        'saas_arr',
                    ],
                    'expiring_subscriptions',
                    'plan_distribution',
                    'recent_tenants',
                    'system_health',
                ],
            ]);
    }
}
