var five = require('johnny-five')
var Controller = require('logitech-dual-action-controller')
var board = new five.Board()

board.on('ready', init)

function init () {
  var motors = initMotors()
  initController(motors)
  this.repl.inject({
    motors: motors,
    l: motors[0],
    r: motors[1]
  })
}

function initMotors () {
  var config = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V1
  return [config.M1, config.M2].map(function (c) { return new five.Motor(c)})
}

function initController (motors) {
  var controller = new Controller()
  ;['left:move', 'right:move'].map(function (evt, i) {
    controller.on(evt, onStickMove.bind(null, motors[i]))
  })
  controller.on('2:press', function () {
    motors.map(function (m) {m.stop()})
  })
}

function onStickMove (motor, data) {
  var speed = five.Fn.map(Math.abs(data.y), 0, 100, 0, 255)
  var dir = data.y < 0 ? 'reverse' : 'forward'
  motor[dir](speed)
}
