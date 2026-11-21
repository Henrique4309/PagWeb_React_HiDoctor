import { Routes, Route } from "react-router-dom";
import Login from "./paginas/Login";
import HomePaciente from "./paginas/HomePaciente";
import HomeFuncionario from "./paginas/HomeFuncionario";
import Cadastro from "./paginas/Cadastro";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/home" element={<HomePaciente />} />
      <Route path="/medico" element={<HomeFuncionario />} />
    </Routes>
  );
}