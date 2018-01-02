require('./bootstrap');
var googleMapsLoader = require('google-maps');
var main_map_elem = document.getElementsByClassName('map');
var preview_map_elem = document.getElementsByClassName('preview-map');
var googleMapsKey = process.env.MIX_GMAPS_KEY;
googleMapsLoader.KEY = googleMapsKey;
var mainmap;
var previewmap;
var markers = [];


/**
 * Function to add pins to a map
 * @param {Array}   data     Array of marker objects we're to add to the map
 * @param {boolean} openif   If this bit is set, then present the marker open & center to it
 */
function addPins(data, map, openif = null) {

  var address;
  var raw_address;
  var review;
  var date;
  var rating ;
  var location_id;

  for(var i = 0; i < data.length; i++) {

    raw_address = data[i].location.coordinates;

    address = raw_address.replace(new RegExp(' ', 'g'), '+');

    getLatLong(address, data[i]).then(function(value, curr_data) {

      raw_address = curr_data.location.coordinates;
      review = curr_data.first_review;
      date = curr_data.created_at; 
      rating = curr_data.first_rating;
      location_id = curr_data.location_id;

      address = raw_address.replace(new RegExp(' ', 'g'), '+');

      var latlong = {
        lat: value.results[0].geometry.location.lat, 
        lng: value.results[0].geometry.location.lng
      };

      var marker = new google.maps.Marker({
        position: latlong,
        title: value.results[0].formatted_address
      });

      var infowindow = makeInfoWindow(rating, raw_address, date, review, location_id);

      marker.addListener('click', function() {
        infowindow.open(mainmap, marker);
      });

      markers.push(marker);

      if(map == 'mainmap') {
        marker.setMap(mainmap);
      } else {
        marker.setMap(previewmap);
      }

      if(openif == value.results[0].formatted_address) {
        new google.maps.event.trigger(marker, 'click');
        mainmap.setCenter(latlong);
        mainmap.setZoom(15);
      }
    })
  } 
}

/**
 * Function to build a map, which involves getting all the pins and placing them.
 * @param  {Object} map    The global variable representing the map
 * @param  {Object} elem   The HTML element that will hold the map
 * @param  {Object} center The lat and long of the center
 * @param  {int} zoom      The desired zoom for the map 
 * @return {null}        
 */
