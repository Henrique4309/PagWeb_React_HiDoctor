import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/hidoctor_logo 1.png";

const botoesMenu = [
	{ rotulo: "Pacientes", acao: "pacientes", icone: "♧", detalhe: "Consulte os pacientes cadastrados" },
	{ rotulo: "Cadastrar paciente", acao: "cadastro", icone: "+", detalhe: "Adicione um novo paciente" },
	{ rotulo: "Consultas", acao: "consultas", icone: "◷", detalhe: "Acompanhe a agenda de consultas" },
	{ rotulo: "Relatórios", acao: "relatorios", icone: "▤", detalhe: "Acesse os resumos de atendimento" },
];

function HomeFuncionario() {
	const usuario = JSON.parse(sessionStorage.getItem("hidoc_usuario") || "null");
	const navigate = useNavigate();
	const [busca, setBusca] = useState("");
	const [secaoSelecionada, setSecaoSelecionada] = useState("");
	const podeAcessar = usuario && ["medico", "admin"].includes(usuario.tipo);

	useEffect(() => {
		if (!podeAcessar) {
			navigate("/", { replace: true });
		}
	}, [podeAcessar, navigate]);

	if (!podeAcessar) return null;

	function executarAcao(acao) {
		if (acao === "cadastro") {
			navigate("/cadastro");
			return;
		}
		setSecaoSelecionada(acao);
	}

	const menuFiltrado = botoesMenu.filter((item) =>
		item.rotulo.toLowerCase().includes(busca.trim().toLowerCase()),
	);

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#eef8f5] via-[#f7fbfa] to-[#e1f1ee] px-4 py-6 sm:px-8 sm:py-10">
			<div className="mx-auto max-w-5xl">
				<header className="mb-8 flex items-center justify-between gap-4">
					<img className="w-32 object-contain sm:w-40" src={logo} alt="HiDoctor" />
					<div className="flex items-center gap-3">
						<div className="hidden text-right sm:block">
							<p className="text-sm font-semibold text-slate-800">{usuario.nome}</p>
							<p className="text-xs text-slate-500">Área administrativa</p>
						</div>
						<div className="grid h-11 w-11 place-items-center rounded-full bg-[#d2eee7] font-bold text-[#267c70]" aria-hidden="true">
							{String(usuario.nome || "A").charAt(0).toUpperCase()}
						</div>
						<button
							className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
							onClick={() => {
								sessionStorage.removeItem("hidoc_usuario");
								navigate("/", { replace: true });
							}}
						>
							Sair
						</button>
					</div>
				</header>

				<section className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-xl shadow-[#94bcb2]/20 backdrop-blur sm:p-9">
					<div className="mb-7">
						<p className="mb-2 text-sm font-semibold text-[#348d7e]">PAINEL ADMINISTRATIVO</p>
						<h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
							Olá, {usuario.nome}! <span aria-hidden="true">👋</span>
						</h1>
						<p className="mt-2 text-sm text-slate-500 sm:text-base">O que você gostaria de fazer hoje?</p>
					</div>

					<label className="mb-6 block max-w-xl">
						<span className="sr-only">Buscar uma opção</span>
						<div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f8fbfa] px-4 shadow-sm transition focus-within:border-[#70b7a9] focus-within:ring-4 focus-within:ring-[#d9f0e9]">
							<span className="text-lg text-slate-400" aria-hidden="true">⌕</span>
							<input
								className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
								value={busca}
								onChange={(event) => setBusca(event.target.value)}
								placeholder="Buscar uma opção..."
							/>
						</div>
					</label>

					<div className="grid gap-4 sm:grid-cols-2">
						{menuFiltrado.map(({ rotulo, acao, icone, detalhe }, index) => (
							<button
								key={acao}
								type="button"
								onClick={() => executarAcao(acao)}
								className="group flex min-h-28 items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#c2e6dd] hover:shadow-lg hover:shadow-[#8dbeb2]/15 focus:outline-none focus:ring-4 focus:ring-[#d9f0e9]"
							>
								<span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl font-semibold ${index % 2 === 0 ? "bg-[#e2f5ef] text-[#318c7b]" : "bg-[#edf0ff] text-[#6675bd]"}`} aria-hidden="true">
									{icone}
								</span>
								<span className="min-w-0 flex-1">
									<span className="block font-semibold text-slate-800">{rotulo}</span>
									<span className="mt-1 block text-sm text-slate-500">{detalhe}</span>
								</span>
								<span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#348d7e]" aria-hidden="true">→</span>
							</button>
						))}
					</div>

					{menuFiltrado.length === 0 && (
						<p className="rounded-2xl bg-[#f8fbfa] p-6 text-sm text-slate-500" role="status">
							Nenhuma opção encontrada. Tente outra busca.
						</p>
					)}

					{secaoSelecionada && secaoSelecionada !== "cadastro" && (
						<p className="mt-5 rounded-xl bg-[#e8f6f1] px-4 py-3 text-sm text-[#267c70]" role="status">
							Seção {botoesMenu.find((item) => item.acao === secaoSelecionada)?.rotulo} selecionada.
						</p>
					)}
				</section>
				<p className="mt-6 text-center text-xs text-slate-400">HiDoctor · Cuidado e saúde em um só lugar</p>
			</div>
		</main>
	);
}

export default HomeFuncionario;
