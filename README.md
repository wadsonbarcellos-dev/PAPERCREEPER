# PaperCreeper - O Painel Mágico de Minecraft (IA + Skript + Servidores Locais)

O **PaperCreeper** não é apenas um painel de hospedagem. É o seu companheiro Minecraft construído com Inteligência Artificial e foco extremo em performance.  
Crie servidores (Paper, Forge, Fabric, etc.), gerencie plugins, edite mapas, modifique configurações, injete Skripts Mágicos nativos, e exporte seu mundo de jogo em minutos, tudo com ajuda da nossa "Inteligência Creeper".

---

## 🚀 Guia de Instalação e Configuração

Nossa arquitetura prioriza servidores Linux virtuais e o Subsistema Windows para Linux (WSL). Servidores em Windows Nativo são lerdos e problemáticos. Nós assumimos que você quer rodar esse mestre direto do pinguim!

### Método 1: Linux (Ubuntu/Debian/VPS) - Recomendado

Garanta que sua máquina possui Node v18+ e as ferramentas essenciais instaladas:
```bash
sudo apt update && sudo apt install -y curl unzip zip tar lsof htop git
```

Clone o repositório e inicie o painel:
```bash
git clone https://github.com/SeuUsuario/PaperCreeper.git
cd PaperCreeper
npm install
npm run build
npm start
```
O Painel estará vivo em `http://localhost:3000`.

> 🪄 **NOVIDADE: NATIVE APP MODE!**
> Ao executar `npm start` ou iniciar pelos atalhos, o sistema detecta se você está no Windows (mesmo via WSL2) ou Mac, e abrirá automaticamente o Edge ou Google Chrome em **Modo Aplicativo (Standalone)**. O painel não terá barras de URL e se comportará como um programa nativo instalado na sua máquina!

### Método 2: Windows via WSL2 (Pinguim no Windows)

Para a melhor performance no Windows, ative o WSL2 (Windows Subsystem for Linux), instale o Ubuntu pela Microsoft Store e abra o terminal do Ubuntu:
```bash
# Atualize e instale as dependências essenciais
sudo apt update && sudo apt install -y curl unzip zip tar lsof htop git

# Instale o Node.js via NVM ou repositório direto
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Baixe e inicie
git clone https://github.com/SeuUsuario/PaperCreeper.git
cd PaperCreeper
npm install
npm run build
npm start
```

### Método 3: Android (Via Termux)

**SIM!** A interface inteira do Painel é Mobile First! Jogue pelo celular e hosteie pelo celular!
Abra seu [Termux](https://f-droid.org/en/packages/com.termux/):
```bash
pkg update && pkg upgrade
pkg install nodejs git curl unzip zip tar
git clone https://github.com/SeuUsuario/PaperCreeper.git
cd PaperCreeper
npm install
npm run build
npm start
```
Acesse `http://localhost:3000` ou pelo IP local usando outro dispositivo! Nossos botões grandes na tela facilitarão mexer nos arquivos `server.properties` direto na cama usando o Smartphone!

### Método 4: macOS via Homebrew

No terminal do seu Mac:
```bash
brew install node git curl unzip zip
git clone https://github.com/SeuUsuario/PaperCreeper.git
cd PaperCreeper
npm install
npm run build
npm start
```

---

## 🛠 Entendendo os Comandos (Dicas & Troubleshooting)

Se o seu sistema der erro de "Permissão negada" (Permission denied) ao tentar instalar dependências pós-instalação ou ao tentar rodar `npm run dev`, aplique esse comando mágio:

> "viu ta faltando aum passo acho q o chmod sei la so deu erro"

Para garantir que nossos scripts automatizados e binários mágicos (como o túnel Playit) funcionem sem o temido erro de "permissão negada" (Permission Denied) no Linux/WSL, rode este passo fundamental na pasta do painel:

```bash
# 1. Dá permissão de execução ao Script de Setup Inicial
chmod +x setup.sh

# 2. Executa o Script de Setup (Isso instalará coisas cruciais e criará os atalhos!)
./setup.sh

# 3. Dá permissão ao binário do túnel proxy se usar Linux/WSL AMD64 (opcional/preventivo)
chmod +x bin/playit-linux-amd64

# 4. PASSO CRÍTICO: Recarrega as configurações do seu terminal!
# O script setup.sh criou atalhos mágicos para você ('staper' e 'stoper'). 
# Para eles funcionarem AGORA na mesma janela, rode:
source ~/.bashrc
```

**O que o `source ~/.bashrc` faz?**  
Ele avisa ao seu Linux: *"Ei, leia novamente o meu arquivo de configurações"*. Como o nosso comando `setup.sh` injetou dois comandos novos lá (`staper` para iniciar o painel rapidamente, e `stoper` para parar quando rodar em background), se você não der o `source`, o terminal dirá que o comando 'staper' não existe até que você feche e abra o terminal novamente!

**Portas Travadas? / Erro de lsof?**
Se houve porta presa, use no WSL:
```bash
killall node
```
*Nosso painel agora já detecta automaticamente portas ocupadas e pula para a 3001, 3002 e assim por diante!*

---

## 🤖 Configuração Cérebro-IA do Creeper

O Creeper tem uma mente virtual própria! O Botão "I.A Assiste" sempre está disponível.

1. Clique na aba lateral **Configurações** ("Settings").
2. Encontre a seção **API IA (Universal)**.
3. Insira suas credenciais:
   * **Local (LM Studio / Ollama):** Endpoint local para rodar Llama3 offline de graça. O IP tem que ser no host windows se via WSL (ex: 172.x.x.x ou se mapeado correto localhost:1234/v1).
   * **Gemini/Groq:** Chave de API externa para a Nuvem de AI Google/Groq/OpenAI!
4. Aperte SALVAR e a engrenagem criará vida!

---

## 🌍 Criando MUNDOS MULTIVERSO

1. **Aba Servidores Central:** Selecione 'Criar'.
2. Digite um Nome Mágico e escolha a RAM (2GB a 8GB pra rodar redondinho no Java embutido no Painel!).
3. Escolha *Paper* para economia de RAM, ou *Fabric* pra Mods, *Forge* pra nostalgia, ou *Nukkit* se for jogar via Bedrock.
4. Ao clicar "CRIAR MUNDO", o painel faz TUDO para você. Não se preocupe em baixar Java dezenas de vezes, o painel centraliza instalações.

---

## 🔄 Como Atualizar seu Painel

Na aba Configurações, no final da página, temos os botões de Sistema. E temos o botão mágico de Atuliar **[Atualizar Painel (Update)]**. Este botão puxará do repositório a aba mais recente usando comandos git clássicos sem frescuras! Sendo nativamente compatível com WSL via comando Linux no Node.js!

O código que roda por trás da interface usa:
```bash
git fetch --all && git reset --hard origin/main && npm install && npm run build
```
*(Certifique-se de que sua pasta é um repositório clonado do github e possua o git instalado)*

---

## 💎 Módulo Super Leve

O uso de memória do Painel base é ~30MB. Mas o FrontEnd (Seu Navegador) vai consumir renderizações 3Ds a depender das abas que utilizar (Mapa)!
**Desligue componentes desnecessários para economizar RAM:**
* O Editor de Mapa (MCEdit-like) pode ser pesado. Feche a aba se não usar.
* Servidores grandes rodam mais tranquilos usando *PaperMC* com flags pré-programadas do Creeper.

---
Desenvolvido com 💚 usando Inteligência Artificial.

