const lines = [
  "Line One",
  "Line Two..",
  "Line Three",
];

let currIdx = 0;
export const getLine = () => {
  if(currIdx === lines.length) return -1;
  let lineArray = [];
  let line = lines[currIdx++];
  for (let i = 0; i < line.length; i++) {
    lineArray.push(`${line[i]}`);
  }

  return lineArray;
};
