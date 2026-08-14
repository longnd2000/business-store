<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Permission;
use App\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $perm = Permission::firstOrCreate(['name' => 'manage_news']);
        
        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            $admin->permissions()->syncWithoutDetaching([$perm->id]);
        }
        
        $editor = Role::where('name', 'editor')->first();
        if ($editor) {
            $editor->permissions()->syncWithoutDetaching([$perm->id]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $perm = Permission::where('name', 'manage_news')->first();
        if ($perm) {
            $perm->roles()->detach();
            $perm->delete();
        }
    }
};
