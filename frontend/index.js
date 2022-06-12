const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port);


// #write the following rule
// RewriteEngine On
// RewriteRule ^$ http://127.0.0.1:8000/ [P,L]
// RewriteCond %{REQUEST_FILENAME} !-f
// RewriteCond %{REQUEST_FILENAME} !-d
// RewriteRule ^(.*)$ http://127.0.0.1:8000/$1 [P,L]

// RewriteRule (./api/v2/*) http://localhost:8001/$1 [P,L]