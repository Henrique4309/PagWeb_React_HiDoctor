import { useState } from "react";

import Grafico from "./Grafico";
import Calendario from "./Calendario";
import ResumoDia from "./ResumoDia";
import { medidas, useHistoricoDia } from "../hooks/useMedicoes";

const classesBotao =
  "w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] text-slate-800 px-6 py-3 rounded-lg font-medium transition-all outline-none focus-visible:ring-2 ring-[#48799C] shadow-bottom xl:text-xl";
const classesBotaoSelecionado =
  "!bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] ring-2";

function PainelMedicoes({ cpfPaciente, className, classeCalendario, classeResumo }) {
  const [medidaSelecionada, setMedidaSelecionada] = useState("oxigenio");
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const historicoDia = useHistoricoDia(cpfPaciente, medidaSelecionada, diaSelecionado);

  return (
    <div className={className}>
      <section className={`transition-transform duration-300 ${diaSelecionado ? "-translate-y-3" : ""}`}>
        <Calendario
          className={classeCalendario}
          diaSelecionado={diaSelecionado}
          aoSelecionarDia={setDiaSelecionado}
        />

        <ResumoDia
          className={classeResumo}
          dia={diaSelecionado}
          medida={medidaSelecionada}
          historico={historicoDia}
        />
      </section>

      <Grafico
        cpfPaciente={cpfPaciente}
        medida={medidaSelecionada}
        dia={diaSelecionado}
        historico={historicoDia}
      />

      <section className="w-[80%] max-w-[370px] mx-auto flex flex-col gap-5 mb-5 xl:col-start-1 xl:row-start-1 xl:mt-8">
        {Object.entries(medidas).map(([chave, medida]) => {
          const selecionada = chave === medidaSelecionada;
          return (
            <button
              key={chave}
              type="button"
              aria-pressed={selecionada}
              onClick={() => setMedidaSelecionada(chave)}
              className={`${classesBotao} ${selecionada ? classesBotaoSelecionado : ""}`}
            >
              {medida.botao}
            </button>
          );
        })}
      </section>
    </div>
  );
}

export default PainelMedicoes;
