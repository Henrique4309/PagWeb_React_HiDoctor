import { medidas } from "../hooks/useMedicoes";

const classesPadrao = "w-[80%] max-w-[370px] mx-auto mt-4 xl:w-[94%]";

const formatarNumero = (valor, casas = 0) =>
  valor.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });

function ResumoDia({ dia, medida, historico, className = classesPadrao }) {
  if (!dia || !historico) return null;

  const medidaAtual = medidas[medida];
  const { resumo, carregando } = historico;
  const { sufixo } = medidaAtual;

  const itens = [
    { rotulo: "Máximo", valor: resumo ? `${formatarNumero(resumo.maximo)}${sufixo}` : "--" },
    { rotulo: "Mínimo", valor: resumo ? `${formatarNumero(resumo.minimo)}${sufixo}` : "--" },
    { rotulo: "Média", valor: resumo ? `${formatarNumero(resumo.media, 1)}${sufixo}` : "--" },
  ];

  const dataFormatada = dia.toLocaleDateString("pt-BR");

  return (
    <section
      className={className}
      aria-live="polite"
      aria-label={`Resumo de ${medidaAtual.titulo} em ${dataFormatada}`}
    >
      <div className="rounded-[16px] border-[3px] border-[#236B55] bg-[#E8F5F2] px-3 py-2 shadow-sm">
        <p className="mb-2 text-center text-xs font-semibold text-[#236B55] xl:text-sm">
          {medidaAtual.titulo} · {dataFormatada}
        </p>

        <dl className="grid grid-cols-3 gap-2">
          {itens.map((item) => (
            <div
              key={item.rotulo}
              className="flex flex-col items-center rounded-[10px] bg-[#9BD7CA] px-1 py-1.5"
            >
              <dt className="text-[10px] font-medium uppercase text-[#236B55] xl:text-xs">
                {item.rotulo}
              </dt>
              <dd className="text-sm font-bold text-[#1A4F3F] tabular-nums xl:text-base">
                {carregando ? "…" : item.valor}
              </dd>
            </div>
          ))}
        </dl>

        {!carregando && !resumo && (
          <p className="mt-2 text-center text-[11px] text-[#55A995]">
            Sem medições registradas neste dia.
          </p>
        )}
      </div>
    </section>
  );
}

export default ResumoDia;
