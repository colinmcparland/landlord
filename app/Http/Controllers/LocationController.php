<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Location;
use App\Review;

class LocationController extends Controller
{
  function getAllLocations() {
    $locations = Location::all();
    $ret = [];

    foreach($locations as $location) {
      $firstreview = Review::where('location_id', $location->id)->orderBy('created_at', 'desc')->first();
      array_push($ret, ['first_review' => $firstreview->content, 'created_at' => $firstreview->created_at->format('d M, Y'), 'location' => $location, 'first_rating' => $firstreview->rating, 'location_id' => $location->id]);
    }

    return response()->json($ret);
  }
}
