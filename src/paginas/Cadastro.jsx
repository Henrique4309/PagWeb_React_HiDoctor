import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USERS_ENDPOINT } from "../config";

const classesInput =
	"w-full rounded-md border border-[#D5E4E5] bg-gradient-to-b from-white to-[#E3F1F1] px-4 py-3 text-sm text-slate-800 shadow-md xl:text-lg outline-none transition focus:border-[#6C9DB5] focus:ring-2 focus:ring-[#48799C]";

// Mesmo degradê dos botões do login e da barra de navegação.
// O botão do formulário aberto fica com o degradê "selecionado" fixo.
const classesBotaoTroca =
	"w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom shadow-neutral-30 xl:text-xl";
const classesBotaoTrocaAtivo =
	"!bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] ring-2";

const formularioVazio = {
	cpf: "",
	senha: "",
	nome: "",
	url: "",
	idade: "",
	peso: "",
	altura: "",
	enfermidade: "",
	historico: "",
};

function Cadastro() {
	// Só o admin pode acessar o cadastro
	const usuario = JSON.parse(sessionStorage.getItem("hidoc_usuario") || "null");
	const podeAcessar = usuario?.tipo === "admin";

	// Qual formulário está aberto: "paciente" ou "medico"
	const [tipoCadastro, setTipoCadastro] = useState("paciente");
	const ehPaciente = tipoCadastro === "paciente";
	const [formulario, setFormulario] = useState(formularioVazio);
	const [erro, setErro] = useState("");
	const [sucesso, setSucesso] = useState("");
	const [carregando, setCarregando] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!podeAcessar) {
			navigate("/", { replace: true });
		}
	}, [podeAcessar, navigate]);

	function trocarFormulario(tipo) {
		setTipoCadastro(tipo);
		setErro("");
		setSucesso("");
	}

	function atualizarCampo(event) {
		const { name, value } = event.target;
		setFormulario((atual) => ({ ...atual, [name]: value }));
	}

	async function cadastrar(event) {
		event.preventDefault();
		setErro("");
		setSucesso("");
		setCarregando(true);

		try {
			const cpf = formulario.cpf.replace(/\D/g, "");
			const respostaUsuarios = await fetch(USERS_ENDPOINT);
			if (!respostaUsuarios.ok) throw new Error("Não foi possível consultar os usuários.");

			const usuarios = await respostaUsuarios.json();
			const cpfJaCadastrado = usuarios.some(
				(usuario) => String(usuario.cpf).replace(/\D/g, "") === cpf,
			);
			if (cpfJaCadastrado) throw new Error("Já existe um cadastro com esse CPF.");

			// Campos comuns aos dois tipos; o id é gerado pelo json-server
			const novoUsuario = {
				cpf,
				senha: formulario.senha,
				tipo: tipoCadastro,
				nome: formulario.nome.trim(),
				url: formulario.url.trim(),
			};

			if (ehPaciente) {
				const historico = formulario.historico.trim()
					? [{ data: new Date().toLocaleDateString("pt-BR"), descricao: formulario.historico.trim() }]
					: [];

				novoUsuario.informacoes = {
					idade: Number(formulario.idade),
					peso: Number(formulario.peso),
					altura: Number(formulario.altura),
					enfermidade: formulario.enfermidade.trim(),
					historico,
				};
			}

			const respostaCadastro = await fetch(USERS_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(novoUsuario),
			});

			if (!respostaCadastro.ok) throw new Error("Não foi possível salvar o cadastro.");

			// O admin continua na página para fazer outros cadastros
			setSucesso(`${ehPaciente ? "Paciente" : "Médico"} cadastrado com sucesso!`);
			setFormulario(formularioVazio);
		} catch (error) {
			setErro(error.message || "Erro ao conectar ao servidor.");
		} finally {
			setCarregando(false);
		}
	}

	if (!podeAcessar) return null;

	return (
		<div className="flex min-h-screen w-full flex-col">
			{/* Header com a mesma cor de fundo da BarraNavegacao */}
			<header className="w-full bg-[#236B55] px-5 py-4 sm:px-12 xl:py-8">
				<div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-3">
							<button
								type="button"
								className={`${classesBotaoTroca} ${!ehPaciente ? classesBotaoTrocaAtivo : ""}`}
								aria-pressed={!ehPaciente}
								onClick={() => trocarFormulario("medico")}
							>
								Cadastrar Médico
							</button>
							<button
								type="button"
								className={`${classesBotaoTroca} ${ehPaciente ? classesBotaoTrocaAtivo : ""}`}
								aria-pressed={ehPaciente}
								onClick={() => trocarFormulario("paciente")}
							>
								Cadastrar Paciente
							</button>
				</div>
			</header>

		<main className="flex w-full flex-1 bg-[#E6F4F1]">
			<section className="flex w-full flex-1 items-start justify-center px-5 py-8 sm:px-12 sm:py-10">
					<div className="flex w-full max-w-4xl flex-col items-center">

						<h1 className="mb-6 text-center text-xl font-semibold xl:mb-8 xl:text-3xl text-slate-800">
							{ehPaciente ? "Cadastro de paciente" : "Cadastro de médico"}
						</h1>

						<form className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:gap-x-8 xl:gap-y-6" onSubmit={cadastrar}>
							<label className="space-y-1 text-xs font-medium text-slate-600 xl:space-y-2 xl:text-base sm:col-span-2">
								Nome completo
								<input className={classesInput} name="nome" value={formulario.nome} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600 xl:space-y-2 xl:text-base">
								CPF
								<input className={classesInput} name="cpf" value={formulario.cpf} onChange={atualizarCampo} inputMode="numeric" required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600 xl:space-y-2 xl:text-base">
								Senha
								<input className={classesInput} name="senha" type="password" value={formulario.senha} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600 xl:space-y-2 xl:text-base sm:col-span-2">
								URL da foto (opcional)
								<input className={classesInput} name="url" type="url" value={formulario.url} onChange={atualizarCampo} placeholder="https://..." />
							</label>
							{/* Campos exclusivos do paciente */}
							{ehPaciente && (
							<>
							<label className="space-y-1 text-xs font-medium text-slate-600 xl:space-y-2 xl:text-base">
								Idade
								<input className={classesInput} name="idade" type="number" min="0" value={formulario.idade} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600 xl:space-y-2 xl:text-base">
								Peso (kg)
								<input className={classesInput} name="peso" type="number" min="0" step="0.1" value={formulario.peso} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600 xl:space-y-2 xl:text-base">
								Altura (m)
								<input className={classesInput} name="altura" type="number" min="0" step="0.01" value={formulario.altura} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600 xl:space-y-2 xl:text-base sm:col-span-1">
								Enfermidade
								<input className={classesInput} name="enfermidade" value={formulario.enfermidade} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600 xl:space-y-2 xl:text-base sm:col-span-2">
								Histórico médico (opcional)
								<textarea className={classesInput} name="historico" rows="2" value={formulario.historico} onChange={atualizarCampo} />
							</label>
							</>
							)}

							{erro && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2 xl:text-base" role="alert">{erro}</p>}
							{sucesso && <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 sm:col-span-2 xl:text-base">{sucesso}</p>}

							<button className="rounded-md border border-[#D5E4E5] bg-gradient-to-b from-white to-[#D5E9E9] px-5 py-3 text-sm font-semibold text-slate-700 shadow-md transition hover:shadow-lg disabled:opacity-60 sm:col-span-2 xl:mt-2 xl:text-lg" type="submit" disabled={carregando}>
								{carregando ? "Cadastrando..." : "Criar cadastro"}
							</button>
						</form>

					</div>
			</section>
		</main>
		</div>
	);
}

export default Cadastro;
