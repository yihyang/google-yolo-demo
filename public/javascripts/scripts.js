var idToken = null;
// https://developers.google.com/identity/one-tap/web/get-started#load_the_javascript_client_library
window.onGoogleYoloLoad = (googleyolo) => {
  // The 'googleyolo' object is ready for use.

  // if user choose to sign in with a different method
  googleyolo.cancelLastOperation().then(() => {
  //   // Credential selector closed.
    document.getElementById('result').textContent = 'googleyolo.cancelLastOperation() => User choose to sign in with a different method';
  });
};

function retrieve() {
  // Request saved credentials
  // https://developers.google.com/identity/one-tap/web/retrieve-credentials
  const retrievePromise = googleyolo.retrieve({
    supportedAuthMethods: [
      "https://accounts.google.com",
      "googleyolo://id-and-password"
    ],
    supportedIdTokenProviders: [
      {
        uri: "https://accounts.google.com",
        clientId: googleYoloClientID
      }
    ]
  });

  // Handle the credential request result
  // https://developers.google.com/identity/one-tap/web/retrieve-credentials#handle_the_credential_request_result
  retrievePromise.then((credential) => {
  if (credential.password) {
      // An ID (usually email address) and password credential was retrieved.
      // Sign in to your backend using the password.
      // signInWithEmailAndPassword(credential.id, credential.password);
      document.getElementById('result').textContent = JSON.stringify(credential);

      // set token
      idToken = credential.idToken;
      document.getElementById('result-verify-token').textContent = "idToken:" + credential.idToken;
    } else {
      // A Google Account is retrieved. Since Google supports ID token responses,
      // you can use the token to sign in instead of initiating the Google sign-in
      // flow.
      // useGoogleIdTokenForAuth(credential.idToken);
      document.getElementById('result').textContent = JSON.stringify(credential);

      // set token
      idToken = credential.idToken;
      document.getElementById('result-verify-token').textContent = "idToken:" + credential.idToken;
    }
  }, (error) => {
    // Credentials could not be retrieved. In general, if the user does not
    // need to be signed in to use the page, you can just fail silently; or,
    // you can also examine the error object to handle specific error cases.

    // If retrieval failed because there were no credentials available, and
    // signing in might be useful or is required to proceed from this page,
    // you can call `hint()` to prompt the user to select an account to sign
    // in or sign up with.
    if (error.type === 'noCredentialsAvailable') {
      // googleyolo.hint(...).then(...);
      document.getElementById('result').textContent = JSON.stringify(error);
    }
  });
}

function hint() {
  const hintPromise = googleyolo.hint({
    supportedAuthMethods: [
      "https://accounts.google.com"
    ],
    supportedIdTokenProviders: [
      {
        uri: "https://accounts.google.com",
        clientId: googleYoloClientID
      }
    ]
  });

  hintPromise.then((credential) => {
    if (credential.idToken) {
      // Send the token to your auth backend.
      // useGoogleIdTokenForAuth(credential.idToken);
      document.getElementById('result').textContent = JSON.stringify(credential);

      // set token
      idToken = credential.idToken;
      document.getElementById('result-verify-token').textContent = "idToken:" + credential.idToken;
    }
  }, (error) => {
    document.getElementById('result').textContent = JSON.stringify(error);
    switch (error.type) {
      case "userCanceled":
        // The user closed the hint selector. Depending on the desired UX,
        // request manual sign up or do nothing.
        break;
      case "noCredentialsAvailable":
        // No hint available for the session. Depending on the desired UX,
        // request manual sign up or do nothing.
        break;
      case "requestFailed":
        // The request failed, most likely because of a timeout.
        // You can retry another time if necessary.
        break;
      case "operationCanceled":
        // The operation was programmatically canceled, do nothing.
        break;
      case "illegalConcurrentRequest":
        // Another operation is pending, this one was aborted.
        break;
      case "initializationError":
        // Failed to initialize. Refer to error.message for debugging.
        break;
      case "configurationError":
        // Configuration error. Refer to error.message for debugging.
        break;
      default:
        // Unknown error, do nothing.
    }
  });
}

function verifyToken() {
  if(idToken == null) {
    document.getElementById('result-verify-token').textContent = 'No token retrieved, unable to verify token';
  } else {
    // send idToken to backend for verification
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/verify?idToken=' + idToken);
    xhr.onload = function() {
      if (xhr.status === 200) {
        document.getElementById('result-verify-token').textContent = xhr.responseText;
      }
      else {
        document.getElementById('result-verify-token').textContent = "Error while attempt to verify token with status code of " + xhr.status;
      }
    };
    xhr.send();
  }
}
