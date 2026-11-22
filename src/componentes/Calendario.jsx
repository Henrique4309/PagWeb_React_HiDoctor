import { useState } from "react";

const classesPadrao =
  "w-[80%] max-w-[370px] mt-6 mx-auto xl:col-start-3 xl:row-start-1 xl:mt-8 xl:w-[94%]";

// Calendário mensal em que o paciente marca/desmarca dias.
// className: substitui as classes de tamanho/posição do calendário (opcional)
function Calendario({ className = classesPadrao }) {
  // Dias escolhidos pelo paciente
  const [datasSelecionadas, setDatasSelecionadas] = useState([]);

  // Seleção de dias
  const selecionarData = (data) => {
    const existe = datasSelecionadas.some(
      (item) => item.toDateString() === data.toDateString()
    );

    if (existe) {
      // Se já estiver selecionada, remove
      setDatasSelecionadas(
        datasSelecionadas.filter(
          (item) => item.toDateString() !== data.toDateString()
        )
      );
    } else {
      // Se não estiver selecionada, adiciona
      setDatasSelecionadas([...datasSelecionadas, data]);
    }
  };

  // Mês exibido
  const [mesAtual, setMesAtual] = useState(new Date());

  // Voltar um mês
  const mesAnterior = () => {
    setMesAtual(new Date(
      mesAtual.getFullYear(),
      mesAtual.getMonth() - 1,
      1
    ));
  };

  // Avançar um mês
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

  const dias = Array.from({ length: quantidadeDias }, (_, i) => {
    const data = new Date(ano, mes, i + 1);

    return {
      numero: i + 1,
      nome: new Intl.DateTimeFormat("pt-BR", {
        weekday: "short",
      }).format(data).replace(".", ""),
      data: data,
    };
  });

  //   const salvarDatasAPI = async () => {
  //   try {
  //     const resposta = await fetch("URL_DA_API", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         pacienteId: usuario.id,
  //         datas: datasSelecionadas.map(data =>
  //           data.toISOString().split("T")[0]
  //         ),
  //       }),
  //     });

  //     if (!resposta.ok) {
  //       throw new Error("Erro ao salvar datas");
  //     }

  //   } catch (erro) {
  //     console.error(erro);
  //   }
  // };

  return (
    <section className={className}>

      <div className="relative mt-5 w-full box-border border-[5px] border-[#236B55] rounded-[22px] bg-[#E8F5F2] px-3 pt-3 pb-1 xl:pt-4 xl:pb-3">

        {/* Detalhes superiores */}
        <div className="absolute -top-[18px] left-[28%] w-[10px] h-[23px] bg-[#E8F5F2] border-[2px] border-[#236B55] rounded-full"></div>

        <div className="absolute -top-[18px] right-[28%] w-[10px] h-[23px] bg-[#E8F5F2] border-[2px] border-[#236B55] rounded-full"></div>

        <div className="flex items-center justify-between mb-3 px-2">

          {/* Mês anterior */}
          <button
            type="button"
            onClick={mesAnterior}
            className="text-[#236B55] font-bold text-xl px-2 hover:scale-110 transition"
          >
            &#10094;
          </button>

          {/* Nome do mês */}
          <h2 className="text-[#236B55] font-semibold text-sm capitalize xl:text-lg">
            {nomeMes}
          </h2>

          {/* Próximo mês */}
          <button
            type="button"
            onClick={proximoMes}
            className="text-[#236B55] font-bold text-xl px-2 hover:scale-110 transition"
          >
            &#10095;
          </button>

        </div>

        {/* Dias */}
        <div className="flex gap-[7px] overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#76C9B7] xl:grid xl:grid-cols-7 xl:gap-x-1.5 xl:gap-y-2 xl:overflow-visible xl:justify-items-center">

          {dias.map((dia, index) => {

            const selecionado = datasSelecionadas.some(
              (item) => item.toDateString() === dia.data.toDateString());

            return (
              <button
                key={dia.numero}
                type="button"
                onClick={() => selecionarData(dia.data)}
                className="flex flex-col items-center gap-[7px] min-w-[35px] shrink-0 xl:w-full xl:min-w-0 xl:gap-1"
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
                    }`}
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
