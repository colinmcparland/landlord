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

Route::get('/emailpreview', function()  {
  return view('emails.deletereview', ['address' => '123 Fake St', 'rating' => 5, 'review_content' => 'Sample review!!!!!!!!!!', 'delete_link' => '1', 'star' => Storage::url('star.png')]);
});

Route::get('/location/{id}', function ($id) {
    $reviews = Review::where('location_id', $id)->orderBy('created_at', 'desc')->get();
    $location = Location::where('id', $id)->first();
    $average_rating = 0;

    if($location == null) {
      return view('404', ['title' => 'Location Not Found', 'message' => "The location you're trying to find does not exist or has been deleted."]);
    }

    foreach($reviews as $review) {
      $average_rating += $review->rating;
    }

    $average_rating = $average_rating / sizeof($reviews);

    return view('location', ['reviews' => $reviews, 'location' => $location, 'avg' => $average_rating]);
});

Route::get('/delete/{id}', function($id) {
  $review = Review::where('delete_link', $id)->first();
  $star;

  if($review == null) {
    return view('404', ['title' => 'Delete Review', 'message' => "The review you're trying to delete does not exist or has already been deleted."]);
  }
  else {
    $review->delete();
    return view('404', ['title' => 'Delete Review', 'message' => "Review successfully deleted."]);
  }

});
