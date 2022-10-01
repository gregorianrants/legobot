from redis import Redis

redis_p = Redis(host = 'localhost', port = 6379)
CAMERA_CHANNEL = 'camera'

redis_s = Redis(host = 'localhost', port = 6379)
subscriber = redis_s.pubsub()
subscriber.subscribe('command')

def getCommand():
        message = subscriber.get_message()
        if message and not message['data']==1: 
                print(message['data'])
                return message['data'].decode('utf-8')
        else:
                return False
                

def publishImage(b64_string):
        redis_p.publish(CAMERA_CHANNEL,b64_string)