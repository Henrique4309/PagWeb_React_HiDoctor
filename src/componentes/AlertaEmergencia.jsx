// Formata datas do alerta em pt-BR; se não for uma data válida, mostra o valor original
function formatarDataHora(valor) {
  if (!valor) return "--";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return String(valor);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// Tela cheia de emergência: ocupa toda a tela até o médico clicar no botão.
// alerta: item de /alertas | paciente: usuário de /users dono do alerta | aoFechar: tira o alerta da tela
function AlertaEmergencia({ alerta, paciente, aoFechar }) {
  if (!alerta) return null;

  const nome = paciente?.nome || "Paciente não identificado";

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alerta-emergencia-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[linear-gradient(to_bottom,#FFFFFF_0%,#FDF4F4_50%,#EFC9C9_100%)] px-4 py-8"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-5 text-center xl:max-w-2xl xl:gap-8">
        {paciente?.url && (
          <img
            className="h-32 w-32 rounded-xl object-cover shadow-[0_8px_6px_-2px_rgba(0,0,0,0.15)] ring-4 ring-[#B42323] xl:h-56 xl:w-56"
            src={paciente.url}
            alt={`Foto de ${nome}`}
          />
        )}

        <h2 className="text-2xl font-bold text-slate-800 xl:text-4xl">{nome}</h2>

        <dl className="grid w-full grid-cols-1 gap-2 rounded-lg bg-white/70 px-5 py-4 text-sm text-slate-700 shadow-md xl:grid-cols-2 xl:gap-4 xl:px-8 xl:py-6 xl:text-lg">
          <div>
            <dt className="font-semibold text-[#8B1A1A]">Data e hora</dt>
            <dd>{formatarDataHora(alerta.dataHora)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#8B1A1A]">Localização em</dt>
            <dd>{formatarDataHora(alerta.localizacaoEm)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#8B1A1A]">Latitude</dt>
            <dd>{alerta.latitude ?? "--"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#8B1A1A]">Longitude</dt>
            <dd>{alerta.longitude ?? "--"}</dd>
          </div>
        </dl>

        <p
          id="alerta-emergencia-titulo"
          className="animate-pulse text-3xl font-extrabold uppercase text-[#B42323] xl:text-5xl"
        >
          Atenção Emergência
        </p>

        <button
          type="button"
          onClick={aoFechar}
          autoFocus
          className="w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#FDF4F4_50%,#EFC9C9_100%)] focus:bg-[linear-gradient(to_bottom,#F4ABAB_0%,#E2B7B7_50%,#EDCACA_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#9C4848] shadow-bottom shadow-neutral-30 xl:w-auto xl:px-[8rem] xl:text-2xl"
        >
          Ciente
        </button>
      </div>
    </div>
  );
}

export default AlertaEmergencia;
