export const generateId = (prefix: string): string => {
  const randomPart = Math.random().toString(36).substring(2, 11);
  return `${prefix}-${Date.now()}-${randomPart}`;
};
