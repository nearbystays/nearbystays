document.addEventListener('DOMContentLoaded', function(event) {
  alert("Welcome to Nearby Stays by Jeremy Scott");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      mapInit(pos);
      console.log("Position Log: " + pos);
      console.table("Position Table: " + pos);
    })
  } else { alert("Not Available"); }
})

function mapInit(pos) {
  console.log("Position Object: " + pos)
  let map = new google.maps.Map(document.getElementById("map"), {
    center: pos,
    zoom: 14,
  });

  const svgIcon = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.59,
    strokeWeight: .1,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };

  new google.maps.Marker({
    position: map.getCenter(),
    icon: svgIcon,
    map: map,
    // title: title.place,
    // zIndex: stay
  });
}

function submitRes() {
  let searchResp = document.getElementById("search");
  let checkInResp = document.getElementById("checkin");
  let checkOutResp = document.getElementById("checkout");
  submitView(searchResp, checkInResp, checkOutResp)
}

function submitView(search, checkIn, checkOut) {
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

function loginView() { }
function mapView() { }
function stayView() { }
function messagesView() { }
function loginView() { }
