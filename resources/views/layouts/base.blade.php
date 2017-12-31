<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{csrf_token()}}">
  <title>Landlord @yield('title')</title>
  <link href="{{ asset('css/app.css') }}" rel="stylesheet">
  <script src="{{ asset('js/main.js') }}"></script>
</head>
<body>
  <div class="nav">
    <div class="search">
      <form id="searchform">
        <input type="text" placeholder="Search Landlord Reviews by Address" class="form-control search-bar" aria-describedby="searchbutton" />
        <ul class="dropdown-menu location-dropdown"></ul>
        <span class="glyphicon glyphicon-search searchbutton"></span>
      </form>
    </div>
    <button type="button" class="menu btn btn-primary" data-toggle="modal" data-target="#newReviewModal">
      +
    </button>
  </div>
  @yield('content')
  @include('forms.newlocation')
  <div class="logo">LAND<br />LORD<br /><small>beta</small></div>
</body>
</html>