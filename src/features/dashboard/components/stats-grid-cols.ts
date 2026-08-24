export const getStatsColClass = (count: number) => {
  if (count <= 2) return "grid-cols-2";
  if (count <= 5) return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";

  return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
};
