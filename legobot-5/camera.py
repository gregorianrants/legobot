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
from behaviour import behaviour
from pubsub import getCommand,publishImage

def pixelFromPercentage(num_pixels,percentage):
    return int((num_pixels/100)*percentage)

def get_corner(img,x_percent,y_percent):
    y_max,x_max,_ = img.shape
    x = pixelFromPercentage(x_max,x_percent)
    y = pixelFromPercentage(y_max,y_percent)
    return x,y

def get_corners(img,top_left,bottom_right):
    (x1,y1)=get_corner(img,top_left[0],top_left[1])
    (x2,y2)=get_corner(img,bottom_right[0],bottom_right[1])
    top_left = (x1,y1)
    top_right = (x2,y2)
    return top_left,top_right

def get_slice(img,top_left,bottom_right):
        top_x = top_left[0]
        top_y = top_left[1]
        bottom_x = bottom_right[0]
        bottom_y = bottom_right[1]
        return img[top_y:bottom_y,top_x:bottom_x]


camera = PiCamera()
camera.resolution = (320, 240)
camera.framerate = 24
time.sleep(2)
stream = io.BytesIO()



for frame in camera.capture_continuous(stream, format="bgr", use_video_port=True):
        stream.seek(0)
        output = np.frombuffer(stream.read(),dtype=np.uint8)
        image = output.reshape((240, 320,3))
        top_left,bottom_right = get_corners(image,(25,75),(75,100))
        roi = get_slice(image,top_left,bottom_right)
        target = np.copy(image)
        hsvt = cv2.cvtColor(target,cv2.COLOR_BGR2HSV)
        #roi = target[200:240,150:200]
        hsv = cv2.cvtColor(roi,cv2.COLOR_BGR2HSV)
        # calculating object histogram
        roihist = cv2.calcHist([hsv],[0, 1], None, [180, 256], [0, 180, 0, 256] )
        # normalize histogram and apply backprojection
        cv2.normalize(roihist,roihist,0,255,cv2.NORM_MINMAX)
        dst = cv2.calcBackProject([hsvt],[0,1],roihist,[0,180,0,256],1)
        #Now convolute with circular disc
        disc = cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(6,6))
        cv2.filter2D(dst,-1,disc,dst)
        #threshold and binary AND
        ret,thresh = cv2.threshold(dst,25,255,0)
        thresh = cv2.merge((thresh,thresh,thresh))
        res = cv2.bitwise_and(target,thresh)
        bgr_back = cv2.cvtColor(dst,cv2.COLOR_GRAY2BGR)
        res = np.hstack((target,res))
        bytes = cv2.imencode(".jpg",res)[1].tobytes()
        b64_string = base64.b64encode(bytes)
        publishImage(b64_string)
        message = getCommand()
        if message:
                behaviour(message)

        

        stream.seek(0)
        stream.truncate()

#opencv-python==4.6.0.66