@extends('layouts.modal')

@section('id', 'newReviewModal')

@section('title', 'New Review')

@section('modal-content')
<form id="newReviewForm">
  <div class="form-group">
    <label for="new-review-address">Street Address</label>
    <input type="text" name="new-review-address" id="new-review-address" class="form-control" placeholder="123 Anywhere St, Exampleville, Canada" /> 
    <ul class="dropdown-menu location-dropdown"></ul>
  </div>
  <div class="form-group">
    <label for="new-review-rating">Rating</label>
    <input type="hidden" name="new-review-rating" class="form-control" id="new-review-rating" value="0">
  
    <div class="rating-container">
      @for ($i = 0; $i < 5; $i++)
        <span class="glyphicon glyphicon-star-empty rating-star" aria-hidden="true"></span>
      @endfor
    </div>

  </div>
  <div class="form-group">
    <label for="new-review-content">Review</label>
    <textarea name="new-review-content" class="form-control" rows="5" id="new-review-content"></textarea>
  </div>
</form>
@stop

@section('action', 'Submit')

