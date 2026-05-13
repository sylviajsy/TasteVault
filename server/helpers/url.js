export const IMAGE_BASE_URL = "https:";

export const fixUrl = (url) => {
  if (!url) return null;

  if (url.startsWith("//")) {
    return `${IMAGE_BASE_URL}${url}`;
  }

  return url;
};