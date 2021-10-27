let map;
let infoWindow;
let markers = new Array();
let results;



function createPhotoMarker(place) {
  var photos = place.photos;
  if (!photos) {
    return;
  }

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: photos[0].getUrl({maxWidth: 35, maxHeight: 35})
  });
}

var s = document.createElement('script');
s.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=places&v=weekly';
s.async = true;

window.initMap = function(pos) {
  map = new google.maps.Map( document.getElementById("map"), { center: new google.maps.LatLng(39.734, -121.853), zoom: 14, });
};

document.head.appendChild(s);

window.addEventListener('DOMContentLoaded', (e) => {
  document.getElementById("body").style.height = window.innerHeight,
  document.getElementById("body").style.width = window.innerWidth
  // document.getElementByTagName("p")[0].setAttribute("id", "idName");
}
