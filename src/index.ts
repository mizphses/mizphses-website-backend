import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './routes/auth';
import contents from './routes/contents';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use('*', cors());

app.get('/', (c) => {
  return c.text('Hello World!');
});

app.route('/auth', auth);
app.route('/contents', contents);

export default app;
