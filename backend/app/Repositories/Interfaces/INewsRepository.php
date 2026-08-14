<?php

namespace App\Repositories\Interfaces;

interface INewsRepository extends IBaseRepository
{
    /**
     * Get list of news articles with optional search filtering.
     *
     * @param string|null $searchQuery
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFilteredNews(?string $searchQuery);
}
