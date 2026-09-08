<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Tenant;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin is not tied to any tenant (tenant_id = null)
        $superAdmin = User::updateOrCreate(
            ['email' => 'superadmin@photobooth.test'],
            [
                'name'     => 'Super Admin',
                'password' => Hash::make('password'),
                'status'   => 'active',
            ]
        );

        $superAdmin->assignRole('super_admin'); // guard: web (default Spatie)

        $this->command->info('Super Admin seeded: superadmin@photobooth.test / password');
    }
}
