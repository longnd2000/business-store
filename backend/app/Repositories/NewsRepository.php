<?php

namespace App\Repositories;

use App\Repositories\Interfaces\INewsRepository;
use App\Models\News;
use Illuminate\Database\Eloquent\Model;

class NewsRepository extends BaseRepository implements INewsRepository
{
    /**
     * Define the model associated with this repository.
     *
     * @return Model
     */
    protected function resolveModel(): Model
    {
        return new News();
    }

    /**
     * Get news articles with search support, latest first.
     *
     * @param string|null $searchQuery
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFilteredNews(?string $searchQuery)
    {
        $query = $this->model;

        if ($searchQuery) {
            $query = $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                  ->orWhere('content', 'like', "%{$searchQuery}%")
                  ->orWhere('summary', 'like', "%{$searchQuery}%");
            });
        }

        return $query->latest()->get();
    }
}
