let map;
let local;
let script;

window.addEventListener('DOMContentLoaded', () => {
  addScript();
  locator()
});

function locator() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((p) => {
      local = {
        lat: p.coords.latitude,
        lng: p.coords.longitude,
      };
      initMap(local);
    });
  }
}

function addScript() {
  script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDLgwI8A-l0MY0LxZSdUcPJZgsFSYSKG78&callback=initMap';
  script.async = true;
  document.head.appendChild(script)
}

function initMap(posit) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: posit,
    zoom: 14,
  });
}

