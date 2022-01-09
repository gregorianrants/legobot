const {Motors} = require("johnny-five");

exports.motors  = new Motors([{
    pins: {
      pwm: 'GPIO10',
      dir: 'GPIO9'
    },
    invertPWM: true
  },
  {
    pins: {
      pwm: 'GPIO8',
      dir: 'GPIO7'
    },
    invertPWM: true
  }
]);