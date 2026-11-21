# Login hidoc — URL configurável

Altere o endereço do JSON Server em `src/config.js`:

```js
export const JSON_SERVER_URL = "https://api-hidoctor.onrender.com";
```

A aplicação acrescenta `/users` automaticamente. A coleção `users` deve conter `cpf`, `senha` e, opcionalmente, `nome`. Consulte `db.json.example`.

Execute:

```bash
npm install
npm run dev
```

Acesse a URL informada pelo Vite.

**Segurança:** esta versão é apenas um protótipo. O JSON Server expõe os registros consultados pelo navegador, inclusive a senha. Em produção, valide CPF e senha em um backend e nunca exponha senhas na API.
