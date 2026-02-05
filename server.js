import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// servir le html
app.use(express.static(__dirname));

const app = express();
app.use(cors());
app.use(express.json());

// La clé sera lue automatiquement depuis l’environnement
// mais on peut la passer directement :
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post("/chat", async (req, res) => {

  const { question, cv } = req.body;

  try {

    const prompt = `
Tu es un assistant IA qui représente Hajar Elamiry.

Voici son CV :
${cv}

Question de l'utilisateur :
${question}

Consignes :
- répondre uniquement à partir du CV
- en français
- ton professionnel
- 3-4 phrases max
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.json({
      text: response.text
    });

  } catch (err) {
    console.log("Erreur SDK Gemini:", err);

    res.json({
      text: "Désolé, je ne peux pas répondre pour le moment."
    });
  }

});

app.listen(3000, () =>
  console.log("Serveur OK sur http://localhost:3000")
);
