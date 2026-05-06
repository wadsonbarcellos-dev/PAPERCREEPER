async function test() {
   try {
      const Anvil = await import('prismarine-provider-anvil');
      const Chunk = await import('prismarine-chunk');
      const registryAll = await import('prismarine-registry');
      const registry = registryAll.default("1.20.1");
      const realAnvil = Anvil.Anvil ? Anvil.Anvil("1.20.1") : Anvil.default.Anvil("1.20.1");
      console.log("Success", !!realAnvil, !!Chunk);
   } catch(e) {
      console.error(e);
   }
}
test();
