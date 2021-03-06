let map;
let pl;
let autocomplete;
let markers = new Array();
let infoWindow;
const host = new RegExp("^https?://.+?/");

document.addEventListener('DOMContentLoaded', function(event) {
  // debugger;
  alert("Welcome to Nearby Stays by Jeremy Scott");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      mapInit(pos);
    })
  } else {
    alert("Not Available");
  }
})

function set_Date(check) {
  // debugger;
  let D = new Date();
  let date = (check == "checkin") ?
    D.setDate(D.getDate() + 3) :
    D.setDate(D.getDate() + 6);
  cosole.log(date);
}

// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDLgwI8A-l0MY0LxZSdUcPJZgsFSYSKG78&callback=initMap';
script.async = true;


// Append the 'script' element to 'head'
document.head.appendChild(script);

window.initMap = function() {
  function mapInit(pos) {
    // debugger;
    console.log("Position Object: " + pos)
    let map = new google.maps.Map(document.getElementById("map"), {
      center: pos,
      zoom: 14,
      mapTypeControl: false,
      panControl: false,
      zoomControl: false,
      streetViewControl: false,
    });

    const input = document.getElementById("search");
    const options = {
      bounds: map.getBounds(),
      fields: [ 'name', 'photos'],
      types: ["lodging"],
      strictBounds: false,
      // componentRestrictions: countryRestrict,
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.bindTo("bounds", map);
    const geo = new google.maps.Geocoder();
    window.onload=function() {
      document.getElementById("submit").addEventListener('click', () => LatLng(geo));
    }

    autocomplete.addListener( 'place_changed', function () {
      const pl = autocomplete.getPlace();

      if (pl.geometry && pl.geometry.location) {
        map.panTo(pl.geometry.location);
        search();
      } else {
        function LatLng(geo) { geo.geocode({ location: pos })
          .then((re) => { input.placeholder = re.results[0] ?  re.results[0].formatted_address[2]["long_name"] : window.alert("No Nearby Stays Avaliable"); })
          .catch(e => { window.alert("Location Not found"); console.log("Error: " + e); });
        }
      }
    });
  }
};

function search() {
  const search = {
    bounds: map.getBounds(),
    types: ["lodging"],
  };

  pl.nearbySearch(search, (results, status, pagination) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      clearResults();
      clearMarkers();

      let i = 0;
      let r = results.length;
      for (i; i<r; i++) {
        const svgIcon = {
          path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
          fillColor: "blue",
          fillOpacity: 0.59,
          strokeWeight: .1,
          rotation: 0,
          scale: 2,
          anchor: new google.maps.Point(15, 30),
        };
        markers[i] = new google.maps.Marker({
          position: map.getCenter(),
          icon: svgIcon,
          map: map,
          // title: title.place,
          // zIndex: stay
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
  let i = 0;
  let m = markers.length;
  for(i; i<m; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }

  markers = [];
}

function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  }
}

function addResult(result, i) { }

function clearResults() {
  const results = document.getElementById("results");

  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

function iWindow() {
  const marker = this; // GLOBAL

  pl.getDetails(
    {placeId: marker.placeResult.place_id },
    (pl, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }

      infoWindow.open(map, marker);
      constructIWContext(pl);
    }
  );
}

function constructIWContext(pl) {
  document.getElementById("iw-name").innerHTML = '<h3 id="hotelName" href="' + pl.url + '">' + pl.name + "</h3>";
  document.getElementById("iw-photo").innerHTML = '<img class="hotelPhoto" src="' + pl.photo + '"/>';

}

function submitView(search, checkIn, checkOut) {
  // debugger;
  try {
    let stayId = document.querySelectorAll("#search, #checkin, #checkout");
    alert("City: " + stayId[0] + " Check In: " + stayId[1] + " Check Out:  " + stayId[2]);
  }
  catch (e) {
    alert("error " + e);
  }
  let mainDiv = document.getElementById("main");
  mainDiv.style.textAlign = "center";
  var mdSearch = '<br>City: ' + search.value;
  var mdVacation = '<br>Your vacation is '+ checkIn.value + ' to ' + checkOut.value;
  mainDiv.innerHTML = mdSearch + mdVacation;
}

function router(view) {
  /*const viewObj = { "list": listView(), "map": mapView(), "stays": staysView(), "messages": messagesView(), "login": loginView() }*/
  const views = ["list", "map", "stays", "messages", "login"];
  views?.forEach( v => { document.getElementById(v).style.display = "none" } );
  document.getElementById(views[view]).style.display = "block";
}

function initService() {
  const displaySuggestions = function (predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
      alert(status);
      return;
    }

    predictions.forEach((prediction) => {
      const li = document.createElement("li");

      li.appendChild(document.createTextNode(prediction.description));
      document.getElementById("results").appendChild(li);
    });
  };

  const service = new google.maps.places.AutocompleteService();
  let search = document.getElementById("search");
  service.getQueryPredictions({ input: search }, displaySuggestions);
}

function listView(search, checkIn, checkOut) { }
function mapView() { }
function staysView() {
  // debugger;
  console.log("Width " + window.innerWidth + " Height " + window.innerHeight);
  // document.getElementById("stays").innerHTML = "Width " + x + " Height " + y;
}
function messagesView() { }
function loginView() { }


// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -33.8688, lng: 151.2195 },
    zoom: 13,
    mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

