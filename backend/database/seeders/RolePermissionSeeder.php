<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Seed roles and permissions based on the Role & Permission Matrix in PRD Section 7.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // -------------------------------------------------------------------------
        // Define Permissions
        // -------------------------------------------------------------------------
        $permissions = [
            // Platform
            'platform.dashboard.view',
            'tenant.manage',
            'subscription.plan.manage',
            'subscription.plan.view',
            'subscription.tenant.manage',

            // Business
            'business.profile.manage',
            'user.manage',

            // Package
            'package.manage',
            'package.view',

            // Event
            'event.manage',
            'event.view',

            // Template
            'template.manage',
            'template.view',
            'template.select', // customer selects template during session

            // Photobooth
            'photobooth.onsite.use',
            'photobooth.online.use',

            // Photo Session
            'session.manage',
            'session.view',
            'session.create',

            // Gallery
            'gallery.manage',
            'gallery.view',
            'gallery.view_own',

            // Transaction
            'transaction.manage',
            'transaction.view',
            'transaction.view_own',

            // Reports
            'report.view',
            'report.limited',

            // System Settings
            'settings.manage',
            'settings.manage_tenant',

            // Media
            'media.upload',
            'media.manage',

            // Notifications
            'notification.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // -------------------------------------------------------------------------
        // Create Roles and assign permissions
        // Based on PRD Section 7: Role & Permission Matrix
        // -------------------------------------------------------------------------

        // Super Admin
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->givePermissionTo([
            'platform.dashboard.view',
            'tenant.manage',
            'subscription.plan.manage',
            'subscription.plan.view',
            'business.profile.manage',
            'user.manage',
            'package.view',
            'event.view',
            'template.view',
            'session.view',
            'gallery.view',
            'transaction.manage',
            'transaction.view',
            'report.view',
            'settings.manage',
            'notification.view',
        ]);

        // Tenant Admin / Business Owner
        $tenantAdmin = Role::firstOrCreate(['name' => 'tenant_admin', 'guard_name' => 'web']);
        $tenantAdmin->givePermissionTo([
            'subscription.plan.view',
            'subscription.tenant.manage',
            'business.profile.manage',
            'user.manage',
            'package.manage',
            'package.view',
            'event.manage',
            'event.view',
            'template.manage',
            'template.view',
            'photobooth.onsite.use',
            'photobooth.online.use',
            'session.manage',
            'session.view',
            'gallery.manage',
            'gallery.view',
            'transaction.manage',
            'transaction.view',
            'report.view',
            'settings.manage_tenant',
            'media.upload',
            'media.manage',
            'notification.view',
        ]);

        // Operator
        $operator = Role::firstOrCreate(['name' => 'operator', 'guard_name' => 'web']);
        $operator->givePermissionTo([
            'event.view',
            'template.view',
            'photobooth.onsite.use',
            'session.create',
            'session.view',
            'gallery.view',
            'transaction.view',
            'report.limited',
            'notification.view',
        ]);

        // Customer (for authenticated customer actions)
        $customer = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);
        $customer->givePermissionTo([
            'photobooth.onsite.use',
            'photobooth.online.use',
            'session.create',
            'session.view',
            'template.select',
            'gallery.view_own',
            'transaction.view_own',
        ]);

        $this->command->info('Roles and permissions seeded successfully.');
    }
}
