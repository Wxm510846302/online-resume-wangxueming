import { handleResumeLogin } from "../server/resumeAuth.js";

export default async function handler(request) {
  return handleResumeLogin(request);
}
