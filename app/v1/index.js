const express = require("express");
const app = express();
const morgan = require("morgan");
const os = require('os');
const requestIp = require('request-ip');
const hostname = os.hostname();
const { Client } = require('pg');
const dotenv = require('dotenv');
const PORT = 3000

app.use(morgan('tiny'));
app.use(requestIp.mw())

// fonction pour récupérer l'adresse IP locale
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    const iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }

  return '0.0.0.0';
}

// fonction ip locale (getLocalIP) & ip distante (clientIp) + hostname
app.get('/', function (req, res) {
  const clientIp = requestIp.getClientIp(req);
  res.send('Rugby API v1'+'\n---> Hostname:' + hostname + '\n---> Local IP: ' + getLocalIP() + '\n---> Remote IP: ' + clientIp);
});

// connexion à la base de données postgres
dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST ,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});


// plaquage OK
// route get plaquage OK
app.get('/ok', (req, res) => {
  client.query(`SELECT * FROM plaquage_ok`, (err, result) => {
      if (!err) {
          res.send(result.rows)
      }
  });
  client.end
})

// route add plaquage OK
app.post('/ok', (req, res) => {
  let insertQuery = `UPDATE plaquage_ok SET sum_plaquage_ok=sum_plaquage_ok+1 WHERE Id = 1`

  client.query(insertQuery, (err, result) => {
      if (!err) {
          res.send('add plaquage ok !')
      }
      else { console.log(err.message) }
  })
  client.end
})

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connexion à la base de données réussie');
  }
});

// reset plaquage OK
app.post('/ok/reset', (req, res) => {
  let insertQuery = `UPDATE plaquage_ok SET sum_plaquage_ok = 0 where id = 1`
  client.query(insertQuery, (err, result) => {
      if (!err) {
          res.send('reset plaquage ok !')
      }
      else { console.log(err.message) }
  })
  client.end
})


// Expose Express sur le port 3000
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Express ecoute sur le port", PORT);
});

