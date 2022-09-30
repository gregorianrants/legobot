# import the necessary packages
from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2
import sys
import io
import numpy as np
# initialize the camera and grab a reference to the raw camera capture
camera = PiCamera()
camera.resolution = (320, 240)
camera.framerate = 24
#rawCapture = PiRGBArray(camera, size=(640, 480))
# allow the camera to warmup
time.sleep(2)
# capture frames from the camera
#for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
        # grab the raw NumPy array representing the image, then initialize the timestamp
        # and occupied/unoccupied text
        #image = frame.array
        # show the frame
        #cv2.imshow("Frame", image)
        #key = cv2.waitKey(1) & 0xFF
        #sys.stdout.buffer.write(cv2.imencode(".jpg",image)[1].tobytes())
        # clear the stream in preparation for the next frame
        #rawCapture.seek(0)
        #rawCapture.truncate()
        # if the `q` key was pressed, break from the loop
        #if key == ord("q"):
        #        break

stream = io.BytesIO()
# while True:
#         output = np.empty((240, 320, 3), dtype=np.uint8)
#         camera.capture(output,'rgb')
#         sys.stdout.buffer.write(cv2.imencode(".jpg",output)[1].tobytes())
#         time.sleep(0.01)


for frame in camera.capture_continuous(stream, format="bgr", use_video_port=True):
        stream.seek(0)
        output = np.frombuffer(stream.read(),dtype=np.uint8)
        decoded = output.reshape((240, 320,3))
        image = cv2.cvtColor(decoded, cv2.COLOR_BGR2GRAY)
        image = cv2.GaussianBlur(image, (5, 5), 0)
        canny = cv2.Canny(image, 30, 150)
        sys.stdout.buffer.write(cv2.imencode(".jpg",canny)[1].tobytes())
        stream.seek(0)
        stream.truncate()
