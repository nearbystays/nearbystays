let map;
let local;

window.addEventListener('DOMContentLoaded', () => {
  initMap();
  // locator();
});

function locator() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((p) => {
      local = {
        lat: p.coords.latitude,
        lng: p.coords.longitude,
      };
    // initMap(local);
    return local
    });
  }
}

document.

// function initMap(usr) {
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: usr,
//     zoom: 14,
//   });
// }


window['initMap'] = function(usr) {
  console.log(locator());
  map = new google.maps.Map(document.getElementById("map"), {
    center: locator(),
    zoom: 14,
  });
}

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDLgwI8A-l0MY0LxZSdUcPJZgsFSYSKG78&callback=initMap';
script.async = true;

document.head.appendChild(script)
