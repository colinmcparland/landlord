<?php

namespace App\Http\Controllers;
use App\Review;
use App\Location;

use Illuminate\Http\Request;

class ReviewController extends Controller
{
  function addReview(Request $req) {
    $address = $req->input('address');
    $rating = $req->input('rating');
    $content = $req->input('content');

    //  Get the location we want to use for this review.  Create one if one doesnt already exist.
    $checklocation = Location::where('coordinates', $address)->first();
    $newlocation;

    if($checklocation == null) {
      $newlocation = new Location;
      $newlocation->coordinates = $address;
      $newlocation->save();
    }
    else {
      $newlocation = $checklocation;
    }

    //  Create the new review
    $newreview = new Review;
    $newreview->content = $content;
    $newreview->rating = $rating;
    $newreview->location_id = $newlocation->id;
    $newreview->save();

    return response()->json(0);
  }
}
