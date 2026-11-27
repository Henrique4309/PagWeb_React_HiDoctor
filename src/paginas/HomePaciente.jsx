import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PainelMedicoes from "../componentes/PainelMedicoes";
import { lerUsuarioSessao } from "../sessao";
import { Header, Footer } from "../componentes/BarraNavegacao";
import Erro404 from "../componentes/Erro404";

function HomePaciente() {
  const [usuario] = useState(lerUsuarioSessao);
  const navigate = useNavigate();
  const podeAcessar = usuario?.tipo === "paciente";

  const [tela, setTela] = useState("inicio");

  useEffect(() => {
    if (!podeAcessar) {
      navigate("/", { replace: true });
    }
  }, [podeAcessar, navigate]);

  if (!podeAcessar) return null;

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

            <h1 className="text-slate-800 font-medium text-2xl mb-4 xl:text-3xl">
              Olá <span className="font-bold">{usuario.nome}</span>,<br /> bem-vindo ao{" "} <br />
              <span className="text-green-800">hi</span>doctor
            </h1>

            <img
              className="w-20 h-20 rounded-md object-cover xl:w-40 xl:h-40"
              src={usuario.url}
              alt={`Foto de ${usuario.nome}`}
            />

          </div>
        </section>

        <PainelMedicoes
          cpfPaciente={usuario.cpf}
          className="w-full xl:grid xl:grid-cols-[1fr_2fr_1fr] xl:gap-16 xl:items-start xl:px-10 xl:mt-5"
        />
        </>
        )}
      </main>

      <Footer aoNavegar={setTela} />
    </div>
  );
}

export default HomePaciente;
