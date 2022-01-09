var keypress = require('keypress');
keypress(process.stdin);

const {Board,Motors} = require("johnny-five");
const Raspi = require('raspi-io').RaspiIO;

let motors = {}

const board = new Board({
    io: new Raspi({enableSoftPwm: true})
  });

board.on('ready',()=>{

  motors = new Motors([{
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

  motors.stop()
})

function left(){
  motors[0].reverse(100)
  motors[1].forward(100)
}

function right(){
  motors[1].reverse(100)
  motors[0].forward(100)
}

process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }

  if(key.name == 'k'){
    motors.stop()
    motors.forward(100)
  }

  if(key.name =='m'){
    motors.stop()
    motors.reverse(100)
  }

  if(key.name=='z'){
    motors.stop()
    left()
  }

  if(key.name=='x'){
    motors.stop()
    right()
  }

  if(key.name == 's'){
    motors.stop()
  }
  
});

process.stdin.setRawMode(true);
process.stdin.resume();
