const { exec } = require('child_process'); 
const http = require('http');  

const server = http.createServer((req, res) => {
  const jsonResponse = {
    message: 'Server is running!',
    status: 200,
    timestamp: new Date().toISOString(),
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(jsonResponse));
});

server.listen(4000, () => {
  console.log('Server is listening on port 3000');
  
  setTimeout(() => {
    console.log('Starting the application after 10 minutes...');
    
    exec('node chrome-browser.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing node index.js: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  }, 600000); 
});
