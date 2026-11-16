import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { USERS_ENDPOINT } from "../config";
import logo from "../assets/hidoctor_logo 1.png";

const classesInput =
	"w-full rounded-md border border-[#D5E4E5] bg-gradient-to-b from-white to-[#E3F1F1] px-4 py-3 text-sm text-slate-800 shadow-md outline-none transition focus:border-[#6C9DB5] focus:ring-2 focus:ring-[#48799C]";

function Cadastro() {
	const [formulario, setFormulario] = useState({
		cpf: "",
		senha: "",
		nome: "",
		url: "",
		idade: "",
		peso: "",
		altura: "",
		enfermidade: "",
		historico: "",
	});
	const [erro, setErro] = useState("");
	const [sucesso, setSucesso] = useState("");
	const [carregando, setCarregando] = useState(false);
	const navigate = useNavigate();

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

			const historico = formulario.historico.trim()
				? [{ data: new Date().toLocaleDateString("pt-BR"), descricao: formulario.historico.trim() }]
				: [];

			const respostaCadastro = await fetch(USERS_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					cpf,
					senha: formulario.senha,
					tipo: "paciente",
					nome: formulario.nome.trim(),
					url: formulario.url.trim(),
					informacoes: {
						idade: Number(formulario.idade),
						peso: Number(formulario.peso),
						altura: Number(formulario.altura),
						enfermidade: formulario.enfermidade.trim(),
						historico,
					},
				}),
			});

			if (!respostaCadastro.ok) throw new Error("Não foi possível salvar o cadastro.");

			setSucesso("Cadastro realizado! Redirecionando para o login...");
			setTimeout(() => navigate("/"), 1200);
		} catch (error) {
			setErro(error.message || "Erro ao conectar ao servidor.");
		} finally {
			setCarregando(false);
		}
	}

	return (
		<main className="min-h-screen bg-[#202020] px-4 py-8 sm:px-8">
			<div className="mx-auto max-w-5xl">
				<p className="mb-3 text-xs text-gray-400">cadastro</p>
				<section className="mx-auto max-w-4xl bg-[#E6F4F1] px-5 py-8 shadow-2xl sm:px-12 sm:py-10">
					<div className="mx-auto flex max-w-2xl flex-col items-center">
						<img className="mb-5 w-32 object-contain" src={logo} alt="HiDoctor" />
						<h1 className="text-center text-xl font-semibold text-slate-800">Cadastro de paciente</h1>
						<p className="mb-6 mt-1 text-center text-sm text-slate-600">Preencha seus dados para criar uma conta.</p>

						<form className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={cadastrar}>
							<label className="space-y-1 text-xs font-medium text-slate-600 sm:col-span-2">
								Nome completo
								<input className={classesInput} name="nome" value={formulario.nome} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600">
								CPF
								<input className={classesInput} name="cpf" value={formulario.cpf} onChange={atualizarCampo} inputMode="numeric" required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600">
								Senha
								<input className={classesInput} name="senha" type="password" value={formulario.senha} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600 sm:col-span-2">
								URL da foto (opcional)
								<input className={classesInput} name="url" type="url" value={formulario.url} onChange={atualizarCampo} placeholder="https://..." />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600">
								Idade
								<input className={classesInput} name="idade" type="number" min="0" value={formulario.idade} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600">
								Peso (kg)
								<input className={classesInput} name="peso" type="number" min="0" step="0.1" value={formulario.peso} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600">
								Altura (m)
								<input className={classesInput} name="altura" type="number" min="0" step="0.01" value={formulario.altura} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600 sm:col-span-1">
								Enfermidade
								<input className={classesInput} name="enfermidade" value={formulario.enfermidade} onChange={atualizarCampo} required />
							</label>
							<label className="space-y-1 text-xs font-medium text-slate-600 sm:col-span-2">
								Histórico médico (opcional)
								<textarea className={classesInput} name="historico" rows="2" value={formulario.historico} onChange={atualizarCampo} />
							</label>

							{erro && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2" role="alert">{erro}</p>}
							{sucesso && <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 sm:col-span-2">{sucesso}</p>}

							<button className="rounded-md border border-[#D5E4E5] bg-gradient-to-b from-white to-[#D5E9E9] px-5 py-3 text-sm font-semibold text-slate-700 shadow-md transition hover:shadow-lg disabled:opacity-60 sm:col-span-2" type="submit" disabled={carregando}>
								{carregando ? "Cadastrando..." : "Criar cadastro"}
							</button>
						</form>

						<p className="mt-5 text-center text-sm text-slate-600">
							Já tem cadastro? <Link className="font-semibold text-[#365f7a] underline" to="/">Voltar ao login</Link>
						</p>
					</div>
				</section>
			</div>
		</main>
	);
}

export default Cadastro;
