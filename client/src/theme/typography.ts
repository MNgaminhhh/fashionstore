export const fontSize = 14;

export const typography = {
  fontSize,
  htmlFontSize: 16,
  body1: { fontSize },
  body2: { fontSize },
};
export const classes = () => {
  const obj = {};

  for (let i = 1; i < 11; i++) {
    obj[`.p-${i}`] = { padding: i + "rem" };
    obj[`.pt-${i}`] = { paddingTop: i + "rem" };
    obj[`.pb-${i}`] = { paddingBottom: i + "rem" };

    obj[`.m-${i}`] = { margin: i + "rem" };
    obj[`.mt-${i}`] = { marginTop: i + "rem" };
    obj[`.mb-${i}`] = { marginBottom: i + "rem" };
  }

  return obj;
};
