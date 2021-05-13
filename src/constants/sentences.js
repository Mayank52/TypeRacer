const lines = [
  "there are some spherical balloons",
  "For each balloon, provided input is the start and end coordinates of the horizontal diameter",
];
export const getLine = () => {
  let lineArray = [];
  let line = lines[0];
  for (let i = 0; i < line.length; i++) {
      lineArray.push(`${line[i]}`);
  }

  return lineArray;
};
