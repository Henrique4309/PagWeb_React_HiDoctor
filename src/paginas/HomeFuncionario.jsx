import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListaPacientes from "../componentes/ListaPacientes";
import { Header, Footer } from "../componentes/BarraNavegacao";
import Erro404 from "../componentes/Erro404";
import imagemPacienteNaoEncontrado from "../assets/Paciente não encontrado no oceano.png";
import AlertaEmergencia from "../componentes/AlertaEmergencia";
import { useAlertas } from "../hooks/useAlertas";
import { usePacientesPrioritarios } from "../hooks/usePacientesPrioritarios";
import { lerUsuarioSessao } from "../sessao";

function HomeFuncionario() {
	const [usuario] = useState(lerUsuarioSessao);
	const navigate = useNavigate();
	const [tela, setTela] = useState("inicio");
	const [semPacientes, setSemPacientes] = useState(false);
	const mostrarFundoNaoEncontrado = tela === "inicio" && semPacientes;
	const podeAcessar = usuario?.tipo === "medico";
	const { alerta, paciente: pacienteAlerta, fecharAlerta } = useAlertas(podeAcessar, usuario?.id);
	const { idsPrioritarios, priorizar, alternarPrioridade } = usePacientesPrioritarios(usuario?.id);

	useEffect(() => {
		if (pacienteAlerta) priorizar(pacienteAlerta);
	}, [pacienteAlerta, priorizar]);

	useEffect(() => {
		if (!podeAcessar) {
			navigate("/", { replace: true });
		}
	}, [podeAcessar, navigate]);

	if (!podeAcessar) return null;

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
					<ListaPacientes
						idsPrioritarios={idsPrioritarios}
						aoAlternarPrioridade={alternarPrioridade}
						aoMudarSemResultado={setSemPacientes}
					/>
				)}
			</main>

			<Footer aoNavegar={setTela} />

			<AlertaEmergencia
				alerta={alerta}
				paciente={pacienteAlerta}
				aoFechar={fecharAlerta}
			/>
		</div>
	);
}

export default HomeFuncionario;
