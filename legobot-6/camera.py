# import the necessary packages
from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2
import sys
import io
import numpy as np
import base64
import time
from pubsub import getCommand,publishImage

camera = PiCamera()
camera.resolution = (320, 240)
camera.framerate = 24
time.sleep(2)
stream = io.BytesIO()

for frame in camera.capture_continuous(stream, format="bgr", use_video_port=True):
        stream.seek(0)
        output = np.frombuffer(stream.read(),dtype=np.uint8)
        image = output.reshape((240, 320,3))
        bytes = cv2.imencode(".jpg",image)[1].tobytes()
        b64_string = base64.b64encode(bytes)
        publishImage(b64_string)
        message = getCommand()
        stream.seek(0)
        stream.truncate()

#opencv-python==4.6.0.66