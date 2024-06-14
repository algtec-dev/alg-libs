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

function validarTituloEleitor(titulo) {
  // Remove caracteres não numéricos (inclui espaços vazios)
  titulo = titulo.replace(/\D/g, '');

  // Verifica se tem exatamente 12 dígitos
  if (titulo.length !== 12) return false;

  // Verifica se todos os dígitos não são iguais
  if (/^(\d)\1*$/.test(titulo)) return false;

  var e = 0,
    t = 0,
    a = titulo.length,
    d = titulo.substr(a - 2, 2),
    c = titulo.substr(a - 4, 2),
    titulo = titulo.substr(0, a - 2),
    a = "01" == c || "02" == c,
    c = (e = 9 * (titulo.charCodeAt(0) - 48) + 8 * (titulo.charCodeAt(1) - 48) + 7 * (titulo.charCodeAt(2) - 48) + 6 * (titulo.charCodeAt(3) - 48) + 5 * (titulo.charCodeAt(4) - 48) + 4 * (titulo.charCodeAt(5) - 48) + 3 * (titulo.charCodeAt(6) - 48) + 2 * (titulo.charCodeAt(7) - 48)) % 11;

  return e = 0 == c ? a ? 1 : 0 : 1 == c ? 0 : 11 - c,
    t = 0 == (c = (t = 4 * (titulo.charCodeAt(8) - 48) + 3 * (titulo.charCodeAt(9) - 48) + 2 * e) % 11) ? a ? 1 : 0 : 1 == c ? 0 : 11 - c,
    d.charCodeAt(0) - 48 == e && d.charCodeAt(1) - 48 == t
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
  if (!obj || typeof prop !== 'string') {
    return undefined;
  }

  const parts = prop.split('.');
  let current = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

export default {
  getHumanDate,
  getOnlyDate,
  validaCpf,
  isValidDate,
  getDottedObjectValue,
  validarTituloEleitor
};
