let map, places, infoWindow, autocomplete, markers = [];

const countryRestrict = { country: "us" };
const MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";
const hostnameRegexp = new RegExp("^https?://.+?/");
const countries = {
  au: { center: { lat: -25.3, lng: 133.8 }, zoom: 4, },
  br: { center: { lat: -14.2, lng: -51.9 }, zoom: 3, },
  ca: { center: { lat: 62, lng: -110.0 }, zoom: 3, },
  fr: { center: { lat: 46.2, lng: 2.2 }, zoom: 5, },
  de: { center: { lat: 51.2, lng: 10.4 }, zoom: 5, },
  mx: { center: { lat: 23.6, lng: -102.5 }, zoom: 4, },
  nz: { center: { lat: -40.9, lng: 174.9 }, zoom: 5, },
  it: { center: { lat: 41.9, lng: 12.6 }, zoom: 5, },
  za: { center: { lat: -30.6, lng: 22.9 }, zoom: 5, },
  es: { center: { lat: 40.5, lng: -3.7 }, zoom: 5, },
  pt: { center: { lat: 39.4, lng: -8.2 }, zoom: 6, },
  us: { center: { lat: 37.1, lng: -95.7 }, zoom: 3, },
  uk: { center: { lat: 54.8, lng: -4.6 }, zoom: 5, },
};

function initMap() {
  map = new google.maps.Map($("#map"), {
    zoom: countries["us"].zoom,
    center: countries["us"].center,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false,
  });
  infoWindow = new google.maps.InfoWindow({ content: $("#info-content"), });
  autocomplete = new google.maps.places.Autocomplete(
    $("#autocomplete"), { componentRestrictions: countryRestrict, }
  );
  places = new google.maps.places.PlacesService(map);
  autocomplete.addListener("place_changed", onPlaceChanged);
  // Add a DOM event listener to react when the user selects a country.
  $("#country").change(setAutocompleteCountry);
}

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
  const place = autocomplete.getPlace();

  if (place.geometry && place.geometry.location) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    search();
  } else {
    $("#autocomplete").placeholder = "Nearby Stays";
  }
}

function search() {
  const search = { bounds: map.getBounds(), types: ["lodging"], };

  places.nearbySearch(search, (results, status, pagination) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      clearResults();
      clearMarkers();

      const resultsLength = results.length;
      for (let i = 0; i < resultsLength; i++) {
        const markerLetter = String.fromCharCode(65 + (i % 26));
        const markerIcon = MARKER_PATH + markerLetter + ".png";

        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon,
        });
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], "click", showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }
    }
  });
}

function clearMarkers() {
  const markerLength = markers.length
  for (let i = 0; i < markerLength; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }

  markers = [];
}

// Set the country restriction based on user input.
// Also center and zoom the map on the given country.
function setAutocompleteCountry() {
  const country = $("#country").value;

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

function dropMarker(i) { return function () { markers[i].setMap(map); }; }

function addResult(result, i) {
  const results = $("#results");
  const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
  const markerIcon = MARKER_PATH + markerLetter + ".png";
  const tr = document.createElement("tr");

  tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
  //reduce(fn callback_fn(A(t-1),At,Ai,A[]){...F},A*)
  tr.onclick = function () { google.maps.event.trigger(markers[i], "click"); };

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
  const results = $("#results");

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
  $("#iw-icon").innerHTML =
    '<img class="hotelIcon" ' + 'src="' + place.icon + '"/>';
  $("#iw-url").innerHTML =
    '<b><a href="' + place.url + '">' + place.name + "</a></b>";
  $("#iw-address").textContent = place.vicinity;
  if (place.formatted_phone_number) {
    $("#iw-phone-row").style.display = "";
    $("#iw-phone").textContent =
      place.formatted_phone_number;
  } else {
    $("#iw-phone-row").style.display = "none";
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

      $("#iw-rating-row").style.display = "";
      $("#iw-rating").innerHTML = ratingHtml;
    }
  } else {
    $("#iw-rating-row").style.display = "none";
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    let fullUrl = place.website;
    let website = String(hostnameRegexp.matchAll(place.website));

    if (!website) {
      website = "http://" + place.website + "/";
      fullUrl = website;
    }

    $("#iw-website-row").style.display = "";
    $("#iw-website").textContent = website;
  } else {
    $("#iw-website-row").style.display = "none";
  }
}

