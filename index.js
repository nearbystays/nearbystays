let map;
let places;
let infoWindow;
let markers = [];
let autocomplete;
const countryRestrict = { country: "us" };
const MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";
const hostnameRegexp = new RegExp("^https?://.+?/");
// const majorStates = {
//   ca: {
//     center: {lat: 0, lng: 0},
//     zoom: 10,
//   }
//   ny: {
//     center: {lat: 0, lng: 0},
//     zoom: 10,
//   }
//   fl: {
//     center: {lat: 0, lng: 0},
//     zoom: 10,
//   }
//   al: {
//     center: {lat: 0, lng: 0},
//     zoom: 10,
//   }
//   nv: {
//     center: {lat: 0, lng: 0},
//     zoom: 10,
//   }
//   fl: {
//     center: {lat: 0, lng: 0},
//     zoom: 10,
//   }
// }

function zoomProportional() {
  let numerator;
  const divisor = 3*4*5*6;
  let context = [];
}

const z = 5;
const countries = {
  au: {
    center: { lat: -25.3, lng: 133.8 },
    zoom: z,
  },
  br: {
    center: { lat: -14.2, lng: -51.9 },
    zoom: z,
  },
  ca: {
    center: { lat: 62, lng: -110.0 },
    zoom: z,
  },
  fr: {
    center: { lat: 46.2, lng: 2.2 },
    zoom: z,
  },
  de: {
    center: { lat: 51.2, lng: 10.4 },
    zoom: z,
  },
  mx: {
    center: { lat: 23.6, lng: -102.5 },
    zoom: z,
  },
  nz: {
    center: { lat: -40.9, lng: 174.9 },
    zoom: z,
  },
  it: {
    center: { lat: 41.9, lng: 12.6 },
    zoom: z,
  },
  za: {
    center: { lat: -30.6, lng: 22.9 },
    zoom: z,
  },
  es: {
    center: { lat: 40.5, lng: -3.7 },
    zoom: z,
  },
  pt: {
    center: { lat: 39.4, lng: -8.2 },
    zoom: z,
  },
  us: {
    center: { lat: 37.1, lng: -95.7 },
    zoom: z,
  },
  uk: {
    center: { lat: 54.8, lng: -4.6 },
    zoom: z,
  },
};

function initMap() {
  const mapElement = document.getElementById("map");
  const autocompleteElement = document.getElementById("autocomplete");

  let mapOpts = {
    zoom: countries["us"].zoom,
    center: countries["us"].center,
    mapTypeControl: false,
    panControl: false,
    zoomControl: true,
    streetViewControl: false,
  };

  let autocompleteOpts = {
    // types: ["address", ""],
    // types: ["administrative_area_level_1"]
  };

  map = new google.maps.Map(mapElement, mapOpts);

  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById("info-content"),
  });
  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  autocomplete = new google.maps.places.Autocomplete(autocompleteElement, autocompleteOpts);
  places = new google.maps.places.PlacesService(map);
  autocomplete.addListener("place_changed", onPlaceChanged);
  // Add a DOM event listener to react when the user selects a country.
  document
    .getElementById("country")
    .addEventListener("change", setAutocompleteCountry);
}

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
  const place = autocomplete.getPlace();

//   //etc...
//   if (! place.geometry || ! place.geometry.location) {
//   }
  if (place.geometry && place.geometry.location) {
    map.panTo(place.geometry.location);
    map.setZoom(9);
    search();
  } else {
    document.getElementById("autocomplete").placeholder = "Nearby Stays";
  }
}

