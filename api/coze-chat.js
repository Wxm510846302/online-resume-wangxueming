import { handleCozeChat } from "../server/cozeProxy.js";

export default async function handler(request) {
  return handleCozeChat(request);
}
