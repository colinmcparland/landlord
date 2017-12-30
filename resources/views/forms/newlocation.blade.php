@extends('layouts.modal')

@section('id', 'newReviewModal')

@section('title', 'New Review')

@section('content')
<form id="newReviewForm">
  <div class="form-group">
    <label for="new-review-address">Street Adress</label>
    <input type="text" name="new-review-address" id="new-review-address" class="form-control" placeholder="123 Anywhere St, Exampleville, Canada" /> 
  </div>
  <div class="form-group">
    <label for="new-review-rating">Rating</label>
    <select name="new-review-rating" class="form-control" id="new-review-rating">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select> 
  </div>
  <div class="form-group">
    <label for="new-review-content">Review</label>
    <textarea name="new-review-content" class="form-control" rows="5" id="new-review-content"></textarea>
  </div>
</form>
@stop

@section('action', 'Submit')

