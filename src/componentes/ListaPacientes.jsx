import { useEffect, useMemo, useState } from "react";
import { usersEndpoint } from "../config";
import { LuCircleAlert, LuSearch } from "react-icons/lu";
import { IoAlertCircle } from "react-icons/io5";
import DadosPaciente from "./DadosPaciente";

function ListarPacientes({ idsPrioritarios, aoAlternarPrioridade, aoMudarSemResultado }) {
    const [pacientes, setPacientes] = useState([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
    const [busca, setBusca] = useState("");
    const [carregou, setCarregou] = useState(false);
    const [erroCarregamento, setErroCarregamento] = useState("");

    useEffect(() => {
        async function buscarPaciente() {
            try {
                const resposta = await fetch(usersEndpoint);
                if (!resposta.ok) throw new Error("Erro ao buscar os pacientes");
                const dados = await resposta.json();
                setPacientes(
                    (Array.isArray(dados) ? dados : []).filter(
                        (usuario) => usuario.tipo === "paciente",
                    ),
                );
                setErroCarregamento("");
            } catch (erro) {
                console.error(erro);
                setErroCarregamento(
                    "Não foi possível carregar os pacientes. Verifique a conexão com o servidor.",
                );
            } finally {
                setCarregou(true);
            }
        }
        buscarPaciente();
    }, []);

    const pacientesOrdenados = useMemo(
        () =>
            [...pacientes].sort(
                (pacienteA, pacienteB) =>
                    Number(idsPrioritarios.has(String(pacienteB.id))) -
                    Number(idsPrioritarios.has(String(pacienteA.id))),
            ),
        [pacientes, idsPrioritarios],
    );

    const termoBusca = busca.trim().toLowerCase();
    const pacientesFiltrados = termoBusca
        ? pacientesOrdenados.filter(
              (paciente) =>
                  paciente.nome?.toLowerCase().includes(termoBusca) ||
                  paciente.informacoes?.enfermidade
                      ?.toLowerCase()
                      .includes(termoBusca),
          )
        : pacientesOrdenados;

    const semResultado =
        carregou &&
        !erroCarregamento &&
        !pacienteSelecionado &&
        pacientesFiltrados.length === 0;
    useEffect(() => {
        aoMudarSemResultado(semResultado);
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
        {erroCarregamento && (
            <p
                role="alert"
                className="w-[95%] xl:w-[60%] mx-auto mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 xl:text-base"
            >
                {erroCarregamento}
            </p>
        )}
        <div className="w-[95%] m-auto grid grid-cols-1 justify-items-center xl:grid-cols-3 gap-4">
            {pacientesFiltrados.map((paciente) => {
                const informacoes = paciente.informacoes || {};
                const prioritario = idsPrioritarios.has(String(paciente.id));
                return (
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
                    className={`w-full flex items-center gap-4 rounded-xl border p-4 shadow-md cursor-pointer bg-gradient-to-b from-white via-white via-65% transition-colors ${prioritario ? "to-[#EFC9C9] border-[#EFC9C9]" : "to-[#CBE6F2]"}`} key={paciente.id}>
                    <img src={paciente.url} alt="Imagem do Paciente" className="w-16 h-16 object-cover rounded-full" />
                    <div className="w-[80%] 2xl:w-[90%]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">{paciente.nome}</h2>
                            <button
                                type="button"
                                aria-label={`${prioritario ? "Despriorizar" : "Priorizar"} ${paciente.nome}`}
                                onClick={(evento) => {
                                    evento.stopPropagation();
                                    aoAlternarPrioridade(paciente);
                                }}
                                onKeyDown={(evento) => evento.stopPropagation()}
                            >
                                {prioritario ? (
                                    <IoAlertCircle className="h-6 w-6 text-red-500" />
                                ) : (
                                    <LuCircleAlert className="h-5 w-5 text-yellow-500" />
                                )}
                            </button>
                        </div>
                        <ul className="flex gap-2">
                            <li className="font-semibold">{informacoes.idade} anos,</li>
                            <li className="font-semibold">{informacoes.peso} kg,</li>
                            <li className="font-semibold">{informacoes.altura} m</li>
                        </ul>
                        <p className="font-semibold">{informacoes.enfermidade}</p>
                    </div>
                </div>
                );
            })}
        </div>
        </>
    );
}
export default ListarPacientes