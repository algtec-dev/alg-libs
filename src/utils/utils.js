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

  const digitos = titulo.split('').map(Number);

  // Função para calcular os dígitos verificadores
  const calcDigito = (limite) => {
    let soma = 0;
    for (let i = 0; i < limite; i++) {
      soma += digitos[i] * (limite + 1 - i);
    }
    const resto = 11 - (soma % 11);
    return resto >= 10 ? 0 : resto;
  };

  // Calcula os dois dígitos verificadores
  const digito10 = calcDigito(8);
  const digito11 = calcDigito(11);

  // Verifica se os dígitos verificadores estão corretos
  return digitos[10] === digito10 && digitos[11] === digito11;
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
