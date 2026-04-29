fetch("http://localhost:3000/api/server/files/list?serverId=fake&folder=plugins/plugins/versions")
  .then(r => r.text())
  .then(console.log);