// Search for hotels in the selected city, within the viewport of the map.
function search() {
  const search = {
    bounds: map.getBounds(),
    types: ["lodging"],
  };

  places.nearbySearch(search, (results, status, pagination) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      clearResults();
      clearMarkers();

      // Create a marker for each hotel found, and
      // assign a letter of the alphabetic to each marker icon.
      for (let i = 0; i < results.length; i++) {
        // const markerLetter = String.fromCharCode("A".charCodeAt(161));
        // const markerLetter = ""; //String.fromCharCode("A".charCodeAt(0) + i);
        const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 52));
        console.log(markerLetter);
        const markerIcon = MARKER_PATH + markerLetter + ".png";

        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
	  // position: event.latlng,
          position: results[i].geometry.location,
          // collisionBehavior:
            // google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
          animation: google.maps.Animation.DROP,
          icon: markerIcon,
        });
        // If the user clicks a hotel marker, show the details of that hotel
        // in an info window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], "click", showInfoWindow);
        setTimeout(dropMarker(i), i * 1);
        addResult(results[i], i);
      }
    }
  });
}

function clearMarkers() {
  // for (let i = 0; i < markers.length; i++) {
  for (let i of markers) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }

  markers = [];
}

// Set the country restriction based on user input.
// Also center and zoom the map on the given country.
function setAutocompleteCountry() {
  const country = document.getElementById("country").value;

  if (country == "all") {
    autocomplete.setComponentRestrictions({ country: [] });
    map.setCenter({ lat: 15, lng: 0 });
    map.setZoom(2);
  } else {
    autocomplete.setComponentRestrictions({ country: country });
    map.setCenter(countries[country].center);
    map.setZoom(countries[country].zoom);
  }

  clearResults();
  clearMarkers();
}

function dropMarker(i) {
  return function () {
    markers[i].setMap(map);
  };
}

function addResult(result, i) {
  console.log(result)
  const results = document.getElementById("results");
  const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
  const markerIcon = MARKER_PATH + markerLetter + ".png";
  const tr = document.createElement("tr");

  tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
  tr.onclick = function () {
    google.maps.event.trigger(markers[i], "click");
  };

  const iconTd = document.createElement("td");
  const nameTd = document.createElement("td");
  const icon = document.createElement("img");

  icon.src = markerIcon;
  icon.setAttribute("class", "placeIcon");
  icon.setAttribute("className", "placeIcon");

  const name = document.createTextNode(result.name);

  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

function clearResults() {
  const results = document.getElementById("results");

  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
  const marker = this;

  places.getDetails(
    { placeId: marker.placeResult.place_id },
    (place, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }

      infoWindow.open(map, marker);
      buildIWContent(place);
    }
  );
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  const icon = document.getElementById("iw-icon")
  icon.innerHTML = '<img class="hotelIcon nearbystays" ' + 'src="' + place.icon + '"/>';
  document.getElementById("iw-url").innerHTML = '<b><a class="nearbystays" href="' + place.url + '">' + place.name + "</a></b>";
  document.getElementById("iw-address").textContent = place.vicinity;
  if (place.formatted_phone_number) {
    document.getElementById("iw-phone-row").style.display = "";
    document.getElementById("iw-phone").textContent = place.formatted_phone_number;
  } else {
    document.getElementById("iw-phone-row").style.display = "none";
  }

  // Assign a five-star rating to the hotel, using a black star ('&#10029;')
  // to indicate the rating the hotel has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
    let ratingHtml = "";

    for (let i = 0; i < 5; i++) {
      if (place.rating < i + 0.5) {
        ratingHtml += "&#10025;";
      } else {
        ratingHtml += "&#10029;";
      }

      document.getElementById("iw-rating-row").style.display = "";
      document.getElementById("iw-rating").innerHTML = ratingHtml;
    }
  } else {
    document.getElementById("iw-rating-row").style.display = "none";
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    let fullUrl = place.website;
    let website = String(hostnameRegexp.exec(place.website));

    if (!website) {
      website = "http://" + place.website + "/";
      fullUrl = website;
    }

    document.getElementById("iw-website-row").style.display = "";
    document.getElementById("iw-website").textContent = website;
  } else {
    document.getElementById("iw-website-row").style.display = "none";
  }
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can add to home screen
  btnAdd.style.display = 'block';
});

btnAdd.addEventListener('click', (e) => {
  // hide our user interface that shows our A2HS button
  btnAdd.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
});
