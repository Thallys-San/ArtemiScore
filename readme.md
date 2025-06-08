CONFIGURAÇÃO DO PROJETO - GUIA COMPLETO
=======================================
---------------------
ESTRUTURA DO PROJETO

- /backend     - API e servidor Node.js (Express, etc)
- /frontend    - Aplicação React
- /electron    - Aplicação desktop (opcional)
-------------------------
1. PRÉ-REQUISITOS GLOBAIS

- Node.js (v18.x ou superior): https://nodejs.org/
- Verifique com: `node -v` e `npm -v`

- Gerenciador de pacotes (um dos seguintes):
  - npm (já vem com o Node) #Recomendado
  - yarn: `npm install -g yarn`
  - pnpm: `npm install -g pnpm`
-------------------
2. CLONAR O PROJETO

- git clone https://github.com/Thallys-San/ArtemiScore.git
- cd ArtemiScore
--------------------------
3. CONFIGURAÇÃO POR MÓDULO

------------------
BACKEND (/backend)

- cd backend
- npm install
# Inicie o servidor:
- npm start
--------------------
FRONTEND (/frontend)

- cd ../frontend
- npm install
- npm run build
# Inicie o app React em modo de desenvolvimento:
- npm start
-------------------------------
ELECTRON (/electron - opcional)

- cd ../electron
- npm install
# Inicie a versão desktop do app (se aplicável):
- npm start
------------------
4. COMANDOS ÚTEIS


BACKEND
- Iniciar em dev:        npm run dev
- Iniciar em produção:   npm start
- Executar testes:       npm test

FRONTEND
- Iniciar em dev:        npm run dev
- Gerar build:           npm run build
- Servir build local:    npm run serve

ELECTRON
- Iniciar em dev:        npm start
- Gerar pacote desktop:  npm run make
-----------------------------------
5. REINSTALAÇÃO COMPLETA (opcional)

# Executar na raiz do projeto:
- rm -rf backend/node_modules frontend/node_modules electron/node_modules
- rm -f backend/package-lock.json frontend/package-lock.json electron/package-lock.json
- npm install
------------------------
6. SOLUÇÃO DE PROBLEMAS


BACKEND
- Verifique a configuração do `.env` se houver erro de conexão
- Banco de dados: verifique se está rodando e acessível

FRONTEND
- Cache corrompido: `rm -rf node_modules/.cache`

ELECTRON
- Erros nativos: delete `node_modules` e reinstale com `npm install --force`
-----------------
7. BOAS PRÁTICAS

- Nunca suba `node_modules`, `build`, `dist` ou `target`
- Sempre configure seu `.env` localmente (não subir para o repositório)
- Comite somente arquivos relevantes do código-fonte
