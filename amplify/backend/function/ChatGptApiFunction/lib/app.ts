import { AxiosError } from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import handler from 'requestOpenAI';
import config from './resources/config.json';
import { WebhookEvent, middleware } from '@line/bot-sdk';
import { textEventHandler } from 'lineApi';

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

if (Object(config)[app.get('env')]) {
  Object.assign(process.env, Object(config)[app.get('env')]);
}
/** ********************
 * Example get method *
 ********************* */

app.get('/chat', async (req, res) => {
  try {
    const result = await handler('comment');
    console.log(process.env.OPENAI_API_KEY);
    console.log(process.env.CHANNEL_ACCESS_TOKEN);
    console.log(process.env.CHANNEL_SECRET);
    res.json({ success: 'get call succeed!', url: req.url, result });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(axiosError);

    // エラーメッセージをクライアントに送るか、適切なステータスコードを設定
    res.status(500).json({ error: 'An error occurred!' });
  }
});

app.post(
  '/line',
  // middleware({
  //   channelSecret: `${process.env.CHANNEL_SECRET as string}`,
  // }),
  async (req, res) => {
    try {
      console.log(req.body.events);
      const events: WebhookEvent[] = req.body.events;

      // Promise.allを使用してすべてのイベントを処理
      await Promise.all(
        events.map(async (event: WebhookEvent) => {
          try {
            console.log(event);
            const result = await textEventHandler(event);
            if (result) console.log(result);
          } catch (error) {
            console.error(error);
            // エラーが発生した場合にリクエストを中断
            throw error;
          }
        }),
      );
      // すべてのプロミスが解決されたら、ステータスコード200を返す
      res.status(200).end();
    } catch (error) {
      // エラーが発生した場合にはステータスコード500を返す
      res.status(500).end();
    }
  },
);

app.get('/chat/*', (req, res) => {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url });
});

/** **************************
 * Example post method *
 *************************** */

app.post('/chat', (req, res) => {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body });
});

app.post('/chat/*', (req, res) => {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body });
});

/** **************************
 * Example put method *
 *************************** */

app.put('/chat', (req, res) => {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body });
});

app.put('/chat/*', (req, res) => {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body });
});

/** **************************
 * Example delete method *
 *************************** */

app.delete('/chat', (req, res) => {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.delete('/chat/*', (req, res) => {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.listen(3000, () => {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app;
