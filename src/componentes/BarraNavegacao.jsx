// aoNavegar recebe o destino: "inicio" (conteúdo original) ou "erro404"
function Botoes({ aoNavegar }) {
	return (
		<>
			<div>
				<button className="bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom shadow-neutral-30 xl:px-[2rem] xl:text-2xl" onClick={() => aoNavegar("inicio")}>
					Início
				</button>
			</div>

			<div className="flex justify-between gap-4">
				<div>
					<button className="bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom shadow-neutral-30 xl:px-[2rem] xl:text-2xl" onClick={() => aoNavegar("erro404")}>
						Notificação
					</button>
				</div>
				<div>
					<button className="bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom shadow-neutral-30 xl:px-[2rem] xl:text-2xl" onClick={() => aoNavegar("erro404")}>
						Mensagens
					</button>
				</div>
			</div>
		</>
	);
}

// Barra superior: aparece apenas em telas grandes (xl)
export function Header({ aoNavegar }) {
	return (
		<header className={`hidden xl:bg-[#236B55] xl:w-full xl:p-8 xl:flex xl:justify-between`}>
			<Botoes aoNavegar={aoNavegar} />
		</header>
	);
}

// Barra inferior fixa: aparece apenas em telas menores que xl
export function Footer({ aoNavegar }) {
	return (
		<footer className={`bg-[#236B55] w-full m-auto py-4 flex justify-center gap-4 fixed inset-x-0 bottom-0 z-10 xl:hidden`}>
			<Botoes aoNavegar={aoNavegar} />
		</footer>
	);
}
