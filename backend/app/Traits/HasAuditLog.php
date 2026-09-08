<?php

namespace App\Traits;

use App\Models\AuditLog;

/**
 * Trait HasAuditLog
 *
 * Automatically records create/update/delete actions on models that use this trait.
 */
trait HasAuditLog
{
    protected static function bootHasAuditLog(): void
    {
        static::created(function ($model) {
            static::createAuditLog('create', $model, null, $model->toArray());
        });

        static::updated(function ($model) {
            static::createAuditLog('update', $model, $model->getOriginal(), $model->getChanges());
        });

        static::deleted(function ($model) {
            static::createAuditLog('delete', $model, $model->toArray(), null);
        });
    }

    protected static function createAuditLog(string $action, $model, ?array $oldValues, ?array $newValues): void
    {
        // Remove sensitive fields
        $sensitiveFields = ['password', 'remember_token', 'raw_response_json'];

        if ($oldValues) {
            $oldValues = array_diff_key($oldValues, array_flip($sensitiveFields));
        }
        if ($newValues) {
            $newValues = array_diff_key($newValues, array_flip($sensitiveFields));
        }

        try {
            AuditLog::create([
                'tenant_id'       => $model->tenant_id ?? null,
                'user_id'         => auth()->id(),
                'action'          => $action,
                'entity_type'     => class_basename($model),
                'entity_id'       => $model->getKey(),
                'old_values_json' => $oldValues,
                'new_values_json' => $newValues,
                'ip_address'      => request()->ip(),
                'user_agent'      => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            // Silently fail — audit log should never block business logic
            \Log::warning('AuditLog creation failed: ' . $e->getMessage());
        }
    }
}
