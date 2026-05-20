export const getTime = () => {
  const dt = new Date();
  const hr = String(dt.getHours()).padStart(2, "0");
  const min = String(dt.getMinutes()).padStart(2, "0");
  const sec = String(dt.getSeconds()).padStart(2, "0");
  return `${hr}:${min}:${sec}`;
};