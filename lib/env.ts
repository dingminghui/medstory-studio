function getDeepSeekApiKey(): string {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not set");
  }

  return apiKey;
}

export const serverEnv = {
  get deepseekApiKey() {
    return getDeepSeekApiKey();
  },
};
