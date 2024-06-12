import utils from "./utils";

// validações genericas

function sizeRule(size, text) {
  return (value) => {
    if (!value) return true;
    if (typeof value == "number") value = value.toString();
    return (
      (value || " ").length === size ||
      (text ?? `Aceita exatamente ${size} caracteres`)
    );
  };
}

function minSizeRule(size, text) {
  return (value) => {
    if (!value) return true;
    if (typeof value == "number") value = value.toString();
    return (
      (value || " ").length >= size ||
      (text ?? `Informe pelo menos ${size} caracteres`)
    );
  };
}

function maxSizeRule(size, text) {
  return (value) => {
    if (!value) return true;
    if (typeof value == "number") value = value.toString();
    return (
      (value || " ").length <= size || (text ?? `Aceita até ${size} caracteres`)
    );
  };
}

function regexRule(regex, text) {
  return (value) => {
    if (!value) return true;
    return regex.test(value) || (text ?? "Valor Inválido");
  };
}

function required(text) {
  return (value) => !!value || (text ?? "Campo Obrigatório");
}

function requiredMultipleSelect(text) {
  return (value) => value.length > 0 || (text ?? "Campo Obrigatório");
}

// validações especificas

function cpfRule(text) {
  return (value) => {
    if (!value) return true;
    return utils.validaCpf(value) || (text ?? "CPF Inválido");
  };
}

function tituloEleitorRule(text) {
  return (value) => {
    if (!value) return true;
    return utils.validarTituloEleitor(value) || (text ?? "Título Inválido");
  };
}

function emailRule(text) {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (value) => {
    if (!value) return true;
    return regex.test(value) || (text ?? "Email incorreto");
  };
}

function brDateRule(text) {
  return (value) => {
    if (!value) return true;
    return utils.isValidDate(value) || (text ?? "Data incorreta");
  };
}

// Função para validar uma data mínima
function minBrDateRule(minDate, text) {
  if (!utils.isValidDate(minDate)) {
    throw new Error("Data mínima fornecida não está no formato correto.");
  }
  return function (value) {
    if (!value) return true;
    if (!utils.isValidDate(value)) return text ?? "Data incorreta";
    var [minDay, minMonth, minYear] = minDate.split("/").map(Number);
    var [day, month, year] = value.split("/").map(Number);
    var date = new Date(year, month - 1, day);
    var minDateTime = new Date(minYear, minMonth - 1, minDay);
    return (
      date >= minDateTime ||
      (text ?? `Data deve ser maior ou igual a ${minDate}`)
    );
  };
}

// Função para validar uma data máxima
function maxBrDateRule(maxDate, text) {
  if (!utils.isValidDate(maxDate)) {
    throw new Error("Data máxima fornecida não está no formato correto.");
  }
  return function (value) {
    if (!value) return true;
    if (!utils.isValidDate(value)) return text ?? "Data incorreta";
    var [maxDay, maxMonth, maxYear] = maxDate.split("/").map(Number);
    var [day, month, year] = value.split("/").map(Number);
    var date = new Date(year, month - 1, day);
    var maxDateTime = new Date(maxYear, maxMonth - 1, maxDay);
    return (
      date <= maxDateTime ||
      (text ?? `Data deve ser menor ou igual a ${maxDate}`)
    );
  };
}

export default {
  regexRule,
  sizeRule,
  minSizeRule,
  maxSizeRule,
  required,
  requiredMultipleSelect,
  cpfRule,
  emailRule,
  brDateRule,
  minBrDateRule,
  maxBrDateRule,
  tituloEleitorRule
};
