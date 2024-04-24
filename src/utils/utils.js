function getHumanDate(x) {
  let value;
  try {
    value = new Date(x).toLocaleString();
  } catch (error) {
    value = x;
  }
  return value;
}

function getOnlyDate(x) {
  let value;
  try {
    value = new Date(x).toLocaleDateString();
  } catch (error) {
    value = x;
  }
  return value;
}

export default {
  getHumanDate,
  getOnlyDate,
};
