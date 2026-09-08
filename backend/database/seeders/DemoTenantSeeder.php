<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;
use App\Models\User;
use App\Models\BusinessProfile;
use App\Models\SubscriptionPlan;
use App\Models\TenantSubscription;
use App\Models\Package;
use App\Models\Template;
use App\Models\TemplateVersion;
use App\Models\TemplatePhotoSlot;
use App\Models\Event;
use App\Models\Customer;
use App\Models\PhotoSession;
use App\Models\PhotoResult;
use App\Models\Transaction;
use App\Models\Payment;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DemoTenantSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Demo Tenant
        $tenant = Tenant::updateOrCreate(
            ['slug' => 'lumina-booth'],
            [
                'name'   => 'Lumina Photobooth Studio',
                'status' => 'active',
            ]
        );

        // 2. Business Profile
        BusinessProfile::updateOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'business_name' => 'Lumina Photobooth Studio',
                'description'   => 'Jasa photobooth profesional untuk wedding, gathering, dan virtual hybrid events.',
                'email'         => 'admin@luminabooth.test',
                'phone'         => '081234567890',
                'address'       => 'Jl. Kemang Raya No. 10, Jakarta Selatan',
                'branding_json' => [
                    'primary_color'   => '#2563eb',
                    'secondary_color' => '#38bdf8',
                    'tagline'         => 'Capture Your Brightest Moments',
                ],
            ]
        );

        // 3. Subscription (Business Plan)
        $businessPlan = SubscriptionPlan::where('slug', 'business')->first();
        if ($businessPlan) {
            TenantSubscription::updateOrCreate(
                ['tenant_id' => $tenant->id],
                [
                    'plan_id'                  => $businessPlan->id,
                    'status'                   => 'active',
                    'started_at'               => now(),
                    'ends_at'                  => now()->addYear(),
                    'external_subscription_id' => 'SUB-DEMO-LUMINA-001',
                ]
            );
        }

        // 4. Create Tenant Users (Admin, Operator, Management)
        $tenantAdmin = User::updateOrCreate(
            ['email' => 'tenant@photobooth.test'],
            [
                'tenant_id' => $tenant->id,
                'name'      => 'Lumina Admin',
                'password'  => Hash::make('password'),
                'status'    => 'active',
            ]
        );
        $tenantAdmin->assignRole('tenant_admin');

        $operator = User::updateOrCreate(
            ['email' => 'operator@photobooth.test'],
            [
                'tenant_id' => $tenant->id,
                'name'      => 'Budi Operator',
                'password'  => Hash::make('password'),
                'status'    => 'active',
            ]
        );
        $operator->assignRole('operator');

        $management = User::updateOrCreate(
            ['email' => 'management@photobooth.test'],
            [
                'tenant_id' => $tenant->id,
                'name'      => 'Siti Management',
                'password'  => Hash::make('password'),
                'status'    => 'active',
            ]
        );
        $management->assignRole('management');

        // 5. Packages
        $pkgWedding = Package::updateOrCreate(
            ['tenant_id' => $tenant->id, 'name' => 'Wedding Glamour (On-Site)'],
            [
                'description'      => 'Paket photobooth lengkap untuk pesta resepsi pernikahan. Durasi 4 jam, cetak tak terbatas.',
                'price'            => 3500000,
                'duration_minutes' => 240,
                'max_sessions'     => 300,
                'status'           => 'active',
            ]
        );

        $pkgVirtual = Package::updateOrCreate(
            ['tenant_id' => $tenant->id, 'name' => 'Virtual Celebration (Online)'],
            [
                'description'      => 'Photobooth online browser-based untuk acara virtual/webinar perusahaan.',
                'price'            => 1200000,
                'duration_minutes' => 180,
                'max_sessions'     => 500,
                'status'           => 'active',
            ]
        );

        // 6. Templates
        $tplStrip = Template::updateOrCreate(
            ['tenant_id' => $tenant->id, 'name' => 'Classic 3-Strip Vertical'],
            [
                'paper_size'    => '4R',
                'orientation'   => 'portrait',
                'canvas_width'  => 1200,
                'canvas_height' => 1800,
                'status'        => 'active',
            ]
        );

        $tplStripVer = TemplateVersion::updateOrCreate(
            ['template_id' => $tplStrip->id, 'version_number' => 1],
            [
                'canvas_width'  => 1200,
                'canvas_height' => 1800,
                'status'        => 'published',
                'created_by'    => $tenantAdmin->id,
            ]
        );
        $tplStrip->update(['current_version_id' => $tplStripVer->id]);

        // Create 3 Slots for Template 1
        TemplatePhotoSlot::updateOrCreate(
            ['template_version_id' => $tplStripVer->id, 'slot_order' => 1],
            [
                'slot_key'   => 'slot_1',
                'position_x' => 100,
                'position_y' => 100,
                'width'      => 1000,
                'height'     => 450,
                'rotation'   => 0,
                'crop_mode'  => 'cover',
            ]
        );
        TemplatePhotoSlot::updateOrCreate(
            ['template_version_id' => $tplStripVer->id, 'slot_order' => 2],
            [
                'slot_key'   => 'slot_2',
                'position_x' => 100,
                'position_y' => 600,
                'width'      => 1000,
                'height'     => 450,
                'rotation'   => 0,
                'crop_mode'  => 'cover',
            ]
        );
        TemplatePhotoSlot::updateOrCreate(
            ['template_version_id' => $tplStripVer->id, 'slot_order' => 3],
            [
                'slot_key'   => 'slot_3',
                'position_x' => 100,
                'position_y' => 1100,
                'width'      => 1000,
                'height'     => 450,
                'rotation'   => 0,
                'crop_mode'  => 'cover',
            ]
        );

        // Template 2: 2x2 Grid Party (Landscape)
        $tplGrid = Template::updateOrCreate(
            ['tenant_id' => $tenant->id, 'name' => '2x2 Grid Party Frame'],
            [
                'paper_size'    => '4R',
                'orientation'   => 'landscape',
                'canvas_width'  => 1800,
                'canvas_height' => 1200,
                'status'        => 'active',
            ]
        );

        $tplGridVer = TemplateVersion::updateOrCreate(
            ['template_id' => $tplGrid->id, 'version_number' => 1],
            [
                'canvas_width'  => 1800,
                'canvas_height' => 1200,
                'status'        => 'published',
                'created_by'    => $tenantAdmin->id,
            ]
        );
        $tplGrid->update(['current_version_id' => $tplGridVer->id]);

        TemplatePhotoSlot::updateOrCreate(
            ['template_version_id' => $tplGridVer->id, 'slot_order' => 1],
            [
                'slot_key' => 'grid_1', 'position_x' => 80, 'position_y' => 80, 'width' => 780, 'height' => 480, 'rotation' => 0, 'crop_mode' => 'cover',
            ]
        );
        TemplatePhotoSlot::updateOrCreate(
            ['template_version_id' => $tplGridVer->id, 'slot_order' => 2],
            [
                'slot_key' => 'grid_2', 'position_x' => 940, 'position_y' => 80, 'width' => 780, 'height' => 480, 'rotation' => 0, 'crop_mode' => 'cover',
            ]
        );
        TemplatePhotoSlot::updateOrCreate(
            ['template_version_id' => $tplGridVer->id, 'slot_order' => 3],
            [
                'slot_key' => 'grid_3', 'position_x' => 80, 'position_y' => 640, 'width' => 780, 'height' => 480, 'rotation' => 0, 'crop_mode' => 'cover',
            ]
        );
        TemplatePhotoSlot::updateOrCreate(
            ['template_version_id' => $tplGridVer->id, 'slot_order' => 4],
            [
                'slot_key' => 'grid_4', 'position_x' => 940, 'position_y' => 640, 'width' => 780, 'height' => 480, 'rotation' => 0, 'crop_mode' => 'cover',
            ]
        );

        // Attach templates to packages (Pivot)
        DB::table('package_templates')->updateOrInsert(['package_id' => $pkgWedding->id, 'template_id' => $tplStrip->id]);
        DB::table('package_templates')->updateOrInsert(['package_id' => $pkgWedding->id, 'template_id' => $tplGrid->id]);
        DB::table('package_templates')->updateOrInsert(['package_id' => $pkgVirtual->id, 'template_id' => $tplStrip->id]);

        // 7. Events (On-Site & Online)
        $eventOnsite = Event::updateOrCreate(
            ['tenant_id' => $tenant->id, 'name' => 'The Wedding of Kevin & Sarah'],
            [
                'package_id'     => $pkgWedding->id,
                'description'    => 'Resepsi pernikahan Kevin & Sarah di Grand Ballroom Hotel Mulia.',
                'event_date'     => now()->addDays(7)->toDateString(),
                'start_time'     => '18:00:00',
                'end_time'       => '22:00:00',
                'location'       => 'Grand Ballroom Hotel Mulia Jakarta',
                'status'         => 'active',
                'online_enabled' => false,
            ]
        );

        $eventOnline = Event::updateOrCreate(
            ['tenant_id' => $tenant->id, 'name' => 'TechFest 2026 Virtual Booth'],
            [
                'package_id'     => $pkgVirtual->id,
                'description'    => 'Online photobooth seminar teknologi tahunan.',
                'event_date'     => now()->addDays(14)->toDateString(),
                'start_time'     => '09:00:00',
                'end_time'       => '17:00:00',
                'location'       => 'Virtual Webinar Platform',
                'status'         => 'scheduled',
                'online_slug'    => 'techfest-2026',
                'online_enabled' => true,
            ]
        );

        // Assign operator to onsite event (Pivot)
        DB::table('event_operators')->updateOrInsert(
            ['event_id' => $eventOnsite->id, 'user_id' => $operator->id],
            ['assigned_at' => now()]
        );

        // Assign templates to events (Pivot)
        DB::table('event_templates')->updateOrInsert(
            ['event_id' => $eventOnsite->id, 'template_id' => $tplStrip->id],
            ['is_default' => true, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()]
        );
        DB::table('event_templates')->updateOrInsert(
            ['event_id' => $eventOnsite->id, 'template_id' => $tplGrid->id],
            ['is_default' => false, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()]
        );
        DB::table('event_templates')->updateOrInsert(
            ['event_id' => $eventOnline->id, 'template_id' => $tplStrip->id],
            ['is_default' => true, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()]
        );

        // 8. Sample Customer & Session
        $customer = Customer::updateOrCreate(
            ['tenant_id' => $tenant->id, 'email' => 'andi@example.com'],
            [
                'name'  => 'Andi Pratama',
                'phone' => '081298765432',
            ]
        );

        $session = PhotoSession::updateOrCreate(
            ['session_token' => 'SESSION-DEMO-001'],
            [
                'tenant_id'                    => $tenant->id,
                'event_id'                     => $eventOnsite->id,
                'customer_id'                  => $customer->id,
                'operator_id'                  => $operator->id,
                'mode'                         => 'onsite',
                'status'                       => 'completed',
                'selected_template_version_id' => $tplStripVer->id,
                'retake_count'                 => 1,
                'started_at'                   => now()->subHours(2),
                'completed_at'                 => now()->subHours(1),
            ]
        );

        PhotoResult::updateOrCreate(
            ['result_token' => 'RESULT-LUMINA-DEMO-001'],
            [
                'session_id'          => $session->id,
                'template_version_id' => $tplStripVer->id,
                'qr_payload'          => 'http://localhost:5173/results/RESULT-LUMINA-DEMO-001',
                'status'              => 'ready',
                'generated_at'        => now()->subHours(1),
                'expires_at'          => now()->addDays(30),
            ]
        );

        // 9. Transaction & Payment
        $transaction = Transaction::updateOrCreate(
            ['invoice_number' => 'INV-20260908-0001'],
            [
                'tenant_id'        => $tenant->id,
                'customer_id'      => $customer->id,
                'package_id'       => $pkgWedding->id,
                'event_id'         => $eventOnsite->id,
                'type'             => 'package_order',
                'amount'           => 3500000,
                'currency'         => 'IDR',
                'status'           => 'paid',
                'transaction_date' => now()->subDays(2),
                'due_at'           => now()->addDays(5),
            ]
        );

        Payment::updateOrCreate(
            ['transaction_id' => $transaction->id, 'external_reference' => 'MID-DEMO-9823471'],
            [
                'provider'          => 'Midtrans',
                'method'            => 'qris',
                'amount'            => 3500000,
                'status'            => 'successful',
                'paid_at'           => now()->subDays(2),
                'raw_response_json' => ['status_code' => '200', 'transaction_status' => 'settlement'],
            ]
        );

        $this->command->info('Demo tenant seeded: Lumina Photobooth Studio');
        $this->command->info('  - Tenant Admin: tenant@photobooth.test / password');
        $this->command->info('  - Operator:     operator@photobooth.test / password');
        $this->command->info('  - Management:   management@photobooth.test / password');
    }
}
