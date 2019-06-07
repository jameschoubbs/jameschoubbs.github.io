var deviceComment_WSHOM1 = 'WSHOM1';
var deviceId_WSHOM1 = '10VWD5KQ';
var sheetUrl_WSHOM1 = 'https://docs.google.com/spreadsheets/d/1FOtBgVQuru_b91fbc1VyErKqqGL67EuhulgQPqjfCqU/edit?usp=sharing';
var sheetName_WSHOM1 = 'Data';

var deviceComment_WSHOM2 = 'WSHOM2';
var deviceId_WSHOM2 = '10VggPwV';
var sheetUrl_WSHOM2 = 'https://docs.google.com/spreadsheets/d/1-Nvc0tMEwlzhPeva8XXTNky9TXB5teVTOi6i_Avjb3I/edit?usp=sharing';
var sheetName_WSHOM2 = 'Data';

function get_date(t) {
	var varDay = new Date(),
		varYear = varDay.getFullYear(),
		varMonth = varDay.getMonth() + 1,
		varDate = varDay.getDate();
	var varNow;
	if (t == "ymd") {
		varNow = varYear + "/" + varMonth + "/" + varDate;
	} else if (t == "mdy") {
		varNow = varMonth + "/" + varDate + "/" + varYear;
	} else if (t == "dmy") {
		varNow = varDate + "/" + varMonth + "/" + varYear;
	} else if (t == "y") {
		varNow = varYear;
	} else if (t == "m") {
		varNow = varMonth;
	} else if (t == "d") {
		varNow = varDate;
	}
	return varNow;
}

function get_time(t) {
	var varTime = new Date(),
		varHours = varTime.getHours(),
		varMinutes = varTime.getMinutes(),
		varSeconds = varTime.getSeconds();
	var varNow;
	if (t == "hms") {
		varNow = varHours + ":" + varMinutes + ":" + varSeconds;
	} else if (t == "h") {
		varNow = varHours;
	} else if (t == "m") {
		varNow = varMinutes;
	} else if (t == "s") {
		varNow = varSeconds;
	}
	return varNow;
}

