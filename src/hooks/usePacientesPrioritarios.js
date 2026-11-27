import { useCallback, useMemo, useState } from "react";

const pacientesPrioritariosKey = "hidoc_pacientes_prioritarios";

function chavePrioritarios(medicoId) {
  return medicoId != null ? `${pacientesPrioritariosKey}_${medicoId}` : null;
}

function carregarPacientesPrioritarios(medicoId) {
  const chave = chavePrioritarios(medicoId);
  if (!chave) return [];

  try {
    const pacientesSalvos = JSON.parse(localStorage.getItem(chave) || "[]");
    return Array.isArray(pacientesSalvos)
      ? pacientesSalvos.filter((paciente) => paciente && paciente.id != null && paciente.nome)
      : [];
  } catch (erro) {
    console.error("Erro ao carregar pacientes prioritários:", erro);
    return [];
  }
}

function salvarPacientesPrioritarios(medicoId, pacientes) {
  const chave = chavePrioritarios(medicoId);
  if (!chave) {
    console.error("Médico não identificado: prioridade não salva.");
    return;
  }

  try {
    if (pacientes.length === 0) {
      localStorage.removeItem(chave);
    } else {
      localStorage.setItem(chave, JSON.stringify(pacientes));
    }
  } catch (erro) {
    console.error("Erro ao salvar paciente prioritário:", erro);
  }
}

export function usePacientesPrioritarios(medicoId) {
  const [prioritarios, setPrioritarios] = useState(() =>
    carregarPacientesPrioritarios(medicoId),
  );

  const idsPrioritarios = useMemo(
    () => new Set(prioritarios.map((paciente) => String(paciente.id))),
    [prioritarios],
  );

  const atualizar = useCallback(
    (calcular) => {
      setPrioritarios((atuais) => {
        const atualizados = calcular(atuais);
        if (atualizados === atuais) return atuais;
        salvarPacientesPrioritarios(medicoId, atualizados);
        return atualizados;
      });
    },
    [medicoId],
  );

  const priorizar = useCallback(
    (paciente) => {
      if (paciente?.id == null) return;
      atualizar((atuais) =>
        atuais.some((item) => String(item.id) === String(paciente.id))
          ? atuais
          : [{ id: paciente.id, nome: paciente.nome }, ...atuais],
      );
    },
    [atualizar],
  );

  const alternarPrioridade = useCallback(
    (paciente) => {
      if (paciente?.id == null) return;
      atualizar((atuais) =>
        atuais.some((item) => String(item.id) === String(paciente.id))
          ? atuais.filter((item) => String(item.id) !== String(paciente.id))
          : [{ id: paciente.id, nome: paciente.nome }, ...atuais],
      );
    },
    [atualizar],
  );

  return { idsPrioritarios, priorizar, alternarPrioridade };
}
