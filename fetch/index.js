class NearbyStays { }
function formMaker() {
  f = document.createElement("form");
  document.appendChild(f);
  f.action = "/actionHTML.html";
  f.method = "POST";
  f.submit();
}

function data() {
  var formData = new FomrData();
  formData.append('key', 'value');
}

function formSet() {
  let f = document.createElement('form');
  let d = document.createElement('div');
  f.appendChild(d);
}

class Guest extends NearbyStays {}
class Hotel extends NearbyStays {}
class Stay extends NearbyStays {}
class Database extends NearbyStays {}
class Payments extends NearbyStays {}
