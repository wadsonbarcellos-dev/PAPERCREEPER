fetch("http://localhost:3000/api/server/files/list?serverId=fake&folder=plugins/cache").then(r => r.json()).then(console.log);
