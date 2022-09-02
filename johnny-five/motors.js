const {Board,Motor,Motors} = require("johnny-five");
const {EventEmitter} = require('events')
const Raspi = require('raspi-io').RaspiIO;

const board = new Board({
  io: new Raspi()
});

class MotorsEmitter extends EventEmitter{
  constructor ({MAX_SPEED}){
    super()
    this.motors = null       
    this.leftMotors = null       
    this.rightMotors = null
    this.MAX_SPEED = MAX_SPEED       
  }

  configure(){
    const frontLeft = new Motor(Motor.SHIELD_CONFIGS.ADAFRUIT_V2.M1)
    const frontRight = new Motor(Motor.SHIELD_CONFIGS.ADAFRUIT_V2.M2)
    const rearLeft = new Motor(Motor.SHIELD_CONFIGS.ADAFRUIT_V2.M3)
    const rearRight = new Motor(Motor.SHIELD_CONFIGS.ADAFRUIT_V2.M4)
    this.motors = new Motors([frontLeft, frontRight,rearLeft,rearRight])
    this.leftMotors = new Motors([frontLeft,rearLeft])
    this.rightMotors = new Motors([frontRight,rearRight])
    this.emit('ready')
  }

  percentageOfMax(percentage){
    return (this.MAX_SPEED/100)*percentage
  }

  checkWithinLimits(speed){
    if(this.speed>254){
      this.stop()
      throw new Error('motor input can not be higher than 255') 
    }
  }

  setLeftForward(speed){
    this.checkWithinLimits(speed)
    this.leftMotors.forward(speed)
  }

  setRightForward(speed){
    this.checkWithinLimits(speed)
    this.rightMotors.forward(speed)
  }

  setLeftReverse(speed){
    this.checkWithinLimits(speed)
    this.leftMotors.reverse(speed)
  }

  setRightReverse(speed){
    this.checkWithinLimits(speed)
    this.rightMotors.reverse(speed)
  }

  forward(speed){
    this.stop()
    const leftInput = this.percentageOfMax(speed)
    const rightInput =this.percentageOfMax(speed)
    this.setLeftForward(leftInput)
    this.setRightForward(rightInput)
  }

  reverse(speed){
    this.stop()
    const leftInput = this.percentageOfMax(speed)
    const rightInput =this.percentageOfMax(speed)
    this.setLeftReverse(leftInput)
    this.setRightReverse(rightInput)
  }

  pivotLeft(speed){
    this.stop()
    const leftInput = this.percentageOfMax(speed)
    const rightInput =this.percentageOfMax(speed)
    this.setLeftReverse(leftInput)
    this.setRightForward(rightInput)
  }

  pivotRight(speed){
    this.stop()
    const leftInput = this.percentageOfMax(speed)
    const rightInput =this.percentageOfMax(speed)
    this.setLeftForward(leftInput)
    this.setRightReverse(rightInput)
  }

 left(speed){
    this.stop()
    const leftInput = this.percentageOfMax(speed)
    const rightInput =this.percentageOfMax(speed)
    this.setLeftForward(leftInput/2)
    this.setRightForward(rightInput)
  }

  right(speed){
    this.stop()
    const leftInput = this.percentageOfMax(speed)
    const rightInput =this.percentageOfMax(speed)
    this.setLeftForward(leftInput)
    this.setRightForward(rightInput/2)
  }

  stop(){
    this.motors.stop()
  }
}


const motorsEmitter = new MotorsEmitter({MAX_SPEED: 250})


board.on('ready',()=>{
  


  motorsEmitter.configure()

  // let frontLeft = new Motor(Motor.SHIELD_CONFIGS.ADAFRUIT_V2.M1)
  // let frontRight = new Motor(Motor.SHIELD_CONFIGS.ADAFRUIT_V2.M2)
  // let rearLeft = new Motor(Motor.SHIELD_CONFIGS.ADAFRUIT_V2.M3)
  // let rearRight = new Motor(Motor.SHIELD_CONFIGS.ADAFRUIT_V2.M4)
  // let motors = new Motors([frontLeft, frontRight,rearLeft,rearRight])
  // let leftMotors = new Motors([frontLeft,rearLeft])
  // let rightMotors = new Motors([frontRight,rearRight])

  // function spinLeft(){
  //   leftMotors.forward(255)
  // }

  // const MAX_SPEED = 200

  // motorsObj.forward = (speed)=>{
     
  // }

  // motorsObj.reverse = (speed)=>{
  //   leftSpeed = speed
  //   rightSpeed = speed
  //   leftInput = (MAX_SPEED/100)*leftSpeed
  //   rightInput = (MAX_SPEED/100)*rightSpeed
  //   if(leftInput>=254 || rightInput>=254){
  //     motors.stop()
  //     throw new Error('motor input can not be higher than 255') 
  //   }
  //   leftMotors.reverse(leftInput)
  //   rightMotors.reverse(rightInput)
  // }

  // motorsObj.pivotLeft=(speed)=>{
  //   leftSpeed = speed
  //   rightSpeed = speed
  //   leftInput = (MAX_SPEED/100)*leftSpeed
  //   rightInput = (MAX_SPEED/100)*rightSpeed
  //   if(leftInput>=254 || rightInput>=254){
  //     motors.stop()
  //     throw new Error('motor input can not be higher than 255') 
  //   }
  //   leftMotors.reverse(leftInput)
  //   rightMotors.forward(rightInput)
  // }

  // motorsObj.pivotRight=(speed)=>{
  //   leftSpeed = speed
  //   rightSpeed = speed
  //   leftInput = (MAX_SPEED/100)*leftSpeed
  //   rightInput = (MAX_SPEED/100)*rightSpeed
  //   if(leftInput>=254 || rightInput>=254){
  //     motors.stop()
  //     throw new Error('motor input can not be higher than 255') 
  //   }
  //   leftMotors.forward(leftInput)
  //   rightMotors.reverse(rightInput)
  // }

  // motorsObj.left=(speed)=>{
  //   leftSpeed = speed
  //   rightSpeed = speed
  //   leftInput = (MAX_SPEED/100)*leftSpeed
  //   rightInput = (MAX_SPEED/100)*rightSpeed
  //   if(leftInput>=254 || rightInput>=254){
  //     motors.stop()
  //     throw new Error('motor input can not be higher than 255') 
  //   }
  //   leftMotors.forward(rightInput/2)
  //   rightMotors.forward(rightInput)
  // }

  // motorsObj.right=(speed)=>{
  //   leftSpeed = speed
  //   rightSpeed = speed
  //   leftInput = (MAX_SPEED/100)*leftSpeed
  //   rightInput = (MAX_SPEED/100)*rightSpeed
  //   if(leftInput>=254 || rightInput>=254){
  //     motors.stop()
  //     throw new Error('motor input can not be higher than 255') 
  //   }
  //   leftMotors.forward(leftInput)
  //   rightMotors.forward(leftInput/2)
  // }
  

})

module.exports =  motorsEmitter




