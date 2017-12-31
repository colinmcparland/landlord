require('./bootstrap');
var googleMapsLoader = require('google-maps');
var main_map_elem = document.getElementsByClassName('map');
var preview_map_elem = document.getElementsByClassName('preview-map');
var googleMapsKey = process.env.MIX_GMAPS_KEY;
var mainmap;
var previewmap;

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
          disableDefaultUI: true,
          styles: [{featureType:"road",elementType:"geometry",stylers:[{lightness:100},{visibility:"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#C6E2FF",}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#C5E3BF"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#D1D1B8"}]}]
        }

        mainmap = new google.maps.Map(main_map_elem[0], options);

        $.when(getPins())
          .then(function(data, textstatus, promise) {
            for(var i = 0; i < data.length; i++) {
              addPin(data[i].location.coordinates, data[i].first_review, data[i].created_at, data[i].first_rating, data[i].location_id);
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

    function addPin(raw_address, review, date, rating, location_id) {
      address = raw_address.replace(' ', '+');
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

          var rating_stars = '<div class="rating-container">';

          //  calculate rating
          for(var i = 0; i < rating; i++) {
            rating_stars += '<span class="glyphicon glyphicon-star rating-star"></span>';
          }

          rating_stars += "</div>";

          var content = '\
            <h4>Recent Reviews for ' + raw_address.split(',')[0] + '</h4>\
            <p><strong>Review on ' + date + '</strong></p>\
            <p>' + review + '</p>\
            '+ rating_stars + '\
            <a class="btn btn-default" role="button" href="/location/' + location_id + '" style="font-size: 12px; margin-top: 12px;">See More Reviews</a>';

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
     * UI animations for the new form button
     */
    $('.menu').mouseenter(function()  {
      $(this).stop();
      $(this).animate({
        width: '150px',
      }, 200, function() {
        $(this).append('<small>New Review</small>');
      });
    });

    $('.menu').mouseleave(function()  {
      $(this).find('small').remove();
      $(this).animate({
        width: '48px',
      }, 100, function() {
        $(this).find('small').remove();
      });
    });


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
      $('.searchbutton').trigger('click');
      return false;
    })
    
    $('.searchbutton').click(function() {
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


    /**
     * Functions for showing preview map when creating new review
     */
    $('#new-review-address').keyup(function() {
      var addr = $(this).val();
      var preview_map = $('.preview-map');

      // Validate map address and submit AJAX request
      var geocoder = new google.maps.Geocoder();
      var dropdown = $('.location-dropdown');
      dropdown.empty();

      geocoder.geocode({
        'address': addr
      }, function(result, status) {
        if(status === google.maps.GeocoderStatus.OK && result.length > 0) {

          dropdown.addClass('show');
          for(var i = 0; i < result.length; i++) {
            dropdown.prepend("<li>" + result[i].formatted_address + "</li>");
          }
        } else {
          dropdown.removeClass('show');
        }
      });
    })

    $('.modal').click(function(e) {
      if($(e.target).attr('id') != 'new-review-address' && !$(e.target).is('li')) {
        $('.location-dropdown').removeClass('show');
      }
    })

    $('body').on('click', '.location-dropdown li', function()  {
      var val = $(this).text();
      $('#new-review-address').val(val);
      $('.location-dropdown').removeClass('show');
    })


  })//  End document ready
})(jQuery);
