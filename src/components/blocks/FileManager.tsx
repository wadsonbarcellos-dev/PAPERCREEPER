import React from "react";
import { Folder, FileText, ChevronLeft, Upload, Trash2, Download, Edit2, Search, Plus, FileCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FileEntry {
  name: string;
  type: "file" | "dir";
  size?: number;
  path: string;
}

interface FileManagerProps {
  files: FileEntry[];
  currentPath: string;
  onNavigate: (path: string) => void;
  onEdit: (file: FileEntry) => void;
  onDelete: (path: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateFile: () => void;
  onCreateDir: () => void;
  onDownload: (file: FileEntry) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  currentPath,
  onNavigate,
  onEdit,
  onDelete,
  onUpload,
  onCreateFile,
  onCreateDir,
  onDownload
}) => {
  const [search, setSearch] = React.useState("");

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const goUp = () => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    onNavigate("/" + parts.join("/"));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {currentPath !== "/" && (
            <button onClick={goUp} className="p-2 bg-emerald-950 rounded-lg text-emerald-400 hover:bg-emerald-900 transition-colors">
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-900/50 flex-1 sm:flex-none">
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest truncate max-w-[200px] block">
                {currentPath}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
           <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900" size={14} />
              <input 
                className="w-full sm:w-48 bg-emerald-950/20 border border-emerald-900/50 rounded-xl pl-9 pr-4 py-2 text-xs text-emerald-100 outline-none focus:border-emerald-500 transition-all"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
           <label className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer transition-all shadow-lg border-b-4 border-emerald-800 active:scale-95">
              <Upload size={18} />
              <input type="file" className="hidden" onChange={onUpload} multiple />
           </label>
           <button onClick={onCreateFile} className="p-2.5 bg-emerald-900/40 text-emerald-400 border border-emerald-900 rounded-xl hover:bg-emerald-900 transition-all">
              <Plus size={18} />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 rounded-2xl border border-emerald-900/50 p-2">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            <AnimatePresence mode="popLayout">
               {filteredFiles.map((file) => (
                  <motion.div
                    key={file.path}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-zinc-900/40 hover:bg-emerald-900/20 border border-zinc-800 hover:border-emerald-700/50 rounded-xl p-3 flex flex-col gap-3 transition-all cursor-pointer relative"
                    onClick={() => file.type === "dir" ? onNavigate(file.path) : onEdit(file)}
                  >
                     <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg ${file.type === "dir" ? "bg-amber-900/20 text-amber-500" : "bg-blue-900/20 text-blue-500"}`}>
                           {file.type === "dir" ? <Folder size={20} /> : <FileText size={20} />}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={(e) => { e.stopPropagation(); onDownload(file); }} className="p-1.5 hover:bg-emerald-500 rounded text-emerald-500 hover:text-white transition-colors"><Download size={14} /></button>
                           <button onClick={(e) => { e.stopPropagation(); onDelete(file.path); }} className="p-1.5 hover:bg-red-500 rounded text-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
                        </div>
                     </div>
                     <div className="min-w-0">
                        <p className="text-[11px] font-black text-zinc-100 uppercase truncate tracking-tight">{file.name}</p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{file.type === "dir" ? "Pasta" : `${(file.size || 0).toLocaleString()} bytes`}</p>
                     </div>
                  </motion.div>
               ))}
               {filteredFiles.length === 0 && (
                  <div className="col-span-full py-12 text-center text-zinc-600 italic uppercase font-black text-xs tracking-widest">
                     Nenhum recurso encontrado neste setor
                  </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};
