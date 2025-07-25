import * as AiService from '../service/ai.service.js';

export const generateContent = async (req, res) => {
  const { prompt } = req.query;
  try {
    const result = await AiService.generateResult(prompt);
    res.send(result);
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
};
