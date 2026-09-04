<?php

use Webman\Route;
use app\controller\HomeController;
use app\controller\admin\AuthController as AdminAuthController;
use app\controller\admin\InformationController;
use app\controller\admin\PortfolioController;
use app\controller\admin\RepositoryController;
use app\controller\api\PublicController;
use app\controller\api\AuthController as ApiAuthController;
use app\controller\api\AdminController as ApiAdminController;
use app\middleware\AdminAuth;
use app\middleware\Cors;

Route::options('/{any:.*}', function () {
    return response('');
});

// ===== API v1 (JSON) =====
Route::group('/api', function () {
    Route::get('/home', [PublicController::class, 'home']);
    Route::get('/informasi', [PublicController::class, 'informasi']);
    Route::get('/info/{id}', [PublicController::class, 'infoShow']);
    Route::get('/portofolio', [PublicController::class, 'portofolio']);
    Route::get('/portofolio/{id}', [PublicController::class, 'portofolioShow']);
    Route::get('/tentang', [PublicController::class, 'tentang']);
    Route::post('/views', [PublicController::class, 'viewIncrement']);
    Route::get('/views', [PublicController::class, 'viewCount']);

    Route::post('/auth/login', [ApiAuthController::class, 'login']);
    Route::get('/auth/check', [ApiAuthController::class, 'check']);
    Route::get('/auth/logout', [ApiAuthController::class, 'logout']);

    Route::get('/admin/informasi', [ApiAdminController::class, 'infoIndex']);
    Route::post('/admin/informasi/store', [ApiAdminController::class, 'infoStore']);
    Route::post('/admin/informasi/update/{id}', [ApiAdminController::class, 'infoUpdate']);
    Route::post('/admin/informasi/delete/{id}', [ApiAdminController::class, 'infoDelete']);

    Route::get('/admin/portofolio', [ApiAdminController::class, 'portfolioIndex']);
    Route::post('/admin/portofolio/store', [ApiAdminController::class, 'portfolioStore']);
    Route::post('/admin/portofolio/update/{id}', [ApiAdminController::class, 'portfolioUpdate']);
    Route::post('/admin/portofolio/delete/{id}', [ApiAdminController::class, 'portfolioDelete']);

    Route::get('/admin/repository', [ApiAdminController::class, 'repoIndex']);
    Route::post('/admin/repository/store', [ApiAdminController::class, 'repoStore']);
    Route::post('/admin/repository/update/{id}', [ApiAdminController::class, 'repoUpdate']);
    Route::post('/admin/repository/delete/{id}', [ApiAdminController::class, 'repoDelete']);
    Route::post('/admin/repository/import', [ApiAdminController::class, 'repoImport']);
})->middleware([Cors::class]);

// ===== ADMIN LOGIN (bisa via /backend atau /admin/login) =====
Route::get('/backend', [AdminAuthController::class, 'loginForm']);
Route::post('/backend', [AdminAuthController::class, 'login']);
Route::get('/admin/login', [AdminAuthController::class, 'loginForm']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::get('/admin/logout', [AdminAuthController::class, 'logout']);

// ===== ADMIN DASHBOARD (HTML views) =====
Route::group('/admin', function () {
    Route::get('', [InformationController::class, 'index']);
    Route::get('/create', [InformationController::class, 'create']);
    Route::post('/store', [InformationController::class, 'store']);
    Route::get('/edit/{id}', [InformationController::class, 'edit']);
    Route::post('/update/{id}', [InformationController::class, 'update']);
    Route::post('/delete/{id}', [InformationController::class, 'delete']);

    Route::get('/portofolio', [PortfolioController::class, 'index']);
    Route::get('/portofolio/create', [PortfolioController::class, 'create']);
    Route::post('/portofolio/store', [PortfolioController::class, 'store']);
    Route::get('/portofolio/edit/{id}', [PortfolioController::class, 'edit']);
    Route::post('/portofolio/update/{id}', [PortfolioController::class, 'update']);
    Route::post('/portofolio/delete/{id}', [PortfolioController::class, 'delete']);

    Route::get('/repository', [RepositoryController::class, 'index']);
    Route::get('/repository/create', [RepositoryController::class, 'create']);
    Route::post('/repository/store', [RepositoryController::class, 'store']);
    Route::get('/repository/edit/{id}', [RepositoryController::class, 'edit']);
    Route::post('/repository/update/{id}', [RepositoryController::class, 'update']);
    Route::post('/repository/delete/{id}', [RepositoryController::class, 'delete']);
    Route::post('/repository/import', [RepositoryController::class, 'import']);
})->middleware([AdminAuth::class]);

// ===== CATCH-ALL: SEMUA ROUTE LAIN → SPA (WAJIB DI PALING BAWAH) =====
Route::get('/{any:.*}', [HomeController::class, 'index']);
// Route::fallback([HomeController::class, 'index']);
