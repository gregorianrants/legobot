var keypress = require('keypress');
keypress(process.stdin);
const motors = require('./motors.js')

motors.on('ready',()=>{
  console.log('ready')
  process.stdin.on('keypress', function (ch, key) {
    console.log('got "keypress"', key);
    if (key && key.ctrl && key.name == 'c') {
      process.stdin.pause();
    }
  
    if(key.name== 'l'){
      motors.spinLeft()
    }
  
    if(key.name == 'k'){
      motors.forward(60)
    }
  
    if(key.name =='m'){
      motors.reverse(60)
    }
  
    if(key.name=='z'){
      motors.pivotLeft(60)
    }
  
    if(key.name=='x'){
      motors.pivotRight(60)
    }
  
    if(key.name==='q'){
      motors.left(60)
    }
  
    if(key.name==='w'){
      motors.right(60)
  
    }
  
    if(key.name == 's'){
      motors.stop()
    }
  
  })
   
})







process.stdin.setRawMode(true);
process.stdin.resume();
