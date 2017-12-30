<?php

namespace App\Http\Controllers;
namespace App\Review;

use Illuminate\Http\Request;

class ReviewController extends Controller
{
  function addReview(Request $req) {
    $address = $req->input('new-review-address');
    $rating = $req->input('new-review-rating');
    $content = $req->input('new-review-content');



    return response()->json(['Hello world!']);
  }
}
