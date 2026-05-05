import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sky, Stars, Edges } from '@react-three/drei';

function Voxel({ position, color, onSelect }: { position: [number, number, number], color: string, onSelect?: (pos: [number, number, number]) => void }) {
  const ref = useRef<any>(null);
  const [hovered, setHover] = useState(false);
  return (
    <Box
      ref={ref}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(position);
      }}
      args={[1, 1, 1]}
    >
      <meshStandardMaterial color={hovered ? 'hotpink' : color} />
      <Edges linewidth={1} threshold={15} color="black" />
    </Box>
  );
}

export default function MapEditor3D() {
  const [blocks, setBlocks] = useState([
    { pos: [0, 0, 0] as [number, number, number], color: 'grass' },
    { pos: [1, 0, 0] as [number, number, number], color: 'dirt' },
    { pos: [2, 0, 0] as [number, number, number], color: 'stone' },
    { pos: [0, 1, 0] as [number, number, number], color: 'grass' },
  ]);

  const [wandMode, setWandMode] = useState<'none'|'pos1'|'pos2'>('none');
  const [pos1, setPos1] = useState<[number, number, number] | null>(null);
  const [pos2, setPos2] = useState<[number, number, number] | null>(null);
  const [clipboard, setClipboard] = useState<{pos: [number, number, number], color: string}[]>([]);

  const addBlock = () => {
    setBlocks([...blocks, { pos: [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)], color: 'stone' }]);
  };

  const toggleWand = () => {
    setWandMode(wandMode === 'none' ? 'pos1' : 'none');
    if (wandMode !== 'none') {
      setPos1(null);
      setPos2(null);
    }
  };

  const handleSelect = (pos: [number, number, number]) => {
     if (wandMode === 'pos1') {
       setPos1(pos);
       setWandMode('pos2');
     } else if (wandMode === 'pos2') {
       setPos2(pos);
       setWandMode('none');
     }
  };

  const handleCopy = () => {
    if (!pos1 || !pos2) {
      alert("Selecione a Posição 1 e 2 usando o //wand");
      return;
    }
    const minX = Math.min(pos1[0], pos2[0]);
    const maxX = Math.max(pos1[0], pos2[0]);
    const minY = Math.min(pos1[1], pos2[1]);
    const maxY = Math.max(pos1[1], pos2[1]);
    const minZ = Math.min(pos1[2], pos2[2]);
    const maxZ = Math.max(pos1[2], pos2[2]);
    
    const selected = blocks.filter(b => 
      b.pos[0] >= minX && b.pos[0] <= maxX &&
      b.pos[1] >= minY && b.pos[1] <= maxY &&
      b.pos[2] >= minZ && b.pos[2] <= maxZ
    );
    
    const offsetSelected = selected.map(b => ({
       pos: [b.pos[0] - pos1[0], b.pos[1] - pos1[1], b.pos[2] - pos1[2]] as [number, number, number],
       color: b.color
    }));
    setClipboard(offsetSelected);
    alert(`Copiado ${offsetSelected.length} blocos!`);
  };

  const handlePaste = () => {
     if (clipboard.length === 0) {
        alert("Clipboard vazio!"); return;
     }
     if (!pos1) {
        alert("Selecione pelo menos a Posição 1 (origem) com //wand!"); return;
     }
     const newBlocks = clipboard.map(b => ({
       pos: [b.pos[0] + pos1[0], b.pos[1] + pos1[1], b.pos[2] + pos1[2]] as [number, number, number],
       color: b.color
     }));
     
     // merge removing overlaps
     const merged = [...blocks];
     newBlocks.forEach(nb => {
        const idx = merged.findIndex(mb => mb.pos[0] === nb.pos[0] && mb.pos[1] === nb.pos[1] && mb.pos[2] === nb.pos[2]);
        if (idx >= 0) merged[idx] = nb;
        else merged.push(nb);
     });
     
     setBlocks(merged);
     alert(`Colado ${newBlocks.length} blocos em ${pos1.join(',')}!`);
  };

  const handleExportSchematic = () => {
     if (clipboard.length === 0) {
        alert("Clipboard vazio! Copie uma área primeiro usando //copy");
        return;
     }
     const data = JSON.stringify(clipboard, null, 2);
     const blob = new Blob([data], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `exported_schematic_${Date.now()}.json`;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     URL.revokeObjectURL(url);
     alert("Schematic exportada!");
  };

  const handleImportSchematic = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
     const reader = new FileReader();
     reader.onload = (ev) => {
        try {
           const imported = JSON.parse(ev.target?.result as string);
           if (Array.isArray(imported)) {
             setClipboard(imported);
             alert(`Schematic importada! (${imported.length} blocos). Use //paste para colocar no mundo.`);
           } else {
             alert('Formato inválido.');
           }
        } catch (err) {
           alert("Erro ao ler o arquivo JSON schematic.");
        }
     };
     reader.readAsText(file);
  };

  return (
    <div className="w-full h-full relative border-4 border-emerald-900 rounded-[2rem] overflow-hidden bg-zinc-950 flex flex-col mt-4">
       <div className="absolute top-0 left-0 w-full z-10 bg-emerald-950/90 p-3 flex gap-2 border-b-2 border-emerald-900 shadow-md flex-wrap">
          <button onClick={addBlock} className="px-3 py-1 bg-emerald-600 text-[10px] font-black uppercase rounded text-white hover:bg-emerald-500 shadow-sm border-b-2 border-emerald-800 active:translate-y-[2px] active:border-b-0">+ Adicionar</button>
          <button onClick={toggleWand} className={`px-3 py-1 ${wandMode !== 'none' ? 'bg-red-800 text-red-200' : 'bg-zinc-800 text-emerald-400'} text-[10px] font-black uppercase rounded hover:bg-zinc-700 shadow-sm border-b-2 border-zinc-950 active:translate-y-[2px] active:border-b-0`}>{wandMode !== 'none' ? 'Cancel Wand' : '//wand'}</button>
          <button onClick={handleCopy} className="px-3 py-1 bg-zinc-800 text-[10px] font-black uppercase rounded text-emerald-400 hover:bg-zinc-700 shadow-sm border-b-2 border-zinc-950 active:translate-y-[2px] active:border-b-0">//copy</button>
          <button onClick={handlePaste} className="px-3 py-1 bg-zinc-800 text-[10px] font-black uppercase rounded text-emerald-400 hover:bg-zinc-700 shadow-sm border-b-2 border-zinc-950 active:translate-y-[2px] active:border-b-0">//paste</button>
          <button onClick={handleExportSchematic} className="px-3 py-1 bg-amber-600 text-[10px] font-black uppercase rounded text-white hover:bg-amber-500 shadow-sm border-b-2 border-amber-800 active:translate-y-[2px] active:border-b-0">Export</button>
          <label className="px-3 py-1 cursor-pointer bg-amber-600 text-[10px] font-black uppercase rounded text-white hover:bg-amber-500 shadow-sm border-b-2 border-amber-800 active:translate-y-[2px] active:border-b-0">
             Import
             <input type="file" accept=".json" className="hidden" onChange={handleImportSchematic} />
          </label>
          {wandMode !== 'none' && (
             <span className="ml-2 text-red-400 text-[10px] font-black uppercase self-center animate-pulse">Selecione {wandMode === 'pos1' ? 'Posição 1' : 'Posição 2'}</span>
          )}
          <span className="ml-auto text-emerald-400 font-black text-[10px] self-center pr-2 tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            MCEDIT VIRTUAL ENGINE
          </span>
       </div>
       <div className="flex-1 w-full h-[500px]">
         <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Sky sunPosition={[100, 20, 100]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <OrbitControls makeDefault />
            <gridHelper args={[20, 20, 0x444444, 0x222222]} />
            
            {blocks.map((b, i) => (
              <Voxel key={i} position={b.pos} color={b.color === 'grass' ? '#4ade80' : b.color === 'dirt' ? '#854d0e' : '#a1a1aa'} onSelect={handleSelect} />
            ))}
            
            {pos1 && <Box position={pos1} args={[1.05, 1.05, 1.05]}><meshBasicMaterial color="red" wireframe /></Box>}
            {pos2 && <Box position={pos2} args={[1.05, 1.05, 1.05]}><meshBasicMaterial color="blue" wireframe /></Box>}
         </Canvas>
       </div>
    </div>
  );
}
