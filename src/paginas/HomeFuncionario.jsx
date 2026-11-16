import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListaPacientes from "../componentes/ListaPacientes";

function HomeFuncionario() {
	const usuario = JSON.parse(sessionStorage.getItem("hidoc_usuario") || "null");
	const navigate = useNavigate();
	const podeAcessar = usuario && ["medico"].includes(usuario.tipo);

	useEffect(() => {
		if (!podeAcessar) {
			navigate("/", { replace: true });
		}
	}, [podeAcessar, navigate]);

	return (
		<div className="flex min-h-screen flex-col">
			<header className="hidden xl:bg-[#236B55] xl:w-[100vw] xl:flex  xl:items-center xl:px-2 xl:py-3 xl:box-border xl:justify-between">
				<button
					className="bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30  xl:ml-10 xl:px-[8rem] xl:text-2xl "
					onClick={() => {
						sessionStorage.removeItem("hidoc_usuario");
						navigate("/", { replace: true });
					}}
				>
					Início
				</button>
				<div className="flex items-center gap-4">
					<button
						className="bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30  xl:px-[8rem] xl:text-2xl"
						onClick={() => {
							sessionStorage.removeItem("hidoc_usuario");
							navigate("/", { replace: true });
						}}
					>
						Notificação
					</button>
					<button
						className="bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30 xl:px-[8rem] xl:text-2xl"
						onClick={() => {
							sessionStorage.removeItem("hidoc_usuario");
							navigate("/", { replace: true });
						}}
					>
						Mensagens
					</button>
				</div>
			</header>

			<main className="w-full flex-1 bg-[#E3F3EE] pb-24 xl:pb-0">
				<div>
					<ListaPacientes key={usuario?.id} medicoId={usuario?.id} />
				</div>
			</main>

			<footer className="fixed inset-x-0 bottom-0 z-10 flex w-full items-center justify-between bg-[#236B55] px-2 py-3 box-border xl:hidden">
				<button
					className="bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30  xl:ml-10 xl:px-[8rem] xl:text-2xl "
					onClick={() => {
						sessionStorage.removeItem("hidoc_usuario");
						navigate("/", { replace: true });
					}}
				>
					Início
				</button>
				<div className="flex items-center gap-4">
					<button
						className="bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30  xl:px-[8rem] xl:text-2xl"
						onClick={() => {
							sessionStorage.removeItem("hidoc_usuario");
							navigate("/", { replace: true });
						}}
					>
						Notificação
					</button>
					<button
						className="bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 px-5 py-3 rounded-lg font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-bottom  shadow-neutral-30 xl:px-[8rem] xl:text-2xl"
						onClick={() => {
							sessionStorage.removeItem("hidoc_usuario");
							navigate("/", { replace: true });
						}}
					>
						Mensagens
					</button>
				</div>
			</footer>
		</div>
	);
}

export default HomeFuncionario;
