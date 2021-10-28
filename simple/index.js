let map;
let local;

window.addEventListener('DOMContentLoaded', () => {
  locator();
  initMap();
});

function locator() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((p) => {
      local = {
        lat: p.coords.latitude,
        lng: p.coords.longitude,
      };
    });
  }
}

function initMap() {
  debugger;
  map = new google.maps.Map(document.getElementById("map"), {
    center: local,
    zoom: 14,
  });
}

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDLgwI8A-l0MY0LxZSdUcPJZgsFSYSKG78&callback=initMap';
script.async = true;

document.head.appendChild(script)
