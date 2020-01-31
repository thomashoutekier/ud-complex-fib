const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  console.log('calculating fib for ' + index);
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  let f  = fib(parseInt(message));
  console.log('result: ' + f);
  redisClient.hset('values', message, f);
});
sub.subscribe('insert');
