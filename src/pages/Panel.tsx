import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Play,
  Square,
  Terminal,
  Settings,
  Server,
  Users,
  Cpu,
  HardDrive,
  Star,
  Copy,
  Sparkles,
  Cloud,
  Flower2,
  Database,
  Moon,
  Folder,
  FileText,
  ChevronLeft,
  Upload,
  Trash2,
  X,
  Check,
  Globe,
  Search,
  RefreshCw,
  ArrowUpCircle,
  ArrowDownCircle,
  FastForward,
  Waves,
  Package,
  ChevronDown,
  Bot,
  Send,
  Languages,
  Sun,
  Palette,
  Power,
  Store,
  ExternalLink,
  Info,
  CheckCircle2,
  Map,
  Shield,
  Hammer,
  Skull,
  Hand,
  UploadCloud,
  Edit2,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { askAI } from "../services/geminiService";

const translations: any = {
  en: {
    menu_magic: "MAGIC MENU",
    servers: "Servers",
    terminal: "Terminal",
    ai_assistant: "AI Assistant",
    map_editor: "Map Editor",
    internal_store: "In-Game Store UI",
    settings: "Settings",
    useful_links: "Useful Links",
    playit_title: "Playit.gg",
    playit_claim: "LINK ACCOUNT",
    playit_linked: "Account Linked!",
    playit_ip: "View IP on Playit",
    dashboard_title: "Servers",
    create_server: "CREATE NEW SERVER",
    hibernation_title: "Panel Resting...",
    hibernation_desc: "Move to wake up!",
    server_online: "ONLINE",
    server_offline: "OFFLINE",
    server_starting: "STARTING",
    server_stopping: "STOPPING",
    config_tab_general: "GENERAL",
    config_tab_plugins: "PLUGINS",
    config_tab_theme: "THEME",
    config_tab_lang: "LANGUAGE",
    theme_light: "LIGHT",
    theme_dark: "DARK",
    new_adventure: "A new adventure awaits!",
    panel_active: "Active Control Panel",
    ai_assistant_sub: "Creeper Intelligence",
    ask_ai_placeholder: "Ask anything about your server...",
    terminal_sub: "Connected to the Cube",
    files_title: "Files",
    files_sub: "Server Root",
    upload: "UPLOAD",
    backup: "BACKUP",
    download_url: "DOWNLOAD URL",
    paste_hint: "DICE: DRAG OR PASTE (CTRL+V) FILES HERE",
    empty_folder: "Empty folder...",
    drag_hint: "Drag files here!",
    settings_title: "Settings",
    settings_sub: "Customize your experience",
    select_lang: "Select Language",
    select_theme: "Select Theme",
    performance_mode: "Performance Mode",
    vps_linux_optimized: "High-Performance Cycles for Linux VPS",
    playit_reset: "Reset",
    playit_reset_title: "Reset Playit Agent",
    playit_waiting: "Waiting for Playit.gg... (Refresh if it takes too long)",
    playit_running: "Installed and running!",
    playit_claim_desc: "Link your account to configure the tunnel:",
    playit_claim_btn: "LINK ACCOUNT",
    playit_linked_status: "Account Linked!",
    playit_waiting_ip: "Waiting for IP / Claim Link...",
    ai_api_key_title: "AI API (Universal)",
    ai_api_key_sub:
      "Supports Gemini (AIza...), OpenAI (sk-...), Groq (gsk_...) and xAI (xai-...)",
    ai_api_key_btn: "Configure",
    ai_api_key_save: "Save",
    ai_api_key_placeholder: "Paste your API KEY...",
    ai_api_key_success: "✅ Key saved locally! AI Assistant is now online.",
    ai_api_key_error: "Error saving key on local machine.",
    ai_api_key_invalid: "❌ Invalid key format.",
    system_update_title: "System Update",
    system_update_desc: "Pull latest updates from GitHub",
    system_update_btn: "Check & Update",
    system_update_running: "Updating...",
    server_default_name: "Server",
    select_server_hint: "Select...",
    developed_for: "Developed for",
    doc_label: "Documentation",
    modrinth_label: "Modrinth",
    hangar_label: "Hangar",
    playit_status_label: "Playit.gg Status",
    panel_waking: "( ੭•͈ω•͈)੭ Panel waking up! Ready to mine?",
    clear_logs: "Clear Logs",
    waiting_vitals: "Waiting for vital signs...",
    editor_title: "Editor",
    cancel: "CANCEL",
    save: "SAVE",
    direct_download: "Direct Download",
    download_now: "DOWNLOAD NOW",
    download_hint: "Paste direct file link here (.jar, .zip, etc)",
    delete_file: "Delete File",
    edit_server: "Edit Server",
    server_name: "Server Name",
    ram_allocation: "RAM Allocation",
    max_memory: "Max Memory",
    mods_store: "Mods/Plugins Store",
    search_placeholder: "Search plugins and mods...",
    search_btn: "SEARCH",
    install_btn: "Install",
    searching: "Searching in",
    developed_by: "Developed by",
    vps_hosting: "VPS Optimization",
    current_server: "(Current Server)",
    disable: "Disable",
    enable: "Enable",
    playit_disabled_desc:
      "Playit.gg is disabled for this server. Only recommended for panels hosted on VPS machines with dedicated IPs and open ports.",
    playit_tunnel_public: "Playit.gg Tunnel (Public)",
    playit_tunnel_desc: "Disable if using VPS with a dedicated IP.",
    map_editor_title: "Spawn/Region Manager",
    map_editor_desc:
      "Create and protect important areas like Lobbies, Spawns, and Stores. Requires WorldGuard & WorldEdit plugins.",
    map_upload_btn: "Upload Map or Schematic (.zip / .schem)",
    map_protector_title: "Quick Protector (WorldGuard)",
    map_region_label: "Select target",
    map_region_tip:
      "Tip: Type `/wand` in-game, select the corners, and type `/rg define {mapRegion}` before applying the permissions below!",
    map_no_pvp: "NO PVP",
    map_no_build: "NO BUILD",
    map_no_mobs: "NO MOBS",
    map_immortal: "IMMORTAL",
    map_allow_interact: "ALLOW INTERACTION (CHESTS/DOORS)",
    map_upload_zip: "Upload Schematic/Zip",
    map_download_web: "Download from Web",
    map_view_schematics: "View Schematics (Server)",
    map_view_worlds: "View Worlds (Server)",
    store_editor_title: "Store Manager",
    store_editor_desc: "Create your own 100% custom Skript store or manage native NPC/GUI store plugins.",
    store_generate_skript: "Generate In-Game Skript Store (AI)",
    store_npc_shopkeepers: "NPC Shop (Shopkeepers)",
    store_gui_economy: "Ready GUI Store (EconomyShopGUI)",
    store_npc_commands: "NPC Commands (Citizens)",
    store_status_help: "Status / Help",
    store_help_desc: "If you generate a Skript Store, the code will be created by our AI assistant. Remember to install the Skript plugin in the Plugins tab first for it to work.",
  },
  pt: {
    menu_magic: "MENU MÁGICO",
    servers: "Servidores",
    terminal: "Terminal",
    ai_assistant: "Assistente IA",
    map_editor: "Mapa / MCEdit",
    internal_store: "Loja In-Game",
    settings: "Configurações",
    useful_links: "Links Úteis",
    playit_title: "Playit.gg",
    playit_claim: "VINCULAR CONTA",
    playit_linked: "Conta Vinculada!",
    playit_ip: "Ver IP no Playit",
    dashboard_title: "Servidores",
    create_server: "CRIAR NOVO SERVIDOR",
    hibernation_title: "Painel em Repouso...",
    hibernation_desc: "Mexa para acordar!",
    server_online: "ONLINE",
    server_offline: "OFFLINE",
    server_starting: "INICIANDO",
    server_stopping: "PARANDO",
    config_tab_general: "GERAL",
    config_tab_plugins: "PLUGINS",
    config_tab_theme: "TEMA",
    config_tab_lang: "IDIOMA",
    theme_light: "CLARO",
    theme_dark: "ESCURO",
    new_adventure: "Uma nova aventura te espera!",
    panel_active: "Painel de Controle Ativo",
    ai_assistant_sub: "Inteligência Creeper",
    ask_ai_placeholder: "Pergunte qualquer coisa sobre seu servidor...",
    terminal_sub: "Conectado ao Cubo",
    files_title: "Arquivos",
    files_sub: "Raiz do Servidor",
    upload: "UPLOAD",
    backup: "BACKUP",
    download_url: "BAIXAR URL",
    paste_hint: "DICA: ARRASTE OU COLE (CTRL+V) ARQUIVOS AQUI",
    empty_folder: "Pasta vazia...",
    drag_hint: "Arraste arquivos aqui!",
    settings_title: "Configurações",
    settings_sub: "Personalize sua experiência",
    select_lang: "Selecionar Idioma",
    select_theme: "Selecionar Tema",
    performance_mode: "Modo Performance",
    vps_linux_optimized: "Ciclos de Alta Performance para VPS Linux",
    playit_reset: "Reset",
    playit_reset_title: "Resetar Agente Playit",
    playit_waiting:
      "Aguardando leitura do Playit.gg... (Atualize a página se demorar)",
    playit_running: "Instalado e rodando!",
    playit_claim_desc: "Vincule sua conta para configurar o túnel:",
    playit_claim_btn: "VINCULAR CONTA",
    playit_linked_status: "Conta Vinculada!",
    playit_waiting_ip: "Aguardando IP / Claim Link...",
    ai_api_key_title: "API IA (Universal)",
    ai_api_key_sub:
      "Suporta Gemini (AIza...), OpenAI (sk-...), Groq (gsk_...) e xAI (xai-...)",
    ai_api_key_btn: "Configurar",
    ai_api_key_save: "Salvar",
    ai_api_key_placeholder: "Cole sua API KEY...",
    ai_api_key_success:
      "✅ Chave salva na máquina local! O Assistente IA está online.",
    ai_api_key_error: "Erro ao salvar a chave na máquina.",
    ai_api_key_invalid: "❌ Formato de chave inválido.",
    system_update_title: "Atualização do Sistema",
    system_update_desc: "Baixar últimas atualizações do GitHub",
    system_update_btn: "Verificar & Atualizar",
    system_update_running: "Atualizando...",
    server_default_name: "Servidor",
    select_server_hint: "Selecionar...",
    developed_for: "Desenvolvido para",
    doc_label: "Documentação",
    modrinth_label: "Modrinth",
    hangar_label: "Hangar",
    playit_status_label: "Status do Playit.gg",
    panel_waking: "( ੭•͈ω•͈)੭ Painel acordando! Pronto para minerar?",
    clear_logs: "Limpar Logs",
    waiting_vitals: "Aguardando sinais vitais...",
    editor_title: "Editor",
    cancel: "CANCELAR",
    save: "SALVAR",
    direct_download: "Download Direto",
    download_now: "BAIXAR AGORA",
    download_hint: "Cole aqui o link direto do arquivo (.jar, .zip, etc)",
    delete_file: "Deletar Arquivo",
    edit_server: "Editar Servidor",
    server_name: "Nome do Servidor",
    ram_allocation: "Alocação de RAM",
    max_memory: "Memória Máxima",
    mods_store: "Loja de Mods/Plugins",
    search_placeholder: "Buscar plugins e mods...",
    search_btn: "BUSCAR",
    install_btn: "Instalar",
    searching: "Buscando no",
    developed_by: "Desenvolvido por",
    vps_hosting: "Otimização VPS",
    current_server: "(Servidor Atual)",
    disable: "Desligar",
    enable: "Ligar",
    playit_disabled_desc:
      "Playit.gg está desativado para este servidor. Recomendado apenas para painéis hospedados em máquinas VPS que possuam IPs dedicados e portas livres.",
    playit_tunnel_public: "Túnel Playit.gg (Público)",
    playit_tunnel_desc: "Desative se usar VPS com IP Dedicado.",
    map_editor_title: "Gerenciador de Spawns/Regiões",
    map_editor_desc:
      "Crie e proteja áreas importantes como Lobbies, Spawns e Lojas. É obrigatório ter o plugin WorldGuard & WorldEdit instalado.",
    map_upload_btn: "Upload Mapa ou Schematic (.zip / .schem)",
    map_protector_title: "Protetor Rápido (WorldGuard)",
    map_region_label: "Selecione o alvo",
    map_region_tip:
      "Dica: Digite `/wand` no jogo, selecione os cantos e digite `/rg define {mapRegion}` antes de aplicar as permissões abaixo!",
    map_no_pvp: "SEM PVP",
    map_no_build: "SEM CONSTRUIR",
    map_no_mobs: "SEM MOBS",
    map_immortal: "IMORTAL",
    map_allow_interact: "PERMITIR INTERAÇÃO (BAÚS/PORTAS)",
    map_upload_zip: "Upload Schematic/Zip",
    map_download_web: "Baixar da Web",
    map_view_schematics: "Ver Schematics no SV",
    map_view_worlds: "Ver Mundos do SV",
    store_editor_title: "Gerenciador de Lojas",
    store_editor_desc: "Crie sua própria loja Skript 100% customizada ou gerencie plugins de Lojas NPC / GUI nativos.",
    store_generate_skript: "Gerar Loja Skript In-Game (IA)",
    store_npc_shopkeepers: "Loja de NPCs (Shopkeepers)",
    store_gui_economy: "Loja GUI Pronta (EconomyShopGUI)",
    store_npc_commands: "Comandos em NPCs (Citizens)",
    store_status_help: "Status / Ajuda",
    store_help_desc: "Se você gerar uma Loja Skript, o código será criado pelo nosso assistente. Lembre-se de instalar o plugin Skript na aba de Plugins primeiro para que ele funcione.",
  },
};

type ServerStatus = "online" | "offline" | "starting" | "stopping";

interface ServerState {
  status: ServerStatus;
  logs: string[];
  tunnel?: string | null;
  stats?: {
    cpu: string;
    ram: string;
    ramPercent: number;
  };
}

