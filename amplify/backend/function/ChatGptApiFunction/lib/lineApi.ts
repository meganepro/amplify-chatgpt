import { Client, WebhookEvent, TextMessage, MessageAPIResponseBase } from '@line/bot-sdk';
import handler from 'requestOpenAI';

const client = new Client({
  channelAccessToken: `${process.env.CHANNEL_ACCESS_TOKEN as string}`,
});

export const textEventHandler = async (
  event: WebhookEvent,
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const { replyToken } = event;
  const { text } = event.message;
  const response: TextMessage = {
    type: 'text',
    text: (await handler(text)) || 'ごめんなさい。よくわかりませんでした。',
  };
  return await client.replyMessage(replyToken, response);
};
