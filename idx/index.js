function go() {

  const DB_NAME = 'nearbystays';
  const DB_VERSION = 1; // Use a long long for this value (don't use a float)
  const DB_STORE_NAME_GUEST = 'stays';
  const DB_STORE_NAME_HOTEL = 'stays';
  const DB_STORE_NAME_STAYS = 'stays';

  var db;

  // Used to keep track of which view is displayed to avoid uselessly reloading it
  var current_view_pub_key;

  function openDb() {
    console.log("opening Database ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
      // Equal to: db = req.result;
      db = this.result;
      console.log("openDb DONE");
    };
    req.onerror = function (evt) {
      console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME_STAYS, { keyPath: 'id', autoIncrement: true });

      store.createIndex('pk', 'pk', { unique: true });
      store.createIndex('title', 'title', { unique: false });
      store.createIndex('year', 'year', { unique: false });
    };
  }

  function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  }

  function clearObjectStore() {
    var store = getObjectStore(DB_STORE_NAME_STAYS, 'readwrite');
    var req = store.clear();
    req.onsuccess = function(evt) {
      displayActionSuccess("Store cleared");
      displayPubList(store);
    };
    req.onerror = function (evt) {
      console.error("clearObjectStore:", evt.target.errorCode);
      displayActionFailure(this.error);
    };
  }

  function getBlob(key, store, success_callback) {
    var req = store.get(key);
    req.onsuccess = function(evt) {
      var value = evt.target.result;
      if (value)
        success_callback(value.blob);
    };
  }

  function displayPubList(store) {
    console.log("displayPubList");

    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME_STAYS, 'readonly');

    // pub_msg.empty();
    // pub_list.empty();
    // Resetting the iframe so that it doesn't display previous content
    var pub_msg = Q('pub-msg', '#pub-msg').empty();
    var pub_list = Q('pub-list', '#pub-list').empty();
    newViewerFrame();

    var req;
    req = store.count();
    // Requests are executed in the order in which they were made against the
    // transaction, and their results are returned in the same order.
    // Thus the count text below will be displayed before the actual pub list
    // (not that it is algorithmically important in this case).
    req.onsuccess = function(evt) {
      pub_msg.append('<p>There are <strong>' + evt.target.result +
                     '</strong> record(s) in the object store.</p>');
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
      displayActionFailure(this.error);
    };

    var i = 0;
    req = store.openCursor();
    req.onsuccess = function(evt) {
      var cursor = evt.target.result;

      // If the cursor is pointing at something, ask for the data
      if (cursor) {
        console.log("displayPubList cursor:", cursor);
        req = store.get(cursor.key);
        req.onsuccess = function (evt) {
          var value = evt.target.result;
          var list_item = $('<li>' + '[' + cursor.key + '] ' + '(biblioid: ' + value.biblioid + ') ' + value.title + '</li>');
          if (value.year != null)
            list_item.append(' - ' + value.year);

          if (value.hasOwnProperty('blob') &&
              typeof value.blob != 'undefined') {
            var link = $('<a href="' + cursor.key + '">File</a>');
            link.on('click', function() { return false; });
            link.on('mouseenter', function(evt) {
                      setInViewer(evt.target.getAttribute('href')); });
            list_item.append(' / ');
            list_item.append(link);
          } else {
            list_item.append(" / No attached file");
          }
          pub_list.append(list_item);
        };

        // Move on to the next object in store
        cursor.continue();

        // This counter serves only to create distinct ids
        i++;
      } else {
        console.log("No more entries");
      }
    };
  }

  function newViewerFrame() {
    var viewer = $('#pub-viewer');
    viewer.empty();
    var iframe = $('<iframe />');
    viewer.append(iframe);
    return iframe;
  }

  function setInViewer(key) {
    console.log("setInViewer:", arguments);
    key = Number(key);
    if (key == current_view_pub_key)
      return;

    current_view_pub_key = key;

    var store = getObjectStore(DB_STORE_NAME_STAYS, 'readonly');
    getBlob(key, store, function(blob) {
      console.log("setInViewer blob:", blob);
      var iframe = newViewerFrame();

      // It is not possible to set a direct link to the
      // blob to provide a mean to directly download it.
      if (blob.type == 'text/html') {
        var reader = new FileReader();
        reader.onload = (function(evt) {
          var html = evt.target.result;
          iframe.load(function() {
            $(this).contents().find('html').html(html);
          });
        });
        reader.readAsText(blob);
      } else if (blob.type.indexOf('image/') == 0) {
        iframe.load(function() {
          var img_id = 'image-' + key;
          var img = $('<img id="' + img_id + '"/>');
          $(this).contents().find('body').html(img);
          var obj_url = window.URL.createObjectURL(blob);
          $(this).contents().find('#' + img_id).attr('src', obj_url);
          window.URL.revokeObjectURL(obj_url);
        });
      } else if (blob.type == 'application/pdf') {
        $('*').css('cursor', 'wait');
        var obj_url = window.URL.createObjectURL(blob);
        iframe.load(function() {
          $('*').css('cursor', 'auto');
        });
        iframe.attr('src', obj_url);
        window.URL.revokeObjectURL(obj_url);
      } else {
        iframe.load(function() {
          $(this).contents().find('body').html("No view available");
        });
      }

    });
  }

  /**
   * @param {string} url the URL of the image to download and store in the local
   *   IndexedDB database. The resource behind this URL is subjected to the
   *   "Same origin policy", thus for this method to work, the URL must come from
   *   the same origin as the web site/app this code is deployed on.
   */
  function addPublicationFromUrl(biblioid, title, year, url) {
    console.log("addPublicationFromUrl:", arguments);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    // Setting the wanted responseType to "blob"
    // http://www.w3.org/TR/XMLHttpRequest2/#the-response-attribute
    xhr.responseType = 'blob';
    xhr.onload = function (evt) {
      if (xhr.status == 200) {
        console.log("Blob retrieved");
        var blob = xhr.response;
        console.log("Blob:", blob);
        addPublication(biblioid, title, year, blob);
      } else {
        console.error("addPublicationFromUrl error:",
        xhr.responseText, xhr.status);
      }
    };
    xhr.send();

    // We can't use jQuery here because as of jQuery 1.8.3 the new "blob"
    // responseType is not handled.
    // http://bugs.jquery.com/ticket/11461
    // http://bugs.jquery.com/ticket/7248
    // $.ajax({
    //   url: url,
    //   type: 'GET',
    //   xhrFields: { responseType: 'blob' },
    //   success: function(data, textStatus, jqXHR) {
    //     console.log("Blob retrieved");
    //     console.log("Blob:", data);
    //     // addPublication(biblioid, title, year, data);
    //   },
    //   error: function(jqXHR, textStatus, errorThrown) {
    //     console.error(errorThrown);
    //     displayActionFailure("Error during blob retrieval");
    //   }
    // });
  }

  /**
   * @param {string} biblioid
   * @param {string} title
   * @param {number} year
   * @param {Blob=} blob
   */
  function addPublication(biblioid, title, year, blob) {
    console.log("addPublication arguments:", arguments);
    var obj = { biblioid: biblioid, title: title, year: year };
    if (typeof blob != 'undefined')
      obj.blob = blob;

    var store = getObjectStore(DB_STORE_NAME_STAYS, 'readwrite');
    var req;
    try {
      req = store.add(obj);
    } catch (e) {
      if (e.name == 'DataCloneError')
        displayActionFailure("This engine doesn't know how to clone a Blob, " +
                             "use Firefox");
      throw e;
    }
    req.onsuccess = function (evt) {
      console.log("Insertion in DB successful");
      displayActionSuccess();
      displayPubList(store);
    };
    req.onerror = function() {
      console.error("addPublication error", this.error);
      displayActionFailure(this.error);
    };
  }

  /**
   * @param {string} biblioid
   */
  function deletePublicationFromBib(biblioid) {
    console.log("deletePublication:", arguments);
    var store = getObjectStore(DB_STORE_NAME_STAYS, 'readwrite');
    var req = store.index('biblioid');
    req.get(biblioid).onsuccess = function(evt) {
      if (typeof evt.target.result == 'undefined') {
        displayActionFailure("No matching record found");
        return;
      }
      deletePublication(evt.target.result.id, store);
    };
    req.onerror = function (evt) {
      console.error("deletePublicationFromBib:", evt.target.errorCode);
    };
  }

  /**
   * @param {number} key
   * @param {IDBObjectStore=} store
   */
  function deletePublication(key, store) {
    console.log("deletePublication:", arguments);

    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME_STAYS, 'readwrite');

    // As per spec http://www.w3.org/TR/IndexedDB/#object-store-deletion-operation
    // the result of the Object Store Deletion Operation algorithm is
    // undefined, so it's not possible to know if some records were actually
    // deleted by looking at the request result.
    var req = store.get(key);
    // req.onsuccess = async function(evt) {
    req.onsuccess = function(evt) {
      var record = evt.target.result;
      console.log("record:", record);
      if (typeof record === 'undefined') {
        displayActionFailure("No matching record found");
        return;
      }
      // Warning: The exact same key used for creation needs to be passed for
      // the deletion. If the key was a Number for creation, then it needs to
      // be a Number for deletion.
      // var deleteReq = await store.delete(key);
      // await deleteReq.onsuccess = async function(evt) {
        // await displayActionSuccess("Deletion successful");
        // await displayPubList(store);
      var deleteReq = store.delete(key);
      deleteReq.onsuccess = function(evt) {
        displayActionSuccess("Deletion successful");
        displayPubList(store);
      };
      deleteReq.onerror = function (evt) {
        console.error("deletePublication:", evt.target.errorCode);
      };
    };
    req.onerror = function (evt) {
      console.error("deletePublication:", evt.target.errorCode);
    };
  }

  function Q(element, name) {
    let name = document.querySelector(element); 
    return name;
  }

