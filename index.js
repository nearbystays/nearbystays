"use strict"
let map,
  places,
  infoWindow,
  markers = [],
  autocomplete;
const MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";
const hostnameRegexp = new RegExp("^https?://.+?/");

window.addEventListener('DOMContentLoaded', () => { locator(); addAPI(); });

function addAPI() {
  var script = document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDLgwI8A-l0MY0LxZSdUcPJZgsFSYSKG78&libraries=places&v=3.46";
  script.async = true;
  document.head.appendChild(script);
}

// You're Welcome
function locator() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem("InitLat", position.coords.latitude);
      localStorage.setItem("InitLng", position.coords.longitude);
      const lat = parseFloat(localStorage.getItem("InitLat"));
      const lng = parseFloat(localStorage.getItem("InitLng"));
      console.log("welcome.com");
      initMap({lat, lng});
    });
  }
}

async function getLastKnownValue() {
  let search = await document.querySelector('#autocomplete');
  let lastKnownValue = await localStorage.getItem('name');
  console.log(lastKnownValue)
  if (lastKnownValue) {
    search.placeholder = lastKnownValue
  }
}

setTimeout(getLastKnownValue, 100)

async function evtListener(...args) {
  let args = Array.from(arguments)
  
}

function initMap(geography) {
  map = new google.maps.Map(document.getElementById("map"), {
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false,
  });
  map.setGestureHandling()
  map.setZoom(14);
  let lastStay = localStorage.getItem("name")
  let lastSearch = localStorage.getItem("search")
  console.table(lastSearch, lastStay);
  try {
    lastSearch === 'null'
    ?  map.setCenter(union(lastSearch))
    :  map.setCenter(geography);
    console.log('Geography: ' + geography)
    console.log('Last Search 0: ' + lastSearch.split(","));
  } catch (e) {
    console.error(e);
  }
  map.setOptions({
    minZoom: 12,
    maxZoom: 15,
  });
  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById("info-content"),
  });
  localStorage.setItem("info-content",infoWindow.content);
  var a = document.getElementById("autocomplete")
  autocomplete = new google.maps.places.Autocomplete(a);
  places = new google.maps.places.PlacesService(map);
  autocomplete.addListener("place_changed", onPlaceChanged);
}

function onPlaceChanged() {
  const place = autocomplete.getPlace();
  localStorage.setItem("place", autocomplete.getPlace());

  if (place.geometry && place.geometry.location) {
    localStorage.setItem("curLat", place.geometry.location.latitude);
    localStorage.setItem("curLng", place.geometry.location.longitude);
    map.panTo(place.geometry.location);
    search();
  } else {
    document.getElementById("autocomplete").placeholder = "Enter a city";
  }
}

function search() {
  const search = {
    bounds: map.getBounds(),
    types: ["lodging"],
  };
  localStorage.setItem("bounds", map.getBounds());

  places.nearbySearch(search, (results, status, pagination) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      localStorage.setItem("results", JSON.stringify(results));
      clearResults();
      clearMarkers();

      for (let i = 0; i < results.length; i++) {
        const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
        const markerIcon = MARKER_PATH + markerLetter + ".png";

        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon,
        });
        markers[i].placeResult = results[i];
        localStorage.setItem("marker-i", markers[i].placeResult);
        google.maps.event.addListener(markers[i], "click", showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }
    }
  });
}

function clearMarkers() {
  for (let i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }

  markers = [];
}

function dropMarker(i) {
  return function () {
    markers[i].setMap(map);
  };
}

