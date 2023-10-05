const path = require("path");
const express = require("express");

const app = express();

// Set Static Folder

app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
