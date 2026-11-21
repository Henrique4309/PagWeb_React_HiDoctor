import { useEffect, useState } from "react";
import { USERS_ENDPOINT } from "../config";
import { LuCircleAlert, LuSearch } from "react-icons/lu";
import { IoAlertCircle } from "react-icons/io5";
import DadosPaciente from "./DadosPaciente";

const pacientesPrioritariosKEY = "hidoc_pacientes_prioritarios";

// Cada médico tem sua própria lista de prioritários no localStorage.
function chavePrioritarios(medicoId) {
    return medicoId != null
        ? `${pacientesPrioritariosKEY}_${medicoId}`
        : null;
}

function carregarPacientesPrioritarios(medicoId) {
    const chave = chavePrioritarios(medicoId);
    if (!chave) return [];

    try {
        const pacientesSalvos = JSON.parse(
            localStorage.getItem(chave) || "[]",
        );

        return Array.isArray(pacientesSalvos)
            ? pacientesSalvos.filter(
                  (paciente) => paciente && paciente.id != null && paciente.nome,
              )
            : [];
    } catch (erro) {
        console.error("Erro ao carregar pacientes prioritários:", erro);
        return [];
    }
}

function ListarPacientes({ medicoId, aoMudarSemResultado }) {
    const [pacientes, setPacientes] = useState([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
    const [busca, setBusca] = useState("");
    const [pacientesPrioritarios, setPacientesPrioritarios] = useState(() =>
        carregarPacientesPrioritarios(medicoId),
    );

    useEffect(() => {
        async function buscarPaciente() {
            try {
                const resposta = await fetch(USERS_ENDPOINT);
                if (!resposta.ok) throw new Error("Erro ao buscar os pacientes");
                const dados = await resposta.json();
                const idsPrioritarios = new Set(
                    pacientesPrioritarios.map((paciente) => String(paciente.id)),
                );
                const pacientesDaApi = dados.filter(
                    (usuario) => usuario.tipo === "paciente",
                );

                setPacientes(
                    pacientesDaApi.sort(
                        (pacienteA, pacienteB) =>
                            Number(idsPrioritarios.has(String(pacienteB.id))) -
                            Number(idsPrioritarios.has(String(pacienteA.id))),
                    ),
                );
            } catch (erro) {
                console.log("Erro: " + erro.message);
            }
        }
        buscarPaciente();
    }, [pacientesPrioritarios]);

    function alternarPrioridade(pacienteSelecionado) {
        const pacienteJaPrioritario = pacientesPrioritarios.some(
            (paciente) =>
                String(paciente.id) === String(pacienteSelecionado.id),
        );
        const pacientesAtualizados = pacienteJaPrioritario
            ? pacientesPrioritarios.filter(
                  (paciente) =>
                      String(paciente.id) !== String(pacienteSelecionado.id),
              )
            : [
                  {
                      id: pacienteSelecionado.id,
                      nome: pacienteSelecionado.nome,
                  },
                  ...pacientesPrioritarios,
              ];

        const chave = chavePrioritarios(medicoId);
        if (!chave) {
            console.error("Médico não identificado: prioridade não salva.");
            return;
        }

        try {
            if (pacientesAtualizados.length === 0) {
                localStorage.removeItem(chave);
            } else {
                localStorage.setItem(
                    chave,
                    JSON.stringify(pacientesAtualizados),
                );
            }
            setPacientesPrioritarios(pacientesAtualizados);
        } catch (erro) {
            console.error("Erro ao salvar paciente prioritário:", erro);
        }
    }

    const termoBusca = busca.trim().toLowerCase();
    const pacientesFiltrados = termoBusca
        ? pacientes.filter(
              (paciente) =>
                  paciente.nome?.toLowerCase().includes(termoBusca) ||
                  paciente.informacoes?.enfermidade
                      ?.toLowerCase()
                      .includes(termoBusca),
          )
        : pacientes;

    // Avisa a página quando nenhum paciente aparece na lista (para trocar o fundo do main)
    const semResultado = !pacienteSelecionado && pacientesFiltrados.length === 0;
    useEffect(() => {
        aoMudarSemResultado?.(semResultado);
    }, [semResultado, aoMudarSemResultado]);

    if (pacienteSelecionado) {
        return (
            <DadosPaciente
                paciente={pacienteSelecionado}
                onVoltar={() => setPacienteSelecionado(null)}
            />
        );
    }

    return (
        <>
        <div className="w-[95%] xl:w-[60%] mx-auto my-6 relative">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="search"
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                placeholder="Buscar por nome ou enfermidade"
                aria-label="Buscar paciente por nome ou enfermidade"
                className="w-full bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F4FDFD_50%,#C9E6EF_100%)] focus:bg-[linear-gradient(to_bottom,#ABE1F4_0%,#B7E2E0_50%,#CAEDEB_100%)] text-slate-800 py-3 pl-12 pr-4 rounded-xl font-medium transition-all outline-none focus:ring-2 ring-[#48799C] shadow-md"
            />
        </div>
        <div className="w-[95%] m-auto grid grid-cols-1 align-items-center justify-items-center xl:grid-cols-3 gap-4">
            {pacientesFiltrados.map((paciente) => (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setPacienteSelecionado(paciente)}
                    onKeyDown={(evento) => {
                        if (evento.key === "Enter" || evento.key === " ") {
                            evento.preventDefault();
                            setPacienteSelecionado(paciente);
                        }
                    }}
                    className="w-full flex items-center gap-4 rounded-xl border p-4 shadow-md cursor-pointer bg-gradient-to-b from-white via-white via-65% to-[#CBE6F2]" key={paciente.id}>
                    <img src={paciente.url} alt="Imagem do Paciente" className="w-16 h-16 object-cover rounded-full" />
                    <div className="w-[80%] 2xl:w-[90%]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">{paciente.nome}</h2>
                            <button
                                type="button"
                                aria-label={`${pacientesPrioritarios.some((pacientePrioritario) => String(pacientePrioritario.id) === String(paciente.id)) ? "Despriorizar" : "Priorizar"} ${paciente.nome}`}
                                onClick={(evento) => {
                                    evento.stopPropagation();
                                    alternarPrioridade(paciente);
                                }}
                                onKeyDown={(evento) => evento.stopPropagation()}
                            >
                                {pacientesPrioritarios.some(
                                    (pacientePrioritario) =>
                                        String(pacientePrioritario.id) ===
                                        String(paciente.id),
                                ) ? (
                                    <IoAlertCircle className="h-6 w-6 text-red-500" />
                                ) : (
                                    <LuCircleAlert className="h-5 w-5 text-yellow-500" />
                                )}
                            </button>
                        </div>
                        <ul className="flex gap-2">
                            <li className="font-semibold">{paciente.informacoes.idade} anos,</li>
                            <li className="font-semibold">{paciente.informacoes.peso} kg,</li>
                            <li className="font-semibold">{paciente.informacoes.altura} m</li>
                        </ul>
                        <p className="font-semibold">{paciente.informacoes.enfermidade}</p>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
};
export default ListarPacientes