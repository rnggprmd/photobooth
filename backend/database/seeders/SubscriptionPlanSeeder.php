<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name'           => 'Free',
                'slug'           => 'free',
                'description'    => 'Paket gratis untuk mencoba platform. Fitur dan kuota terbatas.',
                'price'          => 0,
                'billing_period' => 'monthly',
                'max_events'     => 2,
                'max_sessions'   => 50,
                'max_templates'  => 3,
                'max_storage_mb' => 512,
                'max_operators'  => 1,
                'max_customers'  => 100,
                'features_json'  => [
                    'online_photobooth' => true,
                    'onsite_photobooth' => true,
                    'qr_result'         => true,
                    'custom_branding'   => false,
                    'reports'           => false,
                    'api_access'        => false,
                ],
                'status' => 'active',
            ],
            [
                'name'           => 'Starter',
                'slug'           => 'starter',
                'description'    => 'Paket untuk bisnis kecil. Event, session, dan template lebih banyak.',
                'price'          => 199000,
                'billing_period' => 'monthly',
                'max_events'     => 10,
                'max_sessions'   => 500,
                'max_templates'  => 15,
                'max_storage_mb' => 5120,
                'max_operators'  => 3,
                'max_customers'  => 1000,
                'features_json'  => [
                    'online_photobooth' => true,
                    'onsite_photobooth' => true,
                    'qr_result'         => true,
                    'custom_branding'   => true,
                    'reports'           => true,
                    'api_access'        => false,
                ],
                'status' => 'active',
            ],
            [
                'name'           => 'Business',
                'slug'           => 'business',
                'description'    => 'Paket untuk bisnis berkembang. Operator lebih banyak, branding, dan reporting lengkap.',
                'price'          => 499000,
                'billing_period' => 'monthly',
                'max_events'     => 0, // unlimited
                'max_sessions'   => 2000,
                'max_templates'  => 50,
                'max_storage_mb' => 20480,
                'max_operators'  => 10,
                'max_customers'  => 0, // unlimited
                'features_json'  => [
                    'online_photobooth' => true,
                    'onsite_photobooth' => true,
                    'qr_result'         => true,
                    'custom_branding'   => true,
                    'reports'           => true,
                    'api_access'        => true,
                ],
                'status' => 'active',
            ],
            [
                'name'           => 'Enterprise',
                'slug'           => 'enterprise',
                'description'    => 'Paket enterprise dengan limit custom, multi-cabang, dan dukungan prioritas.',
                'price'          => 999000,
                'billing_period' => 'monthly',
                'max_events'     => 0, // unlimited
                'max_sessions'   => 0, // unlimited
                'max_templates'  => 0, // unlimited
                'max_storage_mb' => 102400,
                'max_operators'  => 0, // unlimited
                'max_customers'  => 0, // unlimited
                'features_json'  => [
                    'online_photobooth'  => true,
                    'onsite_photobooth'  => true,
                    'qr_result'          => true,
                    'custom_branding'    => true,
                    'reports'            => true,
                    'api_access'         => true,
                    'custom_domain'      => true,
                    'priority_support'   => true,
                ],
                'status' => 'active',
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }

        $this->command->info('Subscription plans seeded successfully.');
    }
}
