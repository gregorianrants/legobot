import time
from gpiozero import DistanceSensor

print("Prepare GPIO Pins")
sensor_l = DistanceSensor(echo=17, trigger=27, queue_len=2)

while True:
        print("Left: {l}".format(l=sensor_l.distance * 100))
        time.sleep(0.1)