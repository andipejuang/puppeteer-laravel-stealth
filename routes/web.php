<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ScreenshotController;
use App\Http\Controllers\PuppeteerController;
Route::get('/', function () {
    return view('welcome');
});
Route::post('/capture-screenshot', [ScreenshotController::class, 'capture']);
Route::get('/screenshot', function () {
    return view('screenshot');
});
Route::get('/screenshotpp', [PuppeteerController::class, 'generateScreenshot']);
