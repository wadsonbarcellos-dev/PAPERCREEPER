const http = require('http');

http.get('http://127.0.0.1:8080/api/tunnels', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data));
}).on('error', (err) => console.log('Error:', err.message));
