export const generateNextId = (data, prefix) => {
  const existingIds = Object.keys(data)
    .map((key) => {
      const match = key.match(new RegExp(`^${prefix}_(\\d+)$`));
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((num) => num !== null);

  const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 0;
  return `${prefix}_${nextId}`;
};
