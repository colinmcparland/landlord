require('./bootstrap');
var googleMapsLoader = require('google-maps');
var map_elem = document.getElementsByClassName('map');
var googleMapsKey = process.env.MIX_GMAPS_KEY;
var mainmap;

(function($) {
  $(document).ready(function()  {

    /*
    Begin Google Maps configuration
     */
    googleMapsLoader.KEY = googleMapsKey;

    navigator.geolocation.getCurrentPosition(function(position) {

      googleMapsLoader.load(function(google) {

        //  Center the map and add markers

        var center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        var options = {
          center: center,
          zoom: 13,
          disableDefaultUI: true
        }

        mainmap = new google.maps.Map(map_elem[0], options);

        $.when(getPins())
          .then(function(data, textstatus, promise) {
            for(var i = 0; i < data.length; i++) {
              addPin(data[i].location.coordinates, data[i].first_review, data[i].created_at);
            }
          })

      });

    })

    /*
    End Google Maps config
     */
    

    /**
     * Get all the pins and place them on the map.
     */
    
    function getPins() {
        return $.ajax({
          type: 'GET',
          url: '/api/location',
          success: function(msg) {
            return msg;
          },
          error: function(err) {
            console.log(err.responseJSON);
          }
        });
    }

    function addPin(address, review, date) {
      address = address.replace(' ', '+');
      $.ajax({
        type: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + googleMapsKey,
        success: function(msg) {
          var lat = msg.results[0].geometry.location.lat;
          var long = msg.results[0].geometry.location.lng;
          var latlong = {lat: lat, lng: long};

          var marker = new google.maps.Marker({
            position: latlong,
            title: msg.results[0].formatted_address
          });

          var content = '<strong>Review on ' + date + '</strong><p>' + review + '</p>';

          var infowindow = new google.maps.InfoWindow({
            content: content
          })

          marker.addListener('click', function() {
            infowindow.open(mainmap, marker);
          });

          marker.setMap(mainmap);
        },
        error: function(err) {

        }
      })
    }


    /**
     * New review submit actions
     */
    $('#newReviewModal .action-btn').click(function() {
      $('#newReviewForm .err-text').remove();
      $('#newReviewForm').submit();
    })

    $('#newReviewForm').submit(function(e) {
      e.preventDefault();

      var addr = $(this).find('#new-review-address').val();
      var rating = $(this).find('#new-review-rating').val();
      var content = $(this).find('#new-review-content').val();


      //  Validate review
      if(content.length == 0) {
        showError('#new-review-content', 'You forgot to write your review!');
        return false;
      }

      // Validate map address and submit AJAX request
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({
        'address': addr
      }, function(result, status) {

        if(status === google.maps.GeocoderStatus.OK && result.length > 0) {
          addr = result[0].formatted_address;

          $.ajax({
            type: 'POST',
            url: '/api/review/add',
            data: {
              address: addr,
              rating: rating,
              content: content
            },
            success: function(msg) {
              if(msg == 0) {
                $('#newReviewModal').modal('hide');
                showAlert('success', 'Review successfully added!');

              }
            },
            error: function(err) {
              console.log(err.responseJSON);
            }
          })

        } else {
          showError('#new-review-address', 'Please enter a valid street address.');
        }
      });

    })


    /**
     * When a review star is clicked, populate the value of the hidden input and do an animation.
     */
    $('.rating-star').click(function()  {
      var rating = $(this).index() + 1;

      $('#new-review-rating').val(rating);

      if($(this).hasClass('glyphicon-star-empty')) {
        for(var i = 0; i <= rating; i++) {
          $('.rating-star:nth-child(' + i + '):not(.glyphicon-star)').toggleClass('glyphicon-star-empty glyphicon-star');
        }
      } else {
        for(var i = 5; i > rating; i--) {
          $('.rating-star:nth-child(' + i + '):not(.glyphicon-star-empty)').toggleClass('glyphicon-star glyphicon-star-empty');
        }        
      }
    })


    /**
     * When the search button is clicked, center the map at the location.
     */
    
    $('#searchform').submit(function(e) {
      e.preventDefault();
      $('#searchbutton').trigger('click');
      return false;
    })
    
    $('#searchbutton').click(function() {
      var addr = $('.search-bar').val();

      if(addr == '') {
        return false;
      } else {
        $.ajax({
          type: 'GET',
          url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addr + '&key=' + googleMapsKey,
          success: function(msg) {
            var lat = msg.results[0].geometry.location.lat;
            var long = msg.results[0].geometry.location.lng;
            var latLng = new google.maps.LatLng(lat, long);
            mainmap.setCenter(latLng);
            mainmap.setZoom(13);
          },
          error: function(err) {
            console.log(err);
          }
        }) 
      }
    })

    /**
     * General form utility functions
     */

    function showError(target, msg) {
      var errmsg = '<small style="color: red;" class="form-text text-muted err-text">' + msg + '</small>';
      $(errmsg).insertAfter($(target));
    }

    function showAlert(type, msg) {
      var alert = '<div class="alert alert-' + type + '" role="alert">' + msg + '</div>';
      $('body').prepend(alert);
      setTimeout(function(){
        $('.alert').fadeOut(function()  {
          $('.alert').remove();
        });
      }, 5000);
    }


  })//  End document ready
})(jQuery);
