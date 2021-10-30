let script;
let autocomplete;

window.addEventListener('DOMContentLoaded', () => {
  addScript();
  locator();
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
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDLgwI8A-l0MY0LxZSdUcPJZgsFSYSKG78&callback=initMap&libraries=places&v=3.46';
  script.async = true;
  document.head.appendChild(script)
}

function initMap(posit) {
  const mapId = document.getElementById("map");
  const mapOpts = {
    center: posit,
    zoom: 14,
    mapTypeControl: false,
  };
  const map = new google.maps.Map(mapId, mapOpts);
  const card = document.getElementById("pac-card");
  const input = document.getElementById("pac-input");

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(card);

  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.setFields = ['formatted_address', 'geometry', 'name', 'photos'];
  autocomplete.types = ['lodging'];
  autocomplete.strictBounds = false;

  autocomplete.bindTo('bounds', map);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  const marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(1, -30),
    title: place.name,
    icon: place.photos[0].getUrl({maxWidth: 40, maxHeight: 40})
  });

  autocomplete.addListener('place_changed', () => {
    infowindow.close();
    marker.setVisible(false);
    const place = autocomplete.getPlace();
    const geometry = place.geometry;
    console.log(geometry);

    if (!geometry || !geometry.location) {
      window.alert("No Deets: '" + place.name + "'");
      return;
    }
    geometry.viewport ?
      map.fitBounds(geometry.viewport) :
      map.setCenter(geometry.location)

    marker.setPosition(geometry.location);
    marker.setVisible(true);
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = place.formatted_address;
    // infowindowContent.children['place-photos'].textContent = place.photos[0].getUrl({maxWidth: 35, maxHeight: 35});
    infowindow.open(map, marker);
  });
}
