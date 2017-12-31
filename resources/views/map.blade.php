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
    <div class="search">
      <form id="searchform">
        <div class="input-group">
            <input type="text" class="form-control search-bar" aria-describedby="searchbutton" />
            <span class="input-group-addon" id="searchbutton"><span class='glyphicon glyphicon-search'></span> Search Address</span>
        </div>
      </form>
    </div>
    <button type="button" class="menu btn btn-primary" data-toggle="modal" data-target="#newReviewModal">
      + Add a Review
    </button>
  </div>
  <div class="map"></div>
  @include('forms.newlocation')
</body>
</html>