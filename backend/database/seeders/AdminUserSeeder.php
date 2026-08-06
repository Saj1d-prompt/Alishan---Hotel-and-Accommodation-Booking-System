<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $name = env(
            'ADMIN_NAME',
            'Alishan Admin'
        );

        $email = env(
            'ADMIN_EMAIL'
        );

        $password = env(
            'ADMIN_PASSWORD'
        );

        if (
            ! $email
            || ! $password
        ) {
            throw new RuntimeException(
                'ADMIN_EMAIL and ADMIN_PASSWORD must be configured before running AdminUserSeeder.'
            );
        }

        app(
            PermissionRegistrar::class
        )->forgetCachedPermissions();

        $adminRole =
            Role::firstOrCreate([
                'name' => 'admin',
                'guard_name' => 'web',
            ]);

        $admin = User::query()
            ->updateOrCreate(
                [
                    'email' =>
                        strtolower(
                            trim($email)
                        ),
                ],
                [
                    'name' => $name,
                    'password' => $password,
                ]
            );

        if (
            ! $admin->hasRole(
                $adminRole
            )
        ) {
            $admin->assignRole(
                $adminRole
            );
        }
    }
}