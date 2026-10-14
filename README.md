# Sistema de Locadora — Sprint 1

Angular simples com componentes standalone, formulários com ngModel, serviços com HttpClient e CSS básico. As tabelas recebem os dados da API.

## Executar

Inicie o Spring Boot existente em http://localhost:8080. Nesta pasta, execute:

```powershell
npm.cmd start
```

Abra http://localhost:4200. Use esse endereço, autorizado pelo CORS do back-end. As dependências já estavam instaladas; se necessário, execute npm.cmd install. O sufixo .cmd evita o bloqueio de scripts do PowerShell.

## Testar os cadastros

1. Abra Atores, preencha Nome e clique em Salvar. Confira o registro na tabela.
2. Clique em Editar, altere Nome e salve. Use Cancelar edição para desistir.
3. Clique em Excluir. Cancele a confirmação para manter o registro ou confirme para excluí-lo.
4. Repita em Diretores e Classes. Classes inclui Descrição.
5. Recarregue a página para conferir a persistência pela API.

Os serviços usam GET e POST em /atores, /classes e /diretores, e PUT e DELETE nos mesmos caminhos com /{id}.

## Validar

```powershell
npm.cmd run build
npm.cmd test -- --watch=false
```

Os testes verificam os formulários, botões, chamadas HTTP, confirmação de exclusão e tratamento de erros com respostas simuladas, sem alterar o banco.

Na consulta real durante a implementação, /atores respondeu HTTP 200 com CORS correto, enquanto /classes e /diretores responderam HTTP 404. Os controllers existem no código analisado. Reinicie o Spring Boot a partir do projeto atual e confira essas URLs antes de testar. Nenhum arquivo do back-end foi modificado. As operações de gravação na API real não foram testadas.

## Arquivos criados e modificados

- src/app/inicio/inicio.ts: página inicial.
- src/app/atores/: componente, HTML e serviço de atores.
- src/app/classes/: componente, HTML e serviço de classes.
- src/app/diretores/: componente, HTML e serviço de diretores.
- src/app/app.ts, app.html e app.css: estrutura e menu.
- src/app/app.routes.ts: rotas das quatro páginas.
- src/app/app.config.ts: configuração do HttpClient.
- src/app/app.routes.server.ts: cadastros renderizados no navegador, sem exigir API no build.
- src/styles.css e src/index.html: estilos básicos e idioma português.
- src/app/app.spec.ts e src/app/cadastros.spec.ts: testes.
