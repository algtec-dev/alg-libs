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

function validaCpf(c) {
  if (!c) return false;
  const notDig = (i) => ![".", "-", " "].includes(i);
  const prepare = (cpf) => cpf.trim().split("").filter(notDig).map(Number);
  const is11Len = (cpf) => cpf.length === 11;
  const notAllEquals = (cpf) => !cpf.every((i) => cpf[0] === i);
  const onlyNum = (cpf) => cpf.every((i) => !isNaN(i));

  const calcDig = (limit) => (a, i, idx) => a + i * (limit + 1 - idx);
  const somaDig = (cpf, limit) => cpf.slice(0, limit).reduce(calcDig(limit), 0);
  const resto11 = (somaDig) => 11 - (somaDig % 11);
  const zero1011 = (resto11) => ([10, 11].includes(resto11) ? 0 : resto11);

  const getDV = (cpf, limit) => zero1011(resto11(somaDig(cpf, limit)));
  const verDig = (pos) => (cpf) => getDV(cpf, pos) === cpf[pos];

  const checks = [is11Len, notAllEquals, onlyNum, verDig(9), verDig(10)];
  const checkAll = (cpf) => checks.map((f) => f(cpf)).every((r) => !!r);

  return checkAll(prepare(c));
}

function isValidDate(dateString) {
  var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateString)) return false;
  var [day, month, year] = dateString.split("/").map(Number);
  var date = new Date(year, month - 1, day);
  return (
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year
  );
}

function getDottedObjectValue(obj, prop) {
  var parts = prop.split('.');

  if (parts.length == 1) {
    return obj[prop];
  }

  if (Array.isArray(parts)) {
    var last = parts.pop(),
      l = parts.length,
      i = 1,
      current = parts[0];

    while ((obj = obj[current]) && i < l) {
      current = parts[i];
      i++;
    }

    if (obj) {
      return obj[last];
    }
  } else {
    throw 'parts is not valid array';
  }
}

export default {
  getHumanDate,
  getOnlyDate,
  validaCpf,
  isValidDate,
  getDottedObjectValue
};
