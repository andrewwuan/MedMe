angular.module('MedMe', [
  'ngRoute',
  'mobile-angular-ui',
  'MedMe.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false});
  $routeProvider.when('/search', {templateUrl:'search.html', reloadOnSearch: false});
});

var hospitals = [
  {"ST MARY'S MEDICAL CENTER": {
    "wait_time": "14",
    "phone": "415-668-1000",
    "address": "450 Stanyan St, San Francisco, CA 94117",
    "lat": "37.77416",
    "lon": "-122.45359"
  }},
  {"CHINESE HOSPITAL": {
    "wait_time": "20",
    "phone": "415-982-2400",
    "address": "845 Jackson St, San Francisco, CA 94117",
    "lat": "37.79552",
    "lon": "-122.40919"
  }},
  {"CALIFORNIA PACIFIC MEDICAL CTR-DAVIES CAMPUS HOSP": {
    "wait_time": "21",
    "phone": "415-600-6000",
    "address": "601 Duboce Ave, San Francisco, CA 94117",
    "lat": "37.76824",
    "lon": "-122.43459"
  }},
  {"CALIFORNIA PACIFIC MEDICAL CTR-PACIFIC CAMPUS HOSP": {
    "wait_time": "24",
    "phone": "415-600-6000",
    "address": "2333 Buchanan Street, San Francisco, CA 94117",
    "lat": "37.79084",
    "lon": "-122.43127"
  }},
  {"CALIFORNIA PACIFIC MEDICAL CTR - ST. LUKE'S CAMPUS": {
    "wait_time": "38",
    "phone": "415-641-6562",
    "address": "3555 Cesar Chavez Street, San Francisco, CA 94117",
    "lat": "37.74766",
    "lon": "-122.42070"
  }}
]


function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var geocoder;
var map;
function initMap() {
  var location = getParameterByName('location');
  var lat = getParameterByName('lat');
  var lng = getParameterByName('lng');

  if (lat == '' || lng == '') {
    lat = '37.779206';
    lng = '-122.396250';
  }
  lat = parseFloat(lat);
  lng = parseFloat(lng);

  // Create a geocoder
  geocoder = new google.maps.Geocoder();

  codeAddress(lat, lng);

  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng: lng},
    scrollwheel: false,
    zoom: 11
  });

  var container = document.getElementById("search-list-container");

  for (var i = 0; i < hospitals.length; i++) {
    var hospital = hospitals[i];

    for (var hospitalName in hospital) {
      // Drop markers on the map
      addMarker({lat: parseFloat(hospital[hospitalName].lat), lng: parseFloat(hospital[hospitalName].lon)},
        map, (i+1).toString());

      // Add list items to the page
      var hospitalNode = document.createElement("div");
      hospitalNode.setAttribute("class", "list-group-item list-group-item-home");

      var waitTimeNode = document.createElement("div");
      var waitTimeText = document.createElement("i");
      waitTimeText.setAttribute("class", "text-primary");
      waitTimeText.textContent = hospital[hospitalName].wait_time + " minutes";
      waitTimeNode.appendChild(waitTimeText);
      hospitalNode.appendChild(waitTimeNode);

      var hospitalInfoNode = document.createElement("div");
      var hospitalNameText = document.createElement("h3");
      hospitalNameText.setAttribute("class", "home-heading center-block hospital-name");
      hospitalNameText.textContent = (i+1) + ". " + hospitalName;
      hospitalInfoNode.appendChild(hospitalNameText);
      var hospitalPhone = document.createElement("p");
      hospitalPhone.textContent = hospital[hospitalName].phone;
      hospitalInfoNode.appendChild(hospitalPhone);
      var hospitalAddress = document.createElement("p");
      hospitalAddress.textContent = hospital[hospitalName].address;
      hospitalInfoNode.appendChild(hospitalAddress);
      hospitalNode.appendChild(hospitalInfoNode);

      container.appendChild(hospitalNode);
    }
  }
}

function codeAddress(lat, lng) {
  var latlon = new google.maps.LatLng(lat, lng);
  geocoder.geocode( { 'location': latlon }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var address = results[0].formatted_address;
      console.log(address);
      $("#search-input").val(address);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

// Adds a marker to the map.
function addMarker(location, map, label) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: label,
    map: map
  });
}

$(document).ready(function() {
  // Bind action to buttons
  $("#search-er-button").click(function() {
    var location = $("#search-er-input").val();
    window.location.href = "#/search?location=" + location;
  });

  $("#my-position,#find-er-now-button").click(function() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

        window.location.href = "#/search?lat=" + position.coords.latitude +
          "&lng=" + position.coords.longitude;
      }, function() {
        alert("Can't get your current location.");
      });
    } else {
      // Browser doesn't support Geolocation
      alert("Your browser doesn't support location.");
    }
  })
});
