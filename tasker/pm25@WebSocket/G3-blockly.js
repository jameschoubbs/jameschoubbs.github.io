+(function (window, webduino) {

  'use strict';

  window.getG3 = function(board, rx, tx) {
    return new webduino.module.G3(board, board.getDigitalPin(rx), board.getDigitalPin(tx));
  }

}(window, window.webduino));