function buildMap(map, elem, center, zoom) {

  /*
  Set the options for the map we're going to intialize
   */
  
  var options = {
    center: center,
    zoom: zoom,
    disableDefaultUI: true,
    styles: [{featureType:"road",elementType:"geometry",stylers:[{lightness:100},{visibility:"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#C6E2FF",}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#C5E3BF"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#D1D1B8"}]}]
  }

  /*
  Initialize the map
   */
    
  googleMapsLoader.load(function(google) {

    //  Theres gotta be a better way to do this...
    if(map == 'mainmap') {
      mainmap = new google.maps.Map(elem, options);
    } else {
      previewmap = new google.maps.Map(elem, options);
    }

    /*
    If we have a search query, populate the search bar and center the map
     */
     
    var args = getURLArgs();

    if(args[0] == 'q') {
      $('.search-bar').val(urlargs[1].replace(new RegExp('\\+', 'g'), ' ')); 
      $('.searchbutton').trigger('click');
    }

    /*
    Fetch the pins async, when done place them on the map.
     */
    
    $.when(getPins())
      .then(function(data, textstatus, promise) {
        addPins(data, map);
      })
  });

}


/**
 * Function to fetch all the existing pins from the server.
 * @return {Array} An array of Marker objects
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


function getLatLong(address, data = null) {
  var deferred = $.Deferred();

  $.ajax({
    type: 'GET',
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + googleMapsKey,
    success: function(msg) {
      deferred.resolve(msg, data);
    },
    error: function(err) {
      deferred.reject(err);
    } 
  })

  return deferred.promise();
}


function makeInfoWindow(rating, raw_address, date, review, location_id) {

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
    <a class="btn btn-default" role="button" href="/location/' + location_id + '" style="font-size: 12px; margin-top: 12px;">See More Reviews</ a>';
  
  var infowindow = new google.maps.InfoWindow({
    content: content
  })

  return infowindow;
}



/**
 * Function to check for URL arguments, currently only for the 'q' argument
 * @return {Array} Array of the URL arguments, seperated by '='
 */
function getURLArgs() {

  var urlargs = location.href.split('?');

  if(urlargs.length > 1 && $('.map').length) {
    urlargs = urlargs[1].split('=');
    return urlargs;
  } else {
    return 1;
  }
}




/**
 * Main function
 */


(function($) {
  $(document).ready(function()  {

    //  Init homepage map
    if($('.map').length) {

      navigator.geolocation.getCurrentPosition(function(position) {

        var center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        buildMap('mainmap', main_map_elem[0], center, 13);

      }, function(error) {

        showAlert('warning', 'You have geolocation turned off, so we will start you off in Toronto.  You can browse to any city by using the search bar above.');

        var center = {
          lat: 43.6532,
          lng: -79.3832
        }

        buildMap('mainmap', main_map_elem[0], center, 13);

      });
    }

    //  Init locations page map
    if($('.preview-map').length) {

      var addr = $('.addr').text().replace(new RegExp(' ', 'g'), '+');

      getLatLong(addr).then(function(msg) {

        var center = {
          lat: msg.results[0].geometry.location.lat, 
          lng: msg.results[0].geometry.location.lng
        };

        buildMap('previewmap', preview_map_elem[0], center, 15);

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

                if($('.single-location').length) {
                  $('#newReviewModal').modal('hide');
                  showAlert('success', 'Review successfully added!');
                } else {
                  for(var i = 0; i<markers.length; i++) {
                    markers[i].setMap(null);
                  }

                  $.when(getPins())
                    .then(function(data, textstatus, promise) {

                      //  Empty the marker array
                      markers = [];

                      addPins(data, 'mainmap', addr);

                      $('#newReviewModal').modal('hide');

                      showAlert('success', 'Review successfully added!');
                  })
                }
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
    $('.modal .rating-star').click(function()  {
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

      if($('.single-location').length) {
        location.href = location.origin + '/?q=' + $('.search-bar').val().replace(new RegExp(' ', 'g'), '+').replace(new RegExp(',', 'g'), '');
      } else {
        $('.searchbutton').trigger('click');
      }
      
      return false;
    })
    
    $('.searchbutton').click(function() {

      if($('.single-location').length) {
        location.href = location.origin + '/?q=' + $('.search-bar').val().replace(new RegExp(" ", "g"), '+').replace(new RegExp(',', "g"), '');
      }

      var addr = $('.search-bar').val();

      if(addr == '') {
        return false;
      } else {
        getLatLong(addr).then(function(msg) {
          var lat = msg.results[0].geometry.location.lat;
          var long = msg.results[0].geometry.location.lng;
          var latLng = new google.maps.LatLng(lat, long);
          mainmap.setCenter(latLng);
          mainmap.setZoom(15);
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
      }, 10000);
    }


    /**
     * Functions for showing preview map when creating new review
     */
    $('#new-review-address').keyup(function() {
      var addr = $(this).val();

      // Validate map address and submit AJAX request
      var geocoder = new google.maps.Geocoder();
      var dropdown = $('.modal .location-dropdown');
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

    $('body').on('click', '.modal .location-dropdown li', function()  {
      var val = $(this).text();
      $('#new-review-address').val(val);
      $('.location-dropdown').removeClass('show');
    })

    /**
     * Predictive search for homepage
     */
    
    /**
     * Functions for showing preview map when creating new review
     */
    $('.search-bar').keyup(function() {
      var addr = $(this).val();

      // Validate map address and submit AJAX request
      var geocoder = new google.maps.Geocoder();
      var dropdown = $('#searchform .location-dropdown');

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

    $('.map, .single-location').click(function(e) {
      if($(e.target).attr('id') != 'new-review-address' && !$(e.target).is('li')) {
        $('.location-dropdown').removeClass('show');
      }
    })

    $('body').on('click', '#searchform .location-dropdown li', function()  {
      var val = $(this).text();
      $('.search-bar').val(val);
      $('.location-dropdown').removeClass('show');
      $('.searchbutton').trigger('click');
    })


  })//  End document ready
})(jQuery);
