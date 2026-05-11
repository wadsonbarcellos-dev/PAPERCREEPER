import fs from 'fs';
import path from 'path';

async function run() {
  const worldPath = path.join(process.cwd(), 'world2');
  if(!fs.existsSync(worldPath)) fs.mkdirSync(worldPath);
  if(!fs.existsSync(path.join(worldPath, "region"))) fs.mkdirSync(path.join(worldPath, "region"));
  try {
    const AnvilPkg = await import("prismarine-provider-anvil");
    const ChunkPkg = await import("prismarine-chunk");
    const registryAll = await import("prismarine-registry");
    const registry = registryAll.default ? registryAll.default("1.20.1") : registryAll("1.20.1");

    const Anvil = AnvilPkg.default ? AnvilPkg.default.Anvil : AnvilPkg.Anvil;
    const AnvilWorld = Anvil("1.20.1");
    const worldProvider = new AnvilWorld(path.join(worldPath, "region"));
    
    const PrisChunk = ChunkPkg.default ? ChunkPkg.default(registry) : ChunkPkg(registry);
    const chunk = new PrisChunk();
    chunk.setBlockStateId({x:0, y:-60, z:0}, 1);
    
    await worldProvider.save(0, 0, {
        chunk: chunk.dump(),
        bitmaps: chunk.dumpBitmaps ? chunk.dumpBitmaps() : undefined,
        light: chunk.dumpLight ? chunk.dumpLight() : undefined
    });
    console.log("saved!");
    
    const chunkData = await worldProvider.load(0, 0);
    console.log("load keys", chunkData ? "SUCCESS" : "FAIL");

  } catch(e) {
    console.error(e);
  }
}
run();
