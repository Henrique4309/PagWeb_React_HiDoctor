import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { MEDIDAS, useMedicoes, calcularDominioY } from "../hooks/useMedicoes";
import { USERS_ENDPOINT } from "../config";
// Se quiser manter uma imagem padrão caso o usuário não tenha URL, pode importar, 
// mas usaremos usuario.url diretamente do banco.

function HomePaciente() {
  const usuario = JSON.parse(sessionStorage.getItem("hidoc_usuario") || "null");
  const navigate = useNavigate();

  // Controla o gràfico clicando nos boões
  const [medidaSelecionada, setMedidaSelecionada] = useState("oxigenio");

  const medidaAtual = MEDIDAS[medidaSelecionada];

  // Últimas 10 medições do db.json (completadas com 0), atualizadas automaticamente
  // CPF do paciente logado (sessões antigas não guardavam o CPF: busca pelo id)
  const [cpfPaciente, setCpfPaciente] = useState(usuario?.cpf || "");
  const usuarioId = usuario?.id;

  useEffect(() => {
    if (cpfPaciente || usuarioId == null) return;
    fetch(`${USERS_ENDPOINT}/${encodeURIComponent(usuarioId)}`)
      .then((resposta) => (resposta.ok ? resposta.json() : null))
      .then((dados) => {
        if (dados?.cpf) setCpfPaciente(String(dados.cpf));
      })
      .catch((erro) => console.error(erro));
  }, [cpfPaciente, usuarioId]);

  const dadosGrafico = useMedicoes(cpfPaciente, medidaSelecionada);
  const dominioY = calcularDominioY(dadosGrafico);

  // CALENDÁRIO
  const hoje = new Date();

  // Dia escolhido pelo paciente
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


// const buscarOxigenacaoAPI = async () => {
//   try {
//     const resposta = await fetch("URL_DA_API");

//     if (!resposta.ok) {
//       throw new Error("Erro ao buscar medições");
//     }

//     const dados = await resposta.json();

//     setDadosOxigenacao(dados);

//   } catch (erro) {
//     console.error(erro);
//   }
// };

  useEffect(() => {
    if (!usuario || usuario.tipo !== "paciente") {
      navigate("/", { replace: true });
    }
  }, [usuario, navigate]);

  if (!usuario || usuario.tipo !== "paciente") return null;
  
  return (
    <main className="flex flex-col items-center">
      <section className="bg-[linear-gradient(to_Bottom,#F9FFFF_0%,#E6F4FA_50%,#C9E6EF_100%)] flex items-center justify-center gap-6 h-48 px-4 w-[80%] rounded-lg mt-5 shadow-[0_8px_6px_-2px_rgba(0,0,0,0.15)]  xl:w-[45%] xl:max-w-[800px] xl:self-start xl:ml-[5%]">
        <div className="flex items-center justify-between w-full max-w-2xl py-4 xl:w-full ">
          
          {}
          <h1 className="text-slate-800 font-medium text-2xl mb-4 xl:text-3xl">
            Olá <span className="font-bold">{usuario.nome}</span>,<br/> bem vindo ao{" "} <br/>
            <span className="text-green-800">hi</span>doctor
          </h1>

          { }
          <img 
            className="w-20 h-20 rounded-md object-cover xl:w-40 xl:h-40" 
            src={usuario.url} 
            alt={`Foto de ${usuario.nome}`} 
          />
          
        </div>
      </section>
      
<div className="w-full xl:grid xl:grid-cols-[minmax(320px,1fr)_2fr_1fr] xl:items-start  xl:px-20 xl:mt-10">
      <section>
        
<section className="w-[80%] max-w-[370px] mt-6 mx-auto xl:col-start-3 xl:row-start-1 xl:mt-8 xl:w-[94%] ">

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

          <span className={`text-[11px] text-[#55A995] capitalize xl:text-sm ${
            index >= 7 ? "xl:hidden" : ""
            }`}>
              {dia.nome}
          </span>

            <span
              className={`w-[35px] h-[35px] xl:w-full xl:max-w-[38px] xl:h-auto xl:aspect-square rounded-[10px] flex items-center justify-center text-xs shadow-sm transition-all
                ${
                  selecionado
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


      </section>

      {/* GRÁFICO DE OXIGENAÇÃO */}
<section className="w-[85%] max-w-[500px] mx-auto mt-5 mb-4 xl:col-start-2 xl:row-start-1 xl:w-full xl:max-w-[780px] xl:mt-8">

  {/* Fundo azul externo */}
  <div className="bg-[#D9EDF3] rounded-xl p-3 shadow-[0_3px_5px_rgba(0,0,0,0.12)] border border-[#C5E1E9]">

    {/* Título */}
   <div className="mb-2 ml-1">
    <h2 className="text-sm font-semibold text-slate-600 xl:xl:text-lg">
      {medidaAtual.titulo}
    </h2>

    <p className="text-[10px] text-slate-400">
      {medidaAtual.unidade}
    </p>
  </div>

    {/* Área branca do gráfico */}
    <div className="bg-white rounded-md p-2 shadow-sm">

      <div className="w-full h-[195px] xl:h-[240px]">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={dadosGrafico}
            margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
          >

            <defs>
              <linearGradient
                id="corOxigenacao"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#64BDAE"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="#64BDAE"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#DCECEF"
            />

            <XAxis
              dataKey="horario"
              tick={{ fontSize: 9, fill: "#8299A0" }}
              axisLine={{ stroke: "#DCECEF" }}
              tickLine={false}
            />

            <YAxis
              domain={dominioY}
              tick={{ fontSize: 9, fill: "#8299A0" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                border: "1px solid #D9EDF3",
                fontSize: "11px"
              }}
              formatter={(value) => [`${value}${medidaAtual.sufixo}`, medidaAtual.rotulo]}
            />

            <Area
              type="monotone"
              dataKey="valor"
                      isAnimationActive={false}
              stroke="#62BBAA"
              strokeWidth={2}
              fill="url(#corOxigenacao)"
              dot={{
                r: 3,
                fill: "#FFFFFF",
                stroke: "#62BBAA",
                strokeWidth: 2
              }}
              activeDot={{ r: 5 }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  </div>

</section>

      

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

      
<footer className="bg-[#236B55] w-full flex  items-center justify-around gap-1 px-2 py-3 box-border xl:order-first xl:justify-between">
      <div className="">
        <button
          className="w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30  xl:ml-10 xl:px-[8rem] xl:text-2xl "
          onClick={() => {
            sessionStorage.removeItem("hidoc_usuario");
            navigate("/", { replace: true });
          }}
        >
          Início
        </button>
      </div>

      {/* trocar para onde ele vai */}
      <div className="xl:ml-[30rem]">
        <button
          className="w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30  xl:px-[8rem] xl:text-2xl"
          onClick={() => {
            sessionStorage.removeItem("hidoc_usuario");
            navigate("/", { replace: true });
          }}
        >
          Notificação
        </button>
      </div>

      {/* trocar para onde ele vai */}
      <div className="xl:mr-10">
        <button
          className="w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30 xl:px-[8rem] xl:text-2xl"
          onClick={() => {
            sessionStorage.removeItem("hidoc_usuario");
            navigate("/", { replace: true });
          }}
        >
          Mensagens
        </button>
      </div>

</footer>
    </main>
  );
}

export default HomePaciente;