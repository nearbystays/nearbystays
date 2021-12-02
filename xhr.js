const btn = document.querySelector('button');

function sendData(data) {
  
  console.log('Sending Data');

  const XHR = new XMLHttpRequest();

  let urlEncodedData = '',
  urlEncodedDataPairs = [],
  name;

  for ( name in data ) {
    urlEncodedDataPairs.push( encodeURIComponent( name ) + ' = ' + encodeURIComponent( data[name]) )
  }

  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+' );
  XHR.addEventListener( 'load', function(event) {
    alert('Sent With Response');
  });
  XHR.addEventListener( 'error', function(event) {
    alert( 'Error' );
  });
  XHR.open( 'POST', 'https://example.com/cors.php' );
  XHR.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
  XHR.send( urlEncodedData);
}

btn.addEventListener( 'click', function() {
  sendData( {
    test: 'ok'
  });
});
