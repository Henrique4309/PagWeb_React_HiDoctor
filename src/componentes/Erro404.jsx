import imagemErro404 from "../assets/Ilha Médica_Erro 404.png";

// Conteúdo exibido no main para telas que ainda não existem
function Erro404() {
	return (
		<div className="flex w-full flex-1 items-center justify-center p-6">
			<img
				className="w-full max-w-3xl rounded-lg object-contain"
				src={imagemErro404}
				alt="Ilha Médica: erro 404, página não encontrada"
			/>
		</div>
	);
}

export default Erro404;