function titleBiblioId(evt) {
   console.log("add ...");
   var title = $('#pub-title').val();
   var biblioid = $('#pub-biblioid').val();
   if (!title || !biblioid) {
     displayActionFailure("Required field(s) missing");
     return;
   }
   var year = document.querySelector('#pub-year').value;
   if (year != '') { // Number.isInteger
     if (isNaN(year))  { return; }
     year = Number(year);
   } else {
     year = null;
   }

   var file_input = document.querySelector('#pub-file');
   var selected_file = file_input.get(0).files[0];
   console.log("selected_file:", selected_file);
   // Keeping a reference on how to reset the file input in the UI once we // have its value, but instead of doing that we rather use a "reset" type // input in the HTML form. file_input.val(null);
   var file_url = document.querySelector('#pub-file-url').value;
   if (selected_file) {
     addPublication(biblioid, title, year, selected_file);
   } else if (file_url) {
     addPublicationFromUrl(biblioid, title, year, file_url);
   } else {
     addPublication(biblioid, title, year);
   }
}
  function wrapper(name, element, event, func) {
    name = document.querySelector(element);
    name.addEventListener(event, func);
  }


  function addEventListeners() {
    wrapper('register-form-reset', '#register-form-reset', 'click', resetActionStatus());
    wrapper('add-button', '#add-button', 'click', title_biblioid());

    function title_biblioid(evt) {
      console.log("add ...");
      var title = document.querySelector('#pub-title').value;
      var biblioid = document.querySelector('#pub-biblioid').value;
      if (!title || !biblioid) {
        displayActionFailure("Required field(s) missing");
        return;
      }
      var year = document.querySelector('#pub-year').value;
      if (year != '') { // Number.isInteger
        if (isNaN(year))  { return; }
        year = Number(year);
      } else {
        year = null;
      }

      var file_input = document.querySelector('#pub-file');
      var selected_file = file_input.get(0).files[0];
      console.log("selected_file:", selected_file);
      // Keeping a reference on how to reset the file input in the UI once we
      // have its value, but instead of doing that we rather use a "reset" type
      // input in the HTML form.
      //file_input.val(null);
      var file_url = document.querySelector('#pub-file-url').value;
      if (selected_file) {
        addPublication(biblioid, title, year, selected_file);
      } else if (file_url) {
        addPublicationFromUrl(biblioid, title, year, file_url);
      } else {
        addPublication(biblioid, title, year);
      }

    }

    wrapper('delete-button', '#delete-button', 'click', delFunc())
    function delFunc() {
      console.log("delete ...");
      Q('#pub-biblioid-to-delete', 'biblioid').value;
      Q('#key-to-delete', 'key').value;

      if (biblioid != '') {
        deletePublicationFromBib(biblioid);
      } else if (key != '') {
        // Better use Number.isInteger if the engine has EcmaScript 6
        if (key == '' || isNaN(key))  {
          displayActionFailure("Invalid key");
          return;
        }
        key = Number(key);
        deletePublication(key);
      }
    }

    wrapper('clear-store-button', '#clear-store-button', 'click', clearObjectStore());
    wrapper('search_button', '#search-list-button', 'click', displayPubList())
  }

  // openDb();
  // addEventListeners();

  // })(); // Immediately-Invoked Function Expression (IIFE)
}

window.onload = function() {
  setTimeout(go(),);
  setTimeout(openDb(),);
  setTimeout(addEventListeners(),);
}

function inputt() {
  let in = document.createElement(input);
  in.setAttribute('type', 'text');
  in.setAttribute('value', 'Delete Publication');
  in.setAttribute('id', 'delete-button')
}
