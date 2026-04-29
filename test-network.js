async function test() {
  try {
    console.log("Testing connection to api.playit.gg...");
    const res = await fetch("https://api.playit.gg/claim/setup", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
     });
    console.log("Status:", res.status);
    const body = await res.text();
    console.log("Body:", body);
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}
test();
