let map;

function initMap() {
  mapOpts = {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  }
  map = new google.maps.Map(document.querySelector("#map"), mapOpts);
}
