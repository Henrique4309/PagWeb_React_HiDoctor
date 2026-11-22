import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { MEDIDAS, useMedicoes, calcularDominioY } from "../hooks/useMedicoes";

// Gráfico das últimas medições do paciente.
// cpfPaciente: CPF de quem teve as medições registradas
// medida: chave de MEDIDAS ("oxigenio", "respiratoria" ou "cardiaca")
function Grafico({ cpfPaciente, medida }) {
  const medidaAtual = MEDIDAS[medida];

  // Últimas 10 medições do db.json (completadas com 0), atualizadas automaticamente
  const dadosGrafico = useMedicoes(cpfPaciente, medida);
  const dominioY = calcularDominioY(dadosGrafico);

  return (
    <section className="w-[85%] max-w-[500px] mx-auto mt-5 mb-4 xl:col-start-2 xl:row-start-1 xl:w-full xl:max-w-[780px] xl:mt-8">

      {/* Fundo azul externo */}
      <div className="bg-[#D9EDF3] rounded-xl p-3 shadow-[0_3px_5px_rgba(0,0,0,0.12)] border border-[#C5E1E9]">

        {/* Título */}
        <div className="mb-2 ml-1">
          <h2 className="text-sm font-semibold text-slate-600 xl:xl:text-lg">
            {medidaAtual.titulo}
          </h2>

          <p className="text-[10px] text-slate-400">
            {medidaAtual.unidade}
          </p>
        </div>

        {/* Área branca do gráfico */}
        <div className="bg-white rounded-md p-2 shadow-sm">

          <div className="w-full h-[195px] xl:h-[240px]">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart
                data={dadosGrafico}
                margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
              >

                <defs>
                  <linearGradient
                    id="corOxigenacao"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#64BDAE"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="#64BDAE"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#DCECEF"
                />

                <XAxis
                  dataKey="horario"
                  tick={{ fontSize: 9, fill: "#8299A0" }}
                  axisLine={{ stroke: "#DCECEF" }}
                  tickLine={false}
                />

                <YAxis
                  domain={dominioY}
                  tick={{ fontSize: 9, fill: "#8299A0" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #D9EDF3",
                    fontSize: "11px"
                  }}
                  formatter={(value) => [`${value}${medidaAtual.sufixo}`, medidaAtual.rotulo]}
                />

                <Area
                  type="monotone"
                  dataKey="valor"
                  isAnimationActive={false}
                  stroke="#62BBAA"
                  strokeWidth={2}
                  fill="url(#corOxigenacao)"
                  dot={{
                    r: 3,
                    fill: "#FFFFFF",
                    stroke: "#62BBAA",
                    strokeWidth: 2
                  }}
                  activeDot={{ r: 5 }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>
      </div>

    </section>
  );
}

export default Grafico;
