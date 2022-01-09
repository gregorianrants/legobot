const Redis = require('ioredis')

const pub = new Redis()

const channel = 'motors'

const sleep = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

function forward() {
        console.log('publishing forward')
        pub.publish(channel, 'forward');
}

function stop(){
        console.log('publishing stop')
        pub.publish(channel,'stop')
}

function reverse(){
        console.log()
}

async function main(){
        await sleep(3)
        forward()
        await sleep(3)
        stop()
}

module.exports = {
        forward,
        stop,
}



main();