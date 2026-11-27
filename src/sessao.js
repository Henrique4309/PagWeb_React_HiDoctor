const chaveSessao = "hidoc_usuario";

export function lerUsuarioSessao() {
  try {
    const usuario = JSON.parse(sessionStorage.getItem(chaveSessao) || "null");
    return usuario && typeof usuario === "object" ? usuario : null;
  } catch {
    return null;
  }
}

export function salvarUsuarioSessao(usuario) {
  sessionStorage.setItem(chaveSessao, JSON.stringify(usuario));
}
