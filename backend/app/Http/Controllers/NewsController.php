<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\INewsRepository;
use App\Constants\RolePermissionConstant;
use App\Constants\MessageConstant;
use App\Http\Requests\NewsRequest;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    /**
     * @var INewsRepository
     */
    protected $newsRepository;

    public function __construct(INewsRepository $newsRepository)
    {
        $this->newsRepository = $newsRepository;
    }

    private function checkPermission(Request $request, string $permission): bool
    {
        $user = $request->user();
        return $user && $user->hasPermission($permission);
    }

    /**
     * Public endpoint: Get list of news articles
     */
    public function index(Request $request)
    {
        $news = $this->newsRepository->getFilteredNews($request->query('q'));
        return response()->json($news);
    }

    /**
     * Public endpoint: Show a single news article
     */
    public function show($id)
    {
        $article = $this->newsRepository->find($id);

        if (!$article) {
            return response()->json(['message' => MessageConstant::NEWS_NOT_FOUND], 404);
        }

        return response()->json($article);
    }

    /**
     * Admin endpoint: Get list of news articles for management
     */
    public function adminIndex(Request $request)
    {
        if (!$this->checkPermission($request, RolePermissionConstant::PERM_MANAGE_NEWS)) {
            return response()->json(['message' => MessageConstant::GENERAL_UNAUTHORIZED], 401);
        }

        $news = $this->newsRepository->getFilteredNews($request->query('search'));
        return response()->json($news);
    }

    /**
     * Admin endpoint: Create a news article
     */
    public function store(NewsRequest $request)
    {
        if (!$this->checkPermission($request, RolePermissionConstant::PERM_MANAGE_NEWS)) {
            return response()->json(['message' => MessageConstant::GENERAL_UNAUTHORIZED], 401);
        }

        $slug = Str::slug($request->title);
        // Ensure slug uniqueness
        $originalSlug = $slug;
        $count = 1;
        while (News::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        $article = $this->newsRepository->create([
            'title' => $request->title,
            'slug' => $slug,
            'summary' => $request->summary,
            'content' => $request->content,
            'image_url' => $request->image_url ?? 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop',
            'author' => $request->author ?? 'Ban biên tập',
        ]);

        return response()->json([
            'message' => MessageConstant::NEWS_CREATE_SUCCESS,
            'news' => $article
        ], 201);
    }

    /**
     * Admin endpoint: Update a news article
     */
    public function update(NewsRequest $request, $id)
    {
        if (!$this->checkPermission($request, RolePermissionConstant::PERM_MANAGE_NEWS)) {
            return response()->json(['message' => MessageConstant::GENERAL_UNAUTHORIZED], 401);
        }

        $article = $this->newsRepository->find($id);

        if (!$article) {
            return response()->json(['message' => MessageConstant::NEWS_NOT_FOUND], 404);
        }

        $slug = Str::slug($request->title);
        $originalSlug = $slug;
        $count = 1;
        while (News::where('slug', $slug)->where('id', '!=', $id)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        $article->update([
            'title' => $request->title,
            'slug' => $slug,
            'summary' => $request->summary,
            'content' => $request->content,
            'image_url' => $request->image_url ?? $article->image_url,
            'author' => $request->author ?? $article->author,
        ]);

        return response()->json([
            'message' => MessageConstant::NEWS_UPDATE_SUCCESS,
            'news' => $article
        ]);
    }

    /**
     * Admin endpoint: Delete a news article
     */
    public function delete(Request $request, $id)
    {
        if (!$this->checkPermission($request, RolePermissionConstant::PERM_MANAGE_NEWS)) {
            return response()->json(['message' => MessageConstant::GENERAL_UNAUTHORIZED], 401);
        }

        $article = $this->newsRepository->find($id);

        if (!$article) {
            return response()->json(['message' => MessageConstant::NEWS_NOT_FOUND], 404);
        }

        $article->delete();

        return response()->json([
            'message' => MessageConstant::NEWS_DELETE_SUCCESS
        ]);
    }
}
