window.addEventListener('load', function(e) {
	var ConnSta;
	var g3;
	var myData;
	var YYYY;
	var MM;
	var DD;
	var DateStr;
	var HH;
	var MI;
	var SS;
	var TimeStr;
	var PM2_5;
	var PM1_0;

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


	ConnSta = '嘗試連線...';
	document.getElementById("demo-area-01-show").innerHTML = ConnSta;

	boardReady({board: 'Smart', device: '10VWD5KQ', transport: 'mqtt'}, function (board) {
		board.samplingInterval = 50;
		board.on('error',function (err) {
			board.error = err;
			document.getElementById("demo-area-01-show").innerHTML = '連線中斷！';
		});
		g3 = getG3(board, 14,3);
		myData= {};
		myData.sheetUrl = 'https://docs.google.com/spreadsheets/d/1FOtBgVQuru_b91fbc1VyErKqqGL67EuhulgQPqjfCqU/edit?usp=sharing';
		myData.sheetName = 'WSHOM1Data';
		g3.read(function(evt){
			YYYY = String('') + String(get_date("y"));
			MM = String('') + String(get_date("m"));
			if (get_date("m") < 10) {
				MM = String('0') + String(get_date("m"));
			}
			DD = String('') + String(get_date("d"));
			if (get_date("d") < 10) {
				DD = String('0') + String(get_date("d"));
			}
			DateStr = [YYYY,'-',MM,'-',DD].join('');
			HH = String('') + String(get_time("h"));
			if (get_time("h") < 10) {
				HH = String('0') + String(get_time("h"));
			}
			MI = String('') + String(get_time("m"));
			if (get_time("m") < 10) {
				MI = String('0') + String(get_time("m"));
			}
			SS = String('') + String(get_time("s"));
			if (get_time("s") < 10) {
				SS = String('0') + String(get_time("s"));
			}
			TimeStr = [HH,':',MI,':',SS].join('');
			ConnSta = '正在監測...';
			PM2_5 = g3.pm25;
			PM1_0 = g3.pm10;
			if (PM2_5 != 0) {
				myData.column0 = [DateStr,' ',TimeStr].join('');
				myData.column1 = PM2_5;
				myData.column2 = PM1_0;
				writeSheetData(myData);
				document.getElementById("demo-area-01-show").innerHTML = ([ConnSta,("<br/>"),DateStr,("<br/>"),TimeStr,("<br/>"),'PM2.5=[',PM2_5,']',("<br/>"),'PM1.0=[',PM1_0,']'].join(''));
			}
		}, 1000);
	});
});
