let map;
let location;

window.addEventListener('DOMContentLoaded', () => {
  initMap();
  locator();
});

async function locator() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((p) => {
      location = await {
        lat: p.coords.latitude,
        lng: p.coords.longitude,
      };
    initMap(location);
    });
}

function initMap(usr) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: usr,
    zoom: 14,
  });
}

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAAdMnbeugzorXUqv735wPfnaSTt4qFWvs&callback=initMap';
script.async = true;

document.head.appendChild(script)
