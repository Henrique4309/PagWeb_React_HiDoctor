import { useCallback, useEffect, useState } from "react";
import { jsonServerUrl, usersEndpoint } from "../config";

const intervaloAtualizacao = 3000;

const alertasVistosKey = "hidoc_alertas_vistos";

const normalizarCpf = (cpf) => String(cpf ?? "").replace(/\D/g, "");

const paraId = (valor) => (valor == null ? null : String(valor));

function carregarAlertasVistos() {
  try {
    const salvos = JSON.parse(localStorage.getItem(alertasVistosKey) || "[]");
    return Array.isArray(salvos) ? salvos.filter((visto) => visto?.alertaId) : [];
  } catch {
    return [];
  }
}

function salvarAlertasVistos(vistos) {
  try {
    localStorage.setItem(alertasVistosKey, JSON.stringify(vistos));
  } catch (erro) {
    console.error("Erro ao salvar alertas vistos:", erro);
  }
}

export function useAlertas(habilitado, medicoId) {
  const idMedico = paraId(medicoId);
  const [alertas, setAlertas] = useState([]);
  const [vistos, setVistos] = useState(carregarAlertasVistos);
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    if (!habilitado) return;

    let ativo = true;
    let assinaturaAnterior = "";
    const controller = new AbortController();

    const buscar = async () => {
      try {
        const resposta = await fetch(`${jsonServerUrl}/alertas`, {
          signal: controller.signal,
        });
        if (!resposta.ok) throw new Error("Erro ao buscar alertas");

        const resultado = await resposta.json();
        if (!ativo) return;

        const dados = Array.isArray(resultado) ? resultado : [];

        const assinatura = JSON.stringify(dados);
        if (assinatura !== assinaturaAnterior) {
          assinaturaAnterior = assinatura;
          setAlertas(dados);

          const idsExistentes = new Set(dados.map((item) => String(item.id)));
          setVistos((atuais) => {
            const mantidos = atuais.filter((visto) => idsExistentes.has(visto.alertaId));
            if (mantidos.length === atuais.length) return atuais;
            salvarAlertasVistos(mantidos);
            return mantidos;
          });
        }
      } catch (erro) {
        if (erro.name !== "AbortError") console.error(erro);
      }
    };

    buscar();
    const timer = setInterval(buscar, intervaloAtualizacao);

    return () => {
      ativo = false;
      controller.abort();
      clearInterval(timer);
    };
  }, [habilitado]);

  const alerta =
    alertas
      .filter(
        (item) =>
          !vistos.some(
            (visto) => visto.alertaId === String(item.id) && visto.medicoId === idMedico,
          ),
      )
      .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))[0] || null;

  const cpfAlerta = alerta ? normalizarCpf(alerta.usuario) : "";

  useEffect(() => {
    setPaciente(null);
    if (!cpfAlerta) return;

    let ativo = true;
    fetch(`${usersEndpoint}?${new URLSearchParams({ cpf: cpfAlerta })}`)
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
    const novoVisto = {
      alertaId: String(alerta.id),
      medicoId: idMedico,
      pacienteId: paraId(paciente?.id),
    };
    setVistos((atuais) => {
      const atualizados = [...atuais, novoVisto];
      salvarAlertasVistos(atualizados);
      return atualizados;
    });
  }, [alerta, idMedico, paciente]);

  return { alerta, paciente, fecharAlerta };
}
