require('./bootstrap');
var googleMapsLoader = require('google-maps');
var map_elem = document.getElementsByClassName('map');
var googleMapsKey = process.env.MIX_GMAPS_KEY;

(function($) {
  $(document).ready(function()  {

    /*
    Begin Google Maps configuration
     */
    googleMapsLoader.KEY = googleMapsKey;

    navigator.geolocation.getCurrentPosition(function(position) {

      googleMapsLoader.load(function(google) {

        var center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        var options = {
          center: center,
          zoom: 13,
          disableDefaultUI: true
        }

        var map = new google.maps.Map(map_elem[0], options);

        var marker_options = {
          position: center,
          map: map
        };

        var marker = new google.maps.Marker(marker_options);
      });

    })

    /*
    End Google Maps config
     */
    


    /**
     * Form submits etc..
     */
    $('#newReviewModal .action-btn').click(function() {
      $('#newReviewForm .err-text').remove();
      $('#newReviewForm').submit();
    })

    $('#newReviewForm').submit(function(e) {
      e.preventDefault();

      var addr = $(this).find('#new-review-address').val();
      var rating = $(this).find('#new-review-rating').val();
      var review = $(this).find('#new-review-content').val();


      //  Validate review
      if(review.length == 0) {
        showError('#new-review-content', 'You forgot to write your review!');
        return false;
      }

      // Validate map address and submit AJAX request
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({
        'address': addr
      }, function(result, status) {
        console.log(status);
        if(status === google.maps.GeocoderStatus.OK && result.length > 0) {
          addr = result[0].formatted_address;

          $.ajax({
            type: 'POST',
            url: '/api/review/add',
            data: {
              address: addr,
              rating: rating,
              review: review
            },
            success: function(msg) {
              console.log(msg);
            },
            error: function(err) {
              console.log(err);
            }
          })

        } else {
          showError('#new-review-address', 'Please enter a valid street address.');
        }
      });

    })

    function showError(target, msg) {
      console.log(msg);
      var errmsg = '<small style="color: red;" class="form-text text-muted err-text">' + msg + '</small>';
      $(errmsg).insertAfter($(target));
    }


  })//  End document ready
})(jQuery);
