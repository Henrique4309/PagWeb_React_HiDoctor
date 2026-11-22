import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListaPacientes from "../componentes/ListaPacientes";
import { Header, Footer } from "../componentes/BarraNavegacao";
import Erro404 from "../componentes/Erro404";
import imagemPacienteNaoEncontrado from "../assets/Paciente não encontrado no oceano.png";
import AlertaEmergencia from "../componentes/AlertaEmergencia";
import { useAlertas } from "../hooks/useAlertas";

function HomeFuncionario() {
	const usuario = JSON.parse(sessionStorage.getItem("hidoc_usuario") || "null");
	const navigate = useNavigate();
	// Conteúdo exibido no main: "inicio" (lista de pacientes) ou "erro404"
	const [tela, setTela] = useState("inicio");
	// true quando a lista não mostra nenhum paciente (busca sem resultado ou lista vazia)
	const [semPacientes, setSemPacientes] = useState(false);
	const mostrarFundoNaoEncontrado = tela === "inicio" && semPacientes;
	const podeAcessar = usuario && ["medico"].includes(usuario.tipo);
	// Alertas de emergência de qualquer paciente, para todos os médicos
	const { alerta, paciente: pacienteAlerta, fecharAlerta } = useAlertas();

	useEffect(() => {
		if (!podeAcessar) {
			navigate("/", { replace: true });
		}
	}, [podeAcessar, navigate]);

	return (
		<div className="flex min-h-screen flex-col">
			<Header aoNavegar={setTela} />

			<main
				className="w-full flex-1 bg-[#E3F3EE] bg-cover bg-center bg-no-repeat pb-24 xl:pb-0"
				style={
					mostrarFundoNaoEncontrado
						? { backgroundImage: `url("${imagemPacienteNaoEncontrado}")` }
						: undefined
				}
			>
				{tela === "erro404" ? (
					<Erro404 />
				) : (
					<div>
						<ListaPacientes
							key={usuario?.id}
							medicoId={usuario?.id}
							aoMudarSemResultado={setSemPacientes}
						/>
					</div>
				)}
			</main>

			<Footer aoNavegar={setTela} />

			{/* Cobre a tela inteira enquanto houver alerta pendente */}
			<AlertaEmergencia
				alerta={alerta}
				paciente={pacienteAlerta}
				aoFechar={fecharAlerta}
			/>
		</div>
	);
}

export default HomeFuncionario;
