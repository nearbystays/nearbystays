function showPreview(event){
  if(event.target.files.length > 0){
    var src = URL.createObjectURL(event.target.files[0]);
    database(src);
    var preview = document.getElementById("image-upload");
    preview.src = src;
    preview.style.display = "block";
    upload(event)
  }
}

function db(xn, store, req) {
  var transaction = db.transaction([xn], 'readwrite');
  var objectStore = transaction.objectStore(store);
  var request = objectStore.get(req);
}

function dbSet() {
  var transaction = db.transaction(['customers'], 'readwrite');
  transaction.oncomplete = function (event) { console.log(event)};
  var objectStore = transaction.objectStore('customers');
  customerData.forEach(function(customer) {
    var request = objectStore.add(customer);
    request.onsuccess = function(event) {
      // event.target.result === 
    }
  });
}

function dbGet() {
  var transaction = db.transaction(["customers"]);
  var objectStore = transaction.objectStore("customers");
  var request = objectStore.get("444-44-4444");

  db.transaction("customers").objectStore("customers").get("444-44-4444").onsuccess = function(event) {
    console.log("Name for SSN 444-44-4444 is " + event.target.result.name);
  };
}

function dbCurse(objectStore) {
  var customers = [];
  objectStore.getAll().onsuccess = function(event){
    console.log("Got All Customers: " + event.target.result);
  };
  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if(cursor) {
      console.log(cursor.key + cursor.value.name);
      customers.push(cursor.value);
      cursor.continue();
    } else {
      console.log('No More Entries');
    }
  };
}

function dbUp(objectStore, request) {
  request.onerror = function(event) { };
  request.onsuccess = function(event) {
    var data = event.target.result;
    data.age = 42;
    var requestUpdate = objectStore.put(data);
    requestUpdate.onerror = function(event) { console.log(event); };
    requestUpdate.onsuccess = function(event) { console.log(event); };
  };
}

function dbOld(value) {
  window.indexedDB = window.indexedDB;
  dbtaction = window.IDBTransaction;
  dbVersion = 1;
  var request = indexedDB.open('profilePics');

  request.onsuccess = function (event) {
    db = request.result;
    db.onerror = function(event){ console.log(event;) };

    if (db.setVersion) {
      if (db.version != dbVersion) {
        setVersion = db.setVersion(dbVersion);
        setVersion.onsuccess = function() {
          createObjectStore(db);
          getImageFile();
        };
      } else {
        getImageFile();
      }
    } else {
      getImageFile();
    }
}


function ticker() {
  let symbols = ['TSLA', 'SP', 'DOW'];
  let animation = document.querySelector('#infinite');
  symbols.forEach(function() { });
}

function upload(event) { 
  let reader = new FileReader();
  reader.onload = function() {
    let image = document.querySelector('#output');
    // image.src = URL.createObjectURL(event.target.files[0]);
    const uploadedImage = reader.result;
    document.querySelector('#output').style.backgroundImage = `url(${uploadedImage})`;
  }
  reader.readAsDataURL(this.files[0]);
}
