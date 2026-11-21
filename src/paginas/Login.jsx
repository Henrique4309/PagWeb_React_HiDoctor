import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { USERS_ENDPOINT } from "../config";
import logo from "../assets/hidoctor_logo 1.png";

function Login() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function entrar(event) {
    event.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const cpfFormatado = cpf.replace(/\D/g, "");
      const senhaDigitada = senha.trim();
      const resposta = await fetch(USERS_ENDPOINT);
      if (!resposta.ok) throw new Error("Erro ao consultar os usuários");

      const dados = await resposta.json();
      const usuario = dados.find(
        (item) => String(item.cpf).replace(/\D/g, "") === cpfFormatado,
      );

      if (!usuario || String(usuario.senha) !== senhaDigitada)
        throw new Error("CPF ou senha incorretos.");

      const tipoUsuario = String(usuario.tipo || "").trim().toLowerCase();
      const ehAdmin = ["admin", "adm", "administrador"].includes(tipoUsuario);
      const ehMedico = tipoUsuario === "medico";
      const ehPaciente = ["paciente", "patient"].includes(tipoUsuario);

      // Tipo salvo na sessão e página de destino de cada perfil
      let tipoSessao;
      let destino;
      if (ehAdmin) {
        tipoSessao = "admin";
        destino = "/cadastro";
      } else if (ehMedico) {
        tipoSessao = "medico";
        destino = "/medico";
      } else if (ehPaciente) {
        tipoSessao = "paciente";
        destino = "/home";
      } else {
        throw new Error(
          "Perfil não reconhecido. Confira o campo tipo no cadastro do usuário.",
        );
      }

      sessionStorage.setItem(
        "hidoc_usuario",
        JSON.stringify({
          id: usuario.id,
          cpf: String(usuario.cpf ?? "").replace(/\D/g, ""),
          nome: usuario.nome,
          url: usuario.url,
          tipo: tipoSessao,
        }),
      );
      navigate(destino);
    } catch (error) {
      const mensagem =
        error.message === "Erro ao consultar os usuários"
          ? "Erro ao carregar os dados. Verifique se o servidor está iniciado."
          : error.message || "Erro ao conectar ao servidor.";
      setErro(mensagem);
      console.log(`Erro: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#E6F4F1] px-4 pb-10 pt-16">
      <header className="mb-8 text-center">
       
      </header>
      <section className= "mt-10 xl:flex xl:gap-40 xl:items-center xl:justify mx-auto">
         <div className="xl:flex-col xl:items-center max-w-[650px]">
           <img
            className="mx-auto "
            src={logo}
            alt=""
                   />
                   <form className="space-y-5 xl:flex xl:flex-col xl:ml-30" onSubmit={entrar}>
            <div className="space-y-1">
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="cpf"
              >
                CPF
              </label>
              <input
                className="w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)]
                focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)]
                text-slate-800 px-6 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2
                ring-[#48799C] shadow-bottom  shadow-neutral-300 placeholder:text-sm"
                id="cpf"
                name="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                inputMode="numeric"
                required
                placeholder="046.."
              />
            </div>
            <div className="space-y-1">
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="senha"
              >
                Senha
              </label>
              <input
                className="w-full  bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-6 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-300"
                id="senha"
                name="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            {erro && (
              <p
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {erro}
              </p>
            )}
            <button
              className="w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-6 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30 xl:mt-30 xl:px-30"
              type="submit"
              disabled={carregando}
            >
              {carregando ? "Verificando..." : "Entrar"}
            </button>
            <p className="text-center text-sm text-slate-600">
            </p>
                   </form>
         </div>
      <div className="hidden xl:block mt-28 ">
        <img src="src/assets/hidoctor_login_enfermeiro_senhor 1.png" alt="" />
      </div>
      </section>
      
    </main>
  );
}
export default Login