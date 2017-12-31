<?php

use \App\Review;
use \App\Location;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('map');
});

Route::get('/location/{id}', function ($id) {
    $reviews = Review::where('location_id', $id)->orderBy('created_at', 'desc')->get();
    $location = Location::where('id', $id)->first();
    $average_rating = 0;

    foreach($reviews as $review) {
      $average_rating += $review->rating;
    }

    $average_rating = $average_rating / sizeof($reviews);

    return view('location', ['reviews' => $reviews, 'location' => $location, 'avg' => $average_rating]);
});