window.addEventListener('load', function (e) {

	var fBoardToRun = function (elementId, deviceId, deviceComment, sheetUrl, sheetName) {

		var isReady = false;
		var element = document.getElementById(elementId);
		var initRow = ([('<br/>'), ('<br/>'), ('<br/>'), ('<br/>')].join(''));
		var connSta = deviceComment + ' 嘗試連線...' + initRow;

		element.style.display = 'block';
		element.style.color = 'gray';
		element.style.backgroundColor = 'black';
		element.style.borderColor = 'green';
		element.innerHTML = connSta;

		boardReady({ board: 'Smart', device: deviceId, transport: 'mqtt' }, function (board) {

			isReady = true;

			board.samplingInterval = 50;

			board.on('error', function (err) {

				board.error = err;

				element.style.color = 'gray';
				element.style.backgroundColor = 'black';
				element.style.borderColor = 'green';

				connSta = deviceComment + ' 連線中斷！' + initRow;
				element.innerHTML = connSta;

				setTimeout(function () { fBoardToRun(elementId, deviceId, deviceComment, sheetUrl, sheetName); }, 3000);

			});

			var g3 = getG3(board, 14, 3);

			var myData = {};

			myData.sheetUrl = sheetUrl;
			myData.sheetName = sheetName;

			g3.read(function (evt) {

				var YYYY = String('') + String(get_date("y"));
				var MM = String('') + String(get_date("m"));

				if (get_date("m") < 10) {

					MM = String('0') + String(get_date("m"));

				}

				var DD = String('') + String(get_date("d"));

				if (get_date("d") < 10) {

					DD = String('0') + String(get_date("d"));

				}

				var DateStr = [YYYY, '-', MM, '-', DD].join('');
				var HH = String('') + String(get_time("h"));

				if (get_time("h") < 10) {

					HH = String('0') + String(get_time("h"));

				}

				var MI = String('') + String(get_time("m"));

				if (get_time("m") < 10) {

					MI = String('0') + String(get_time("m"));

				}

				var SS = String('') + String(get_time("s"));

				if (get_time("s") < 10) {

					SS = String('0') + String(get_time("s"));

				}

				var TimeStr = [HH, ':', MI, ':', SS].join('');

				connSta = deviceComment + ' 正在監測中...';

				var PM2_5 = g3.pm25;
				var PM1_0 = g3.pm10;

				if (PM2_5 != 0) {

					myData.column0 = [DateStr, ' ', TimeStr].join('');
					myData.column1 = PM2_5;
					myData.column2 = PM1_0;

					writeSheetData(myData);

					var PM2_5_Text = '(無)';

					if (PM2_5 >= 0 && PM2_5 <= 11) {

						PM2_5_Text = '(低)';
						element.style.color = '#000';
						element.style.backgroundColor = '#9cff9c';
						element.style.borderColor = 'gray';
					}
					else if (PM2_5 >= 12 && PM2_5 <= 23) {

						PM2_5_Text = '(低)';
						element.style.color = '#000';
						element.style.backgroundColor = '#31ff00';
						element.style.borderColor = 'gray';
					}
					else if (PM2_5 >= 24 && PM2_5 <= 35) {

						PM2_5_Text = '(低)';
						element.style.color = '#000';
						element.style.backgroundColor = '#31cf00';
						element.style.borderColor = 'gray';
					}
					else if (PM2_5 >= 36 && PM2_5 <= 41) {

						PM2_5_Text = '(中)';
						element.style.color = '#000';
						element.style.backgroundColor = 'yellow';
						element.style.borderColor = 'gray';
					}
					else if (PM2_5 >= 42 && PM2_5 <= 47) {

						PM2_5_Text = '(中)';
						element.style.color = '#000';
						element.style.backgroundColor = 'ffcf00';
						element.style.borderColor = 'gray';
					}
					else if (PM2_5 >= 48 && PM2_5 <= 53) {

						PM2_5_Text = '(中)';
						element.style.color = '#000';
						element.style.backgroundColor = '#ff9a00';
						element.style.borderColor = 'gray';
					}
					else if (PM2_5 >= 54 && PM2_5 <= 58) {

						PM2_5_Text = '(高)';
						element.style.color = '#000';
						element.style.backgroundColor = '#ff6464';
						element.style.borderColor = 'gray';
					}
					else if (PM2_5 >= 59 && PM2_5 <= 64) {

						PM2_5_Text = '(高)';
						element.style.color = 'gray';
						element.style.backgroundColor = '#red';
						element.style.borderColor = 'gray';
					}
					else if (PM2_5 >= 65 && PM2_5 <= 70) {

						PM2_5_Text = '(高)';
						element.style.color = 'gray';
						element.style.backgroundColor = '#900';
						element.style.borderColor = 'gray';
					}
					else if (PM2_5 >= 71) {

						PM2_5_Text = '(非常高)';
						element.style.color = 'white';
						element.style.backgroundColor = '#ce30ff';
						element.style.borderColor = 'gray';
					}

					element.innerHTML = ([connSta, ('<br/>'), DateStr, ('&nbsp;'), TimeStr, ('<br/>'), 'PM2.5=[', PM2_5, ']', ('&nbsp;'), PM2_5_Text, ('<br/>'), 'PM1.0=[', PM1_0, ']'].join(''));

				}

			}, 1900);

		});

		setTimeout(function () {

			if (!isReady) {

				connSta = deviceComment + ' 連線失敗！' + initRow;
				element.innerHTML = connSta;

				setTimeout(function () { fBoardToRun(elementId, deviceId, deviceComment, sheetUrl, sheetName); }, 3000);

			}

		}, 10000);

	};

	fBoardToRun('demo-area-01-show', deviceId_WSHOM1, deviceComment_WSHOM1, sheetUrl_WSHOM1, sheetName_WSHOM1);
	
  setTimeout(function() {

    fBoardToRun('demo-area-02-show', deviceId_WSHOM2, deviceComment_WSHOM2, sheetUrl_WSHOM2, sheetName_WSHOM2);

  }, 2000);

});
