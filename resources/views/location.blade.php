@extends('layouts.base')

@section('title', '- Location Details')

@section('content')
<div class="single-location">
  <div class="preview-map"></div>
  <ol class="breadcrumb">
    <li><a href="/">Home</a></li>
    <li class='active'>Reviews for {{ explode(',', $location->coordinates)[0] }}</li>
  </ol>
  <div class="reviews-container content">
    <h1>Reviews for <span class='addr'>{{ $location->coordinates }}</span></h1>
    <p class="avg-rating"><small>Average rating: 
    @for($i = 0; $i < $avg; $i++)
      <span class="glyphicon glyphicon-star rating-star"></span>
    @endfor
    </small></p>
    @for ($i = 0; $i < sizeof($reviews); $i++)
      <div class="single-review">
        <p><strong>Review on {{ $reviews[$i]->created_at->format('d M, Y') }}</strong></p>
        <p>{{ $reviews[$i]->content }}</p>
        @for($j = 0; $j < $reviews[$i]->rating; $j++)
        <span class="glyphicon glyphicon-star rating-star"></span>
        @endfor
      </div>
    @endfor
  </div>
</div>
@stop