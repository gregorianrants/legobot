from robot import Robot

robot = Robot()

def behaviour(command):
        if(command=='forward'):
                robot.forward(70)
        elif(command=='stop'):
                robot.stop()
        elif(command=='backward'):
                robot.backward(70)
        elif(command=='pivot_left'):
                robot.pivot_left(50)
        elif(command=='pivot_right'):
                robot.pivot_right(50)
        

