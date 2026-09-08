<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

/**
 * Trait BelongsToTenant
 *
 * Applies a global query scope so that all queries on models using this trait
 * are automatically filtered by the authenticated user's tenant_id.
 * This is the primary mechanism for multi-tenant data isolation.
 */
trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            if (auth()->check() && auth()->user()->tenant_id) {
                $builder->where($builder->getModel()->getTable() . '.tenant_id', auth()->user()->tenant_id);
            }
        });

        // Automatically set tenant_id when creating a new record
        static::creating(function ($model) {
            if (auth()->check() && auth()->user()->tenant_id && empty($model->tenant_id)) {
                $model->tenant_id = auth()->user()->tenant_id;
            }
        });
    }

    /**
     * Query scope to explicitly bypass the global tenant scope.
     * Use with caution — only in Super Admin contexts.
     */
    public function scopeWithoutTenantScope(Builder $query): Builder
    {
        return $query->withoutGlobalScope('tenant');
    }
}
