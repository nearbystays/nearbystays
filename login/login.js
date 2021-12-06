function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id: "86822582342-ohkbhad3csa8tsg85h9cp37fiu628u97.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", size: "large" }  // customization attributes
  );
  google.accounts.id.prompt(); // also display the One Tap dialog
}