const CreeperPaper = ({ className = "" }: { className?: string }) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0],
      scale: [1, 1.02, 1],
    }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute pointer-events-none select-none opacity-30 -z-10 ${className}`}
  >
    <div className="w-16 h-16 bg-emerald-500 rounded-sm relative shadow-[4px_4px_0_0_#064e3b]">
      {/* Face */}
      <div className="absolute top-4 left-3 w-3 h-3 bg-black" />
      <div className="absolute top-4 right-3 w-3 h-3 bg-black" />
      <div className="absolute top-8 left-6 w-4 h-6 bg-black" />
      <div className="absolute top-10 left-4 w-2 h-4 bg-black" />
      <div className="absolute top-10 right-4 w-2 h-4 bg-black" />
      {/* Paper Fold Texture */}
      <div className="absolute inset-0 border-t border-l border-emerald-400/30" />
    </div>
  </motion.div>
);

export default function App({
  appConfig,
  setAppConfig,
}: {
  appConfig?: any;
  setAppConfig?: any;
}) {
  const [language, setLanguage] = useState<"en" | "pt">(
    () => (localStorage.getItem("creeper_lang") as "en" | "pt") || "en",
  );
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("creeper_theme") as "dark" | "light") || "dark",
  );
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyValue, setApiKeyValue] = useState("");
  const [isSystemUpdating, setIsSystemUpdating] = useState(false);
  const [appVersion, setAppVersion] = useState("Carregando versão...");
  const t = (key: string) => translations[language][key] || key;

  useEffect(() => {
    fetch("/api/system/version")
      .then((res) => res.json())
      .then((data) => setAppVersion(data.version))
      .catch(() => setAppVersion("Desconhecida"));
  }, []);

  const [serverState, setServerState] = useState<ServerState>({
    status: "offline",
    logs: [t("panel_waking")],
  });
  const [servers, setServers] = useState<
    {
      id: string;
      name: string;
      ram?: number;
      minRam?: number;
      type?: string;
      version?: string;
    }[]
  >([]);
  const [currentServerId, setCurrentServerId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "servers" | "console" | "files" | "ai" | "settings"
  >("servers");

  useEffect(() => {
    localStorage.setItem("creeper_lang", language);
    localStorage.setItem("creeper_theme", theme);
    document.documentElement.className = theme;
  }, [language, theme]);

  const [aiChat, setAiChat] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiProvider, setAiProvider] = useState<"gemini" | "openai" | "local">(
    () => (localStorage.getItem("creeper_ai_provider") as any) || "gemini"
  );
  const [aiEndpoint, setAiEndpoint] = useState<string>(
    () => localStorage.getItem("creeper_ai_endpoint") || "http://127.0.0.1:1234/v1/chat/completions"
  );
  
  useEffect(() => {
    localStorage.setItem("creeper_ai_provider", aiProvider);
    localStorage.setItem("creeper_ai_endpoint", aiEndpoint);
  }, [aiProvider, aiEndpoint]);

  const [isVpsOptimized, setIsVpsOptimized] = useState(true);
  const [storeSearch, setStoreSearch] = useState("");
  const [storeResults, setStoreResults] = useState<any[]>([]);
  const [isSearchingStore, setIsSearchingStore] = useState(false);
  const [storeProvider, setStoreProvider] = useState<"hangar" | "modrinth">(
    "modrinth",
  );
  const [storeFolder, setStoreFolder] = useState<"plugins" | "mods">("plugins");
  const [installingStoreItem, setInstallingStoreItem] = useState<string | null>(
    null,
  );

  const searchStore = async (q: string) => {
    if (!q) {
      setStoreResults([]);
      return;
    }
    setIsSearchingStore(true);
    try {
      const endpoint =
        storeProvider === "hangar"
          ? "/api/hangar/search"
          : "/api/modrinth/search";
      const res = await fetch(`${endpoint}?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (storeProvider === "hangar") {
        setStoreResults(data.result || []);
      } else {
        setStoreResults(data.hits || []);
      }
    } catch (e) {}
    setIsSearchingStore(false);
  };

  const installHangarPlugin = async (slug: string, version: string) => {
    if (!currentServerId) return;
    try {
      const res = await fetch("/api/server/plugins/hangar-install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverId: currentServerId,
          slug,
          version,
          folder: storeFolder,
        }),
      });
      if (res.ok) fetchPlugins();
    } catch (e) {}
  };

  const installModrinthProject = async (projectId: string) => {
    if (!currentServerId) return;
    try {
      // Fetch project details first to get the latest version id
      const pRes = await fetch(`/api/modrinth/project/${projectId}`);
      if (!pRes.ok) return;
      const pData = await pRes.json();
      const latestVersion = pData.versions[0];
      if (!latestVersion) return;

      const res = await fetch("/api/server/modrinth/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverId: currentServerId,
          versionId: latestVersion.id,
          folder: storeFolder,
        }),
      });
      if (res.ok) fetchPlugins();
    } catch (e) {}
  };
  const [isHibernating, setIsHibernating] = useState(false);
  const [command, setCommand] = useState("");
  const [installSoftware, setInstallSoftware] = useState({
    type: "paper",
    version: "1.21.1",
    customUrl: "",
  });
  const [pluginUrl, setPluginUrl] = useState("");
  const [pluginName, setPluginName] = useState("");
  const [ramConfig, setRamConfig] = useState({ ram: 2, minRam: 1 });
  const [isSyncingRam, setIsSyncingRam] = useState(true);
  const [modules, setModules] = useState<{
    map: boolean;
    store: boolean;
    ai: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem("ppc_modules");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { map: true, store: true, ai: true };
  });

  useEffect(() => {
    localStorage.setItem("ppc_modules", JSON.stringify(modules));
  }, [modules]);

  const [plugins, setPlugins] = useState<
    { name: string; version: string; filename: string }[]
  >([]);
  const [pluginUpdates, setPluginUpdates] = useState<
    {
      name: string;
      currentVersion: string;
      latestVersion: string;
      file: string;
    }[]
  >([]);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState("");
  const [editingFile, setEditingFile] = useState<{
    path: string;
    content: string;
  } | null>(null);
  const [showDownloadInput, setShowDownloadInput] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<
    {
      id: string;
      name: string;
      progress: number;
      status: "pending" | "uploading" | "done" | "error";
    }[]
  >([]);
  const [metadata, setMetadata] = useState<{
    links: { label: string; url: string }[];
    versions: string[];
    systemMaxRam?: number;
  }>({ links: [], versions: [] });
  const [playitStatus, setPlayitStatus] = useState<{
    claimUrl: string | null;
    installed: boolean;
    logs: string[];
    linked?: boolean;
    tunnel?: string | null;
    running?: boolean;
  }>({
    claimUrl: null,
    installed: false,
    logs: [],
    linked: false,
    tunnel: null,
    running: false,
  });
  const [playitLoading, setPlayitLoading] = useState<
    "install" | "uninstall" | "start" | "stop" | "reset" | null
  >(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newServerConfig, setNewServerConfig] = useState({
    name: "",
    type: "paper",
    version: "1.21.1",
    ram: 4,
    minRam: 1,
    url: "", // for custom or github
    usePlayit: true,
  });

  const [editingServer, setEditingServer] = useState<{
    id: string;
    name: string;
    ram?: number;
    minRam?: number;
    store?: any;
  } | null>(null);
  const [editTab, setEditTab] = useState<"general" | "plugins" | "store">(
    "general",
  );
  const [isInstalling, setIsInstalling] = useState(false);
  const [mapRegion, setMapRegion] = useState("spawn");

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastActivity = useRef(Date.now());

  const fetchServers = async () => {
    try {
      const res = await fetch("/api/servers");
      const data = await res.json();
      setServers(data.servers || []);
      if (!currentServerId && data.servers?.length > 0) {
        setCurrentServerId(data.servers[0].id);
      }
    } catch (e) {}
  };

  const lastLogCount = useRef<number>(0);

  const fetchStatus = async () => {
    if (!currentServerId) return;
    try {
      const res = await fetch(
        `/api/server/status?serverId=${currentServerId}&lastLogIdx=${lastLogCount.current}`,
      );
      if (!res.ok) {
        if (res.status === 404) setCurrentServerId("");
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return;
      }

      const data = await res.json();

      setServerState((prev) => {
        const newLogs =
          lastLogCount.current === 0 ? data.logs : [...prev.logs, ...data.logs];
        // Adaptive memory management: keep fewer logs in hibernation
        const maxLogs = isHibernating ? 50 : 300;
        const trimmedLogs =
          newLogs.length > maxLogs ? newLogs.slice(-maxLogs) : newLogs;

        return {
          ...data,
          logs: trimmedLogs,
        };
      });

      lastLogCount.current = data.logCount;

      if (data.config && isSyncingRam) {
        setRamConfig(data.config);
      }
    } catch (error) {
      // server probably down or restarting
    }
  };

  useEffect(() => {
    // Reset status and logs when switching servers to avoid UI flickering with old data
    lastLogCount.current = 0;
    setServerState({
      status: "offline",
      logs: [],
      tunnel: null,
      stats: { cpu: "0%", ram: "0 / 0 GB", ramPercent: 0 },
    });
    fetchStatus();
  }, [currentServerId]);

  const handleCreateServer = async () => {
    if (!newServerConfig.name.trim()) {
      alert("Nome do servidor é obrigatório! (｡•́︿•̀｡)");
      return;
    }
    setIsInstalling(true);
    try {
      // 1. Create the server
      const res = await fetch("/api/servers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newServerConfig.name,
          ram: newServerConfig.ram,
          type: newServerConfig.type,
          version: newServerConfig.version,
          usePlayit: newServerConfig.usePlayit,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const serverId = data.id;

        // 2. Install Software
        await fetch("/api/server/install", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serverId,
            type: newServerConfig.type,
            version: newServerConfig.version,
            customUrl:
              newServerConfig.type === "custom"
                ? newServerConfig.url
                : undefined,
          }),
        });

        setNewServerConfig({
          name: "",
          type: "paper",
          version: "1.21.1",
          ram: 4,
          minRam: 1,
          url: "",
          usePlayit: true,
        });
        setShowCreateModal(false);
        await fetchServers();
        setCurrentServerId(serverId);
        setActiveTab("console");
        alert("Servidor criado e instalação iniciada! (•◡•)");
      }
    } catch (e) {
      alert("Erro ao criar servidor. 🔌");
    } finally {
      setIsInstalling(false);
    }
  };

  const handleUpdateServerConfig = async () => {
    if (!editingServer) return;
    try {
      const res = await fetch("/api/server/update-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverId: editingServer.id,
          name: editingServer.name,
          ram: editingServer.ram,
          minRam: editingServer.minRam,
          store: editingServer.store,
        }),
      });
      if (res.ok) {
        setEditingServer(null);
        await fetchServers();
        await fetchStatus();
      }
    } catch (e) {}
  };

  const handleDeleteServer = async () => {
    if (!currentServerId) return;
    try {
      const res = await fetch("/api/server/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId: currentServerId }),
      });
      if (res.ok) {
        setShowDeleteConfirm(false);
        const nextServers = servers.filter((s) => s.id !== currentServerId);
        setServers(nextServers);
        setCurrentServerId(nextServers[0]?.id || "");
        alert("Servidor excluído! ✨");
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (e) {
      alert("Erro ao excluir servidor.");
    }
  };

  const handleSaveConfig = async () => {
    if (!currentServerId) return;
    try {
      const res = await fetch("/api/server/update-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverId: currentServerId,
          ram: ramConfig.ram,
          minRam: ramConfig.minRam,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
      } else {
        alert("Configuração salva! (｡♥‿♥｡)");
        setIsSyncingRam(true);
      }
    } catch (e) {
      alert("Erro ao salvar config.");
    }
  };

  const handleBackup = async () => {
    if (!currentServerId) return;
    try {
      const res = await fetch("/api/server/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId: currentServerId }),
      });
      if (res.ok) {
        alert("Backup iniciado! Verifique os logs. (•◡•)");
        setActiveTab("console");
      }
    } catch (e) {
      alert("Erro ao fazer backup.");
    }
  };

  const fetchPlugins = async () => {
    if (!currentServerId) return;
    try {
      const res = await fetch(
        `/api/server/plugins?serverId=${currentServerId}`,
      );
      const data = await res.json();
      setPlugins(data.plugins || []);
    } catch (e) {}
  };

  const handleGeneralDownload = async () => {
    if (!currentServerId || !downloadUrl) return;
    try {
      const res = await fetch("/api/server/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverId: currentServerId,
          url: downloadUrl,
          destPath: currentFolder,
        }),
      });
      if (res.ok) {
        setDownloadUrl("");
        setShowDownloadInput(false);
        setActiveTab("console");
        alert("Download solicitado! Verifique o console. (•◡•)");
      }
    } catch (e) {}
  };

  const checkPluginUpdates = async () => {
    if (!currentServerId) return;
    setIsCheckingUpdates(true);
    try {
      const res = await fetch(
        `/api/server/plugins/check-updates?serverId=${currentServerId}`,
      );
      const data = await res.json();
      setPluginUpdates(data.updates || []);
    } catch (e) {}
    setIsCheckingUpdates(false);
  };

  const fetchMeta = async (type: string = "paper") => {
    try {
      const res = await fetch(`/api/meta?type=${type}`);
      const data = await res.json();
      setMetadata(data);
      if (
        showCreateModal &&
        data.versions &&
        data.versions.length > 0 &&
        !data.versions.includes(newServerConfig.version)
      ) {
        setNewServerConfig((prev) => ({ ...prev, version: data.versions[0] }));
      }
    } catch (e) {}
  };

  // Re-fetch meta when server config type changes, but we want it in a useEffect so let's separate it
  useEffect(() => {
    if (activeTab === "settings") {
      fetch(`/api/meta?type=${installSoftware.type}`)
        .then((r) => r.json())
        .then((d) => {
          setMetadata(d);
          if (
            d.versions &&
            d.versions.length > 0 &&
            !d.versions.includes(installSoftware.version)
          ) {
            setInstallSoftware((prev) => ({ ...prev, version: d.versions[0] }));
          }
        });
    }
  }, [installSoftware.type, activeTab]);

  useEffect(() => {
    if (showCreateModal && newServerConfig.type !== "custom") {
      fetchMeta(newServerConfig.type);
    }
  }, [newServerConfig.type, showCreateModal]);

  const handleInstallPlugin = async () => {
    if (!currentServerId || !pluginUrl) return;
    setInstallingStoreItem("manual");
    try {
      const res = await fetch("/api/server/plugins/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: pluginUrl,
          serverId: currentServerId,
          name: pluginName,
        }),
      });
      if (res.ok) {
        setPluginUrl("");
        setPluginName("");
        fetchPlugins();
      }
    } catch (e) {}
    setInstallingStoreItem(null);
  };

  const handleInstall = async () => {
    if (!currentServerId) {
      alert("Crie ou selecione um servidor primeiro! (•◡•)");
      return;
    }
    try {
      const res = await fetch("/api/server/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...installSoftware, serverId: currentServerId }),
      });
      if (!res.ok) alert("Puxa, deu erro no download... (｡•́︿•̀｡)");
      else setActiveTab("console");
    } catch (e) {
      console.error(e);
    }
  };

  const handleUserActivity = () => {
    lastActivity.current = Date.now();
    if (isHibernating) {
      setIsHibernating(false);
      fetchStatus();
    }
  };

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((name) =>
      document.addEventListener(name, handleUserActivity),
    );

    const checkHibernation = setInterval(() => {
      const now = Date.now();
      if (
        (now - lastActivity.current > 60000 || document.hidden) &&
        !isHibernating
      ) {
        setIsHibernating(true);
      }
    }, 5000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsHibernating(true);
      } else {
        handleUserActivity();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      events.forEach((name) =>
        document.removeEventListener(name, handleUserActivity),
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(checkHibernation);
    };
  }, [isHibernating]);

  useEffect(() => {
    fetchServers();
    fetchMeta();
  }, []);

  useEffect(() => {
    if (isHibernating || !currentServerId) return;

    const getInterval = () => {
      if (serverState.status === "online") return 1000;
      if (
        serverState.status === "starting" ||
        serverState.status === "stopping"
      )
        return 2000;
      return 5000;
    };

    const interval = setInterval(() => {
      fetchStatus();
    }, getInterval());
    fetchStatus(); // immediate check

    return () => clearInterval(interval);
  }, [isHibernating, currentServerId, serverState.status, activeTab]);

  useEffect(() => {
    if (isHibernating || activeTab !== "playit") return;

    const fetchPlayitStatus = async () => {
      try {
        const res = await fetch(`/api/playit/status`);
        if (res.ok) setPlayitStatus(await res.json());
      } catch (e) {}
    };

    const playitInterval = setInterval(fetchPlayitStatus, 2000);
    fetchPlayitStatus();

    return () => clearInterval(playitInterval);
  }, [isHibernating, activeTab]);

  useEffect(() => {
    if (activeTab === "files") fetchFiles(currentFolder);
  }, [activeTab, currentFolder, currentServerId]);

  const fetchFiles = async (folder: string) => {
    if (!currentServerId) return;
    try {
      const res = await fetch(
        `/api/server/files/list?serverId=${currentServerId}&folder=${encodeURIComponent(folder)}&_t=${Date.now()}`,
      );
      if (!res.ok) {
        throw new Error("Erro ao buscar arquivos (" + res.status + ")");
      }
      const data = await res.json();
      setFileList(data.items || []);
    } catch (e) {
      console.error("fetchFiles error:", e);
      // Mantém a lista anterior em caso de erro para não "sumir" com os arquivos da tela
      // Só limpa se realmente não houver nada e o erro persistir
      if (fileList.length === 0) {
        setFileList([]);
      }
    }
  };

  const openFile = async (path: string) => {
    if (!currentServerId) return;

    const extMatch = path.match(/\.([^.]+)$/);
    if (extMatch) {
      const ext = extMatch[1].toLowerCase();
      if (['dat', 'mca', 'nbt', 'schem', 'schematic', 'png', 'jpg', 'jpeg', 'jar', 'zip', 'gz', 'tar', 'sqlite', 'db'].includes(ext)) {
        if (ext === "dat" || ext === "mca") {
          alert("⚠️ Aviso de Performance: Este é um arquivo de mapa 3D bruto!\n\n💡 VISUALIZAR: Instale o plugin 'BlueMap' na Loja para navegar pelo mundo 3D no navegador.\n\n🛠️ EDITAR: Um editor completo estilo 'MCEdit' faria o navegador explodir (muito pesado). Para editar montanhas ou schemas, FAÇA O DOWNLOAD do mundo e use o 'Amulet Editor' no PC, ou use 'WorldEdit' de dentro do próprio jogo.");
          setActiveTab("map");
          return;
        } else if (ext === "schem" || ext === "schematic") {
           alert("Este é um Schematic (construção 3D). Para colá-lo no mapa, use //schem load e //paste com o WorldEdit, diretamente de dentro do jogo!");
           setActiveTab("map");
           return;
        } else if (ext === "jar" || ext === "zip") {
           alert("Esse é um arquivo compilado ou compactado. Faça o download para acessar o conteúdo na sua máquina.");
           return;
        } else {
           alert(`O formato .${ext} é binário e não pode ser editado como texto.`);
           return;
        }
      }
    }

    try {
      const res = await fetch(
        `/api/server/files/content?serverId=${currentServerId}&path=${encodeURIComponent(path)}`,
      );
      const data = await res.json();
      setEditingFile({ path, content: data.content });
    } catch (e) {
      alert("Erro ao ler arquivo.");
    }
  };

  const saveFile = async () => {
    if (!editingFile || !currentServerId) return;
    try {
      const res = await fetch("/api/server/files/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingFile, serverId: currentServerId }),
      });
      if (res.ok) {
        setEditingFile(null);
      } else {
        alert("Erro ao salvar.");
      }
    } catch (e) {
      alert("Erro ao salvar.");
    }
  };

  const deleteFile = async (path: string) => {
    if (!currentServerId || !confirm(`Certeza que quer deletar ${path}?`))
      return;
    try {
      const res = await fetch(
        `/api/server/files/delete?serverId=${currentServerId}&path=${encodeURIComponent(path)}`,
        { method: "DELETE" },
      );
      if (res.ok) fetchFiles(currentFolder);
    } catch (e) {}
  };

  const renameFile = async (oldPath: string) => {
    if (!currentServerId) return;
    const newName = prompt(`Digite o novo nome para ${oldPath.split('/').pop()}:`);
    if (!newName) return;
    
    // Extrai o caminho sem o arquivo
    const parts = oldPath.split('/');
    parts.pop(); // Remove o antigo nome
    const basePath = parts.join('/');
    const newPath = basePath ? `${basePath}/${newName}` : newName;

    try {
      const res = await fetch("/api/server/files/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId: currentServerId, oldPath, newPath }),
      });
      if (res.ok) fetchFiles(currentFolder);
      else alert("Erro ao renomear arquivo.");
    } catch (e) {}
  };

  const createFolder = async () => {
    if (!currentServerId) return;
    const folderName = prompt(`Digite o nome da nova pasta:`);
    if (!folderName) return;

    const newPath = currentFolder ? `${currentFolder}/${folderName}` : folderName;

    try {
      const res = await fetch("/api/server/files/mkdir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId: currentServerId, path: newPath }),
      });
      if (res.ok) fetchFiles(currentFolder);
      else alert("Erro ao criar pasta.");
    } catch (e) {}
  };

  const uploadMultipleFiles = async (
    files: FileList | File[],
    serverId: string,
    folder: string,
  ) => {
    setIsUploading(true);
    const fileArray = Array.from(files);

    const newTasks = fileArray.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      progress: 0,
      status: "pending" as const,
    }));

    setUploadQueue((prev) => [...prev, ...newTasks]);

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const task = newTasks[i];

        setUploadQueue((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, status: "uploading" } : t,
          ),
        );

        try {
          await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(
              "POST",
              `/api/server/files/upload?serverId=${serverId}&folder=${encodeURIComponent(folder)}`,
            );

            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                setUploadQueue((prev) =>
                  prev.map((t) =>
                    t.id === task.id ? { ...t, progress: percent } : t,
                  ),
                );
              }
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                setUploadQueue((prev) =>
                  prev.map((t) =>
                    t.id === task.id
                      ? { ...t, progress: 100, status: "done" }
                      : t,
                  ),
                );
                resolve(xhr.response);
              } else {
                setUploadQueue((prev) =>
                  prev.map((t) =>
                    t.id === task.id ? { ...t, status: "error" } : t,
                  ),
                );
                reject(new Error(xhr.statusText));
              }
            };

            xhr.onerror = () => {
              setUploadQueue((prev) =>
                prev.map((t) =>
                  t.id === task.id ? { ...t, status: "error" } : t,
                ),
              );
              reject(new Error("Network Error"));
            };

            const formData = new FormData();
            formData.append("files", file);
            xhr.send(formData);
          });
        } catch (fileError) {
          console.error(`Erro ao subir arquivo ${file.name}:`, fileError);
          // Continue with next file
        }
      }
      fetchFiles(folder);
    } catch (e) {
      console.error("Erro no processo de upload:", e);
    } finally {
      setIsUploading(false);
      // Clear completed/error tasks after 10 seconds to give time for the user to see results
      setTimeout(() => {
        setUploadQueue((prev) => prev.filter((t) => t.status === "uploading"));
      }, 10000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !currentServerId) return;

    await uploadMultipleFiles(files, currentServerId, currentFolder);
    e.target.value = "";
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    // Don't intercept paste if user is typing in an input or textarea
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    )
      return;

    const items = e.clipboardData.items;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        const file = items[i].getAsFile();
        if (file) files.push(file);
      }
    }

    if (files.length > 0 && currentServerId) {
      e.preventDefault();
      await uploadMultipleFiles(files, currentServerId, currentFolder);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0 || !currentServerId) return;

    await uploadMultipleFiles(files, currentServerId, currentFolder);
  };

  const clearLogs = async () => {
    if (!currentServerId) return;
    try {
      await fetch("/api/server/clear-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId: currentServerId }),
      });
      // also clear locally instantly
      setServerState((prev) => ({ ...prev, logs: [] }));
      lastLogCount.current = 0;
    } catch (e) {}
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [serverState.logs, activeTab]);

  const handleAction = async (action: "start" | "stop" | "kill") => {
    if (!currentServerId) return;

    // Optimistic UI update
    setServerState((prev) => ({
      ...prev,
      status:
        action === "start"
          ? "starting"
          : action === "kill"
            ? "offline"
            : "stopping",
    }));

    try {
      const res = await fetch(`/api/server/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId: currentServerId }),
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Algo não deu certo... (´• ᵕ •`)");
        return;
      }
      fetchStatus();
    } catch (error) {
      console.error(`Erro ao ${action}:`, error);
    }
  };

  const executeAITool = async (call: any) => {
    const { name, args } = call;
    const serverId = args.serverId || currentServerId;

    try {
      let res;
      switch (name) {
        case "sendTerminalCommand":
          res = await fetch("/api/server/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serverId, command: args.command }),
          });
          break;
        case "startServer":
          res = await fetch("/api/server/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serverId }),
          });
          break;
        case "stopServer":
          res = await fetch("/api/server/stop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serverId }),
          });
          break;
        case "installSoftware":
          res = await fetch("/api/server/install", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              serverId,
              type: args.type,
              version: args.version,
            }),
          });
          break;
        case "hangarInstallPlugin":
          res = await fetch("/api/server/plugins/hangar-install", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              serverId,
              slug: args.slug,
              version: args.version,
            }),
          });
          break;
        case "listFiles":
          res = await fetch(
            `/api/server/files/list?serverId=${serverId}&folder=${args.folder || ""}`,
          );
          break;
        case "readFile":
          res = await fetch(
            `/api/server/files/content?serverId=${serverId}&path=${args.path}`,
          );
          break;
        case "saveFile":
          res = await fetch("/api/server/files/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              serverId,
              path: args.path,
              content: args.content,
            }),
          });
          break;
        case "executeTerminal":
          res = await fetch("/api/server/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serverId, command: args.command }),
          });
          break;
        case "downloadFile":
          res = await fetch("/api/server/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              serverId,
              url: args.url,
              destPath: args.destPath,
            }),
          });
          break;
        case "updateRAM":
          res = await fetch("/api/server/config/ram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serverId, ram: args.ram }),
          });
          break;
        case "setOP":
          res = await fetch("/api/server/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serverId, command: `op ${args.player}` }),
          });
          break;
        case "deleteFile":
          res = await fetch(
            `/api/server/files/delete?serverId=${serverId}&path=${args.path}`,
            { method: "DELETE" },
          );
          break;
        case "importServerFromGithub":
          res = await fetch("/api/servers/import-github", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serverId: args.serverId, url: args.url }),
          });
          break;
        case "evaluateNode":
          res = await fetch("/api/app/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: args.code }),
          });
          break;
        case "installAICore":
          res = await fetch("/api/server/install-ai-core", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serverId }),
          });
          break;
        case "reloadSkripts":
          res = await fetch("/api/server/skript/reload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serverId }),
          });
          break;
        case "getPlayitStatus":
          res = await fetch("/api/playit/status");
          break;
        case "resetPlayit":
          res = await fetch("/api/playit/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          break;
        case "manageNPC":
          let commands: string[] = [];
          if (args.action === "create") {
            commands.push(`npc create ${args.name || "PaperCreeper"}`);
          } else if (args.action === "skin") {
            commands.push(`npc skin ${args.extra}`);
          } else if (args.action === "remove") {
            commands.push(`npc remove`);
          } else if (args.action === "message") {
            commands.push(`npc text --set "${args.extra}"`);
          } else if (args.action === "setRole") {
            if (args.role === "guard") {
              commands.push(`trait sentinel`);
              commands.push(`sentinel addtarget monsters`);
              commands.push(`sentinel speed 1.5`);
              if (args.extra) commands.push(`sentinel guard ${args.extra}`);
            } else if (args.role === "vendor") {
              commands.push(`trait shopkeeper`);
            } else if (args.role === "greeter") {
              commands.push(`npc text --range 5 --at 1 --close`);
              if (args.extra) commands.push(`npc text --add "${args.extra}"`);
            }
          }

          for (const cmdText of commands) {
            await fetch("/api/server/command", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ serverId, command: cmdText }),
            });
          }
          res = {
            ok: true,
            json: () => Promise.resolve({ success: true }),
          } as any;
          break;
      }

      const data = await res?.json();
      return JSON.stringify(data || { success: true });
    } catch (error) {
      return `Erro ao executar ferramenta: ${error}`;
    }
  };

  const handleAskAI = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userMsg = aiInput;
    setAiInput("");
    setAiChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setAiLoading(true);

    try {
      const context = `Servidor Selecionado: ${currentServerId}. Status: ${serverState.status}. Logs recentes:\n${serverState.logs.slice(-10).join("\n")}`;
      const firstResult = await askAI(userMsg, context, currentServerId, aiProvider, aiEndpoint);

      if (firstResult.call) {
        setAiChat((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `⚙️ Entendido. Executando ação: ${firstResult.call!.name}...`,
          },
        ]);
        const toolResult = await executeAITool(firstResult.call);

        // Pass the result back to the IA for a final natural language response
        const secondResult = await askAI(
          `O sistema retornou: ${toolResult}. Comunique isso ao usuário.`,
          context,
          currentServerId,
          aiProvider,
          aiEndpoint
        );
        setAiChat((prev) => [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            text: secondResult.text || "Ação concluída com sucesso! 💎",
          },
        ]);
      } else {
        setAiChat((prev) => [
          ...prev,
          {
            role: "assistant",
            text: firstResult.text || "Não entendi bem, pode repetir? (｡•́︿•̀｡)",
          },
        ]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setAiChat((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Tive um curto-circuito na redstone. Tente novamente! 🔌",
        },
      ]);
    }

    setAiLoading(false);
    setTimeout(fetchStatus, 500);
  };

  const sendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || !currentServerId) return;

    // Immediate local feedback
    const cmd = command;
    setCommand("");
    setServerState((prev) => ({
      ...prev,
      logs: [...prev.logs, `> ${cmd}`].slice(-300),
    }));

    try {
      const res = await fetch("/api/server/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd, serverId: currentServerId }),
      });
      if (!res.ok) {
        setServerState((prev) => ({
          ...prev,
          logs: [...prev.logs, `⚠️ Sistema: Erro ao enviar comando.`].slice(
            -300,
          ),
        }));
      }
    } catch (error) {
      console.error("Erro ao enviar comando:", error);
    }
  };

  const getStatusBubble = () => {
    switch (serverState.status) {
      case "online":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
      case "starting":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50 animate-pulse";
      case "stopping":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-zinc-800 text-zinc-500 border-zinc-700";
    }
  };

  return (
    <div
      className={`min-h-screen font-sans selection:bg-emerald-500 selection:text-white transition-all duration-500 ${theme === "dark" ? "bg-[#071E14] text-emerald-50" : "bg-zinc-50 text-emerald-950"} ${isHibernating ? "grayscale-[0.8] brightness-50" : ""}`}
    >
      <div
        className={`fixed inset-0 creeper-pattern pointer-events-none ${theme === "light" ? "opacity-[0.02]" : "opacity-05"}`}
      />
      <div className="w-full max-w-[1920px] mx-auto min-h-screen flex flex-col p-6 lg:p-10 relative">
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#1b4332] rounded-[2.5rem] border-2 border-emerald-500 shadow-xl p-8 max-w-md w-full text-center space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <Trash2 size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-emerald-50 tracking-tighter uppercase">
                    Tem certeza?
                  </h3>
                  <p className="text-emerald-400 font-bold mt-2 leading-relaxed italic">
                    Cuidado! Isso deletará todos os arquivos...
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-emerald-950 hover:bg-emerald-950/80 text-emerald-500 font-black py-4 rounded-2xl transition-all"
                  >
                    CANCELAR
                  </button>
                  <button
                    onClick={handleDeleteServer}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-lg border-b-4 border-red-900 transition-all active:scale-95"
                  >
                    BOOM!
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#0b251a] rounded-[2.5rem] border-2 border-emerald-500 shadow-xl p-8 max-w-2xl w-full space-y-6 overflow-y-auto max-h-[90vh] custom-scrollbar"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-400">
                    <Play size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-emerald-50 tracking-tighter uppercase italic">
                      Novo Servidor
                    </h3>
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                      Configure sua nova aventura!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2">
                        Nome do Servidor
                      </label>
                      <input
                        className="w-full bg-black/40 border-2 border-emerald-900 rounded-2xl px-6 py-3 text-emerald-50 font-black outline-none focus:border-emerald-500 transition-all font-mono"
                        placeholder="Ex: Galilandia Survival"
                        value={newServerConfig.name}
                        onChange={(e) =>
                          setNewServerConfig({
                            ...newServerConfig,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2">
                        Software (Motor)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "paper",
                          "purpur",
                          "spigot",
                          "velocity",
                          "waterfall",
                          "bungeecord",
                          "fabric",
                          "mohist",
                          "forge",
                          "vanilla",
                          "nukkit",
                          "custom",
                        ].map((t) => (
                          <button
                            key={t}
                            onClick={() =>
                              setNewServerConfig({
                                ...newServerConfig,
                                type: t,
                              })
                            }
                            className={`px-3 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest border-2 transition-all ${newServerConfig.type === t ? "bg-emerald-500 border-emerald-400 text-white shadow-lg" : "bg-black/20 border-emerald-900 text-emerald-700 hover:border-emerald-600"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {newServerConfig.type === "custom" ? (
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2">
                          Link Direto (.jar)
                        </label>
                        <input
                          className="w-full bg-black/40 border-2 border-emerald-900 rounded-2xl px-6 py-3 text-emerald-50 font-black outline-none focus:border-emerald-500 transition-all font-mono text-xs"
                          placeholder={"Ex: https://site.com/server.jar"}
                          value={newServerConfig.url}
                          onChange={(e) =>
                            setNewServerConfig({
                              ...newServerConfig,
                              url: e.target.value,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2">
                          Versão
                        </label>
                        <div className="relative">
                          <select
                            className="w-full bg-black/40 border-2 border-emerald-900 rounded-2xl px-6 py-3 text-emerald-50 font-black outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                            value={newServerConfig.version}
                            onChange={(e) =>
                              setNewServerConfig({
                                ...newServerConfig,
                                version: e.target.value,
                              })
                            }
                          >
                            {metadata.versions?.map((v) => (
                              <option
                                key={v}
                                value={v}
                                className="bg-[#0b251a]"
                              >
                                {v}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-700 pointer-events-none"
                            size={16}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2">
                        RAM Máxima ({newServerConfig.ram}GB)
                      </label>
                      <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border-2 border-emerald-900">
                        <input
                          type="range"
                          min="1"
                          max={metadata.systemMaxRam || 16}
                          step="1"
                          className="flex-1 accent-emerald-400"
                          value={newServerConfig.ram}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setNewServerConfig({
                              ...newServerConfig,
                              ram: val,
                              minRam: Math.min(newServerConfig.minRam, val),
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2">
                        RAM Mínima ({newServerConfig.minRam}GB)
                      </label>
                      <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border-2 border-emerald-900">
                        <input
                          type="range"
                          min="1"
                          max={newServerConfig.ram}
                          step="1"
                          className="flex-1 accent-emerald-400"
                          value={newServerConfig.minRam}
                          onChange={(e) =>
                            setNewServerConfig({
                              ...newServerConfig,
                              minRam: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-900/50">
                      <p className="text-[9px] text-emerald-500 font-bold leading-relaxed">
                        Ao clicar em CRIAR, o painel irá reservar os recursos e
                        começar o download do software escolhido
                        automaticamente.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-emerald-950 text-emerald-500 font-black py-4 rounded-2xl transition-all"
                  >
                    CANCELAR
                  </button>
                  <button
                    onClick={handleCreateServer}
                    disabled={isInstalling}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg border-b-4 border-emerald-900 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isInstalling ? "INSTALANDO..." : "CRIAR MUNDO!"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {editingServer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#0b251a] rounded-[3rem] border-2 border-emerald-500/30 shadow-2xl p-0 max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-emerald-900/50 flex items-center justify-between bg-emerald-950/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-400">
                      <Settings size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-emerald-50 tracking-tighter uppercase italic">
                        {t("edit_server")}
                      </h3>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                        {editingServer.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-emerald-900/50">
                    <button
                      onClick={() => setEditTab("general")}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${editTab === "general" ? "bg-emerald-600 text-white shadow-lg" : "text-emerald-700 hover:text-emerald-400"}`}
                    >
                      {t("config_tab_general")}
                    </button>
                    <button
                      onClick={() => {
                        setEditTab("plugins");
                        fetchPlugins();
                      }}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${editTab === "plugins" ? "bg-emerald-600 text-white shadow-lg" : "text-emerald-700 hover:text-emerald-400"}`}
                    >
                      {t("config_tab_plugins")}
                    </button>
                  </div>
                  <button
                    onClick={() => setEditingServer(null)}
                    className="text-emerald-900 hover:text-emerald-400 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  {editTab === "general" ? (
                    <div className="max-w-md mx-auto space-y-8 py-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2">
                          {t("server_name")}
                        </label>
                        <input
                          className="w-full bg-black/40 border-2 border-emerald-900 rounded-2xl px-6 py-5 text-emerald-50 font-black outline-none focus:border-emerald-500 transition-all font-mono text-lg"
                          value={editingServer.name || ""}
                          onChange={(e) =>
                            setEditingServer({
                              ...editingServer,
                              name: e.target.value,
                            })
                          }
                          placeholder="Ex: Survival Hardcore"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2">
                          {t("ram_allocation")}
                        </label>
                        <div className="bg-black/40 p-8 rounded-[2rem] border-2 border-emerald-900 space-y-6">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-emerald-700 uppercase">
                              {t("max_memory")}
                            </span>
                            <span className="text-2xl font-black text-white">
                              {editingServer.ram}GB
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max={metadata.systemMaxRam || 16}
                            step="1"
                            className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            value={editingServer.ram || 2}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setEditingServer({
                                ...editingServer,
                                ram: val,
                                minRam: Math.min(
                                  editingServer.minRam || 1,
                                  val,
                                ),
                              });
                            }}
                          />
                          <div className="flex justify-between text-[8px] font-black text-emerald-900">
                            <span>1GB</span>
                            <span>
                              {Math.floor((metadata.systemMaxRam || 16) / 4)}GB
                            </span>
                            <span>
                              {Math.floor((metadata.systemMaxRam || 16) / 2)}GB
                            </span>
                            <span>
                              {Math.floor((metadata.systemMaxRam || 16) * 0.75)}
                              GB
                            </span>
                            <span>{metadata.systemMaxRam || 16}GB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Search Area */}
                        <div className="space-y-4 p-6 bg-emerald-900/10 border-2 border-emerald-900 rounded-3xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                {t("mods_store")}
                              </h4>
                              <select
                                className="bg-black/40 border-2 border-emerald-900 rounded-xl px-2 py-1 text-emerald-50 text-[10px] font-black outline-none focus:border-emerald-500 uppercase"
                                value={storeProvider}
                                onChange={(e) => {
                                  setStoreProvider(
                                    e.target.value as "hangar" | "modrinth",
                                  );
                                  setStoreResults([]);
                                }}
                              >
                                <option value="modrinth">Modrinth</option>
                                <option value="hangar">Hangar (Paper)</option>
                              </select>
                              <select
                                className="bg-black/40 border-2 border-emerald-900 rounded-xl px-2 py-1 text-emerald-50 text-[10px] font-black outline-none focus:border-emerald-500 uppercase"
                                value={storeFolder}
                                onChange={(e) =>
                                  setStoreFolder(
                                    e.target.value as "plugins" | "mods",
                                  )
                                }
                              >
                                <option value="plugins">Plugins</option>
                                <option value="mods">Mods</option>
                              </select>
                            </div>
                            <Sparkles
                              size={16}
                              className="text-emerald-500 animate-pulse"
                            />
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-1 bg-black/40 border-2 border-emerald-900 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-emerald-500 transition-all">
                              <Search size={18} className="text-emerald-700" />
                              <input
                                className="bg-transparent border-none outline-none text-emerald-50 w-full font-black text-xs placeholder:text-emerald-900"
                                placeholder={t("search_placeholder")}
                                value={storeSearch}
                                onChange={(e) => setStoreSearch(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && searchStore(storeSearch)
                                }
                              />
                            </div>
                            <button
                              onClick={() => searchStore(storeSearch)}
                              className="px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-[10px] transition-all border-b-4 border-emerald-800"
                            >
                              {t("search_btn")}
                            </button>
                          </div>

                          <AnimatePresence>
                            {isSearchingStore && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-[8px] text-emerald-500 font-black animate-pulse uppercase tracking-widest"
                              >
                                {t("searching")}{" "}
                                {storeProvider === "modrinth"
                                  ? "Modrinth"
                                  : "Hangar"}
                                ...
                              </motion.p>
                            )}
                          </AnimatePresence>

                          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {storeResults.map((p: any) => {
                              const itemKey = p.project_id || p.name;
                              return (
                                <div
                                  key={itemKey}
                                  className="bg-black/40 p-3 rounded-xl border border-emerald-900/50 flex items-center gap-4 hover:border-emerald-500 transition-all group"
                                >
                                  {p.icon_url || p.avatarUrl ? (
                                    <img
                                      src={p.icon_url || p.avatarUrl}
                                      alt=""
                                      className="w-10 h-10 rounded-lg"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-emerald-900 rounded-lg flex items-center justify-center text-[10px] font-black">
                                      {p.title ? p.title[0] : p.name?.[0]}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-black text-emerald-50 truncate text-xs">
                                      {p.title || p.name}
                                    </p>
                                    <p className="text-[8px] text-emerald-700 font-black uppercase">
                                      {t("developed_by")}{" "}
                                      {p.author ||
                                        p.namespace?.owner ||
                                        "Unknown"}
                                    </p>
                                  </div>
                                  <button
                                    onClick={async () => {
                                      setInstallingStoreItem(itemKey);
                                      if (storeProvider === "hangar")
                                        await installHangarPlugin(
                                          p.name,
                                          p.primaryVersion ||
                                            p.latest?.name ||
                                            p.lastVersion ||
                                            "latest",
                                        );
                                      else
                                        await installModrinthProject(
                                          p.project_id,
                                        );
                                      setInstallingStoreItem(null);
                                    }}
                                    disabled={installingStoreItem === itemKey}
                                    className={`px-3 py-1.5 font-black text-[9px] rounded-lg transition-all uppercase flex-shrink-0 ${installingStoreItem === itemKey ? "bg-zinc-600 text-zinc-300 pointer-events-none" : "bg-emerald-500 group-hover:bg-emerald-400 text-white"}`}
                                  >
                                    {installingStoreItem === itemKey
                                      ? "..."
                                      : t("install_btn")}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Manual/List Area */}
                        <div className="space-y-6">
                          <div className="p-6 bg-emerald-900/5 border-2 border-dashed border-emerald-900/30 rounded-3xl space-y-4">
                            <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">
                              Download Direto
                            </h4>
                            <div className="flex gap-2">
                              <input
                                className="flex-1 bg-black/20 border-2 border-emerald-900/50 rounded-xl px-4 py-2 text-xs text-emerald-50 font-black outline-none focus:border-emerald-500"
                                placeholder="URL do arquivo .jar"
                                value={pluginUrl}
                                onChange={(e) => setPluginUrl(e.target.value)}
                              />
                              <button
                                onClick={handleInstallPlugin}
                                disabled={installingStoreItem === "manual"}
                                className="bg-emerald-900 px-4 rounded-xl text-emerald-500 font-black text-[10px] disabled:opacity-50"
                              >
                                {installingStoreItem === "manual"
                                  ? "..."
                                  : "OK"}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                                Instalados
                              </h3>
                              <button
                                onClick={fetchPlugins}
                                className="text-emerald-700 hover:text-emerald-500 transition-colors"
                              >
                                <RefreshCw size={12} />
                              </button>
                            </div>
                            <div className="space-y-2">
                              {plugins.map((p) => (
                                <div
                                  key={p.filename}
                                  className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-emerald-900/30"
                                >
                                  <div>
                                    <p className="text-xs font-black text-emerald-50">
                                      {p.name}
                                    </p>
                                    <p className="text-[8px] font-black text-emerald-800 uppercase">
                                      {p.version}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() =>
                                      deleteFile(`plugins/${p.filename}`)
                                    }
                                    className="text-red-900 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                              {plugins.length === 0 && (
                                <p className="text-[10px] text-emerald-900 font-black text-center py-4">
                                  Nenhum plugin instalado.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {editTab === "store" && (
                    <div className="max-w-2xl mx-auto space-y-8 py-4">
                      <div className="bg-emerald-950/30 p-6 rounded-3xl border border-emerald-900/50 space-y-6">
                        <div className="flex justify-between items-center bg-fuchsia-950/20 p-5 rounded-2xl border border-fuchsia-500/20 shadow-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-fuchsia-500 shadow-lg border-b-4 border-fuchsia-950">
                              <Store size={24} />
                            </div>
                            <div>
                              <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">
                                Loja Pública (Website)
                              </h3>
                              <p className="text-[10px] text-fuchsia-400 font-bold mt-1.5 uppercase tracking-widest leading-none">
                                Crie pacotes e comandos via website.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                setAppConfig &&
                                setAppConfig({
                                  ...appConfig,
                                  storeEnabled:
                                    appConfig.storeEnabled === false,
                                })
                              }
                              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center justify-start rounded-full transition-all duration-300 focus:outline-none ring-2 ring-offset-2 ring-offset-black ${appConfig?.storeEnabled !== false ? "bg-emerald-600 ring-emerald-500/20" : "bg-zinc-700 ring-zinc-700/20"}`}
                              title={
                                appConfig?.storeEnabled !== false
                                  ? "Loja Ativa"
                                  : "Loja Inativa"
                              }
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out ${appConfig?.storeEnabled !== false ? "translate-x-6" : "translate-x-1"}`}
                              />
                            </button>

                            {appConfig?.storeEnabled !== false && (
                              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                                <button
                                  onClick={() => {
                                    window.open(`/site`, "_blank");
                                  }}
                                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all border border-white/5 active:scale-95 flex items-center gap-2"
                                >
                                  Ver Site <ExternalLink size={12} />
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveTab("settings");
                                  }}
                                  className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 border-b-2 border-fuchsia-800 flex items-center gap-2"
                                >
                                  Opções <Settings size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest px-2">
                              Nome da Loja
                            </label>
                            <input
                              className="w-full bg-black/40 border-2 border-emerald-900/50 rounded-xl px-4 py-3 text-emerald-50 font-bold outline-none focus:border-emerald-500 transition-all text-xs"
                              value={editingServer.store?.name || ""}
                              onChange={(e) =>
                                setEditingServer({
                                  ...editingServer,
                                  store: {
                                    ...editingServer.store,
                                    name: e.target.value,
                                  },
                                })
                              }
                              placeholder="Minha Loja de Servidor"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest px-2">
                              Cor Principal (Hex)
                            </label>
                            <input
                              className="w-full bg-black/40 border-2 border-emerald-900/50 rounded-xl px-4 py-3 text-emerald-50 font-bold outline-none focus:border-emerald-500 transition-all text-xs font-mono"
                              value={editingServer.store?.color || "#10b981"}
                              onChange={(e) =>
                                setEditingServer({
                                  ...editingServer,
                                  store: {
                                    ...editingServer.store,
                                    color: e.target.value,
                                  },
                                })
                              }
                              placeholder="#10b981"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                          <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                            Pacotes à Venda
                          </h3>
                          <button
                            onClick={() => {
                              const newItem = {
                                id: `item-${Date.now()}`,
                                name: "Novo VIP",
                                description: "",
                                price: 10,
                                commands: ["say {player} comprou VIP!"],
                              };
                              setEditingServer({
                                ...editingServer,
                                store: {
                                  ...editingServer.store,
                                  items: [
                                    ...(editingServer.store?.items || []),
                                    newItem,
                                  ],
                                },
                              });
                            }}
                            className="text-[10px] bg-emerald-900 text-emerald-100 hover:bg-emerald-800 font-black px-4 py-2 rounded-xl transition-colors uppercase"
                          >
                            + Adicionar
                          </button>
                        </div>

                        {(editingServer.store?.items || []).map(
                          (item: any, i: number) => (
                            <div
                              key={item.id}
                              className="p-4 bg-black/20 border border-emerald-900/50 rounded-2xl relative group"
                            >
                              <button
                                onClick={() => {
                                  const items = [...editingServer.store.items];
                                  items.splice(i, 1);
                                  setEditingServer({
                                    ...editingServer,
                                    store: { ...editingServer.store, items },
                                  });
                                }}
                                className="absolute top-4 right-4 text-red-900 hover:text-red-500 transition-colors"
                              >
                                <X size={16} />
                              </button>

                              <div className="grid grid-cols-2 gap-4 mb-4 pr-8">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">
                                    Nome
                                  </label>
                                  <input
                                    className="w-full bg-black/40 border border-emerald-900/50 rounded-lg px-3 py-2 text-emerald-50 font-bold outline-none focus:border-emerald-500 text-xs"
                                    value={item.name}
                                    onChange={(e) => {
                                      const items = [
                                        ...editingServer.store.items,
                                      ];
                                      items[i].name = e.target.value;
                                      setEditingServer({
                                        ...editingServer,
                                        store: {
                                          ...editingServer.store,
                                          items,
                                        },
                                      });
                                    }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">
                                    Preço (R$)
                                  </label>
                                  <input
                                    type="number"
                                    className="w-full bg-black/40 border border-emerald-900/50 rounded-lg px-3 py-2 text-emerald-50 font-bold outline-none focus:border-emerald-500 text-xs"
                                    value={item.price}
                                    onChange={(e) => {
                                      const items = [
                                        ...editingServer.store.items,
                                      ];
                                      items[i].price = Number(e.target.value);
                                      setEditingServer({
                                        ...editingServer,
                                        store: {
                                          ...editingServer.store,
                                          items,
                                        },
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1 mb-4">
                                <label className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">
                                  Descrição Pequena
                                </label>
                                <input
                                  className="w-full bg-black/40 border border-emerald-900/50 rounded-lg px-3 py-2 text-emerald-50 font-bold outline-none focus:border-emerald-500 text-xs"
                                  value={item.description || ""}
                                  onChange={(e) => {
                                    const items = [
                                      ...editingServer.store.items,
                                    ];
                                    items[i].description = e.target.value;
                                    setEditingServer({
                                      ...editingServer,
                                      store: { ...editingServer.store, items },
                                    });
                                  }}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">
                                  Comandos Executados (1 por linha, use{" "}
                                  {"{player}"})
                                </label>
                                <textarea
                                  className="w-full bg-black/40 border border-emerald-900/50 rounded-lg px-3 py-2 text-emerald-50 font-mono outline-none focus:border-emerald-500 text-xs h-20 custom-scrollbar"
                                  value={(item.commands || []).join("\n")}
                                  onChange={(e) => {
                                    const items = [
                                      ...editingServer.store.items,
                                    ];
                                    items[i].commands =
                                      e.target.value.split("\n");
                                    setEditingServer({
                                      ...editingServer,
                                      store: { ...editingServer.store, items },
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-8 bg-emerald-950/40 border-t border-emerald-900/50 flex gap-4">
                  <button
                    onClick={() => setEditingServer(null)}
                    className="flex-1 bg-emerald-950 text-emerald-500 font-black py-4 rounded-2xl transition-all hover:bg-emerald-900"
                  >
                    FECHAR
                  </button>
                  {editTab === "general" && (
                    <>
                      <button
                        onClick={() => {
                          setEditingServer(null);
                          setShowDeleteConfirm(true);
                        }}
                        disabled={serverState.status !== "offline"}
                        className="flex-none bg-red-950 hover:bg-red-900 text-red-500 hover:text-white font-black py-4 px-6 rounded-2xl shadow-lg border-b-4 border-red-900 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
                        title={
                          serverState.status !== "offline"
                            ? "Desligue o servidor primeiro"
                            : "Excluir Servidor"
                        }
                      >
                        <Trash2 size={24} />
                      </button>
                      <button
                        onClick={handleUpdateServerConfig}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg border-b-4 border-emerald-800 transition-all active:scale-95"
                      >
                        SALVAR ALTERAÇÕES
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {isHibernating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center pointer-events-none"
            >
              <div className="bg-[#0b251a] p-8 rounded-[2.5rem] border-2 border-emerald-900 shadow-2xl flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-emerald-950 rounded-full flex items-center justify-center text-emerald-500 relative">
                  <Moon size={48} fill="currentColor" />
                  <div className="absolute -top-4 -right-4 flex flex-col gap-1 font-black text-emerald-400">
                    <span className="animate-bounce delay-75">Z</span>
                    <span className="animate-bounce delay-150 ml-2">z</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-black text-emerald-50 text-xl tracking-tighter uppercase">
                    {t("hibernation_title")}
                  </p>
                  <p className="text-emerald-500 font-bold text-sm tracking-widest uppercase mt-1">
                    {t("hibernation_desc")}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorations Section */}
        <div className="fixed top-20 right-10 text-emerald-900/10 -z-10 animate-bounce cursor-default">
          <Sparkles size={120} />
        </div>

        {/* Creepers de Papel Enfeite */}
        <CreeperPaper className="top-40 left-10 rotate-[-15deg] blur-[1px]" />
        <CreeperPaper className="bottom-40 left-20 rotate-[15deg] scale-75 blur-[2px]" />
        <CreeperPaper className="top-1/4 right-2 rotate-[45deg] scale-50 opacity-10" />

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 relative">
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 bg-emerald-950 rounded-3xl border-2 border-emerald-500/30 flex items-center justify-center relative shadow-sm transition-all"
            >
              <div className="w-16 h-12 flex flex-col gap-2">
                <div className="flex justify-between px-1">
                  <div className="w-4 h-4 bg-black rounded-sm" />
                  <div className="w-4 h-4 bg-black rounded-sm" />
                </div>
                <div
                  className="w-7 h-7 bg-black mx-auto"
                  style={{
                    clipPath:
                      "polygon(0% 0%, 100% 0%, 100% 100%, 70% 100%, 70% 50%, 30% 50%, 30% 100%, 0% 100%)",
                  }}
                />
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-400 text-white">
                <Check size={20} />
              </div>
            </motion.div>

            <div>
              <h1 className="text-5xl font-black tracking-tighter flex items-center gap-2 italic">
                PAPER<span className="text-emerald-500">CREEPER</span>{" "}
                <Sparkles
                  className="text-emerald-500 animate-pulse"
                  size={32}
                />
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <p
                  className={`font-black tracking-[0.3em] text-[10px] px-3 py-1 rounded-full w-fit shadow-sm uppercase border ${theme === "dark" ? "bg-emerald-950/50 text-emerald-500/60 border-emerald-900/50" : "bg-zinc-200 text-emerald-700 border-zinc-300"}`}
                >
                  {t("panel_active")} (•◡•)
                </p>
                <div className="bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-md shadow-lg flex items-center gap-1 animate-pulse">
                  <Cpu size={10} /> LINUX PRO
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 bg-black/40 backdrop-blur-md p-2 px-4 rounded-full shadow-sm border border-emerald-900/50 transition-all hover:bg-black/60 group">
            <div className="flex flex-col items-start">
              <div className="text-[7px] font-black text-emerald-500/40 uppercase tracking-[0.2em] mb-0.5 group-hover:text-emerald-500/80 transition-colors truncate max-w-[150px]">
                {currentServerId
                  ? servers.find((s) => s.id === currentServerId)?.name ||
                    t("server_default_name")
                  : t("select_server_hint")}
              </div>
              <div
                className={`px-3 py-1 rounded-full font-black text-[8px] uppercase tracking-widest border transition-all ${getStatusBubble()}`}
              >
                {t(`server_${serverState.status}`)}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 relative flex-1">
          {/* Links Sidebar */}
          <div className="order-1 lg:col-span-3 space-y-6 lg:pr-2 h-auto lg:h-full flex flex-col">
            <div
              className={`border-2 rounded-3xl p-4 lg:p-6 shadow-sm space-y-4 lg:space-y-5 flex-shrink-0 ${theme === "dark" ? "bg-[#0b251a]/80 border-emerald-900" : "bg-white border-zinc-200"}`}
            >
              <div className="hidden lg:flex text-[10px] font-black text-emerald-400 uppercase tracking-[0.25em] items-center gap-2">
                <Star size={12} fill="currentColor" /> {t("menu_magic")}
              </div>
              <nav className="flex lg:flex-col overflow-x-auto gap-3 lg:gap-0 lg:space-y-1 pb-2 lg:pb-0 snap-x custom-scrollbar">
                <MenuLink
                  icon={<Server size={20} />}
                  label={t("servers")}
                  active={activeTab === "servers"}
                  onClick={() => setActiveTab("servers")}
                />
                <MenuLink
                  icon={<Globe size={20} />}
                  label={t("playit_title")}
                  active={activeTab === "playit"}
                  onClick={() => setActiveTab("playit")}
                />
                <MenuLink
                  icon={<Terminal size={20} />}
                  label={t("terminal")}
                  active={activeTab === "console"}
                  onClick={() => setActiveTab("console")}
                />
                {modules.ai && (
                  <MenuLink
                    icon={<Bot size={20} />}
                    label={t("ai_assistant")}
                    active={activeTab === "ai"}
                    onClick={() => setActiveTab("ai")}
                  />
                )}
                {modules.map && (
                  <MenuLink
                    icon={<Map size={20} />}
                    label={t("map_editor")}
                    active={activeTab === "map"}
                    onClick={() => setActiveTab("map")}
                  />
                )}
                {modules.store && (
                  <MenuLink
                    icon={<Store size={20} />}
                    label={t("internal_store")}
                    active={activeTab === "store"}
                    onClick={() => setActiveTab("store")}
                  />
                )}
                <MenuLink
                  icon={<Settings size={20} />}
                  label={t("settings")}
                  active={activeTab === "settings"}
                  onClick={() => setActiveTab("settings")}
                />
              </nav>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="order-2 lg:order-none col-span-1 lg:col-span-9 h-full lg:pr-2">
            <AnimatePresence mode="wait">
              {activeTab === "servers" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-[#0b251a]/80 border-2 border-emerald-900 rounded-[2.5rem] shadow-sm p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                        <Server className="text-emerald-400" /> Servidores
                      </h3>
                      <div className="px-4 py-1.5 bg-emerald-900/50 rounded-full border border-emerald-500/30 text-emerald-400 font-black text-[10px] uppercase tracking-widest shadow-sm">
                        {servers.length} Criados (•◡•)
                      </div>
                    </div>

                    <div className="space-y-4">
                      {servers.map((srv) => (
                        <div
                          key={srv.id}
                          className={`p-6 rounded-[2rem] border-4 transition-all cursor-pointer shadow-sm hover:shadow-xl ${currentServerId === srv.id ? "bg-emerald-900/20 border-emerald-500" : "bg-black/20 border-zinc-900 border-opacity-50 hover:border-emerald-900/50"}`}
                          onClick={() => setCurrentServerId(srv.id)}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-6">
                              <div
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-transform ${currentServerId === srv.id ? "bg-emerald-500 border-emerald-400 rotate-3" : "bg-zinc-800 border-zinc-700"}`}
                              >
                                <Server size={32} className="text-white" />
                              </div>
                              <div className="min-w-0">
                                <h4
                                  className={`text-xl font-black tracking-tight truncate ${currentServerId === srv.id ? "text-white" : "text-emerald-50/80"}`}
                                >
                                  {srv.name}
                                </h4>
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                  <span className="text-[9px] font-black text-emerald-400 bg-black/40 px-2 py-0.5 rounded-full border border-emerald-950 uppercase tracking-tighter">
                                    {srv.id}
                                  </span>
                                  {srv.type && (
                                    <span className="text-[9px] font-black text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded-full border border-emerald-800 uppercase tracking-tighter">
                                      {srv.type} {srv.version}
                                    </span>
                                  )}
                                  <span className="text-[9px] font-black text-emerald-400 bg-black/40 px-2 py-0.5 rounded-full border border-emerald-950 uppercase tracking-tighter">
                                    {srv.ram}GB RAM
                                  </span>
                                  {currentServerId === srv.id && (
                                    <>
                                      <span className="text-[9px] font-black text-emerald-400 bg-black/40 px-2 py-0.5 rounded-full border border-emerald-950 uppercase tracking-tighter font-mono">
                                        {serverState.status}
                                      </span>
                                      {serverState.config && (
                                        <span className="text-[9px] font-black text-emerald-400 bg-black/40 px-2 py-0.5 rounded-full border border-emerald-950 uppercase tracking-tighter">
                                          {serverState.config.ram}GB RAM
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3 ml-auto">
                              {currentServerId === srv.id && (
                                <>
                                  <button
                                    onClick={() => setActiveTab("console")}
                                    className="w-10 h-10 bg-emerald-950 border-2 border-emerald-900 rounded-xl flex items-center justify-center text-emerald-500 hover:border-emerald-500 hover:text-white transition-all shadow-md active:scale-95"
                                    title="Console"
                                  >
                                    <Terminal size={18} />
                                  </button>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentServerId(srv.id);
                                        setActiveTab("files");
                                      }}
                                      className="w-10 h-10 bg-emerald-950 border-2 border-emerald-900 rounded-xl flex items-center justify-center text-emerald-500 hover:border-emerald-500 hover:text-white transition-all shadow-md active:scale-95"
                                      title="Arquivos"
                                    >
                                      <Database size={18} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingServer({
                                          id: srv.id,
                                          name: srv.name,
                                          ram: srv.ram || 2,
                                          minRam: srv.minRam || 1,
                                          store: srv.store || {
                                            name: "",
                                            color: "#10b981",
                                            items: [],
                                          },
                                        });
                                      }}
                                      className="w-10 h-10 bg-emerald-950 border-2 border-emerald-900 rounded-xl flex items-center justify-center text-emerald-500 hover:border-emerald-500 hover:text-white transition-all shadow-md active:scale-95"
                                      title="Ajustes"
                                    >
                                      <Settings size={18} />
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        if (
                                          serverState.status === "starting" ||
                                          serverState.status === "stopping"
                                        )
                                          return;
                                        handleAction(
                                          serverState.status === "online"
                                            ? "stop"
                                            : "start",
                                        );
                                      }}
                                      disabled={
                                        serverState.status === "starting" ||
                                        serverState.status === "stopping"
                                      }
                                      className={`px-6 h-10 rounded-xl font-black text-[11px] text-white transition-all shadow-lg active:scale-95 border-b-4 ${
                                        serverState.status === "online"
                                          ? "bg-red-600 border-red-800 hover:bg-red-500"
                                          : serverState.status === "offline"
                                            ? "bg-emerald-600 border-emerald-800 hover:bg-emerald-500"
                                            : "bg-zinc-700 border-zinc-900 animate-pulse cursor-wait"
                                      }`}
                                    >
                                      {serverState.status === "online"
                                        ? "STOP"
                                        : serverState.status === "offline"
                                          ? "START"
                                          : serverState.status.toUpperCase()}
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="w-full p-6 border-2 border-dashed border-emerald-900 rounded-[2rem] text-center hover:bg-emerald-950/30 hover:border-emerald-500 transition-all group flex items-center justify-center gap-4"
                      >
                        <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center group-hover:rotate-90 transition-transform border border-emerald-900">
                          <Play size={20} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-black text-white text-sm uppercase italic tracking-tighter">
                            CRIAR NOVO SERVIDOR
                          </p>
                          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">
                            Uma nova aventura te espera!
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Infos redundantes removidas */}
                </motion.div>
              )}

              {activeTab === "playit" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#0b251a]/80 border-2 border-emerald-900 rounded-[2.5rem] shadow-sm p-4 sm:p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]"
                >
                  <Globe
                    size={64}
                    className="text-emerald-500 mb-6 opacity-80 animate-pulse"
                  />
                  <h3 className="text-3xl font-black text-white tracking-tighter mb-4 text-center uppercase">
                    Playit.gg
                  </h3>
                  <p className="text-emerald-500 font-bold mb-8 text-center max-w-lg leading-relaxed mix-blend-screen text-[10px] sm:text-xs uppercase tracking-widest hidden sm:block">
                    Túnel de rede público e global.
                    <br />
                    Ative para expor as portas dos seus servidores online sem
                    configurar roteador.
                  </p>

                  <div className="flex flex-col items-center gap-4 w-full max-w-md">
                    <button
                      disabled={!!playitLoading}
                      onClick={async () => {
                        setPlayitLoading(
                          playitStatus.running ? "stop" : "start",
                        );
                        if (playitStatus.running) {
                          await fetch("/api/playit/stop", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({}),
                          });
                        } else {
                          await fetch("/api/playit/start", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({}),
                          });
                        }
                        setPlayitLoading(null);
                      }}
                      className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-black text-xs uppercase shadow-lg transition-transform active:scale-95 border-b-4 ${playitLoading ? "opacity-50 cursor-not-allowed " : ""}${playitStatus.running ? "bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border-rose-900/50" : "bg-emerald-500 hover:bg-emerald-400 text-emerald-950 border-emerald-700"}`}
                    >
                      {playitLoading === "start" || playitLoading === "stop" ? (
                        <RefreshCw className="animate-spin" size={18} />
                      ) : (
                        <Power size={18} />
                      )}
                      {playitLoading === "start"
                        ? "Ligando..."
                        : playitLoading === "stop"
                          ? "Desligando..."
                          : playitStatus.running
                            ? "Desligar Agente"
                            : "Ligar Agente Playit"}
                    </button>

                    <div className="flex w-full gap-4">
                      <button
                        disabled={!!playitLoading}
                        onClick={async (e) => {
                          e.stopPropagation();
                          setPlayitLoading("reset");
                          await fetch("/api/playit/reset", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({}),
                          });
                          setPlayitLoading(null);
                        }}
                        className={`flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold text-xs uppercase rounded-xl transition-all border border-zinc-800 shadow-md ${playitLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {playitLoading === "reset" ? "Resetando..." : "Resetar"}
                      </button>

                      {playitStatus.installed ? (
                        <>
                          <button
                            disabled={!!playitLoading}
                            onClick={async (e) => {
                              e.stopPropagation();
                              setPlayitLoading("update");
                              await fetch("/api/playit/update", {
                                method: "POST",
                              });
                              setPlayitLoading(null);
                            }}
                            className={`flex-1 py-3 bg-blue-900/50 hover:bg-blue-800 text-blue-400 font-bold text-xs uppercase rounded-xl transition-all border border-blue-900 shadow-md ${playitLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {playitLoading === "update"
                              ? "Atualizando..."
                              : "Atualizar"}
                          </button>
                          <button
                            disabled={!!playitLoading}
                            onClick={async (e) => {
                              e.stopPropagation();
                              setPlayitLoading("uninstall");
                              await fetch("/api/playit/uninstall", {
                                method: "POST",
                              });
                              setPlayitStatus((prev) => ({
                                ...prev,
                                installed: false,
                                running: false,
                              }));
                              setPlayitLoading(null);
                            }}
                            className={`flex-1 py-3 bg-rose-900/50 hover:bg-rose-800 text-rose-400 font-bold text-xs uppercase rounded-xl transition-all border border-rose-900 shadow-md ${playitLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {playitLoading === "uninstall"
                              ? "Desinstalando..."
                              : "Desinstalar"}
                          </button>
                        </>
                      ) : (
                        <button
                          disabled={!!playitLoading}
                          onClick={async (e) => {
                            e.stopPropagation();
                            setPlayitLoading("install");
                            await fetch("/api/playit/install", {
                              method: "POST",
                            });
                            setPlayitStatus((prev) => ({
                              ...prev,
                              installed: true,
                            }));
                            setPlayitLoading(null);
                          }}
                          className={`flex-1 py-3 flex justify-center items-center gap-2 bg-emerald-900/50 hover:bg-emerald-800 text-emerald-400 font-bold text-xs uppercase rounded-xl transition-all border border-emerald-900 shadow-md ${playitLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {playitLoading === "install" && (
                            <RefreshCw size={14} className="animate-spin" />
                          )}
                          {playitLoading === "install"
                            ? "Instalando..."
                            : "Instalar"}
                        </button>
                      )}
                    </div>

                    {!playitStatus.running ? (
                      <div className="w-full mt-4 p-5 bg-black/40 border-2 border-zinc-900/80 rounded-2xl text-center">
                        <p className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mb-1">
                          Status
                        </p>
                        <div className="text-zinc-600 font-bold text-xs uppercase tracking-widest">
                          Offline
                        </div>
                      </div>
                    ) : (
                      <div className="w-full mt-4 p-5 bg-black/40 border-2 border-emerald-900/40 rounded-2xl text-center">
                        <p className="text-[10px] text-emerald-500/50 mb-3 font-black tracking-widest uppercase">
                          Status do Único Túnel
                        </p>

                        {playitStatus.linked ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center p-3 bg-emerald-950/40 rounded-xl border border-emerald-900">
                              <span className="font-bold text-emerald-400 text-[10px] sm:text-xs tracking-widest uppercase">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 size={14} /> Conta Vinculada com
                                  Sucesso
                                </div>
                              </span>
                            </div>
                            <p className="text-[10px] text-emerald-600 font-bold max-w-sm mx-auto leading-relaxed">
                              Acesse playit.gg para configurar seus túneis. O
                              Playit roteará o tráfego automaticamente para este
                              PC.
                            </p>
                            {playitStatus.tunnel && (
                              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 flex justify-between items-center px-4">
                                <span className="text-zinc-300 font-mono text-xs font-bold">
                                  {playitStatus.tunnel}
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      playitStatus.tunnel || "",
                                    );
                                    alert("IP copiado! (•◡•)");
                                  }}
                                  className="text-emerald-500 hover:text-emerald-400"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : playitStatus.claimUrl ? (
                          <div className="space-y-3">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                              Conta Playit.gg pendente
                            </p>
                            <a
                              href={playitStatus.claimUrl}
                              target="_blank"
                              className="block text-center py-4 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] sm:text-xs uppercase rounded-xl shadow-lg border-b-4 border-emerald-800"
                            >
                              Vincular Conta Playit Agora
                            </a>
                          </div>
                        ) : (
                          <div className="text-emerald-500/60 font-bold text-xs flex justify-center items-center gap-2 uppercase tracking-widest">
                            <RefreshCw size={14} className="animate-spin" />{" "}
                            Verificando conexão...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "map" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#0b251a]/80 border-2 border-emerald-900 rounded-[2.5rem] shadow-sm p-4 sm:p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]"
                >
                  <Map size={64} className="text-emerald-500 mb-6 opacity-80" />
                  <h3 className="text-3xl font-black text-white tracking-tighter mb-4 text-center uppercase">
                    {t("map_editor_title")}
                  </h3>
                  <p className="text-emerald-500 font-bold mb-8 text-center max-w-lg leading-relaxed mix-blend-screen text-[10px] sm:text-xs uppercase tracking-widest hidden sm:block">
                    {t("map_editor_desc")}
                  </p>

                  <div className="flex flex-col items-center gap-4 w-full max-w-lg">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button
                        onClick={() => {
                          if (!currentServerId)
                            return alert("Selecione um servidor primeiro!");
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = ".zip,.schematic,.schem";
                          input.onchange = async (e: any) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            let targetFolder = "";
                            if (
                              file.name.endsWith(".schem") ||
                              file.name.endsWith(".schematic")
                            ) {
                              targetFolder = "plugins/WorldEdit/schematics";
                            }

                            await uploadMultipleFiles(
                              [file],
                              currentServerId,
                              targetFolder,
                            );
                            alert("Mapa/Schematic enviado com sucesso!");
                          };
                          input.click();
                        }}
                        className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase shadow-lg transition-transform active:scale-95 border-b-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 border-emerald-700"
                      >
                        <UploadCloud size={16} /> {t("map_upload_zip")}
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab("settings");
                          setStoreProvider("hangar");
                          setEditTab("plugins");
                          setStoreFolder("plugins");
                          setStoreSearch("bluemap");
                          searchStore("bluemap");
                          setEditingServer(servers.find(s => s.id === currentServerId) || null);
                        }}
                        className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase shadow-lg transition-transform active:scale-95 border-b-4 bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-800"
                      >
                        <Globe size={16} /> Mapa 3D no Navegador (BlueMap)
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab("files");
                          setCurrentFolder("plugins/WorldEdit/schematics");
                        }}
                        className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase shadow-lg transition-transform active:scale-95 border-b-4 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border-zinc-950"
                      >
                        <Folder size={16} /> {t("map_view_schematics")}
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab("files");
                          setCurrentFolder("");
                        }}
                        className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase shadow-lg transition-transform active:scale-95 border-b-4 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border-zinc-950"
                      >
                        <Map size={16} /> {t("map_view_worlds")}
                      </button>
                    </div>

                    <div className="w-full mt-4 p-6 bg-black/40 border-2 border-emerald-900/40 rounded-2xl">
                      <p className="text-[12px] text-emerald-500 font-black tracking-widest uppercase mb-4 text-center">
                        {t("map_protector_title")}
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] uppercase font-black tracking-widest text-emerald-600 block mb-2 px-1">
                            {t("map_region_label")}
                          </label>
                          <input
                            value={mapRegion}
                            onChange={(e) => setMapRegion(e.target.value)}
                            className="w-full bg-emerald-950/20 border-2 border-emerald-900/50 p-4 rounded-xl text-emerald-400 text-xs font-black uppercase focus:border-emerald-500 transition outline-none"
                            placeholder="NOME_DA_REGIAO (EX: SPAWN, VIP_ZONE)"
                          />
                        </div>
                        <p className="text-emerald-500/50 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                          {t("map_region_tip").replace(
                            "{mapRegion}",
                            mapRegion,
                          )}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <button
                            onClick={async () => {
                              if (!currentServerId)
                                return alert("Selecione ou inicie o servidor!");
                              await fetch("/api/server/command", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  command: `rg flag ${mapRegion} pvp deny`,
                                  serverId: currentServerId,
                                }),
                              });
                              alert("Permissão aplicada!");
                            }}
                            className="bg-emerald-900/30 border border-emerald-800 text-emerald-400 p-4 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-800 transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
                          >
                            <Shield size={14} /> {t("map_no_pvp")}
                          </button>
                          <button
                            onClick={async () => {
                              if (!currentServerId)
                                return alert("Selecione ou inicie o servidor!");
                              await fetch("/api/server/command", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  command: `rg flag ${mapRegion} build deny`,
                                  serverId: currentServerId,
                                }),
                              });
                              alert("Permissão aplicada!");
                            }}
                            className="bg-emerald-900/30 border border-emerald-800 text-emerald-400 p-4 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-800 transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
                          >
                            <Hammer size={14} /> {t("map_no_build")}
                          </button>
                          <button
                            onClick={async () => {
                              if (!currentServerId)
                                return alert("Selecione ou inicie o servidor!");
                              await fetch("/api/server/command", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  command: `rg flag ${mapRegion} mob-spawning deny`,
                                  serverId: currentServerId,
                                }),
                              });
                              alert("Permissão aplicada!");
                            }}
                            className="bg-emerald-900/30 border border-emerald-800 text-emerald-400 p-4 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-800 transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
                          >
                            <Skull size={14} /> {t("map_no_mobs")}
                          </button>
                          <button
                            onClick={async () => {
                              if (!currentServerId)
                                return alert("Selecione ou inicie o servidor!");
                              await fetch("/api/server/command", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  command: `rg flag ${mapRegion} invincible allow`,
                                  serverId: currentServerId,
                                }),
                              });
                              alert("Permissão aplicada!");
                            }}
                            className="bg-emerald-900/30 border border-emerald-800 text-emerald-400 p-4 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-800 transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
                          >
                            <Heart size={14} /> {t("map_immortal")}
                          </button>
                          <button
                            onClick={async () => {
                              if (!currentServerId)
                                return alert("Selecione ou inicie o servidor!");
                              await fetch("/api/server/command", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  command: `rg flag ${mapRegion} interact allow`,
                                  serverId: currentServerId,
                                }),
                              });
                              alert("Permissão aplicada!");
                            }}
                            className="col-span-2 bg-emerald-900/30 border border-emerald-800 text-emerald-400 p-4 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-800 transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
                          >
                            <Hand size={14} /> {t("map_allow_interact")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "store" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#0b251a]/80 border-2 border-emerald-900 rounded-[2.5rem] shadow-sm p-4 sm:p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]"
                >
                  <Store
                    size={64}
                    className="text-emerald-500 mb-6 opacity-80"
                  />
                  <h3 className="text-3xl font-black text-white tracking-tighter mb-4 text-center uppercase">
                    {t("store_editor_title") || "Gerenciador de Lojas"}
                  </h3>
                  <p className="text-emerald-500 font-bold mb-8 text-center max-w-lg leading-relaxed mix-blend-screen text-[10px] sm:text-xs uppercase tracking-widest hidden sm:block">
                    {t("store_editor_desc") ||
                      "Crie sua própria loja Skript 100% customizada ou gerencie plugins de Lojas NPC / GUI nativos."}
                  </p>

                  <div className="flex flex-col items-center gap-4 w-full max-w-lg">
                    <button
                      onClick={() => {
                        const prompt = window.prompt(
                          "Descreva a sua loja (Ex: Loja de Vips, Loja de Blocos, NPCs que vendem espadas):",
                          "Quero uma loja GUI simples que venda pedra por $10",
                        );
                        if (!prompt) return;

                        setAiInput(
                          `Crie um plugin Skript para uma Loja In-Game com as seguintes características: ${prompt}. O código DEVE estar em um bloco \`\`\`skript ... \`\`\`. O Skript deve usar um menu GUI e ter economia básica.`,
                        );
                        setActiveTab("ai");
                      }}
                      className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-black text-xs uppercase shadow-lg transition-transform active:scale-95 border-b-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 border-emerald-700"
                    >
                      <Sparkles size={18} />{" "}
                      {t("store_generate_skript") ||
                        "Gerar Loja Skript In-Game (IA)"}
                    </button>

                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button
                        onClick={() => {
                          setActiveTab("plugins");
                          setStoreSearch("Shopkeepers");
                        }}
                        className="w-full py-4 rounded-xl flex flex-col items-center justify-center gap-2 font-black text-[10px] uppercase shadow-lg transition-transform active:scale-95 border-b-4 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border-zinc-950"
                      >
                        <Users size={16} /> {t("store_npc_shopkeepers")}
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("plugins");
                          setStoreSearch("EconomyShopGUI");
                        }}
                        className="w-full py-4 rounded-xl flex flex-col items-center justify-center gap-2 font-black text-[10px] uppercase shadow-lg transition-transform active:scale-95 border-b-4 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border-zinc-950"
                      >
                        <Store size={16} /> {t("store_gui_economy")}
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("plugins");
                          setStoreSearch("Citizens");
                        }}
                        className="col-span-2 w-full py-4 rounded-xl flex flex-col items-center justify-center gap-2 font-black text-[10px] uppercase shadow-lg transition-transform active:scale-95 border-b-4 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border-zinc-950"
                      >
                        <Bot size={16} /> {t("store_npc_commands")}
                      </button>
                    </div>

                    <div className="w-full mt-4 p-5 bg-black/40 border-2 border-emerald-900/40 rounded-2xl text-center">
                      <p className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mb-1">
                        {t("store_status_help")}
                      </p>
                      <div className="text-zinc-600 font-normal text-xs leading-relaxed max-w-md mx-auto">
                        {t("store_help_desc")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-[2.5rem] border-2 shadow-sm p-6 lg:p-10 min-h-[600px] lg:min-h-0 h-full flex flex-col relative overflow-hidden ${theme === "dark" ? "bg-[#0b251a]/80 border-emerald-900" : "bg-white border-zinc-200"}`}
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-emerald-950/20 rounded-2xl text-emerald-500">
                      <Settings size={32} />
                    </div>
                    <div>
                      <h2
                        className={`text-3xl font-black tracking-tighter italic uppercase ${theme === "dark" ? "text-white" : "text-emerald-950"}`}
                      >
                        {t("settings_title")}
                      </h2>
                      <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">
                        {t("settings_sub")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <section className="space-y-4">
                      <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <Languages size={14} /> {t("select_lang")}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setLanguage("en")}
                          className={`flex-1 px-4 py-3 rounded-2xl font-black text-xs transition-all border-2 ${language === "en" ? "bg-emerald-600 border-emerald-400 text-white shadow-lg" : "bg-black/10 border-emerald-950/20 text-emerald-900/50 hover:border-emerald-500"}`}
                        >
                          ENGLISH
                        </button>
                        <button
                          onClick={() => setLanguage("pt")}
                          className={`flex-1 px-4 py-3 rounded-2xl font-black text-xs transition-all border-2 ${language === "pt" ? "bg-emerald-600 border-emerald-400 text-white shadow-lg" : "bg-black/10 border-emerald-950/20 text-emerald-900/50 hover:border-emerald-500"}`}
                        >
                          PORTUGUÊS (BR)
                        </button>
                      </div>
                    </section>

                    {/* Modules Toggles */}
                    <section className="space-y-4 col-span-1 md:col-span-2">
                      <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <Power size={14} /> Ativar/Desativar Módulos
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() =>
                            setModules((m) => ({ ...m, ai: !m.ai }))
                          }
                          className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-black text-xs transition-all border-2 ${modules.ai ? "bg-emerald-600 border-emerald-400 text-white shadow-lg" : "bg-black/10 border-emerald-950/20 text-emerald-900/50 hover:border-emerald-500"}`}
                        >
                          <Bot size={24} /> ASSISTENTE IA
                        </button>
                        <button
                          onClick={() =>
                            setModules((m) => ({ ...m, map: !m.map }))
                          }
                          className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-black text-xs transition-all border-2 ${modules.map ? "bg-emerald-600 border-emerald-400 text-white shadow-lg" : "bg-black/10 border-emerald-950/20 text-emerald-900/50 hover:border-emerald-500"}`}
                        >
                          <Map size={24} /> EDITOR DE MAPA
                        </button>
                        <button
                          onClick={() =>
                            setModules((m) => ({ ...m, store: !m.store }))
                          }
                          className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-black text-xs transition-all border-2 ${modules.store ? "bg-emerald-600 border-emerald-400 text-white shadow-lg" : "bg-black/10 border-emerald-950/20 text-emerald-900/50 hover:border-emerald-500"}`}
                        >
                          <Store size={24} /> LOJA IN-GAME
                        </button>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <Palette size={14} /> {t("select_theme")}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTheme("dark")}
                          className={`flex-1 px-4 py-3 rounded-2xl font-black text-xs transition-all border-2 flex items-center justify-center gap-2 ${theme === "dark" ? "bg-emerald-600 border-emerald-400 text-white shadow-lg" : "bg-black/10 border-emerald-950/20 text-emerald-900/50 hover:border-emerald-500"}`}
                        >
                          <Moon size={14} /> {t("theme_dark")}
                        </button>
                        <button
                          onClick={() => setTheme("light")}
                          className={`flex-1 px-4 py-3 rounded-2xl font-black text-xs transition-all border-2 flex items-center justify-center gap-2 ${theme === "light" ? "bg-emerald-600 border-emerald-400 text-white shadow-lg" : "bg-black/10 border-emerald-950/20 text-emerald-900/50 hover:border-emerald-500"}`}
                        >
                          <Sun size={14} /> {t("theme_light")}
                        </button>
                      </div>
                    </section>

                    <section className="md:col-span-2 p-8 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg border-b-4 border-emerald-800">
                          <Cpu size={24} />
                        </div>
                        <div>
                          <h5 className="font-black text-emerald-700 text-xs uppercase tracking-tighter">
                            {t("performance_mode")}
                          </h5>
                          <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">
                            {t("vps_linux_optimized")}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${isVpsOptimized ? "bg-emerald-600" : "bg-emerald-950 border border-emerald-800"}`}
                        onClick={() => setIsVpsOptimized(!isVpsOptimized)}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transition-transform ${isVpsOptimized ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </div>
                    </section>

                    <section className="md:col-span-2 p-8 bg-black/20 rounded-[2rem] border border-emerald-500/10 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg border-b-4 border-emerald-950">
                          <Bot size={24} />
                        </div>
                        <div>
                          <h5 className="font-black text-emerald-700 text-xs uppercase tracking-tighter">
                            {t("ai_api_key_title")}
                          </h5>
                          <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-black text-emerald-900/60 uppercase tracking-widest hover:text-emerald-500 transition-colors underline-offset-4 hover:underline block cursor-pointer"
                          >
                            {t("ai_api_key_sub")}
                          </a>
                        </div>
                      </div>

                      {!showApiKeyInput ? (
                        <button
                          onClick={() => setShowApiKeyInput(true)}
                          className="font-black text-xs uppercase bg-emerald-500 text-white px-4 py-2 rounded-xl border-b-2 border-emerald-700 hover:-translate-y-1 hover:shadow-lg transition-all active:scale-95"
                        >
                          {t("ai_api_key_btn")}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                          <input
                            type="password"
                            placeholder={t("ai_api_key_placeholder")}
                            value={apiKeyValue}
                            onChange={(e) => setApiKeyValue(e.target.value)}
                            className="bg-black/40 border-2 border-emerald-900/50 rounded-xl px-4 py-2 outline-none focus:border-emerald-500 text-sm text-emerald-100 flex-1 min-w-[250px]"
                          />
                          <button
                            onClick={async () => {
                              const key = apiKeyValue.trim();
                              if (key && key.length > 5) {
                                const res = await fetch("/api/config/env", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({ key }),
                                });
                                if (res.ok) {
                                  alert(t("ai_api_key_success"));
                                  setShowApiKeyInput(false);
                                  setApiKeyValue("");
                                } else alert(t("ai_api_key_error"));
                              } else {
                                alert(t("ai_api_key_invalid"));
                              }
                            }}
                            className="font-black text-xs uppercase bg-emerald-500 text-white px-4 py-2 rounded-xl border-b-2 border-emerald-700 hover:-translate-y-1 hover:shadow-lg transition-all active:scale-95"
                          >
                            {t("ai_api_key_save")}
                          </button>
                          <button
                            onClick={() => setShowApiKeyInput(false)}
                            className="p-2 text-zinc-500 hover:text-emerald-500 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      )}
                    </section>

                    <section className="md:col-span-2 p-8 bg-black/20 rounded-[2rem] border border-blue-500/10 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-blue-500 shadow-lg border-b-4 border-blue-950">
                          <RefreshCw
                            size={24}
                            className={isSystemUpdating ? "animate-spin" : ""}
                          />
                        </div>
                        <div>
                          <h5 className="font-black text-blue-700 text-xs uppercase tracking-tighter">
                            {t("system_update_title")}
                          </h5>
                          <p className="text-[10px] font-black text-blue-900/60 uppercase tracking-widest">
                            {t("system_update_desc")} - Versão Atual: {appVersion}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (isSystemUpdating) return;
                          setIsSystemUpdating(true);
                          try {
                            const res = await fetch("/api/system/update", {
                              method: "POST",
                            });
                            if (res.ok) {
                              alert(
                                "Atualização iniciada. O sistema irá reiniciar em breve.\nUpdate initiated. System will restart shortly.",
                              );
                              setTimeout(() => {
                                window.location.reload();
                              }, 5000);
                            } else {
                              alert("Falha ao atualizar / Update failed");
                              setIsSystemUpdating(false);
                            }
                          } catch (e) {
                            alert("Erro de rede / Network error");
                            setIsSystemUpdating(false);
                          }
                        }}
                        disabled={isSystemUpdating}
                        className={`font-black text-xs uppercase text-white px-4 py-2 rounded-xl border-b-2 transition-all active:scale-95 ${isSystemUpdating ? "bg-blue-800 border-blue-900 opacity-50 cursor-not-allowed" : "bg-blue-500 border-blue-700 hover:-translate-y-1 hover:shadow-lg"}`}
                      >
                        {isSystemUpdating
                          ? t("system_update_running")
                          : t("system_update_btn")}
                      </button>
                    </section>

                    {appConfig && setAppConfig && (
                      <section className="md:col-span-2 p-8 bg-black/20 rounded-[2rem] border border-fuchsia-500/10 flex flex-col gap-6">
                        <div className="flex items-center justify-between p-5 bg-fuchsia-950/20 rounded-2xl border border-fuchsia-500/20">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-fuchsia-500 shadow-lg border-b-4 border-fuchsia-950">
                              <Store size={24} />
                            </div>
                            <div>
                              <h5 className="font-black text-white text-xs uppercase tracking-tighter">
                                Portal Web Público
                              </h5>
                              <p className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest leading-none mt-1">
                                Sincronizado com Store & Auth
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${appConfig.storeEnabled !== false ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}
                            >
                              <div
                                className={`w-1 h-1 rounded-full ${appConfig.storeEnabled !== false ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}
                              />
                              {appConfig.storeEnabled !== false
                                ? "Online"
                                : "Offline"}
                            </div>
                            <button
                              onClick={() =>
                                setAppConfig({
                                  ...appConfig,
                                  storeEnabled:
                                    appConfig.storeEnabled === false,
                                })
                              }
                              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center justify-start rounded-full transition-all duration-300 focus:outline-none ring-2 ring-offset-2 ring-offset-black ${appConfig.storeEnabled !== false ? "bg-fuchsia-600 ring-fuchsia-500/20" : "bg-zinc-700 ring-zinc-700/20"}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out ${appConfig.storeEnabled !== false ? "translate-x-6" : "translate-x-1"}`}
                              />
                            </button>
                          </div>
                        </div>

                        {appConfig.storeEnabled !== false && (
                          <div className="p-5 bg-black/40 rounded-2xl border border-fuchsia-900/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black uppercase text-fuchsia-400 tracking-widest flex items-center gap-2">
                                <Settings size={12} /> Configurações do Portal
                              </p>
                              <button
                                onClick={() => window.open("/site", "_blank")}
                                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-1.5"
                              >
                                <ExternalLink size={10} /> Visitar Site
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                                  Público Alvo / Estilo
                                </label>
                                <select
                                  value={
                                    appConfig.familyMode ? "family" : "pro"
                                  }
                                  onChange={(e) =>
                                    setAppConfig({
                                      ...appConfig,
                                      familyMode: e.target.value === "family",
                                    })
                                  }
                                  className="w-full bg-zinc-900 border-2 border-white/5 rounded-xl px-3 py-2.5 text-[10px] uppercase text-white font-black outline-none focus:border-fuchsia-500"
                                >
                                  <option value="family">
                                    Aventura / Amigável (Family Friendly)
                                  </option>
                                  <option value="pro">
                                    Pro / Hardcore / PvP
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="p-4 bg-zinc-950/50 rounded-2xl border border-white/5 flex items-start gap-4">
                          <div className="mt-1 flex-shrink-0 bg-zinc-900 p-2 rounded-xl text-zinc-600 border-b-2 border-zinc-950">
                            <Info size={16} />
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                              Estimativa de Performance
                            </div>
                            <p className="text-[9px] text-zinc-500 font-medium uppercase leading-relaxed tracking-wider">
                              {appConfig.storeEnabled !== false
                                ? "Site Ativo: ~25-35MB RAM consumida. CPU oscila apenas durante acessos."
                                : "Site Offline: Modo de economia total. <2MB RAM (Apenas estáticos)."}
                            </p>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>

                  <div className="mt-auto flex justify-center">
                    <CreeperPaper className="relative opacity-20 scale-150 rotate-0 bottom-0 left-0" />
                  </div>
                </motion.div>
              )}

              {activeTab === "ai" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#0b251a]/80 backdrop-blur-md rounded-[2.5rem] border-2 border-emerald-900 shadow-sm p-4 lg:p-8 min-h-[600px] lg:min-h-0 h-full flex flex-col relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-emerald-900/50 rounded-2xl border-2 border-emerald-500/30 text-emerald-400">
                        <Bot size={32} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
                          Assistente
                        </h2>
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">
                          Inteligência Creeper (•◡•)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4"
                  >
                    <div className="flex gap-2 bg-emerald-950/50 p-1 rounded-xl">
                      <button
                        onClick={() => { setAiProvider("gemini"); setAiChat([]); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${aiProvider === "gemini" ? "bg-emerald-600 text-white" : "text-emerald-500 hover:text-emerald-400"}`}
                      >
                        Gemini
                      </button>
                      <button
                        onClick={() => { setAiProvider("openai"); setAiChat([]); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${aiProvider === "openai" ? "bg-emerald-600 text-white" : "text-emerald-500 hover:text-emerald-400"}`}
                      >
                        Outros
                      </button>
                      <button
                        onClick={() => { setAiProvider("local"); setAiChat([]); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${aiProvider === "local" ? "bg-emerald-600 text-white" : "text-emerald-500 hover:text-emerald-400"}`}
                      >
                        Local AI
                      </button>
                    </div>
                    {aiProvider === "local" && (
                      <input
                        type="text"
                        value={aiEndpoint}
                        onChange={(e) => setAiEndpoint(e.target.value)}
                        placeholder="http://127.0.0.1:1234/v1/chat/completions"
                        className="bg-emerald-950/50 border border-emerald-900 rounded-xl px-3 py-1.5 text-xs text-emerald-200 outline-none focus:border-emerald-500 flex-1 min-w-[200px]"
                      />
                    )}
                    <button
                      onClick={() => setAiChat([])}
                      className="px-3 py-1.5 bg-red-900/50 hover:bg-red-800 text-red-400 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ml-auto"
                      title="Apagar Memória do Chat"
                    >
                      <RefreshCw size={14} /> Memória
                    </button>
                  </div>

                  <div
                    className="flex-1 overflow-y-auto pr-4 custom-scrollbar mb-6 space-y-4"
                    ref={scrollRef}
                  >
                    {aiChat.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <Bot size={64} className="mb-4 text-emerald-500" />
                        <p className="font-black italic uppercase tracking-tighter text-xl">
                          Como posso ajudar?
                        </p>
                        <p className="text-xs font-bold uppercase tracking-widest mt-2 max-w-xs">
                          Pergunte sobre erros, comandos ou como otimizar seu
                          servidor.
                        </p>
                      </div>
                    )}
                    {aiChat.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl border-2 ${msg.role === "user" ? "bg-emerald-900 shadow-sm border-emerald-700 text-white rounded-tr-none" : "bg-black/40 border-emerald-900 text-emerald-100 rounded-tl-none font-mono text-sm shadow-inner"}`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    {aiLoading && (
                      <div className="flex justify-start">
                        <div className="bg-black/40 border-2 border-emerald-900 text-emerald-500 p-4 rounded-2xl rounded-tl-none animate-pulse italic font-black text-xs uppercase tracking-widest">
                          Creeper está pensando... ( ੭•͈ω•͈)੭
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleAskAI} className="relative">
                    <input
                      className="w-full bg-black/60 border-2 border-emerald-900 rounded-2xl px-6 py-5 text-emerald-50 font-medium outline-none focus:border-emerald-500 transition-all shadow-inner pr-16"
                      placeholder="Pergunte qualquer coisa sobre seu servidor..."
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!aiInput.trim() || aiLoading}
                      className="absolute right-3 top-3 w-12 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg border-b-4 border-emerald-800 transition-all flex items-center justify-center disabled:opacity-50 disabled:grayscale"
                    >
                      <Send size={24} />
                    </button>
                  </form>
                </motion.div>
              )}

              {activeTab === "console" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#0b251a]/80 backdrop-blur-md rounded-3xl border-2 border-emerald-900 shadow-sm p-4 lg:p-8 min-h-[600px] lg:min-h-0 h-full flex flex-col relative overflow-hidden group"
                >
                  <div className="absolute -top-10 -right-10 text-emerald-950 transition-colors pointer-events-none opacity-20">
                    <Flower2 size={240} />
                  </div>

                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-emerald-900/50 rounded-2xl text-emerald-400">
                        <Terminal size={32} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
                          Terminal
                        </h2>
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                          Conectado ao Cubo (•◡•)
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearLogs}
                      className="px-4 py-2 bg-emerald-900/40 hover:bg-emerald-800 text-emerald-400 font-bold rounded-xl border border-emerald-800 flex items-center gap-2 transition-colors text-xs"
                    >
                      <Trash2 size={14} /> Limpar Logs
                    </button>
                  </div>

                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto pr-6 space-y-1.5 custom-scrollbar font-mono text-[11px] p-6 bg-black/80 rounded-2xl border border-emerald-900/50 shadow-inner tech-grid"
                  >
                    {serverState.logs.length === 0 && (
                      <div className="text-emerald-900 animate-pulse italic">
                        Aguardando sinais vitais...
                      </div>
                    )}
                    {serverState.logs.map((log, i) => (
                      <div
                        key={i}
                        className="flex gap-4 group hover:bg-emerald-500/5 transition-colors"
                      >
                        <span className="text-emerald-900 select-none font-bold tabular-nums w-8 text-right opacity-50 group-hover:opacity-100 italic">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <p
                          className={`leading-relaxed break-all ${
                            log.includes("[ERROR]") || log.includes("Exception")
                              ? "text-red-400 font-bold bg-red-950/20 px-1"
                              : log.includes("[SUCCESS]") ||
                                  log.includes("Done") ||
                                  log.includes("For help, type")
                                ? "text-emerald-400 font-black"
                                : log.includes("[WARN]")
                                  ? "text-amber-500 italic"
                                  : log.startsWith(">")
                                    ? "text-emerald-100 font-bold border-l-2 border-emerald-500 pl-2"
                                    : "text-emerald-500/80"
                          }`}
                        >
                          {log}
                        </p>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={sendCommand}
                    className="mt-8 flex gap-4 relative z-10"
                  >
                    <div className="flex-1 bg-black/40 rounded-2xl px-6 py-4 flex items-center gap-4 border-2 border-emerald-900 focus-within:border-emerald-500 transition-all">
                      <span className="text-emerald-500 font-black text-lg">
                        ❯
                      </span>
                      <input
                        className="flex-1 bg-transparent border-none outline-none text-emerald-50 placeholder:text-emerald-900 font-black text-md"
                        placeholder="Mande um comando mágico..."
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                      />
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === "files" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#0b251a]/80 backdrop-blur-md rounded-3xl border-2 border-emerald-900 shadow-sm p-4 lg:p-10 min-h-[600px] lg:min-h-0 h-full flex flex-col relative overflow-hidden"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onPaste={handlePaste}
                  onKeyDown={(e) => {
                    /* Support common paste shortcut if focus is not on an input */
                    if (
                      e.ctrlKey &&
                      e.key === "v" &&
                      !(
                        e.target instanceof HTMLInputElement ||
                        e.target instanceof HTMLTextAreaElement
                      )
                    ) {
                      /* Handled by onPaste */
                    }
                  }}
                  tabIndex={0}
                >
                  {editingFile ? (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setEditingFile(null)}
                            className="p-3 bg-emerald-950 rounded-2xl text-emerald-400 hover:bg-emerald-900"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <div>
                            <h3 className="font-black text-white tracking-tighter italic uppercase">
                              Editor
                            </h3>
                            <p className="text-emerald-500 text-xs font-bold">
                              {editingFile.path}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingFile(null)}
                            className="p-4 rounded-2xl font-black text-xs text-emerald-500 hover:bg-emerald-950 transition-all"
                          >
                            CANCELAR
                          </button>
                          <button
                            onClick={saveFile}
                            className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-950 transition-all active:scale-95 border-b-4 border-emerald-800"
                          >
                            SALVAR
                          </button>
                        </div>
                      </div>
                      <textarea
                        className="flex-1 w-full bg-black/60 border-2 border-emerald-900 rounded-3xl p-8 font-mono text-sm text-emerald-50 outline-none focus:border-emerald-500 transition-all resize-none shadow-inner"
                        value={editingFile.content}
                        onChange={(e) =>
                          setEditingFile({
                            ...editingFile,
                            content: e.target.value,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-emerald-900/50 rounded-2xl border-2 border-emerald-500/30 text-emerald-400">
                            <Database size={32} />
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
                              Arquivos
                            </h2>
                            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">
                              {currentFolder && (
                                <button
                                  onClick={() =>
                                    setCurrentFolder(
                                      currentFolder
                                        .split("/")
                                        .slice(0, -1)
                                        .join("/"),
                                    )
                                  }
                                  className="hover:text-emerald-300 transition-colors uppercase"
                                >
                                  {servers.find((s) => s.id === currentServerId)
                                    ?.name || "Servidor"}
                                </button>
                              )}
                              {!currentFolder && (
                                <span className="uppercase">
                                  {servers.find((s) => s.id === currentServerId)
                                    ?.name || "Servidor"}
                                </span>
                              )}
                              {currentFolder && (
                                <span className="opacity-50">
                                  {"/"} {currentFolder}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleBackup}
                            className="px-6 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-amber-950 transition-all active:scale-95 border-b-4 border-amber-800 flex items-center gap-2"
                            title="Fazer Backup Agora"
                          >
                            <Sparkles size={16} />
                            BACKUP
                          </button>
                          <button
                            onClick={() =>
                              setShowDownloadInput(!showDownloadInput)
                            }
                            className={`px-6 py-4 rounded-2xl font-black text-xs transition-all border-b-4 flex items-center gap-2 ${showDownloadInput ? "bg-red-900/50 text-red-500 border-red-900" : "bg-emerald-900/50 text-emerald-500 border-emerald-950 hover:bg-emerald-900"}`}
                          >
                            <Globe size={16} />
                            {showDownloadInput ? "CANCELAR" : "BAIXAR URL"}
                          </button>
                          <label className="cursor-pointer px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-950 transition-all active:scale-95 border-b-4 border-emerald-800 flex items-center gap-2">
                            <Upload size={16} />
                            UPLOAD
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>
                          <button
                            onClick={createFolder}
                            className="px-6 py-4 bg-emerald-900/50 hover:bg-emerald-900 text-emerald-400 rounded-2xl font-black text-xs shadow-lg shadow-emerald-950/20 transition-all active:scale-95 border-b-4 border-emerald-950 flex items-center gap-2"
                            title="Nova Pasta"
                          >
                            <Folder size={16} />
                            NOVA PASTA
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {showDownloadInput && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              marginBottom: 24,
                            }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 bg-emerald-900/20 border-2 border-emerald-500 rounded-3xl flex gap-4">
                              <input
                                className="flex-1 bg-black/40 border-2 border-emerald-900 rounded-xl px-4 py-3 text-sm text-emerald-50 font-black outline-none focus:border-emerald-500 transition-all font-mono"
                                placeholder="Cole aqui o link direto do arquivo (.jar, .zip, etc)"
                                value={downloadUrl}
                                onChange={(e) => setDownloadUrl(e.target.value)}
                              />
                              <button
                                onClick={handleGeneralDownload}
                                className="px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs transition-all shadow-lg border-b-4 border-emerald-800 active:scale-95"
                              >
                                BAIXAR AGORA
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar bg-black/40 rounded-3xl border border-emerald-900/50 p-6 shadow-inner relative">
                        <div className="absolute top-4 right-4 text-[8px] font-black text-emerald-900 uppercase tracking-widest pointer-events-none">
                          DICA: ARRASTE OU COLE (CTRL+V) ARQUIVOS AQUI
                        </div>
                        {uploadQueue.length > 0 && (
                          <div className="mb-4 space-y-2 mt-4 relative z-20">
                            {uploadQueue.map((task) => (
                              <div
                                key={task.id}
                                className="bg-emerald-950/50 p-4 rounded-xl border border-emerald-900 flex flex-col gap-2 relative overflow-hidden"
                              >
                                <div className="flex items-center justify-between text-xs font-black z-10 w-full relative">
                                  <span className="text-emerald-300 truncate pr-4">
                                    {task.name}
                                  </span>
                                  <span
                                    className={
                                      task.status === "error"
                                        ? "text-red-500 flex-shrink-0"
                                        : task.status === "done"
                                          ? "text-emerald-400 flex-shrink-0"
                                          : "text-emerald-500 flex-shrink-0"
                                    }
                                  >
                                    {task.status === "error"
                                      ? "ERRO"
                                      : task.status === "done"
                                        ? "CONCLUÍDO"
                                        : `${task.progress}%`}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden z-10 w-full relative">
                                  <div
                                    className={`absolute top-0 left-0 h-full transition-all duration-300 ${task.status === "error" ? "bg-red-500" : "bg-emerald-500"}`}
                                    style={{ width: `${task.progress}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-2 mt-4 relative z-10">
                          {fileList
                            .sort(
                              (a, b) =>
                                (b.isDirectory ? 1 : 0) -
                                (a.isDirectory ? 1 : 0),
                            )
                            .map((item, i) => (
                              <div
                                key={i}
                                className="group flex items-center justify-between p-4 bg-emerald-950/30 hover:bg-emerald-900/50 rounded-2xl transition-all border-2 border-emerald-900 hover:border-emerald-500 cursor-pointer"
                                onClick={() =>
                                  item.isDirectory
                                    ? setCurrentFolder(
                                        currentFolder
                                          ? `${currentFolder}/${item.name}`
                                          : item.name,
                                      )
                                    : openFile(
                                        currentFolder
                                          ? `${currentFolder}/${item.name}`
                                          : item.name,
                                      )
                                }
                              >
                                <div className="flex items-center gap-4 min-w-0">
                                  <div
                                    className={`p-2 rounded-xl border-2 ${item.isDirectory ? "bg-emerald-900/50 border-emerald-500/30 text-emerald-400" : "bg-emerald-950 border-emerald-900 text-emerald-600"}`}
                                  >
                                    {item.isDirectory ? (
                                      <Folder size={20} />
                                    ) : (
                                      <FileText size={20} />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-black text-white truncate tracking-tight text-sm">
                                      {item.name}
                                    </p>
                                    {!item.isDirectory && (
                                      <p className="text-[10px] text-emerald-700 font-black uppercase">
                                        {(item.size / 1024).toFixed(1)} KB
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                  {!item.isDirectory && (
                                    <a
                                      href={`/api/server/files/download?serverId=${currentServerId}&path=${encodeURIComponent(currentFolder ? `${currentFolder}/${item.name}` : item.name)}`}
                                      onClick={(e) => e.stopPropagation()}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-3 text-emerald-900 hover:text-emerald-400 font-black"
                                      title="Baixar Arquivo"
                                    >
                                      <Download size={18} />
                                    </a>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      renameFile(
                                        currentFolder
                                          ? `${currentFolder}/${item.name}`
                                          : item.name,
                                      );
                                    }}
                                    className="p-3 text-emerald-900 hover:text-emerald-400 font-black"
                                    title="Renomear"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteFile(
                                        currentFolder
                                          ? `${currentFolder}/${item.name}`
                                          : item.name,
                                      );
                                    }}
                                    className="p-3 text-emerald-900 hover:text-red-500 font-black"
                                    title="Deletar"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            ))}

                          {fileList.length === 0 &&
                            uploadQueue.length === 0 && (
                              <div className="h-64 flex flex-col items-center justify-center text-emerald-900 gap-4">
                                <Moon size={48} className="opacity-20" />
                                <p className="font-black">Pasta vazia...</p>
                                <p className="text-xs font-black uppercase tracking-widest">
                                  Arraste arquivos aqui!
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Credits */}
        <footer className="mt-8 py-4 text-center">
          <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur px-6 py-3 rounded-full border-2 border-emerald-900 shadow-sm text-emerald-800 font-black text-xs uppercase tracking-widest">
            {t("vps_hosting")}{" "}
            <span className="text-emerald-500">LINUX POWER</span>{" "}
            <Sparkles
              size={14}
              fill="currentColor"
              className="text-emerald-500 animate-pulse"
            />
          </div>
        </footer>
      </div>
    </div>
  );
}

function CircularBtn({
  icon,
  color,
  onClick,
  disabled,
  tooltip,
}: {
  icon: React.ReactNode;
  color: "emerald" | "pink" | "blood";
  onClick: () => void;
  disabled: boolean;
  tooltip: string;
}) {
  const styles = {
    emerald:
      "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950 border-emerald-800",
    pink: "bg-red-600 hover:bg-red-500 shadow-red-950 border-red-800",
    blood: "bg-red-950 hover:bg-red-900 shadow-red-950 border-red-950",
  }[color];

  return (
    <div className="relative group/btn">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all active:scale-95 shadow-xl border-b-8 disabled:opacity-10 disabled:grayscale disabled:scale-100 disabled:border-b-0 ${styles}`}
      >
        {icon}
      </button>
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-emerald-400 text-[10px] font-black px-3 py-1 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-emerald-900/50">
        {tooltip}
      </div>
    </div>
  );
}

function MenuLink({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-w-fit lg:w-full flex-shrink-0 flex items-center gap-3 lg:gap-4 px-5 py-3 lg:py-4 rounded-3xl font-black text-xs lg:text-sm transition-all relative overflow-hidden group snap-start ${active ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 lg:translate-x-2" : "bg-black/10 lg:bg-transparent text-emerald-700 hover:bg-emerald-950/30 hover:text-emerald-400 border lg:border-transparent border-emerald-900/10"}`}
    >
      <span
        className={
          active ? "text-white" : "group-hover:scale-110 transition-transform"
        }
      >
        {icon}
      </span>
      {label}
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="hidden lg:block absolute right-4 w-2 h-2 bg-white rounded-full"
        />
      )}
    </button>
  );
}

function MiniStat({
  icon,
  label,
  value,
  percent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  percent?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-[#0b251a]/80 border-2 border-emerald-900 rounded-3xl p-5 flex flex-col gap-3 hover:border-emerald-500/50 transition-all shadow-lg group cursor-default h-full"
    >
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-emerald-950 rounded-2xl flex items-center justify-center group-hover:bg-emerald-900 transition-colors border border-emerald-900/50">
          {icon}
        </div>
        <div>
          <div className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">
            {label}
          </div>
          <div className="font-black text-emerald-50 text-xl tracking-tighter">
            {value}
          </div>
        </div>
      </div>
      {percent !== undefined && (
        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-emerald-900/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: percent + "%" }}
            className={`h-full ${percent > 80 ? "bg-red-500" : percent > 50 ? "bg-amber-500" : "bg-emerald-500"}`}
          />
        </div>
      )}
    </motion.div>
  );
}
