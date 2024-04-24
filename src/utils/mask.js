function cellphoneMask(x) {
  let value;
  try {
    value = `(${x[0]}${x[1]}) ${x.substring(2, 7)}-${x.substring(7)}`;
  } catch (error) {
    value = x;
  }
  return value;
}

function cnpjMask(x) {
  let value;
  try {
    value = x.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5");
  } catch (error) {
    value = x;
  }
  return value;
}

function moneyMask(x) {
  let value;
  try {
    if (x == undefined) x = 0;
    value = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(x / 100);
  } catch (error) {
    value = x;
  }
  return value;
}

export default {
  cellphoneMask,
  cnpjMask,
  moneyMask,
};
