import { useState } from "react";

import Grafico from "./Grafico";
import Calendario from "./Calendario";
// Se quiser manter uma imagem padrão caso o usuário não tenha URL, pode importar, 
// mas usaremos paciente.url diretamente do banco.

function DadosPaciente({ paciente, onVoltar }) {

  // Controla o gràfico clicando nos boões
  const [medidaSelecionada, setMedidaSelecionada] = useState("oxigenio");

  if (!paciente) return null;

  const informacoes = paciente.informacoes || {};

  return (
    <section className="flex flex-col items-center">
      {onVoltar && (
        <button
          type="button"
          onClick={onVoltar}
          className="self-start ml-[10%] mt-4 text-[#236B55] font-semibold hover:underline xl:ml-[5%]"
        >
          &#10094; Voltar
        </button>
      )}
      <section className="bg-[linear-gradient(to_Bottom,#F9FFFF_0%,#E6F4FA_50%,#C9E6EF_100%)] flex items-center justify-center gap-6 h-26 px-4 w-[80%] rounded-lg mt-5 shadow-[0_8px_6px_-2px_rgba(0,0,0,0.15)]  xl:w-[45%] xl:max-w-[500px] xl:self-start xl:ml-[5%] xl:h-48">
        <div className="flex items-center justify-start gap-4 w-full max-w-2xl py-2 xl:w-full ">
          <img
            className="w-20 h-20 rounded-md object-cover xl:w-40 xl:h-40"
            src={paciente.url}
            alt={`Foto de ${paciente.nome}`}
          />

          <div className="text-slate-800">
            <h1 className="font-bold text-lg mb-1 xl:text-3xl">{paciente.nome}</h1>
            <ul className="font-medium text-sm xl:text-xl">
              <li>{informacoes.idade} anos</li>
              <li>{informacoes.peso} kg</li>
              <li>{informacoes.altura} m</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="w-full xl:grid xl:grid-cols-[1fr_2fr_1fr] xl:gap-16 xl:items-start xl:px-10">
        <section>

          <Calendario className="w-[80%] max-w-[370px] mt-6 mx-auto xl:col-start-3 xl:row-start-1 xl:mt-8 xl:w-full xl:max-w-[420px]" />


        </section>

        {/* GRÁFICO DAS MEDIÇÕES */}
        <Grafico cpfPaciente={paciente.cpf} medida={medidaSelecionada} />



        <section className=" w-[80%] max-w-[370px] mx-auto flex flex-col gap-5 mb-5 xl:col-start-1 xl:row-start-1 xl:mt-8">
          <div>
            <button onClick={() => setMedidaSelecionada("oxigenio")} className="w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-6 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30 xl:mt-30 xl:px-30 xl:text-xl">
              Oxigênio
            </button>
          </div>
          <div>
            <button onClick={() => setMedidaSelecionada("respiratoria")} className="w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-6 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30 xl:mt-30 xl:px-30 xl:text-xl">
              Frequência Respiratória
            </button>
          </div>
          <div>
            <button onClick={() => setMedidaSelecionada("cardiaca")} className="w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-6 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30 xl:mt-30 xl:px-30 xl:text-xl">
              Frequência Cardíaca
            </button>
          </div>
          <div>
            <button onClick={() => setMedidaSelecionada("oxigenio")} className="w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-6 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30 xl:mt-30 xl:px-30 xl:text-xl">
              Oxigênio
            </button>
          </div>
        </section>
      </div>



    </section>
  );
}

export default DadosPaciente;