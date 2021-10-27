let map;



function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAAdMnbeugzorXUqv735wPfnaSTt4qFWvs&callback=initMap';
script.async = true;

window.addEventListener('DOMContentLoaded', () => {
  initMap();
});

document.head.appendChild(script)
