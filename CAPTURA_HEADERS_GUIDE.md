# 📥 Guia: Como Capturar Headers e Parâmetros para Testes K6

## 1. Exportar HAR (HTTP Archive) do Navegador

- Abra o DevTools (F12) → Aba Network
- Clique com o direito em qualquer requisição → “Salvar tudo como HAR com conteúdo”
- Use a ferramenta [har-to-k6](https://github.com/k6io/har-to-k6) para converter o HAR em script k6:
  ```bash
  npm install -g har-to-k6
  har-to-k6 arquivo.har -o teste-k6.js
  ```
- O script gerado já traz todos os headers, parâmetros e cookies reais.

---

## 2. Usar Extensões do Navegador
- Extensões como “RESTED”, “Postman Interceptor” ou “ModHeader” permitem capturar e exportar requisições completas, incluindo headers e cookies.

---

## 3. Proxy HTTP (Fiddler, Charles, mitmproxy)
- Rode um proxy local, configure o navegador para usá-lo e capture todo o tráfego HTTP/HTTPS.
- Exporte as requisições desejadas (muitos proxies exportam em HAR ou cURL).

---

## 4. Postman
- Importe a requisição manualmente ou use o Interceptor para capturar do navegador.
- Exporte a requisição como cURL ou como coleção (que pode ser convertida para k6).

---

## 5. Ferramentas de Linha de Comando
- Use o comando `curl -v` para ver todos os headers enviados e recebidos.
- Use `httpie` para requisições mais legíveis.

---

## 6. Análise de Código Fonte
- Se você tem acesso ao frontend, pode ver no código JS quais headers/parâmetros são enviados nas chamadas AJAX/fetch.

---

## 7. Dica Prática: HAR → K6

A forma mais automatizada é exportar um HAR do navegador e converter para k6, pois isso garante que todos os headers, parâmetros, cookies e até a ordem das requisições sejam idênticos ao uso real do usuário.

### Exemplo de conversão:
```bash
# 1. Capture o HAR no navegador
# 2. Converta para k6
har-to-k6 minha-sessao.har -o teste-gerado.js
```

O arquivo `teste-gerado.js` já estará pronto para rodar no k6!

---

**Use sempre o método que melhor se adapta ao seu cenário e garanta que os testes sejam o mais realistas possível!**