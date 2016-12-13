const Hapi = require('hapi');

const server = new Hapi.Server({ debug: { request: ['error'] } });
const port = process.env.PORT || 8080;
server.connection({ port: port });

const endpoint = process.env.ENDPOINT || '/';

server.route({ 
  method: '*',
  path: endpoint,
  config: {
    payload: {
      parse: false,
      allow: ['application/csp-report']
    }
  },
  handler(request, reply) {
    reply('ok');
    const data = {
      timestamp: new Date(),
      referrer: request.info.referrer,
      url: request.url.pathname,
      userAgent: request.headers['user-agent'],
      query: request.query,
      method: request.method,
      data: request.payload.toString('utf-8')
    }

    const spaces = (process.env.PRETTY == '1') ? 2 : 0;
    console.log(JSON.stringify(data, null, spaces));
  }
});


server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server started on port ${port} listening at ${endpoint}`);
});
