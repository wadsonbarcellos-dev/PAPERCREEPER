import https from "https";
https.get("https://raw.githubusercontent.com/wadsonbr2/papermu/main/server.ts", (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => console.log(data));
});
