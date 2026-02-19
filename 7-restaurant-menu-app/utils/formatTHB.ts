export const formatTHB = (value: number) => {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  return (
    sign +
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(abs)
  );
};
