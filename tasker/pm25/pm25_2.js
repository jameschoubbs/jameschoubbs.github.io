var CLIENT_ID = '656523659985-o5feg4jk9og2jrd76cdt2pvl0e0lagor.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAnmqStyPEFVtdqK8h7MlBF1xEPtGLh6As';

var DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

var WSHOM1_DocId = '1FOtBgVQuru_b91fbc1VyErKqqGL67EuhulgQPqjfCqU';
var WSHOM1_SheetRange = 'TestValue!A1:M2';

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

	});

}

function updateSigninStatus(isSignedIn) {

	if (isSignedIn) {

		Refresh();

	} else {

		gapi.auth2.getAuthInstance().signIn();

	}

}

function Refresh() {

	gapi.client.sheets.spreadsheets.values.get({

		spreadsheetId: WSHOM1_DocId,
		range: WSHOM1_SheetRange,

	}).then(function(response) {

		var element = document.getElementById('demo-area-01-show');

		var range = response.result;

		if (range.values.length > 1) {

			var row = range.values[1];
			
			element.innerHTML = row[0];

		}
		else {

		}

	}, function(response) {

	});

}