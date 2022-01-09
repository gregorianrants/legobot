# CamJam EduKit 3 - Robotics
# Worksheet 3 - Motor Test Code
import time # Import the Time library
from gpiozero import CamJamKitRobot # Import the CamJam GPIO Zero Library
robot = CamJamKitRobot()
# Turn the motors on
#robot.forward()
# Wait for 1 seconds
# time.sleep(10)

# robot.backward()

# time.sleep(10)
# # Turn the motors off
# robot.stop()

import redis

def handleMessage(message):
        if(message=='forward'):
                print('going forth')
                robot.forward()
        elif(message=='stop'):
                print('backing off')
                robot.stop()



subscriber = redis.Redis(host = 'localhost', port = 6379)
channel = 'motors'
p = subscriber.pubsub()
p.subscribe(channel)
while True:
 message = p.get_message()
 if message and not message['data'] == 1:
  message = message['data'].decode('utf-8')
  handleMessage(message)

