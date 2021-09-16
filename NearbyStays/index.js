let map;

function initMap() {
  mapOpts = {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  };
  const mapId = document.querySelector("#map");
  map = new google.maps.Map(mapId, mapOpts);
}
