var deviceComment_WSHOM1 = 'WSHOM1';
var deviceId_WSHOM1 = '10VWD5KQ';
var sheetUrl_WSHOM1 = 'https://docs.google.com/spreadsheets/d/1FOtBgVQuru_b91fbc1VyErKqqGL67EuhulgQPqjfCqU/edit?usp=sharing';
var sheetName_WSHOM1 = 'Data';
var deviceIP_WSHOM1 = '192.168.1.122';

var deviceComment_WSHOM2 = 'WSHOM2';
var deviceId_WSHOM2 = '10VggPwV';
var sheetUrl_WSHOM2 = 'https://docs.google.com/spreadsheets/d/1-Nvc0tMEwlzhPeva8XXTNky9TXB5teVTOi6i_Avjb3I/edit?usp=sharing';
var sheetName_WSHOM2 = 'Data';
var deviceIP_WSHOM2 = '192.168.1.124';

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

function isValid_PM2_5(value) {

    return !(value == 0 || value == 4352);
}

window.addEventListener('load', function (e) {

    var fBoardToRun = function (options) {

        var f2PrepareBorad = function () {

            var isReady = false;
            var element = document.getElementById(options.elementId);
            var initRow = ([('<br/>'), ('<br/>'), ('<br/>'), ('<br/>')].join(''));
            var connSta = options.deviceComment + ' 嘗試連線...' + initRow;

            element.style.display = 'block';
            element.style.color = 'gray';
            element.style.backgroundColor = 'black';
            element.style.borderColor = 'green';
            element.innerHTML = connSta;

            boardReady({ board: 'Smart', url: options.deviceIP }, function (board) {

                isReady = true;

                board.samplingInterval = 4899;

                board.on('error', function (err) {

                    isReady = false;

                    board.error = err;

                    element.style.color = 'gray';
                    element.style.backgroundColor = 'black';
                    element.style.borderColor = 'green';

                    connSta = options.deviceComment + ' 連線中斷！' + initRow;
                    element.innerHTML = connSta;

                    setTimeout(f2PrepareBorad, 3000);
                });

                var g3 = getG3(board, 14, 3);
                var myData = {};

                myData.sheetUrl = options.sheetUrl;
                myData.sheetName = options.sheetName;

                var readInterval = 4899;
                var checkInterval = readInterval + 10000;
                var readData = null;

                var f3ReadData = function () {

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

                        var timeStr = [HH, ':', MI, ':', SS].join('');

                        readData = timeStr;

                        connSta = options.deviceComment + ' 正在監測中...';

                        var PM2_5 = g3.pm25;
                        var PM1_0 = g3.pm10;

                        options.readCount++;

                        if (isValid_PM2_5(PM2_5)) {

                            options.okCount++;

                            myData.column0 = [DateStr, ' ', timeStr].join('');
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

                            element.innerHTML = ([
                                connSta, ('<br/>'), DateStr, ('&nbsp;'), timeStr, ('<br/>'),
                                'PM2.5=[', PM2_5, ']', ('&nbsp;'), PM2_5_Text, ('<br/>'),
                                'PM1.0=[', PM1_0, ']', ('<br/>'),
                                '<span name="readCount">', options.okCount, '/', options.readCount, '</span>'
                            ].join(''));
                        }
                        else {

                            element.innerHTML = ([
                                connSta, ('<br/>'), DateStr, ('&nbsp;'), timeStr, ('<br/>'),
                                'PM2.5=[', PM2_5, ']', ('&nbsp;'), '(讀值異常)', ('<br/>'),
                                'PM1.0=[', PM1_0, ']', ('<br/>'),
                                '<span name="readCount">', options.okCount, '/', options.readCount, '</span>'
                            ].join(''));
                        }

                    }, readInterval);

                    var f4ReadCheck = function () {

                        var lastData = readData;

                        setTimeout(function () {

                            if (isReady) {

                                if (lastData == readData) {

                                    connSta = options.deviceComment + ' 讀取失敗！' + initRow;
                                    element.innerHTML = connSta;

                                    lastData = readData;

                                    setTimeout(function () {

                                        connSta = options.deviceComment + ' 嘗試讀取...' + initRow;
                                        element.innerHTML = connSta;

                                        f3ReadData();

                                    }, 3000);
                                }
                                else {

                                    setTimeout(f4ReadCheck, 0);
                                }
                            }

                        }, checkInterval);
                    };

                    f4ReadCheck();
                };

                f3ReadData();
            });

            setTimeout(function () {

                if (!isReady) {

                    connSta = options.deviceComment + ' 連線失敗！' + initRow;
                    element.innerHTML = connSta;

                    setTimeout(f2PrepareBorad, 3000);
                }

            }, 10000);
        };

        f2PrepareBorad();
    };

    var dev1Opts = {
        elementId: 'demo-area-01-show',
        deviceId: deviceId_WSHOM1,
        deviceComment: deviceComment_WSHOM1,
        sheetUrl: sheetUrl_WSHOM1,
        sheetName: sheetName_WSHOM1,
        deviceIP: deviceIP_WSHOM1,
        readCount: 0,
        okCount: 0
    };

    var dev2Opts = {
        elementId: 'demo-area-02-show',
        deviceId: deviceId_WSHOM2,
        deviceComment: deviceComment_WSHOM2,
        sheetUrl: sheetUrl_WSHOM2,
        sheetName: sheetName_WSHOM2,
        deviceIP: deviceIP_WSHOM2,
        readCount: 0,
        okCount: 0
    };

    fBoardToRun(dev1Opts);
    fBoardToRun(dev2Opts);

});
