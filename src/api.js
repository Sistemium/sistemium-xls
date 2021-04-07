import Koa from 'koa';
import koaBody from 'koa-bodyparser';
import logger from 'koa-logger';
import Router from '@koa/router';
import log from 'sistemium-debug';
import assert from 'assert';
import post from './post';

const { debug } = log('api');

const { PORT } = process.env;
const app = new Koa();
const router = new Router();

router
  .post('/xlsx', post);

app
  .use(logger())
  .use(koaBody())
  .use(router.routes());

if (!module.parent) {
  assert(PORT);
  app.listen(PORT);
  debug('port', PORT);
}

export default app;
