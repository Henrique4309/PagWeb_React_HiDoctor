import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Grafico from "../componentes/Grafico";
import Calendario from "../componentes/Calendario";
import { USERS_ENDPOINT } from "../config";
import { Header, Footer } from "../componentes/BarraNavegacao";
import Erro404 from "../componentes/Erro404";
// Se quiser manter uma imagem padrão caso o usuário não tenha URL, pode importar, 
// mas usaremos usuario.url diretamente do banco.

function HomePaciente() {
  const usuario = JSON.parse(sessionStorage.getItem("hidoc_usuario") || "null");
  const navigate = useNavigate();

  // Controla o gràfico clicando nos boões
  const [medidaSelecionada, setMedidaSelecionada] = useState("oxigenio");

  // Conteúdo exibido no main: "inicio" (painel do paciente) ou "erro404"
  const [tela, setTela] = useState("inicio");

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

  useEffect(() => {
    if (!usuario || usuario.tipo !== "paciente") {
      navigate("/", { replace: true });
    }
  }, [usuario, navigate]);

  if (!usuario || usuario.tipo !== "paciente") return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header aoNavegar={setTela} />

      <main className="flex flex-1 flex-col items-center bg-[#E3F3EE] pb-24 xl:pb-0">
        {tela === "erro404" ? (
          <Erro404 />
        ) : (
        <>
        <section className="bg-[linear-gradient(to_Bottom,#F9FFFF_0%,#E6F4FA_50%,#C9E6EF_100%)] flex items-center justify-center gap-6 h-48 px-4 w-[80%] rounded-lg mt-5 shadow-[0_8px_6px_-2px_rgba(0,0,0,0.15)]  xl:w-[45%] xl:max-w-[800px] xl:self-start xl:ml-[5%]">
          <div className="flex items-center justify-between w-full max-w-2xl py-4 xl:w-full ">

            { }
            <h1 className="text-slate-800 font-medium text-2xl mb-4 xl:text-3xl">
              Olá <span className="font-bold">{usuario.nome}</span>,<br /> bem vindo ao{" "} <br />
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

        <div className="w-full xl:grid xl:grid-cols-[1fr_2fr_1fr] xl:gap-16 xl:items-start xl:px-10 xl:mt-5">
          <section>

            <Calendario />


          </section>

          {/* GRÁFICO DAS MEDIÇÕES */}
          <Grafico cpfPaciente={cpfPaciente} medida={medidaSelecionada} />



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

        </>
        )}
      </main>

      <Footer aoNavegar={setTela} />
    </div>
  );
}

export default HomePaciente;