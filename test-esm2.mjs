async function test() {
   try {
      const Chunk = await import('prismarine-chunk');
      const registryAll = await import('prismarine-registry');
      const registry = registryAll.default("1.20.1");
      const PrisChunk = Chunk.default ? Chunk.default(registry) : Chunk(registry);
      const chunk = new PrisChunk(null);
      console.log("Chunk is loaded", !!chunk);
   } catch(e) {
       console.error(e);
   }
}
test();
