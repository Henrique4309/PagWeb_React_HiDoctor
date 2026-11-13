import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Se quiser manter uma imagem padrão caso o usuário não tenha URL, pode importar, 
// mas usaremos usuario.url diretamente do banco.

function HomePaciente() {
  const usuario = JSON.parse(sessionStorage.getItem("hidoc_usuario") || "null");
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || usuario.tipo !== "paciente") {
      navigate("/", { replace: true });
    }
  }, [usuario, navigate]);

  if (!usuario || usuario.tipo !== "paciente") return null;
  
  return (
    <main className="">
      <section className="bg-[linear-gradient(to_top,#F9FFFF_0%,#E6F4FA_50%,#C9E6EF_100%)] flex items-center justify-center gap-6 h-48 px-4">
        <div className="flex items-center justify-between w-full max-w-2xl">
          
          {}
          <h1 className="text-slate-800 font-medium text-lg">
            Olá <span className="font-bold">{usuario.nome}</span>, bem vindo ao{" "}
            <span className="text-green-800">hi</span>doctor
          </h1>

          { }
          <img 
            className="w-16 h-16 rounded-full object-cover border-2 border-[#48799C]" 
            src={usuario.url} 
            alt={`Foto de ${usuario.nome}`} 
          />
          
        </div>
      </section>

      <div className="p-6">
        <button
          className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          onClick={() => {
            sessionStorage.removeItem("hidoc_usuario");
            navigate("/", { replace: true });
          }}
        >
          Sair
        </button>
      </div>
    </main>
  );
}

export default HomePaciente;