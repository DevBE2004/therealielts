export const urlToFile = async (url: string, fileName?: string): Promise<File> => {
  const res = await fetch(url);
  const blob = await res.blob();
  const name = fileName || url.split('/').pop() || 'image.jpg';
  return new File([blob], name, { type: blob.type });
};