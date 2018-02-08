var CLIENT_ID = '656523659985-o5feg4jk9og2jrd76cdt2pvl0e0lagor.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAnmqStyPEFVtdqK8h7MlBF1xEPtGLh6As';

var DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

var WSHOM1_DeviceComment = 'WSHOM1';
var WSHOM1_DocId = '1FOtBgVQuru_b91fbc1VyErKqqGL67EuhulgQPqjfCqU';
var WSHOM1_SheetRange = 'TestValue!A1:M2';
var WSHOM2_DeviceComment = 'WSHOM2';
var WSHOM2_DocId = '1-Nvc0tMEwlzhPeva8XXTNky9TXB5teVTOi6i_Avjb3I';
var WSHOM2_SheetRange = 'TestValue!A1:M2';

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
	}
	else {

		gapi.auth2.getAuthInstance().signIn();
	}
}

var Refresh = function () {

	RefreshViewerElement('demo-area-01-show', WSHOM1_DeviceComment, WSHOM1_DocId, WSHOM1_SheetRange);
	RefreshViewerElement('demo-area-02-show', WSHOM2_DeviceComment, WSHOM2_DocId, WSHOM2_SheetRange);
};

function RefreshViewerElement(elementId, deviceComment, docId, sheetRange) {

	var isReady = false;
	var lastDateTime = null;
	var element = document.getElementById(elementId);
	var initRow = ([('<br/>'), ('<br/>'), ('<br/>'), ('<br/>')].join(''));
	var connSta = deviceComment + ' 嘗試連線...' + initRow;

	element.style.display = 'block';
	element.style.color = 'gray';
	element.style.backgroundColor = 'black';
	element.style.borderColor = 'green';
	element.innerHTML = connSta;

	var fUpdate = function () {

		gapi.client.sheets.spreadsheets.values.get({

			spreadsheetId: docId,
			range: sheetRange,

		}).then(function (response) {

			isReady = true;

			var range = response.result;

			if (range.values.length > 1) {

				connSta = deviceComment + ' 正在監測中...';

				var row = range.values[1];

				if (row != null &&
					row.length > 0) {

					var isOK = true;
					var dateTimeParts = null;
					var dateStr = null;
					var timeStr = null;
					var pm25Value = null;
					var pm10Value = null;
					var pm25Value60Max = null;

					// (4)[量測時間]
					isOK = (isOK && (row[3] != null && row[3].length > 0));

					if (isOK) {

						dateTimeParts = row[3].split(' ');

						if (dateTimeParts != null &&
							dateTimeParts.length > 1) {

							dateStr = dateTimeParts[0];
							timeStr = dateTimeParts[1];
						}
						else {

							isOK = false;
						}
					}

					// (12)[最新PM2.5偵測值]
					isOK = (isOK && (row[11] != null && row[11].length > 0 && !isNaN(row[11])));

					if (isOK) {

						pm25Value = row[11];
					}

					// (13)[最新PM1.0偵測值]
					isOK = (isOK && (row[12] != null && row[12].length > 0 && !isNaN(row[12])));

					if (isOK) {

						pm10Value = row[12];
					}

					// (1)[近60筆PM2.5最大值]
					isOK = (isOK && (row[0] != null && row[0].length > 0 && !isNaN(row[0])));

					if (isOK) {

						pm25Value60Max = row[0];
					}

					if (isOK) {

						var pm25Text = '(無)';

						if (pm25Value >= 0 && pm25Value <= 11) {

							pm25Text = '(低)';
							element.style.color = '#000';
							element.style.backgroundColor = '#9cff9c';
							element.style.borderColor = 'gray';
						}
						else if (pm25Value >= 12 && pm25Value <= 23) {

							pm25Text = '(低)';
							element.style.color = '#000';
							element.style.backgroundColor = '#31ff00';
							element.style.borderColor = 'gray';
						}
						else if (pm25Value >= 24 && pm25Value <= 35) {

							pm25Text = '(低)';
							element.style.color = '#000';
							element.style.backgroundColor = '#31cf00';
							element.style.borderColor = 'gray';
						}
						else if (pm25Value >= 36 && pm25Value <= 41) {

							pm25Text = '(中)';
							element.style.color = '#000';
							element.style.backgroundColor = 'yellow';
							element.style.borderColor = 'gray';
						}
						else if (pm25Value >= 42 && pm25Value <= 47) {

							pm25Text = '(中)';
							element.style.color = '#000';
							element.style.backgroundColor = 'ffcf00';
							element.style.borderColor = 'gray';
						}
						else if (pm25Value >= 48 && pm25Value <= 53) {

							pm25Text = '(中)';
							element.style.color = '#000';
							element.style.backgroundColor = '#ff9a00';
							element.style.borderColor = 'gray';
						}
						else if (pm25Value >= 54 && pm25Value <= 58) {

							pm25Text = '(高)';
							element.style.color = '#000';
							element.style.backgroundColor = '#ff6464';
							element.style.borderColor = 'gray';
						}
						else if (pm25Value >= 59 && pm25Value <= 64) {

							pm25Text = '(高)';
							element.style.color = 'gray';
							element.style.backgroundColor = '#red';
							element.style.borderColor = 'gray';
						}
						else if (pm25Value >= 65 && pm25Value <= 70) {

							pm25Text = '(高)';
							element.style.color = 'gray';
							element.style.backgroundColor = '#900';
							element.style.borderColor = 'gray';
						}
						else if (pm25Value >= 71) {

							pm25Text = '(非常高)';
							element.style.color = 'white';
							element.style.backgroundColor = '#ce30ff';
							element.style.borderColor = 'gray';
						}

						element.innerHTML =
							([
								connSta, ('<br/>'),
								dateStr, ('&nbsp;'), timeStr, ('<br/>'),
								'PM2.5=[', pm25Value, ']', ('&nbsp;'), pm25Text, ('&nbsp;'), 'Max=[', pm25Value60Max, ']', ('<br/>'),
								'PM1.0=[', pm10Value, ']'
							].join(''));

						lastDateTime = dateStr + ' ' + timeStr;
					}
					else {

					}
				}

				setTimeout(function () {

					fUpdate();

				}, 1000);
			}
			else {

				element.style.color = 'gray';
				element.style.backgroundColor = 'black';
				element.style.borderColor = 'green';

				connSta = deviceComment + ' 連線中斷！' + initRow;
				element.innerHTML = connSta;

				setTimeout(function () { fUpdate(); }, 3000);
			}

		}, function (response) {

		});
	};

	fUpdate();

	setTimeout(function () {

		if (!isReady) {

			connSta = deviceComment + ' 連線失敗！' + initRow;
			element.innerHTML = connSta;

			setTimeout(function () { fUpdate(); }, 3000);
		}

	}, 10000);
}