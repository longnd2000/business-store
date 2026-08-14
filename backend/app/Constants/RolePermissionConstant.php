<?php

namespace App\Constants;

class RolePermissionConstant
{
    public const ROLE_ADMIN = 'admin';
    public const ROLE_EDITOR = 'editor';
    public const ROLE_BUYER = 'buyer';

    public const PERM_VIEW_STATS = 'view_stats';
    public const PERM_VIEW_PRODUCTS = 'view_products';
    public const PERM_CREATE_PRODUCTS = 'create_products';
    public const PERM_EDIT_PRODUCTS = 'edit_products';
    public const PERM_DELETE_PRODUCTS = 'delete_products';
    public const PERM_VIEW_CATEGORIES = 'view_categories';
    public const PERM_MANAGE_CATEGORIES = 'manage_categories';
    public const PERM_VIEW_BUYERS = 'view_buyers';
    public const PERM_MANAGE_ORDERS = 'manage_orders';
    public const PERM_MANAGE_NEWS = 'manage_news';

    public const MAP = [
        self::ROLE_ADMIN => [
            self::PERM_VIEW_STATS,
            self::PERM_VIEW_PRODUCTS,
            self::PERM_CREATE_PRODUCTS,
            self::PERM_EDIT_PRODUCTS,
            self::PERM_DELETE_PRODUCTS,
            self::PERM_VIEW_CATEGORIES,
            self::PERM_MANAGE_CATEGORIES,
            self::PERM_VIEW_BUYERS,
            self::PERM_MANAGE_ORDERS,
            self::PERM_MANAGE_NEWS,
        ],
        self::ROLE_EDITOR => [
            self::PERM_VIEW_PRODUCTS,
            self::PERM_EDIT_PRODUCTS,
            self::PERM_VIEW_CATEGORIES,
            self::PERM_MANAGE_NEWS,
        ],
        self::ROLE_BUYER => []
    ];

    public static function getPermissionsForRole(string $role): array
    {
        return self::MAP[$role] ?? [];
    }
}
