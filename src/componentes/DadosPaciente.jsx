import PainelMedicoes from "./PainelMedicoes";

function DadosPaciente({ paciente, onVoltar }) {
  const informacoes = paciente.informacoes || {};

  return (
    <section className="flex flex-col items-center">
      <button
        type="button"
        onClick={onVoltar}
        className="self-start ml-[10%] mt-4 text-[#236B55] font-semibold hover:underline xl:ml-[5%]"
      >
        &#10094; Voltar
      </button>
      <section className="bg-[linear-gradient(to_Bottom,#F9FFFF_0%,#E6F4FA_50%,#C9E6EF_100%)] flex items-center justify-center gap-6 px-4 w-[80%] rounded-lg mt-5 shadow-[0_8px_6px_-2px_rgba(0,0,0,0.15)] xl:w-[45%] xl:max-w-[500px] xl:self-start xl:ml-[5%] xl:h-48">
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

      <PainelMedicoes
        cpfPaciente={paciente.cpf}
        className="w-full xl:grid xl:grid-cols-[1fr_2fr_1fr] xl:gap-16 xl:items-start xl:px-10"
        classeCalendario="w-[80%] max-w-[370px] mt-6 mx-auto xl:mt-8 xl:w-full xl:max-w-[420px]"
        classeResumo="w-[80%] max-w-[370px] mx-auto mt-4 xl:w-full xl:max-w-[420px]"
      />
    </section>
  );
}

export default DadosPaciente;