function addResultBeta(result, i) {
  const results = document.getElementById("results");
  const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
  const markerIcon = MARKER_PATH + markerLetter + ".png";
  const tr = document.createElement("tr");

  tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
  tr.onclick = function () {
    localStorage.setItem('this.tr', this.tr)
    localStorage.setItem('markers[i]', markers[i])
    google.maps.event.trigger(markers[i], "click");
  };

  async function Objects () {
    let createObjects = { 'td': ['iconTd', 'nameTd'], 'img': 'icon' }
    create[Symbol.iterator]
  }
  createObjects.map(obj)
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

function addResult(result, i) {
  const results = document.getElementById("results");
  const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
  const markerIcon = MARKER_PATH + markerLetter + ".png";
  const tr = document.createElement("tr");

  tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
  tr.onclick = function () {
    localStorage.setItem('this.tr', this.tr)
    localStorage.setItem('markers[i]', markers[i])
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
  document.getElementById("iw-icon").innerHTML =
    '<img class="hotelIcon" ' + 'src="' + place.icon + '"/>';
  document.getElementById("iw-url").innerHTML =
    '<b><a href="' + place.url + '">' + place.name + "</a></b>";
  document.getElementById("iw-address").textContent = place.vicinity;
  localStorage.setItem("name", place.name);
  localStorage.setItem("address", place.address);
  localStorage.setItem("vicinity", place.vicinity);

  if (place.rating) {
    let ratingHtml = "";

    for (let i = 0; i < 5; i++) {
      place.rating < i + 0.5 ?  ratingHtml += "&#10025;" : ratingHtml += "&#10029;"
      // if (place.rating < i + 0.5) {
      //   ratingHtml += "&#10025;";
      // } else {
      //   ratingHtml += "&#10029;";
      // }

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

function fetchPromise() {
  var pl = localStorage.getItem('name');
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'text/xml');
  myHeaders.append('Content-Type', 'image/jpeg');

  var myInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default'
  };
  const fetchResponsePromise = fetch(resource).then(function() {
    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.status);
    }
    return response.blob();
  })
  .then(function(r) {
    let objectUrl = URL.createObjectURL(r);
    myImg.src = objUrl;
  });
}

function searchUpdate() {
  const search = {
    bounds: map.getBounds(),
    types: ["lodging"],
  };

  places.nearbySearch(search, (results, status, pagination) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      clearResults();
      clearMarkers();
    }
  });
}

function name() {
  for (let i = 0; i < results.length; i++) {
    const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
    const markerIcon = MARKER_PATH + markerLetter + ".png";
        // let photos = place.photos
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon,
        });
        // If the user clicks a hotel marker, show the details of that hotel
        // in an info window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], "click", showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
  }
}

// export default name;

// let idx = '.js'
// import idx;
// import * as NearbyStays from idx;
// let Export = import ExportFunction1 from idx
// import {
//   ExportFunction2
//   ExportFunction3
//   ExportFunction4
// } from idx;
// 
// const main 
// 
// let settings = class Settings { }
// function nearbystaysImports() { }
// 
// export function ExportFunction1(arg1, arg2) {
//   let api; // new APIName();
//   api.onload = function () {
//     callback(this.responseText)
//   };
//   api.open(method, ...args);
//   api.send();
// }
// 
// const main = document.querySelector('main');
// for (const link of document.querySelectorAll('nav > a')) {
//   link.addEventListener('click', e => {
//     e.preventDefault();
// 
//     import('nearbystays.js')
//     .then(module => {
//       module.loadPageInto(main);
//     });
//   });
// }
// 
// let co = new NearbyStays();
// 
// class NearbyStays {
//   constructor(arg1, ...args) {
//     this.createArg1 = createElement(arg1);
//     this.arg1 = document.querySelector(arg1);
// 
//   }
//   get arg1() {
//     return this.arg1;
//   }
//   set rg1() {
//     this.arg1 = document.createElement(arg1);
//   }
// }

class NearbyStays {
  constructor(pk, username, name, email, phone, avatar) {
    var args = Array.from(arguments);
    args.forEach(function(arg) {
      this['arg' + i]  = arg;
      console.log(`this: ${this}`);
      console.log(`this.Argument [${i}]: ${this.arg}`);
      console.log(`Argument [${i}]: ${arg}`);
    });
    this.name = localStorage.getItem;
  }
}

class Hotel extends NearbyStays { }

class Searches extends NearbyStays {
  constructor(arg1, ...args) {
    super(pk);
    this.arg1 = arg1;
    this.args = args;
  }
}

class Guest extends NearbyStays {
   constructor(searches, hotels, checkin, checkout) {
     super(pk);
     this.name = name;
     this.email = email;
     this.phone = phone;
     this.pk = pk;
   }

   get primaryKey() {
     return this.pk;
   }
   
   set primaryKey(pk) {
     this.primaryKey.push(pk);
   }
}
