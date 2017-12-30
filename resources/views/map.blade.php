<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{csrf_token()}}">
  <title>Landlord</title>
  <link href="{{ asset('css/app.css') }}" rel="stylesheet">
  <script src="{{ asset('js/main.js') }}"></script>
</head>
<body>
  <div class="nav">
    <div class="logo"></div>
    <button type="button" class="menu btn btn-primary" data-toggle="modal" data-target="#newReviewModal">
      + Add a Review
    </button>
  </div>
  <div class="map"></div>
  @include('forms.newlocation')
</body>
</html>