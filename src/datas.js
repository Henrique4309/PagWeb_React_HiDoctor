export const fusoBrasilia = "America/Sao_Paulo";

export function hojeEmBrasilia() {
  const [ano, mes, dia] = new Intl.DateTimeFormat("en-CA", { timeZone: fusoBrasilia })
    .format(new Date())
    .split("-")
    .map(Number);
  return new Date(ano, mes - 1, dia);
}
