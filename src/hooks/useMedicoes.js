import { useEffect, useState } from "react";
import { jsonServerUrl } from "../config";
import { fusoBrasilia } from "../datas";

const qtdMedicoes = 10;

const intervaloAtualizacao = 3000;

export const medidas = {
  oxigenio: {
    titulo: "Oxigênio",
    botao: "Oxigênio",
    unidade: "SpO₂ (%)",
    tipo: "saturacao_oxigenio",
    rotulo: "Oxigenação",
    sufixo: "%",
    faixa: [95, 100],
  },
  respiratoria: {
    titulo: "Frequência Respiratória",
    botao: "Frequência Respiratória",
    unidade: "Movimentos por minuto",
    tipo: "frequencia_respiratoria",
    rotulo: "Freq. respiratória",
    sufixo: " rpm",
    faixa: [12, 20],
  },
  cardiaca: {
    titulo: "Frequência Cardíaca",
    botao: "Frequência Cardíaca",
    unidade: "BPM",
    tipo: "frequencia_cardiaca",
    rotulo: "Freq. cardíaca",
    sufixo: " bpm",
    faixa: [60, 100],
  },
  variabilidade: {
    titulo: "Variabilidade da Frequência Cardíaca",
    botao: "Variabilidade Cardíaca",
    unidade: "Milissegundos (ms)",
    tipo: "variabilidade_fc",
    rotulo: "Variabilidade FC",
    sufixo: " ms",
    faixa: [20, 100],
  },
};

const normalizarCpf = (cpf) => String(cpf ?? "").replace(/\D/g, "");

const formatarHorario = (dataHora) =>
  new Date(dataHora).toLocaleTimeString("pt-BR", {
    timeZone: fusoBrasilia,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

function montarPontos(medicoes) {
  const reais = [...medicoes]
    .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
    .slice(-qtdMedicoes)
    .map((m) => ({
      id: m.id,
      horario: formatarHorario(m.dataHora),
      valor: Number(m.valor) || 0,
    }));

  const vazios = Array.from({ length: qtdMedicoes - reais.length }, (_, i) => ({
    id: `vazio-${i}`,
    horario: "--",
    valor: null,
  }));

  return [...vazios, ...reais];
}

export function useMedicoes(cpfInformado, medidaKey) {
  const tipo = medidas[medidaKey].tipo;
  const cpf = normalizarCpf(cpfInformado);
  const [pontos, setPontos] = useState(() => montarPontos([]));

  useEffect(() => {
    if (!cpf || !tipo) {
      setPontos(montarPontos([]));
      return;
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
          _limit: String(qtdMedicoes),
        });
        const resposta = await fetch(`${jsonServerUrl}/medicoes?${params}`, {
          signal: controller.signal,
        });
        if (!resposta.ok) throw new Error("Erro ao buscar medições");

        const resultado = await resposta.json();
        if (!ativo) return;

        const dados = (Array.isArray(resultado) ? resultado : []).filter(
          (m) => normalizarCpf(m.usuario) === cpf && m.tipo === tipo,
        );

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
    const timer = setInterval(buscar, intervaloAtualizacao);

    return () => {
      ativo = false;
      controller.abort();
      clearInterval(timer);
    };
  }, [cpf, tipo]);

  return pontos;
}

const chaveDoDia = (data) =>
  `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(
    data.getDate(),
  ).padStart(2, "0")}`;

const formatarHoraMinuto = (dataHora) => String(dataHora).slice(11, 16);

export function useHistoricoDia(cpfInformado, medidaKey, dia) {
  const tipo = medidas[medidaKey].tipo;
  const cpf = normalizarCpf(cpfInformado);
  const chave = dia ? chaveDoDia(dia) : "";
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    if (!chave || !cpf || !tipo) {
      setEstado(null);
      return;
    }

    let ativo = true;
    const controller = new AbortController();
    setEstado({ chave, pontos: [], resumo: null, carregando: true });

    const params = new URLSearchParams({
      usuario: cpf,
      tipo,
      dataHora_like: `^${chave}`,
      _sort: "dataHora",
      _order: "asc",
    });

    fetch(`${jsonServerUrl}/historico?${params}`, { signal: controller.signal })
      .then((resposta) => {
        if (!resposta.ok) throw new Error("Erro ao buscar histórico");
        return resposta.json();
      })
      .then((resultado) => {
        if (!ativo) return;
        const dados = (Array.isArray(resultado) ? resultado : [])
          .filter(
            (m) =>
              normalizarCpf(m.usuario) === cpf &&
              m.tipo === tipo &&
              String(m.dataHora).startsWith(chave),
          )
          .sort((a, b) => (a.dataHora < b.dataHora ? -1 : 1));

        const pontos = dados.map((m) => ({
          id: m.id,
          horario: formatarHoraMinuto(m.dataHora),
          valor: Number(m.valor) || 0,
        }));

        const valores = pontos.map((p) => p.valor);
        const resumo = valores.length
          ? {
              maximo: Math.max(...valores),
              minimo: Math.min(...valores),
              media: valores.reduce((soma, v) => soma + v, 0) / valores.length,
            }
          : null;

        setEstado({ chave, pontos, resumo, carregando: false });
      })
      .catch((erro) => {
        if (erro.name === "AbortError" || !ativo) return;
        console.error(erro);
        setEstado({ chave, pontos: [], resumo: null, carregando: false });
      });

    return () => {
      ativo = false;
      controller.abort();
    };
  }, [cpf, tipo, chave]);

  if (!chave || !estado || estado.chave !== chave) {
    return chave ? { pontos: [], resumo: null, carregando: true } : null;
  }
  return estado;
}

const folgaForaDaFaixa = 2;

export function calcularDominioY(pontos, medidaKey) {
  const [faixaMin, faixaMax] = medidas[medidaKey].faixa;
  const valores = pontos
    .map((p) => p.valor)
    .filter((valor) => Number.isFinite(valor));

  if (valores.length === 0) return [faixaMin, faixaMax];

  const menor = Math.min(...valores);
  const maior = Math.max(...valores);

  const min = menor < faixaMin ? Math.floor(menor - folgaForaDaFaixa) : faixaMin;
  const max = maior > faixaMax ? Math.ceil(maior + folgaForaDaFaixa) : faixaMax;

  return [Math.max(0, min), max];
}
