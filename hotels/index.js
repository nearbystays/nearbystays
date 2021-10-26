let map;
let place;
let autocomplete;
let markers = new Array();
let infoWindow;
const h = new RegExp("^https?://.+?/");

document.addEventListener('DOMContentLoaded', function(e) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((p) => {
      const pos = {
        lat: p.coords.latitude,
        lng: p.coords.longitude
      };
      initMap(pos);
    })
  } else {
    alert("Geolocation Not Available");
  }
})

// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAAdMnbeugzorXUqv735wPfnaSTt4qFWvs&callback=initMap';
script.async = true;

// Attach your callback function to the `window` object
window.initMap = function(pos) {
  // JS API is loaded and available
  map = new google.maps.Map(document.getElementById("map"), {
    center: pos, 
    zoom: 14,
    });
};

// Append the 'script' element to 'head'
document.head.appendChild(script);
