var deviceComment_WSHOM1 = 'WSHOM1';
var deviceId_WSHOM1 = '10VWD5KQ';
var sheetUrl_WSHOM1 = 'https://docs.google.com/spreadsheets/d/1FOtBgVQuru_b91fbc1VyErKqqGL67EuhulgQPqjfCqU/edit?usp=sharing';
var sheetName_WSHOM1 = 'WSHOM1Data';

var deviceComment_WSHOM2 = 'WSHOM2';
var sheetUrl_WSHOM2 = 'https://docs.google.com/spreadsheets/d/1-Nvc0tMEwlzhPeva8XXTNky9TXB5teVTOi6i_Avjb3I/edit?usp=sharing';
var sheetName_WSHOM2 = 'Data';
var deviceId_WSHOM2 = '10VggPwV';

window.addEventListener('load', function(e) {

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

	var fBoardToRun = function(elementId, deviceId, deviceComment, sheetUrl, sheetName)	{
		
		var ConnSta = deviceComment + ' 嘗試連線...';
		document.getElementById(elementId).innerHTML = ConnSta;

		boardReady({ board: 'Smart', device: deviceId, transport: 'mqtt' }, function (board) {
			
			board.samplingInterval = 50;
			
			board.on('error',function (err) {
				
				board.error = err;
				
				ConnSta = deviceComment + ' 連線中斷！';
				document.getElementById(elementId).innerHTML = ConnSta;
				
				setTimeout(function() { fBoardToRun(elementId, deviceId, deviceComment, sheetUrl, sheetName); }, 1000);
				
			});
			
			var g3 = getG3(board, 14, 3);
			
			var myData= {};
			
			myData.sheetUrl = sheetUrl;
			myData.sheetName = sheetName;
			
			g3.read(function(evt) {
				
				var YYYY = String('') + String(get_date("y"));
				var MM = String('') + String(get_date("m"));
				
				if (get_date("m") < 10) {
					
					MM = String('0') + String(get_date("m"));
					
				}
				
				var DD = String('') + String(get_date("d"));
				
				if (get_date("d") < 10) {
					
					DD = String('0') + String(get_date("d"));
					
				}
				
				var DateStr = [YYYY,'-',MM,'-',DD].join('');
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
				
				var TimeStr = [HH,':',MI,':',SS].join('');
				
				ConnSta = deviceComment + ' 正在監測...';
				
				var PM2_5 = g3.pm25;
				var PM1_0 = g3.pm10;
				
				if (PM2_5 != 0) {
					
					myData.column0 = [DateStr,' ',TimeStr].join('');
					myData.column1 = PM2_5;
					myData.column2 = PM1_0;
					
					writeSheetData(myData);
					
					document.getElementById(elementId).innerHTML = ([ConnSta,('<br/>'),DateStr,('<br/>'),TimeStr,('<br/>'),'PM2.5=[',PM2_5,']',('<br/>'),'PM1.0=[',PM1_0,']'].join(''));
				}
				
			}, 1000);
		});
	};
	
	fBoardToRun('demo-area-02-show', deviceId_WSHOM2, sheetUrl_WSHOM2, sheetName_WSHOM2);

});
