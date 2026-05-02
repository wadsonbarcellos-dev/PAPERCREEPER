# PaperCreeper - O Painel Mágico de Minecraft (IA + Skript + Servidores Locais)

O **PaperCreeper** não é apenas um painel de hospedagem. É o seu companheiro Minecraft construído com Inteligência Artificial e foco extremo em performance.  
Crie servidores (Paper, Forge, Fabric, etc.), gerencie plugins, edite mapas, modifique configurações, injete Skripts Mágicos nativos, e exporte seu mundo de jogo em minutos, tudo com ajuda da nossa "Inteligência Creeper".

---

## 🚀 Como Iniciar (Setup & Configuração)

A configuração foi desenhada para ser simples e rápida. Você pode rodar de duas formas principais: Usando a nossa IA Embutida gratuitamente, ou se conectando ao seu provedor local pra rodar o painel off-grid (sem custos na cloud).

### 1. Inicializando o Servidor Web (NodeJS)

Certifique-se de que o NPM e Node (v18+) estão instalados no seu computador.
No terminal, execute:
```bash
npm install
npm run build
npm start
```
O painel iniciará na porta `3000`. Acesse `http://localhost:3000` ou a URL providenciada do deploy na Cloud, e o **Menu Mágico** lhe dará boas vindas!

### 2. Configuração do Assistente IA

O painel já vem com integração total da IA nas abas e um botão voador onipresente (`I.A Assist`). Como conectar:

1. Clique na engrenagem de **Configurações** no menu lateral.
2. Na seção **API IA (Universal)** clique em `Configurar`.
3. Selecione o seu provedor:
   * **Local AI**: Se você roda [LM Studio](https://lmstudio.ai/) ou Ollama, selecione essa aba. Para o LM Studio, ligue o *Local Server* e cole o Endpoint (geralmente `http://127.0.0.1:1234/v1/chat/completions`). Aperte Salvar.
   * **Gemini / OpenAI**: Se você for conectar à Nuvem (Google Gemini, Groq, xAI), cole sua respectiva `API_KEY` na caixa respectiva e aperte Salvar.

O Assistente agora está "Acordado" e ajudará em toda a jornada.

### 3. Criando seu Primeiro Servidor Minecraft

1. Vá na aba **Servidores (Servers)**.
2. Clique em "CRIAR NOVO SERVIDOR".
3. Dê um nome mágico, aloque a quantidade de RAM e selecione a versão que quiser da lista suspensa (desde o Nostálgico 1.12.2 até o 1.21.1+).  
   *Nota: O painel automaticamente faz o download da versão exata de Java requisitada pela versão e instala o Forja (Forge / Fabric / Paper / Purpur / Vanilla) na hora pra você.*
4. Clique em **Salvar e Iniciar!**
5. Abra seu jogo no IP listado (ex: `localhost:25565`) ou pelo link do Playit.gg que será gerado!

---

## 🛠 Recursos Opcionais: "Rode Leve, Rode Livre"

Quer focar apenas na performance do Minecraft sem gastar recursos do painel? Nosso sistema foi feito para consumir 0% de uso até você clicar.

### 🔌 Desligando Módulos Desnecessários
Nas **Configurações**, procure pelos interruptores modulares:
* **EDITOR DE MAPA:** Desligue para focar apenas nos arquivos (Desativando a aba Map)
* **LOJA IN-GAME:** Oculta a área de configuração de lojinhas NPC.
* **ASSISTENTE IA:** Desliga globalmente o companheiro virtual, poupando processamento de I/O em máquinas pesadas (VPS Optimistic).

---

## 🔧 Fábrica de Plugins (Skript)

O painel possui um integrador Native Skript acoplado nativamente na IA. 
1. Clique no Menu de **Criador de Plugins**.
2. Descreva sua ideia. Exemplo: *"Quero que toda vez que um jogador entre no servidor toquem fogos de artifício!"*
3. Confirme. Ao receber a reposta da IA, clique em **Salvar e Injetar**. O painel auto-injeta o arquivo `.sk` direto na pasta, e recarrega os plugins instantaneamente no servidor aberto. Vualá.

---

## 🗺 Funcionalidade de Mapa Embutido

Na aba **Mapa** (quando ativada usando a Loja de Extensões internas ou usando BlueMap), a IA explica claramente o que esperar da manipulação de Schematic (construções MCEdit). Devido à pesada renderização de grafos web tridimensionais, é recomendado rodar via BlueMap para pre-view, mas colar grandes schemas _sempre de dentro do jogo_ com as orientações do próprio botão `Ver Schematics`.

### 🎉 Por que a inteligência artificial vai dominar?

Porque ela lê os relatórios de crash, recarrega o Playit quando o tunnel cai off-line e até lhe informa dicas de "Otimização de Linux VPS e Anti-Lag". Explore e teste!
