import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Brand website mapping
const brandWebsites = {
  'samsung': 'https://www.samsung.com',
  'apple': 'https://www.apple.com',
  'xiaomi': 'https://www.mi.com',
  'oneplus': 'https://www.oneplus.com',
  'realme': 'https://www.realme.com',
  'vivo': 'https://www.vivo.com',
  'oppo': 'https://www.oppo.com',
  'huawei': 'https://www.huawei.com',
  'google': 'https://store.google.com',
  'sony': 'https://www.sony.com',
  'lava': 'https://www.lavamobiles.com',
  'micromax': 'https://www.micromaxinfo.com',
  'karbonn': 'https://www.karbonnmobiles.com',
  'jio': 'https://www.jio.com',
  'reliance': 'https://www.ril.com',
  'tata': 'https://www.tata.com',
  'mahindra': 'https://www.mahindra.com',
  'bajaj': 'https://www.bajaj.com',
  'hero': 'https://www.heromotocorp.com',
  'maruti': 'https://www.marutisuzuki.com',
  'hyundai': 'https://www.hyundai.com',
  'honda': 'https://www.honda.com',
  'toyota': 'https://www.toyota.com',
  'ford': 'https://www.ford.com',
  'bmw': 'https://www.bmw.com',
  'mercedes': 'https://www.mercedes-benz.com',
  'audi': 'https://www.audi.com',
  'tesla': 'https://www.tesla.com',
  'nike': 'https://www.nike.com',
  'adidas': 'https://www.adidas.com',
  'puma': 'https://www.puma.com',
  'reebok': 'https://www.reebok.com'
};

function getWebsiteForBrand(brandName) {
  const name = brandName.toLowerCase();

  // Try to find exact match
  for (const [key, website] of Object.entries(brandWebsites)) {
    if (name.includes(key)) {
      return website;
    }
  }

  // Generate a reasonable website URL based on brand name
  const cleanName = name.replace(/[^a-z0-9]/g, '').substring(0, 20);
  return `https://www.${cleanName}.com`;
}

// Search endpoint
app.post('/api/search-brands', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const EXA_API_KEY = process.env.EXA_API_KEY;

    if (!GEMINI_API_KEY || !EXA_API_KEY) {
      return res.status(500).json({ error: 'API keys not configured' });
    }

    // Get brand websites from Exa AI
    let exaBrandWebsites = {};

    try {
      const exaResponse = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': EXA_API_KEY,
        },
        body: JSON.stringify({
          query: `${query} brands official websites`,
          type: 'neural',
          numResults: 6
        })
      });

      if (exaResponse.ok) {
        const exaData = await exaResponse.json();
        if (exaData.results?.length > 0) {
          // Extract brand websites from Exa results
          exaData.results.forEach(result => {
            if (result.url) {
              // Extract domain as potential brand website
              const domain = result.url.match(/https?:\/\/([^\/]+)/)?.[0];
              if (domain) {
                // Store by title keywords for matching later
                const titleWords = result.title.toLowerCase().split(/\s+/);
                titleWords.forEach(word => {
                  if (word.length > 3 && !exaBrandWebsites[word]) {
                    exaBrandWebsites[word] = domain;
                  }
                });
              }
            }
          });

          console.log('Exa found', Object.keys(exaBrandWebsites).length, 'brand websites');
        }
      }
    } catch (error) {
      console.log('Exa API error:', error.message);
      // Continue without search context
    }

    // Simple prompt without thinking mode
    const prompt = `List 3 Indian and 3 global brands for: ${query}

Return only this JSON structure:
{
  "summary": "One sentence comparison",
  "indianBrands": [{"name": "Brand", "description": "Brief desc", "pros": ["pro1"], "cons": ["con1"]}],
  "globalBrands": [{"name": "Brand", "description": "Brief desc", "pros": ["pro1"], "cons": ["con1"]}]
}`;

    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048
        }
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Gemini API error:', errorText);
      return res.status(500).json({ error: 'AI service error' });
    }

    const aiData = await aiResponse.json();
    console.log('AI Response:', JSON.stringify(aiData, null, 2));

    const content = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error('No content in AI response:', aiData);
      return res.status(500).json({ error: 'No response from AI' });
    }

    // Parse JSON response
    let results;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      results = JSON.parse(jsonStr);

      // Ensure all brands have website URLs using multiple sources
      const assignWebsite = (brand) => {
        // Priority 1: AI provided website
        if (brand.website && brand.website.startsWith('http')) {
          return brand.website;
        }

        // Priority 2: Exa search results
        const brandNameLower = brand.name.toLowerCase();
        for (const [keyword, url] of Object.entries(exaBrandWebsites)) {
          if (brandNameLower.includes(keyword)) {
            return url;
          }
        }

        // Priority 3: Manual mapping fallback
        return getWebsiteForBrand(brand.name);
      };

      if (results.indianBrands) {
        results.indianBrands = results.indianBrands.map(brand => ({
          ...brand,
          website: assignWebsite(brand)
        }));
      }

      if (results.globalBrands) {
        results.globalBrands = results.globalBrands.map(brand => ({
          ...brand,
          website: assignWebsite(brand)
        }));
      }

      console.log('Brands with websites assigned:', {
        indian: results.indianBrands?.length || 0,
        global: results.globalBrands?.length || 0
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    res.json(results);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Express server is working!',
    env: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasExaKey: !!process.env.EXA_API_KEY
    }
  });
});

// Serve React app for all non-API routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
  });
}

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 BharatLens Full-Stack App running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints: http://localhost:${PORT}/api/*`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log('💡 Port is already in use. Try a different port or kill existing processes.');
  }
});