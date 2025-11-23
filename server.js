const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

function convertUsingLibreOffice(inputPath, format) {
  return new Promise((resolve, reject) => {
    const cmd = `soffice --headless --convert-to ${format} --outdir output "${inputPath}"`;

    exec(cmd, (err) => {
      if (err) return reject(err);
      const base = path.basename(inputPath, path.extname(inputPath));
      const outputFile = path.join("output", `${base}.${format}`);
      resolve(outputFile);
    });
  });
}

app.post("/pdf-to-word", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const output = await convertUsingLibreOffice(filePath, "docx");
    res.download(output, "converted.docx");
  } catch (e) {
    res.status(500).send("Conversion Failed");
  }
});

app.post("/pdf-to-ppt", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const output = await convertUsingLibreOffice(filePath, "pptx");
    res.download(output, "converted.pptx");
  } catch (e) {
    res.status(500).send("Conversion Failed");
  }
});

app.post("/pdf-to-excel", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const output = await convertUsingLibreOffice(filePath, "xlsx");
    res.download(output, "converted.xlsx");
  } catch (e) {
    res.status(500).send("Conversion Failed");
  }
});

app.get("/", (req, res) => {
  res.send("GTTOOLS API Ready!");
});

app.listen(8080, () => console.log("Server Running on 8080"));
