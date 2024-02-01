var http = require('http');
var https = require('https');
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
let openai;
let OpenAI = require('openai');
const GAMETITLE = 'Garden Hustle';
const cert = 'certificates/';
const path = require('path');
const crypto = require('crypto');
const DATADIR = '';
let user;

const app = express();
app.use(express.json());
app.use(express.static('public'));

// DEZE MOET ER MISSCHIEN UIT!
// DEZE MOET ER MISSCHIEN UIT!
// DEZE MOET ER MISSCHIEN UIT!
app.use(cors({ origin: 'http://localhost:9007' }));


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const rateLimit = require("express-rate-limit");

// Enable rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // limit each IP to 10 requests per windowMs
});

// Apply the rate limiter to a specific route
app.use("/", apiLimiter);
app.use("/register", apiLimiter);
app.use("/api/load", apiLimiter);
app.use("/api/save", apiLimiter);
app.use("/api/delete", apiLimiter);

app.use(express.json());


// Function to generate a random API key
const generateApiKey = () => {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charSetSize = charSet.length;
  const keyLength = 32;
  let apiKey = '';
  for (let i = 0; i < keyLength; i++) {
    const randomChar = charSet.charAt(Math.floor(Math.random() * charSetSize));
    apiKey += randomChar;
  }
  const apiKeyMap = readApiKeyData();
  let collisionCount = 0;
  while (apiKeyMap.has(apiKey) && collisionCount < 1000) {
    // If we have generated a duplicate key, try again up to 1000 times
    apiKey = '';
    for (let i = 0; i < keyLength; i++) {
      const randomChar = charSet.charAt(Math.floor(Math.random() * charSetSize));
      apiKey += randomChar;
    }
    collisionCount++;
  }
  if (collisionCount >= 1000) {
    throw new Error('Failed to generate unique game key');
  }
  return apiKey;
}


// Functie om de API key data te lezen en te verwerken
const readApiKeyData = () => {
  try {
    const data = fs.readFileSync(DATADIR + 'api-keys.json', 'utf-8');
    const users = JSON.parse(data);
    const apiKeyMap = new Map();
    users.forEach(user => {
      apiKeyMap.set(user.apiKey, user);
    });
    return apiKeyMap;
  } catch (err) {
    console.error(err);
    return new Map();
  }
};


// Function to write the API key data to file
const writeApiKeyData = (apiKeyMap) => {
  try {
    const data = JSON.stringify(Array.from(apiKeyMap));
    fs.writeFileSync(DATADIR + 'api-keys.json', data);
  } catch (err) {
    console.error(err);
  }
}


// Middleware function to check API key
const checkApiKey = (req, res, next) => {
  const providedApiKey = req.headers['api-key'];
  const apiKeyMap = readApiKeyData();
  if (apiKeyMap.has(providedApiKey)) {
	req.user = apiKeyMap.get(providedApiKey);    
	next();	
  } else {
    res.status(401).json({ message: 'Invalid game key' });
  }
};


function generateFileName(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
}


// Home path
app.get('/', (req,res)=> {
  const filePath = path.join(__dirname, DATADIR, 'index.html');
  res.sendFile(filePath);
});


// Route to register a new user and generate an API key
app.post('/register', (req, res) => {
    const apiKey = generateApiKey();

    const newUser = {
        apiKey: apiKey,
        email: req.body.email
    };

    const users = readApiKeyData(); // Lees de huidige gebruikerslijst
    users.push(newUser); // Voeg de nieuwe gebruiker toe aan de lijst
    writeApiKeyData(users); // Sla de bijgewerkte gebruikerslijst op
	
	// Maak directory voor saveData:
	const savePath = `./public/saves/${newUser.email}/save.json`;
	const fileStream = fs.createWriteStream(savePath);

  // send the API key to the user by email
  const transporter = nodemailer.createTransport({
	  host: "mail.zxcs.nl",
	  port: 587,
	  secure: true, // upgrade later with STARTTLS EN Azure Keyvault!
	  auth: {
		user: "api@stijnjanssen.nl",
		pass: "zW^W#fn*Z;^eZ/DtW8&",
	  },
	  tls: {
		  rejectUnauthorized: false
	  }
  });

  const mailOptions = {
    from: 'api@stijnjanssen.nl',
    to: req.body.email,
    subject: 'Your game key',
    text: `Enjoy playing ${GAMETITLE}! Your game key is: ${apiKey}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Registration successful' });
    }
  });
});


// LOGIN endpoint 
app.post('/api/login', checkApiKey, async (req, res) => {
    try {
		res.json(user);
	}
	catch (loginError) {
		res.status(500).json({ message: 'User login incorrect' });
	}
});


// SAVE endpoint
app.post('/api/save', checkApiKey, async (req, res) => {
    try {
        const user = req.user;
        const safeFileName = generateFileName(user.email);
        const filePath = path.join(__dirname, 'public', 'saves', `${safeFileName}.json`);

        // Check if the 'saves' directory exists, if not, create it
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(filePath, JSON.stringify(req.body.gameData));
		console.log('Data saved!')
        res.status(200).json({ message: 'Game opgeslagen' });

    } catch (saveError) {
        console.error('Fout bij het opslaan van de game:', saveError);
        res.status(500).json({ message: 'Fout bij het opslaan van de game: ' + saveError.message });
    }
});



// LOAD endpoint
app.post('/api/load', checkApiKey, (req, res) => {
    try {
        const user = req.user;
        const safeFileName = generateFileName(user.email);
        let filePath = path.join(__dirname, 'public', 'saves', `${safeFileName}.json`);

        const savedGame = JSON.parse(fs.readFileSync(filePath));

        res.json(savedGame);

    } catch (err) {
        console.error(`Fout bij inlezen van de savegame: ${err}`);
        res.status(500).json({ message: 'Fout bij het laden van de game' });
    }
});


// RESTART endpoint
app.delete('/api/restart', checkApiKey, (req, res) => {
	
	console.log('User ${user} begint opnieuw');
	
	// Delete de saveFile / maak hem leeg.
	
    res.sendStatus(200);
});


var options = {
	/*
  key: fs.readFileSync(cert + 'www.gardenhustle.nl-key.pem'),
  cert: fs.readFileSync(cert + 'www.gardenhustle.nl-chain.pem'),
  ciphers:
    [
      "ECDHE-RSA-AES128-SHA256",
      "DHE-RSA-AES128-SHA256",
      "AES128-GCM-SHA256",
      "HIGH",
      "!MD5",
      "!aNULL"
    ].join(':'),
  honorCipherOrder: true,
  minVersion: 'TLSv1.2'  
  */
};

// onderstaand moet worden: httpS!

http.createServer(options, app).listen(9007, function () {
  console.log('Garden Hustle listening on port 9007!');
});