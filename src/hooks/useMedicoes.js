import { useEffect, useState } from "react";
import { JSON_SERVER_URL } from "../config";

// Quantidade de medições exibidas no gráfico
export const QTD_MEDICOES = 10;

// Intervalo (ms) entre consultas ao json-server para detectar novos dados
const INTERVALO_ATUALIZACAO = 3000;

// Configuração de cada gráfico -> tipo de medição no db.json
export const MEDIDAS = {
  oxigenio: {
    titulo: "Oxigênio",
    unidade: "SpO₂ (%)",
    tipo: "saturacao_oxigenio",
    rotulo: "Oxigenação",
    sufixo: "%",
  },
  respiratoria: {
    titulo: "Frequência Respiratória",
    unidade: "Movimentos por minuto",
    tipo: "frequencia_respiratoria",
    rotulo: "Freq. respiratória",
    sufixo: " rpm",
  },
  cardiaca: {
    titulo: "Frequência Cardíaca",
    unidade: "BPM",
    tipo: "frequencia_cardiaca",
    rotulo: "Freq. cardíaca",
    sufixo: " bpm",
  },
};

const normalizarCpf = (cpf) => String(cpf ?? "").replace(/\D/g, "");

const formatarHorario =(dataHora) =>
  new Date(dataHora).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

// Sempre devolve QTD_MEDICOES pontos: as últimas medições em ordem
// cronológica, completadas com 0 à esquerda quando faltarem dados.
function montarPontos(medicoes) {
  const reais = [...medicoes]
    .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
    .slice(-QTD_MEDICOES)
    .map((m) => ({
      id: m.id,
      horario: formatarHorario(m.dataHora),
      valor: Number(m.valor) || 0,
    }));

  const vazios = Array.from({ length: QTD_MEDICOES - reais.length }, (_, i) => ({
    id: `vazio-${i}`,
    horario: "--",
    valor: 0,
  }));

  return [...vazios, ...reais];
}

/**
 * Observa as medições de um paciente (pelo CPF) no db.json via json-server.
 * Faz uma nova consulta a cada INTERVALO_ATUALIZACAO ms, então o gráfico
 * atualiza sozinho quando chegam medições novas.
 */
export function useMedicoes(cpfInformado, medidaKey) {
  const tipo = MEDIDAS[medidaKey]?.tipo;
  // CPF só com dígitos, para comparar com o campo "usuario" das medições
  const cpf = normalizarCpf(cpfInformado);
  const [pontos, setPontos] = useState(() => montarPontos([]));

  useEffect(() => {
    if (!cpf || !tipo) {
      setPontos(montarPontos([]));
      return undefined;
    }

    let ativo = true;
    let assinaturaAnterior = "";
    const controller = new AbortController();

    const buscar = async () => {
      try {
        const params = new URLSearchParams({
          usuario: cpf,
          tipo,
          _sort: "dataHora",
          _order: "desc",
          _limit: String(QTD_MEDICOES),
        });
        const resposta = await fetch(`${JSON_SERVER_URL}/medicoes?${params}`, {
          signal: controller.signal,
        });
        if (!resposta.ok) throw new Error("Erro ao buscar medições");

        const resultado = await resposta.json();
        if (!ativo) return;

        // Garantia extra: só aceita medições deste paciente e deste tipo
        const dados = (Array.isArray(resultado) ? resultado : []).filter(
          (m) => normalizarCpf(m.usuario) === cpf && m.tipo === tipo,
        );

        // Só re-renderiza se algo mudou
        const assinatura = dados.map((m) => `${m.id}:${m.valor}`).join("|");
        if (assinatura !== assinaturaAnterior) {
          assinaturaAnterior = assinatura;
          setPontos(montarPontos(dados));
        }
      } catch (erro) {
        if (erro.name !== "AbortError") console.error(erro);
      }
    };

    setPontos(montarPontos([]));
    buscar();
    const timer = setInterval(buscar, INTERVALO_ATUALIZACAO);

    return () => {
      ativo = false;
      controller.abort();
      clearInterval(timer);
    };
  }, [cpf, tipo]);

  return pontos;
}

// Domínio do eixo Y ajustado aos dados (inclui 0 quando há pontos vazios)
export function calcularDominioY(pontos) {
  const valores = pontos.map((p) => p.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  if (max === 0) return [0, 10];
  const folga = Math.max(1, Math.ceil((max - min) * 0.1));
  return [Math.max(0, Math.floor(min - folga)), Math.ceil(max + folga)];
}
