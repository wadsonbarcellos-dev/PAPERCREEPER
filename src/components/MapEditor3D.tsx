import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sky, Stars } from '@react-three/drei';

function Voxel({ position, color }: { position: [number, number, number], color: string }) {
  const ref = useRef<any>(null);
  const [hovered, setHover] = useState(false);
  return (
    <Box
      ref={ref}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
      args={[1, 1, 1]}
    >
      <meshStandardMaterial color={hovered ? 'hotpink' : color} />
    </Box>
  );
}

export default function MapEditor3D() {
  const [blocks, setBlocks] = useState([
    { pos: [0, 0, 0] as [number, number, number], color: 'grass' },
    { pos: [1, 0, 0] as [number, number, number], color: 'dirt' },
  ]);

  const addBlock = () => {
    setBlocks([...blocks, { pos: [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)], color: 'stone' }]);
  };

  return (
    <div className="w-full h-full relative border-4 border-emerald-900 rounded-[2rem] overflow-hidden bg-zinc-950 flex flex-col mt-4">
       <div className="absolute top-0 left-0 w-full z-10 bg-emerald-950/90 p-3 flex gap-2 border-b-2 border-emerald-900 shadow-md">
          <button onClick={addBlock} className="px-3 py-1 bg-emerald-600 text-[10px] font-black uppercase rounded text-white hover:bg-emerald-500 shadow-sm border-b-2 border-emerald-800 active:translate-y-[2px] active:border-b-0">+ Adicionar</button>
          <button className="px-3 py-1 bg-zinc-800 text-[10px] font-black uppercase rounded text-emerald-400 hover:bg-zinc-700 shadow-sm border-b-2 border-zinc-950 active:translate-y-[2px] active:border-b-0">//wand</button>
          <button className="px-3 py-1 bg-zinc-800 text-[10px] font-black uppercase rounded text-emerald-400 hover:bg-zinc-700 shadow-sm border-b-2 border-zinc-950 active:translate-y-[2px] active:border-b-0">//copy</button>
          <button className="px-3 py-1 bg-zinc-800 text-[10px] font-black uppercase rounded text-emerald-400 hover:bg-zinc-700 shadow-sm border-b-2 border-zinc-950 active:translate-y-[2px] active:border-b-0">//paste</button>
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
              <Voxel key={i} position={b.pos} color={b.color === 'grass' ? '#4ade80' : b.color === 'dirt' ? '#854d0e' : '#a1a1aa'} />
            ))}
         </Canvas>
       </div>
    </div>
  );
}
