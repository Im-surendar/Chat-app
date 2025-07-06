import { createMessage } from "../api/graphqlclinet";
import type { Message } from "../types/message";

const POST_MESSAGE_MUTATION= `
     mutation PostMessage($channelId: String!, $text: String!, $userId: String!) {
    postMessage(channelId: $channelId, text: $text, userId: $userId) {
      messageId
      text
      datetime
      userId
    }
  }
`


export const postMessage = async (
  channelId: string,
  text: string,
  userId: string
): Promise<Message> => {
  const variables = { channelId, text, userId };
  const data = await createMessage(POST_MESSAGE_MUTATION, variables);
  return data.postMessage;
};