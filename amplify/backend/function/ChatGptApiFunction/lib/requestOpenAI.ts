// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as fs from 'fs';
import path from 'path';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

type ChatRequestData = {
  model: string;
  messages: { role: string; content: string }[];
  max_tokens: number;
};

type ChatResponseData = {
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
};

const endpoint = 'https://api.openai.com/v1/chat/completions';

const chat = async (prompt: string, maxTokens: number): Promise<string> => {
  const requestData: ChatRequestData = {
    model: 'gpt-3.5-turbo',
    // model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: fs.readFileSync(path.join(__dirname, 'resources', 'role.txt'), 'utf-8'),
      },
      { role: 'user', content: prompt },
    ],
    max_tokens: maxTokens,
  };
  console.log('role', requestData.messages[0].content);

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY as string}`,
    },
  };

  const res = await axios.post<ChatResponseData>(endpoint, requestData, config);
  // const res = await Promise.resolve({ data: { choices: [{ message: { content: prompt } }] } });
  const { message } = res.data.choices[0];

  return message.content;
};

const prompt = (context: string) => {
  const template = fs.readFileSync(path.join(__dirname, 'resources', 'template.txt'), 'utf-8');

  return template.replace('[[CONTEXT]]', context);
};

const validate = (content: string) => {
  // validate evaluations
  if (content.length === 0) {
    return { valid: false, message: 'context must not be empty' };
  }

  return { valid: true, message: '' };
};

const handler = async (context: string): Promise<string | null> => {
  // Parse Request Body as EvaluationsType
  const { valid, message } = validate(context);
  if (!valid) {
    console.error(message);

    return null;
  }

  // call openai api
  const maxTokens = 2000;

  try {
    const text = await chat(prompt(context), maxTokens);

    return text;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(axiosError);

    return null;
  }
};

export default handler;
