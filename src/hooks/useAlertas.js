import { useCallback, useEffect, useState } from "react";
import { JSON_SERVER_URL, USERS_ENDPOINT } from "../config";

// Intervalo (ms) entre consultas ao json-server para detectar novos alertas
const INTERVALO_ATUALIZACAO = 3000;

// Ids dos alertas já fechados neste navegador (para não reaparecerem)
const ALERTAS_VISTOS_KEY = "hidoc_alertas_vistos";

const normalizarCpf = (cpf) => String(cpf ?? "").replace(/\D/g, "");

function carregarAlertasVistos() {
  try {
    const salvos = JSON.parse(localStorage.getItem(ALERTAS_VISTOS_KEY) || "[]");
    return Array.isArray(salvos) ? salvos.map(String) : [];
  } catch {
    return [];
  }
}

function salvarAlertasVistos(ids) {
  try {
    localStorage.setItem(ALERTAS_VISTOS_KEY, JSON.stringify(ids));
  } catch (erro) {
    console.error("Erro ao salvar alertas vistos:", erro);
  }
}

/**
 * Observa a coleção /alertas do json-server, para qualquer médico.
 * Devolve o alerta pendente mais antigo (ainda não fechado), junto com o
 * paciente dono do alerta (users.cpf === alertas.usuario), e a função
 * para fechá-lo. Quando não há alerta pendente, alerta e paciente são null.
 */
export function useAlertas() {
  const [alertas, setAlertas] = useState([]);
  const [vistos, setVistos] = useState(carregarAlertasVistos);
  const [paciente, setPaciente] = useState(null);

  // Consulta /alertas periodicamente
  useEffect(() => {
    let ativo = true;
    let assinaturaAnterior = "";
    const controller = new AbortController();

    const buscar = async () => {
      try {
        const resposta = await fetch(`${JSON_SERVER_URL}/alertas`, {
          signal: controller.signal,
        });
        if (!resposta.ok) throw new Error("Erro ao buscar alertas");

        const resultado = await resposta.json();
        if (!ativo) return;

        const dados = Array.isArray(resultado) ? resultado : [];

        // Só re-renderiza se algo mudou
        const assinatura = dados.map((alerta) => alerta.id).join("|");
        if (assinatura !== assinaturaAnterior) {
          assinaturaAnterior = assinatura;
          setAlertas(dados);
        }
      } catch (erro) {
        if (erro.name !== "AbortError") console.error(erro);
      }
    };

    buscar();
    const timer = setInterval(buscar, INTERVALO_ATUALIZACAO);

    return () => {
      ativo = false;
      controller.abort();
      clearInterval(timer);
    };
  }, []);

  // Alerta pendente mais antigo
  const alerta =
    alertas
      .filter((item) => !vistos.includes(String(item.id)))
      .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))[0] || null;

  const cpfAlerta = alerta ? normalizarCpf(alerta.usuario) : "";

  // Busca foto e nome do paciente do alerta em /users
  useEffect(() => {
    setPaciente(null);
    if (!cpfAlerta) return undefined;

    let ativo = true;
    fetch(USERS_ENDPOINT)
      .then((resposta) => (resposta.ok ? resposta.json() : []))
      .then((usuarios) => {
        if (!ativo || !Array.isArray(usuarios)) return;
        const encontrado = usuarios.find(
          (usuario) => normalizarCpf(usuario.cpf) === cpfAlerta,
        );
        setPaciente(encontrado || null);
      })
      .catch((erro) => console.error(erro));

    return () => {
      ativo = false;
    };
  }, [cpfAlerta]);

  const fecharAlerta = useCallback(() => {
    if (!alerta) return;
    setVistos((atuais) => {
      const atualizados = [...atuais, String(alerta.id)];
      salvarAlertasVistos(atualizados);
      return atualizados;
    });
  }, [alerta]);

  return { alerta, paciente, fecharAlerta };
}
