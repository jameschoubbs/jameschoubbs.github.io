var CLIENT_ID = '656523659985-o5feg4jk9og2jrd76cdt2pvl0e0lagor.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAnmqStyPEFVtdqK8h7MlBF1xEPtGLh6As';

var DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

function initClient() {
	gapi.client.init({
		apiKey: API_KEY,
		clientId: CLIENT_ID,
		discoveryDocs: DISCOVERY_DOCS,
		scope: SCOPES
	}).then(function () {

		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignoutClick;
	});
}

function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		authorizeButton.style.display = 'none';
		signoutButton.style.display = 'block';
		listMajors();
	} else {
		authorizeButton.style.display = 'block';
		signoutButton.style.display = 'none';
	}
}

function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
}

function appendPre(message) {
	var pre = document.getElementById('content');
	var textContent = document.createTextNode(message + '\n');

	pre.appendChild(textContent);
}

function listMajors() {
	gapi.client.sheets.spreadsheets.values.get({
	  spreadsheetId: '1yg0KgxWTWm9V0AdKcc_czzTr9H50AZYExem3BQvpALI',
	  range: 'Data!A1:C10',
	}).then(function(response) {
	  var range = response.result;
	  if (range.values.length > 0) {
		appendPre('Time, PM2.5, PM1.0:');
		for (i = 0; i < range.values.length; i++) {
		  var row = range.values[i];
		  // Print columns A and E, which correspond to indices 0 and 4.
		  appendPre(row[0] + ', ' + row[1] + ', ' + row[2]);
		}
	  } else {
		appendPre('No data found.');
	  }
	}, function(response) {
	  appendPre('Error: ' + response.result.error.message);
	});
}