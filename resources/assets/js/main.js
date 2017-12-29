var googleMapsLoader = require('google-maps');
var map_elem = document.getElementsByClassName('map');
var googleMapsKey = process.env.MIX_GMAPS_KEY;

document.addEventListener("DOMContentLoaded", function(event) {

  googleMapsLoader.KEY = googleMapsKey;

  navigator.geolocation.getCurrentPosition(function(position) {

    googleMapsLoader.load(function(google) {

      var center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      var options = {
        center: center,
        zoom: 13
      }

      var map = new google.maps.Map(map_elem[0], options);

      var marker_options = {
        position: center,
        map: map
      };

      var marker = new google.maps.Marker(marker_options);
    });

  })

});