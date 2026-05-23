export const formatGeo = (geo) => {
  if (!geo) return null;

  const { country, region, city } = geo;

  if (!country && !region && !city) return null;

  return [city, region, country].filter(Boolean).join(", ");
};
