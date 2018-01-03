<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{csrf_token()}}">
  <title>Rate my Space @yield('title')</title>
  <link href="{{ asset('css/app.css') }}" rel="stylesheet">
  <script src="{{ asset('js/main.js') }}"></script>
</head>
<body>
  <div class="nav">
    <div class="search">
      <form id="searchform">
        <input type="text" placeholder="Search Rental Property Reviews by Address" class="form-control search-bar" aria-describedby="searchbutton" />
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
  <div class="logo"><span>RATE</span><small style="margin: 10px 0;">MY</small><span>SPACE</span><small style="font-size: 14px; color: #efefef;">beta</small></div>
  <footer>
    <div class="footer">
      
    </div>
  </footer>
</body>
</html>