<?php

namespace App\Http\Controllers;
use App\Review;
use App\Location;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\DeleteReview;
use Storage;

use Illuminate\Http\Request;

class ReviewController extends Controller
{
  function addReview(Request $req) {
    $address = $req->input('address');
    $rating = $req->input('rating');
    $content = $req->input('content');
    $email = $req->input('email');

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

    //  Generate a unique delete key
    $key = str_random(15);

    $checkreview = Review::where('delete_link', $key)->first();

    if($checkreview != null) {
      return response()->json('Error:  Delete key already exists');
    }

    //  Create the new review
    $newreview = new Review;
    $newreview->delete_link = $key;
    $newreview->content = $content;
    $newreview->rating = $rating;
    $newreview->location_id = $newlocation->id;
    $newreview->email = $email;
    $newreview->save();

    //  Send the creator an email
    $star = Storage::url('star.png');
    
    $mail = Mail::to($email)->send(new DeleteReview($key, $rating, $content, $address, $star));

    return response()->json(0);
  }

}
