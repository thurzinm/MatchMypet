# Código Fonte

Esta pasta contém o código-fonte da plataforma **MatchMyPet**. A aplicação é composta por um front-end estático (HTML, CSS e JavaScript) e um back-end baseado em **Node.js + JSON Server**, que fornece uma API RESTful a partir do arquivo `db/db.json`.

## Estrutura de diretórios

```plaintext
codigo/
│
├── db/
│   └── db.json                  Estruturas de dados (usuarios, animais, produtos, pedidos, mensagens, settings)
│
├── public/                      Front end (site servido pelo JSON Server)
│   ├── assets/
│   │   ├── css/                 Estilos globais e por tela
│   │   ├── js/                  Scripts (login, perfil, ranking, cadastro de pet, settings, chat)
│   │   └── images/              Imagens do site
│   │
│   ├── modulos/                 Funcionalidades, organizadas por membro/módulo
│   │   ├── login/               Login e cadastro de usuários
│   │   ├── pedro-aguiar/        Loja de produtos e carrinho de compras
│   │   ├── henrique-souza-telas/ Cadastro de animais, perfil do usuário e ranking
│   │   ├── Arthur-Lopes-telas/  Configurações e chat/mensagens
│   │   └── telas ronan/         Contato e reportar animal
│   │
│   ├── index.html               Página inicial (boas-vindas / integração com login)
│   └── about.html               Landing page da plataforma (MatchMyPet)
│
├── index.js                     Inicialização do JSON Server (back end)
├── package.json                 Configuração do projeto Node.js
└── README.md                    Este arquivo
```

## Parte Front End

Os arquivos do front-end ficam na pasta `public`. A organização adotada é:

* `index.html` / `about.html`: páginas iniciais do site.
* `assets`: arquivos de estilo (CSS), scripts (JS) e imagens compartilhados pelo site.
* `modulos`: cada funcionalidade fica em uma subpasta própria, também usada para dividir o trabalho entre os membros do grupo.

## Parte Back End

O back-end utiliza o ambiente **[Node.js](https://nodejs.org/)** com o módulo **[JSON Server](https://github.com/typicode/json-server#readme)**, que cria um servidor web e uma API RESTful a partir do `db.json`.

* Pasta `db`: contém o arquivo `db.json` com as estruturas de dados da aplicação.
* Arquivo `index.js`: inicializa o JSON Server, servindo os arquivos estáticos de `public` e a API REST dos dados de `db.json`.
* Arquivo `package.json`: configurações e dependências do projeto Node.js (`express` e `json-server`).

## Configuração e execução do ambiente

Instale o **[Node.js](https://nodejs.org/)** (versão LTS). Em seguida:

1. Abra a pasta `codigo` na sua IDE (ex.: Visual Studio Code).
2. Abra um terminal na pasta `codigo`.
3. Execute `npm install` para instalar as dependências (recria a pasta `node_modules`).
4. Execute `npm start` para iniciar o JSON Server.
5. Para testar:
   * **Front End:** acesse [http://localhost:3000](http://localhost:3000)
   * **Back End (API):** acesse [http://localhost:3000/usuarios](http://localhost:3000/usuarios)

> Dica: caso apareça o erro `EADDRINUSE: address already in use :::3000`, significa que a porta 3000 já está em uso. Encerre o processo anterior (ex.: `lsof -ti:3000 | xargs kill -9`) antes de rodar `npm start` novamente.

## Endpoints da API

O JSON Server expõe automaticamente um endpoint REST para cada coleção do `db.json`:

| Recurso | Endpoint |
| --- | --- |
| Usuários | `/usuarios` |
| Animais | `/animais` |
| Produtos | `/produtos` |
| Pedidos | `/pedidos` |
| Mensagens | `/mensagens` |
| Configurações | `/settings` |

Cada endpoint aceita as operações REST padrão (GET, POST, PUT, PATCH, DELETE).

## Usuários de teste

O `db.json` já vem com usuários para teste de login:

| Login | Senha |
| --- | --- |
| `admin` | `123` |
| `user` | `123` |

## Dúvidas e Suporte

Em caso de dúvidas sobre o ambiente, procure a monitoria da disciplina.

* Documentação do JSON Server: [página do módulo no NPM](https://www.npmjs.com/package/json-server/v/0.17.4)
* Portal de exemplos da disciplina (DIW): [lab-jsonserver](https://github.com/webtech-network/lab-jsonserver)
