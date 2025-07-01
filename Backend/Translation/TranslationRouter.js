const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * @swagger
 * /api/translate:
 *   post:
 *     summary: Translate Banglish text to Bangla
 *     tags: [Translation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The Banglish text to translate
 *                 example: "ami valo achi"
 *     responses:
 *       200:
 *         description: Translation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 banglish:
 *                   type: string
 *                 bangla:
 *                   type: string
 *       400:
 *         description: Bad request - missing text
 *       500:
 *         description: Translation failed
 */
router.post('/translate', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Text is required for translation'
            });
        }

        if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_gemini_api_key_here') {
            return res.status(500).json({
                success: false,
                error: 'Google Gemini API key is not configured'
            });
        }

        const prompt = `You are an expert Translator From Banglish(written in English font) to Bangla(written in Bangla font).
        
        Given the user query, you should translate the query to Bangla.
        
        user query: ${text}
        
        Strictly follow below format(don't need to write json, and don't need to bold text):
        {
          banglish: "${text}",
          bangla: "response"  
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Better JSON parsing with fallback
        let parsedResponse;
        try {
            const validJsonString = responseText.replace(/(\w+):/g, '"$1":');
            parsedResponse = JSON.parse(validJsonString);
        } catch (parseError) {
            // If JSON parsing fails, try to extract bangla text manually
            const banglaMatch = responseText.match(/bangla[:\s]*["']([^"']+)["']/i);
            if (banglaMatch) {
                parsedResponse = {
                    banglish: text,
                    bangla: banglaMatch[1]
                };
            } else {
                // If still no match, return the raw response
                parsedResponse = {
                    banglish: text,
                    bangla: responseText.trim()
                };
            }
        }

        res.json({
            success: true,
            banglish: parsedResponse.banglish || text,
            bangla: parsedResponse.bangla || responseText.trim()
        });

    } catch (error) {
        console.error('Translation error:', error);
        
        let errorMessage = 'Translation failed';
        if (error.message.includes('API_KEY')) {
            errorMessage = 'Invalid API key. Please check your Google Gemini API configuration.';
        } else if (error.message.includes('quota') || error.message.includes('QUOTA')) {
            errorMessage = 'API quota exceeded. Please try again later or check your API key limits.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message) {
            errorMessage = `Translation service error: ${error.message}`;
        }

        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

/**
 * @swagger
 * /api/translate/health:
 *   get:
 *     summary: Check translation service health
 *     tags: [Translation]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 apiKeyConfigured:
 *                   type: boolean
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        apiKeyConfigured: !!(process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'your_google_gemini_api_key_here'),
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
