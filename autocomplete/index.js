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

function initMap() {
  const mapId = document.getElementById("map");
  const mapOptions = {
    center: posit,
    zoom: 14,
    mapTypeControl: false,
  };
  const map = new google.maps.Map(mapId, mapOptions);
  const card = document.getElementById("pac-input");
  const input = document.getElementById("pac-input");
  const biasInputElement = document.getElementById("use-location-bias");
  const strictBoundsInputElement = document.getElementById("use-strict-bounds");
  const options = {
    fields: ['formatted_address', 'geometry', 'name', 'photos'],
    strictBounds: false,
    types: ['lodging'],
  };

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(card);
  const autocmoplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.bindTo('bounds', map);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById('infowindow-content);
  infowindow.setContent(infowindowContent);

  const marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(1, -30),
  });

  autocomplete.addListener('place_changed', () => {
    infowindow.close();
    marker.setVisible(false);
    const place = autocomplete.getPlace.getPlace();
    const geometry = place.geometry;
      
    if (!geometry || !geometry.location) {
      window.alert("No Deets: '" + place.name + "'");
      return;
    }
    geometry.viewport ?
      map.fitBounds(geometry.viewport) :
      map.setCenter(geometry.location)

    marker.setPosition(geometry.location);
    marker.setVisible(true);
    infowindowContent.children.place-name.textContent = place.name;
    infowindowContent.children.place-address.textContent = place['formatted_address'];
    infowindowContent.children.place-photos.textContent = place.photos[0];
    infowindow.open(map, marker);
  });
}
