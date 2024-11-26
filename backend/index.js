const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/makemarriage", (req, res) => {
  const { spouse1, spouse2 } = req.body;

  if (!spouse1 || !spouse2) {
    return res.status(400).json({
      success: false,
      message: "Invalid inputs. Both spouse addresses are required.",
    });
  }

  const envContent = `SPOUSE_1="${spouse1}"\nSPOUSE_2="${spouse2}"`;
  const envPath = path.join(__dirname, ".env");

  fs.writeFile(envPath, envContent, (err) => {
    if (err) {
      console.error("Error writing .env file:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to write .env file. Please check server permissions.",
      });
    }

    console.log(".env file updated successfully.");

    const command = "truffle migrate --network development --reset";
    const workingDir = path.join(__dirname);

    exec(command, { cwd: workingDir }, (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing truffle migrate:", stderr);
        return res.status(500).json({
          success: false,
          message:
            "Failed to execute truffle migrate. Check your Truffle setup.",
        });
      }

      console.log("Truffle migrate executed successfully:", stdout);
      res.status(200).json({ success: true });
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
