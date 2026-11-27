import { useEffect, useRef, useState } from "react";
import { hojeEmBrasilia } from "../datas";

const classesPadrao =
  "w-[80%] max-w-[370px] mt-6 mx-auto xl:mt-8 xl:w-[94%]";

function Calendario({ className = classesPadrao, diaSelecionado = null, aoSelecionarDia }) {
  const hoje = hojeEmBrasilia();
  const listaDiasRef = useRef(null);
  const hojeRef = useRef(null);

  const selecionarData = (data) => {
    if (data > hoje) return;
    if (
      data.getTime() === hoje.getTime() ||
      diaSelecionado?.toDateString() === data.toDateString()
    ) {
      aoSelecionarDia(null);
      return;
    }
    aoSelecionarDia(data);
  };

  const [mesAtual, setMesAtual] = useState(hojeEmBrasilia);

  const mesAnterior = () => {
    setMesAtual(new Date(
      mesAtual.getFullYear(),
      mesAtual.getMonth() - 1,
      1
    ));
  };

  const proximoMes = () => {
    setMesAtual(new Date(
      mesAtual.getFullYear(),
      mesAtual.getMonth() + 1,
      1
    ));
  };

  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();

  const nomeMes = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(mesAtual);

  const quantidadeDias = new Date(ano, mes + 1, 0).getDate();

  useEffect(() => {
    const lista = listaDiasRef.current;
    if (!lista) return;

    let rolavelAntes = false;
    const posicionar = () => {
      const rolavel = lista.scrollWidth > lista.clientWidth;
      if (rolavel && !rolavelAntes) {
        const botaoHoje = hojeRef.current;
        if (botaoHoje) {
          const deslocamento =
            botaoHoje.getBoundingClientRect().left - lista.getBoundingClientRect().left;
          lista.scrollLeft += deslocamento - (lista.clientWidth - botaoHoje.offsetWidth) / 2;
        } else {
          lista.scrollLeft = 0;
        }
      }
      rolavelAntes = rolavel;
    };

    posicionar();
    const observador = new ResizeObserver(posicionar);
    observador.observe(lista);
    return () => observador.disconnect();
  }, [ano, mes]);

  const dias = Array.from({ length: quantidadeDias }, (_, i) => {
    const data = new Date(ano, mes, i + 1);

    return {
      numero: i + 1,
      nome: new Intl.DateTimeFormat("pt-BR", {
        weekday: "short",
      }).format(data).replace(".", ""),
      data,
    };
  });

  return (
    <section className={className}>

      <div className="relative mt-5 w-full box-border border-[5px] border-[#236B55] rounded-[22px] bg-[#E8F5F2] px-3 pt-3 pb-1 xl:pt-4 xl:pb-3">

        <div className="absolute -top-[18px] left-[28%] w-[10px] h-[23px] bg-[#E8F5F2] border-[2px] border-[#236B55] rounded-full"></div>

        <div className="absolute -top-[18px] right-[28%] w-[10px] h-[23px] bg-[#E8F5F2] border-[2px] border-[#236B55] rounded-full"></div>

        <div className="flex items-center justify-between mb-3 px-2">

          <button
            type="button"
            onClick={mesAnterior}
            className="text-[#236B55] font-bold text-xl px-2 hover:scale-110 transition"
          >
            &#10094;
          </button>

          <h2 className="text-[#236B55] font-semibold text-sm capitalize xl:text-lg">
            {nomeMes}
          </h2>

          <button
            type="button"
            onClick={proximoMes}
            className="text-[#236B55] font-bold text-xl px-2 hover:scale-110 transition"
          >
            &#10095;
          </button>

        </div>

        <div ref={listaDiasRef} className="flex gap-[7px] overflow-x-auto pb-2 xl:grid xl:grid-cols-7 xl:gap-x-1.5 xl:gap-y-2 xl:overflow-visible xl:justify-items-center">

          {dias.map((dia, index) => {

            const selecionado =
              diaSelecionado?.toDateString() === dia.data.toDateString();
            const futuro = dia.data > hoje;
            const ehHoje = dia.data.getTime() === hoje.getTime();

            return (
              <button
                key={dia.numero}
                ref={ehHoje ? hojeRef : null}
                type="button"
                onClick={() => selecionarData(dia.data)}
                aria-pressed={selecionado}
                aria-disabled={futuro}
                title={futuro ? "Sem histórico para dias futuros" : undefined}
                className={`flex flex-col items-center gap-[7px] min-w-[35px] shrink-0 xl:w-full xl:min-w-0 xl:gap-1 ${futuro ? "cursor-default opacity-50" : ""}`}
              >

                <span className={`text-[11px] text-[#55A995] capitalize xl:text-sm ${index >= 7 ? "xl:hidden" : ""
                  }`}>
                  {dia.nome}
                </span>

                <span
                  className={`w-[35px] h-[35px] xl:w-full xl:max-w-[38px] xl:h-auto xl:aspect-square rounded-[10px] flex items-center justify-center text-xs shadow-sm transition-all
                ${selecionado
                      ? "bg-[#236B55] text-white font-bold"
                      : "bg-[#9BD7CA] text-[#236B55]"
                    } ${ehHoje && !selecionado ? "ring-2 ring-[#236B55]" : ""}`}
                >
                  {dia.numero}
                </span>

              </button>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default Calendario;
