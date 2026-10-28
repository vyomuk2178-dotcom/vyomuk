import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    return parseInt(process.argv[portArgIndex + 1], 10);
  }
  if (process.env.NODE_ENV === 'production') {
    return process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
  }
  return process.env.PORT && process.env.PORT !== '8080' ? parseInt(process.env.PORT, 10) : 3000;
}
const PORT = getPort();

// Generous body limit for processing documents, PDFs, and OCR images
app.use(express.json({ limit: '25mb' }));

const geminiApiKey = process.env.GEMINI_API_KEY;
const isAiConfigured = Boolean(geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY' && geminiApiKey.trim().length > 5);

let ai: GoogleGenAI | null = null;
if (isAiConfigured && geminiApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

const PRIMARY_MODEL = 'gemini-flash-latest';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

async function callGemini(params: any) {
  if (!ai) throw new Error('AI client not initialized');
  try {
    return await ai.models.generateContent({
      ...params,
      model: PRIMARY_MODEL,
    });
  } catch (err: any) {
    console.warn(`[OpenLearn AI] Primary model ${PRIMARY_MODEL} error (${err?.message || err}), switching to fallback ${FALLBACK_MODEL}...`);
    return await ai.models.generateContent({
      ...params,
      model: FALLBACK_MODEL,
    });
  }
}

// -----------------------------------------------------------------------------
// Sample Fallback Data for Honest Demo Mode
// -----------------------------------------------------------------------------
const DEMO_SIMPLIFIED = {
  title: "Photosynthesis: How Plants Make Food from Sunlight",
  level: "school",
  summary: "Photosynthesis is the process green plants use to convert sunlight, water, and carbon dioxide into sugars for food and oxygen to breathe.",
  plainExplanation: "Think of a plant leaf as a miniature solar-powered kitchen. Chlorophyll in the leaf acts like solar panels catching light energy. The roots act as water pipes absorbing moisture from soil, and tiny pores under the leaf (stomata) breathe in carbon dioxide. Inside the plant cell's chloroplasts, these ingredients are combined to make glucose (energy sugar) and release clean oxygen into our air.",
  importantConcepts: [
    {
      term: "Chlorophyll",
      explanation: "A green pigment inside plant cells that traps sunlight energy, giving plants their vibrant green color."
    },
    {
      term: "Chloroplast",
      explanation: "The specialized cellular factory inside leaf cells where photosynthesis chemical reactions occur."
    },
    {
      term: "Glucose",
      explanation: "A simple sugar molecule (C₆H₁₂O₆) created by the plant to store chemical energy for growth and repair."
    }
  ],
  difficultTerms: [
    {
      term: "Stomata",
      definition: "Microscopic openings on the surface of plant leaves.",
      everydayComparison: "Like tiny nostrils on the leaf that open to breathe in CO₂ and close to prevent water loss."
    },
    {
      term: "Photolysis",
      definition: "The chemical decomposition of water molecules induced by light.",
      everydayComparison: "Like a light scissor that cuts water into hydrogen building blocks and oxygen waste."
    }
  ],
  analogies: [
    {
      concept: "Solar Cooking",
      analogy: "Photosynthesis is just like baking bread in a solar-powered oven: light is the heat source, water and carbon dioxide are the flour and yeast, and glucose is the fresh bread."
    }
  ],
  keyTakeaways: [
    "Photosynthesis requires three key inputs: Sunlight, Water (H₂O), and Carbon Dioxide (CO₂).",
    "It produces two primary outputs: Glucose (plant food) and Oxygen (O₂).",
    "It forms the biological foundation of virtually all oxygen-based life and food chains on Earth."
  ],
  quickRecap: "Plants drink water, breathe carbon dioxide, absorb sunlight, and produce sweet glucose and fresh oxygen.",
  followUpQuestions: [
    "What would happen to photosynthesis during prolonged drought or dark conditions?",
    "How does cellular respiration in animals connect to photosynthesis in plants?",
    "Why are deep-ocean plants often brown or red instead of bright green?"
  ],
  isDemo: true
};

const DEMO_TRANSLATIONS: Record<string, string> = {
  hi: "प्रकाश संश्लेषण वह जैविक प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश, जल और कार्बन डाइऑक्साइड को भोजन (ग्लूकोज) और ऑक्सीजन में परिवर्तित करते हैं। यह प्रक्रिया पादप कोशिकाओं में मौजूद क्लोरोप्लास्ट में संपन्न होती है।",
  mr: "प्रकाशसंश्लेषण ही अशी जैविक प्रक्रिया आहे ज्याद्वारे हिरव्या वनस्पती सूर्यप्रकाश, पाणी आणि कार्बन डायऑक्साइडचे रूपांतर अन्नात (ग्लुकोज) आणि ऑक्सिजनमध्ये करतात. ही प्रक्रिया वनस्पती पेशींमधील हरितलवकांमध्ये (क्लोरोप्लास्ट) घडते.",
  es: "La fotosíntesis es el proceso biológico mediante el cual las plantas verdes convierten la luz solar, el agua y el dióxido de carbono en glucosa (alimento) y oxígeno liberado a la atmósfera.",
  fr: "La photosynthèse est le processus biologique par lequel les plantes vertes convertissent la lumière du soleil, l'eau et le dioxyde de carbone en glucose et en oxygène.",
  de: "Die Photosynthese ist der biologische Prozess, durch den grüne Pflanzen Sonnenlicht, Wasser und Kohlendioxid in Glukose und Sauerstoff umwandeln.",
};

const DEMO_NOTES = {
  title: "Comprehensive Study Notes: Cellular Energy & Photosynthesis",
  length: "standard",
  overview: "An organized breakdown of photosynthetic pathways, biochemical inputs, stages of light-dependent and light-independent reactions, and global ecological significance.",
  sections: [
    {
      heading: "1. Core Equation & Biochemical Inputs",
      content: "The balanced chemical formula representing oxygenic photosynthesis is 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂.",
      subpoints: [
        "Reactants: 6 molecules of Carbon Dioxide and 6 molecules of Water.",
        "Catalyst: Chlorophyll pigments absorbing violet-blue and red light wavelengths.",
        "Products: 1 molecule of Glucose and 6 molecules of atmospheric Oxygen gas."
      ]
    },
    {
      heading: "2. The Two Stages of Photosynthesis",
      content: "Photosynthesis occurs in two interdependent continuous phases within chloroplast structures.",
      subpoints: [
        "Light-Dependent Reactions: Occur in the thylakoid membranes; water is split, releasing O₂ and producing ATP + NADPH.",
        "Calvin Cycle (Light-Independent): Occurs in the stroma; CO₂ is fixed into carbohydrate chains using ATP and NADPH energy."
      ]
    }
  ],
  definitions: [
    { term: "Thylakoid", definition: "Flattened sac-like membrane structures inside chloroplasts where light-dependent reactions take place." },
    { term: "Stroma", definition: "The fluid-filled internal space surrounding grana thylakoids where carbon fixation enzymes operate." },
    { term: "ATP (Adenosine Triphosphate)", definition: "The universal molecular currency of biochemical cellular energy." }
  ],
  formulas: [
    {
      name: "Photosynthesis General Equation",
      formula: "6CO₂ + 6H₂O + Photons → C₆H₁₂O₆ + 6O₂",
      explanation: "Converts low-energy inorganic molecules into high-energy organic carbohydrates."
    }
  ],
  revisionChecklist: [
    "Memorize the balanced chemical equation for photosynthesis.",
    "Identify chloroplast anatomy (thylakoid, granum, stroma, double membrane).",
    "Compare the light-dependent phase with the Calvin cycle.",
    "Explain how environmental factors (light intensity, CO₂ level, temperature) affect reaction velocity."
  ],
  finalSummary: "Photosynthesis bridges cosmic solar energy to terrestrial living ecosystems, generating the food reserves and atmospheric oxygen required for modern biosphere existence.",
  sourceCitationNote: "Content structured from standard biological educational principles; verify specific textbook chapter page numbers.",
  isDemo: true
};

const DEMO_ACTIVITIES = {
  title: "Photosynthesis Quiz & Flashcards",
  flashcards: [
    {
      id: "fc-1",
      question: "What are the three essential raw inputs for photosynthesis?",
      answer: "Sunlight, Water (H₂O), and Carbon Dioxide (CO₂).",
      hint: "Light from above, moisture from below, and gas from the atmosphere.",
      category: "Fundamentals"
    },
    {
      id: "fc-2",
      question: "Where in the plant cell do light reactions take place?",
      answer: "Across the thylakoid membranes within chloroplasts.",
      hint: "Look for the disc-shaped membrane stacks.",
      category: "Cell Anatomy"
    },
    {
      id: "fc-3",
      question: "What gas is released as a byproduct when water is split during photolysis?",
      answer: "Oxygen gas (O₂).",
      hint: "The vital gas humans and animals breathe in.",
      category: "Reactions"
    },
    {
      id: "fc-4",
      question: "What is the primary organic molecule synthesized by plants to store energy?",
      answer: "Glucose (C₆H₁₂O₆).",
      hint: "A six-carbon hexose sugar.",
      category: "Biochemistry"
    }
  ],
  quiz: [
    {
      id: "q-1",
      question: "Which cellular organelle is responsible for conducting photosynthesis in plant cells?",
      options: ["Mitochondria", "Chloroplast", "Golgi Apparatus", "Endoplasmic Reticulum"],
      correctIndex: 1,
      explanation: "Chloroplasts contain the chlorophyll pigments and biochemical machinery required to harvest photon energy and fix carbon.",
      difficulty: "easy"
    },
    {
      id: "q-2",
      question: "During which phase of photosynthesis is carbon dioxide converted into carbohydrate sugars?",
      options: ["Light-dependent photolysis", "The Calvin Cycle (Light-independent reactions)", "Glycolysis", "The Krebs cycle"],
      correctIndex: 1,
      explanation: "The Calvin Cycle occurs in the stroma of the chloroplast and uses chemical energy (ATP and NADPH) from light reactions to fix CO₂ into glucose precursors.",
      difficulty: "medium"
    },
    {
      id: "q-3",
      question: "Why do most plant leaves appear green to human eyes?",
      options: [
        "Chlorophyll absorbs green light and reflects red and blue light.",
        "Chlorophyll reflects green light wavelengths while absorbing blue and red wavelengths.",
        "Plant cell walls are naturally dyed green by nitrogen atoms.",
        "Stomata refract sunlight into only green spectrum bands."
      ],
      correctIndex: 1,
      explanation: "Chlorophyll pigments absorb photons from the blue and red spectra most efficiently, while reflecting green light back to our retinas.",
      difficulty: "medium"
    }
  ],
  isDemo: true
};

// -----------------------------------------------------------------------------
// API Endpoints
// -----------------------------------------------------------------------------

// 1. Health & Status
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConfigured: isAiConfigured,
    model: PRIMARY_MODEL,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 2. Extract Document Content (Text, MD, PDF text/ocr, or Image OCR)
app.post('/api/extract', async (req: Request, res: Response) => {
  try {
    const { fileData, fileName, mimeType, rawText } = req.body;

    if (rawText && typeof rawText === 'string') {
      const clean = rawText.trim();
      return res.json({
        success: true,
        text: clean,
        wordCount: clean.split(/\s+/).filter(Boolean).length,
        charCount: clean.length,
        fileName: fileName || 'Pasted Content',
        extractedVia: 'direct',
      });
    }

    if (!fileData) {
      return res.status(400).json({ error: 'No file data or text was provided.' });
    }

    // If it's a plain text file encoded in base64
    if (mimeType?.includes('text') || mimeType?.includes('markdown') || fileName?.endsWith('.txt') || fileName?.endsWith('.md')) {
      const buffer = Buffer.from(fileData, 'base64');
      const text = buffer.toString('utf-8');
      return res.json({
        success: true,
        text,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        charCount: text.length,
        fileName,
        extractedVia: 'utf-8 decoder',
      });
    }

    // For PDF or Images, use Gemini 3.8 Flash multimodal to accurately extract text
    if (!ai) {
      return res.json({
        success: true,
        text: "Sample Extracted Text (Demo Mode): Photosynthesis is the chemical process by which green plants and certain other organisms transform light energy into chemical energy. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.",
        wordCount: 46,
        charCount: 308,
        fileName,
        extractedVia: 'demo_fallback',
        warning: 'AI is running in demo mode. Configure GEMINI_API_KEY for live document OCR & extraction.',
      });
    }

    const response = await callGemini({
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: fileData,
                mimeType: mimeType || 'application/pdf',
              },
            },
            {
              text: 'Extract and transcribe all educational text from this document or image verbatim with high accuracy. Maintain headings, bullet points, and formulas. Do not invent contents. If unreadable, clearly state what parts could not be deciphered.',
            },
          ],
        },
      ],
    });

    const text = response.text || '';
    if (!text.trim()) {
      return res.status(422).json({
        error: 'Unable to extract legible text from this document. Please ensure the document is clear, non-empty, and readable.',
      });
    }

    return res.json({
      success: true,
      text: text.trim(),
      wordCount: text.split(/\s+/).filter(Boolean).length,
      charCount: text.length,
      fileName,
      extractedVia: 'gemini-3.8-flash-multimodal',
    });
  } catch (error: any) {
    console.error('Error during document extraction:', error);
    return res.status(500).json({
      error: 'Failed to process document. ' + (error?.message || 'Unknown processing error'),
    });
  }
});

// 3. Simplify Text Feature
app.post('/api/simplify', async (req: Request, res: Response) => {
  try {
    const { text, level = 'school', language = 'en', focusArea } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide educational text to simplify.' });
    }

    if (!ai) {
      // Demo response
      return res.json({
        ...DEMO_SIMPLIFIED,
        level,
        isDemo: true,
      });
    }

    const levelDescriptions: Record<string, string> = {
      beginner: 'A curious 8-10 year old or someone completely new to the topic. Use vivid everyday imagery, short sentences, and zero jargon without explanation.',
      school: 'A middle school student (grades 6-8). Clear structure, relatable real-world analogies, step-by-step clarity.',
      high_school: 'A high school student (grades 9-12). Balanced depth, precise scientific/academic vocabulary with plain-English definitions, exam-ready logic.',
      university: 'An undergraduate or adult learner. Clear conceptual architecture, rigorous definitions, contextual nuance, without unnecessary obfuscation.',
    };

    const prompt = `You are OpenLearn AI, an expert accessible education specialist.
Transform the provided educational text into an accessible, clear, and comprehensive learning explanation.

TARGET AUDIENCE:
Level: ${level} (${levelDescriptions[level] || levelDescriptions.school})
Target Output Language: ${language}
${focusArea ? `User Focus Question/Area: "${focusArea}"` : ''}

RULES:
1. Preserve true facts, formulas, and essential principles from the source text. Do NOT omit crucial steps.
2. Replace dense jargon with plain words, or explain the term clearly right where it appears.
3. Distinguish illustrative analogies from factual source data.
4. If input is incomplete or ambiguous, note that in the summary.
5. Provide helpful analogies and follow-up questions to spark deeper understanding.

SOURCE TEXT:
${text.slice(0, 20000)}
`;

    const response = await callGemini({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            plainExplanation: { type: Type.STRING },
            importantConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['term', 'explanation'],
              },
            },
            difficultTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  everydayComparison: { type: Type.STRING },
                },
                required: ['term', 'definition', 'everydayComparison'],
              },
            },
            analogies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  concept: { type: Type.STRING },
                  analogy: { type: Type.STRING },
                },
                required: ['concept', 'analogy'],
              },
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            quickRecap: { type: Type.STRING },
            followUpQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'title',
            'summary',
            'plainExplanation',
            'importantConcepts',
            'difficultTerms',
            'analogies',
            'keyTakeaways',
            'quickRecap',
            'followUpQuestions',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      level,
      isDemo: false,
    });
  } catch (error: any) {
    console.error('Error in /api/simplify:', error);
    return res.status(500).json({
      error: 'Failed to generate simplification. ' + (error?.message || 'Please try again.'),
    });
  }
});

// 4. Multilingual Translation Feature
app.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage = 'hi', sourceLanguage = 'auto' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide text to translate.' });
    }

    if (!ai) {
      const demoResult = DEMO_TRANSLATIONS[targetLanguage] || `[Translation into ${targetLanguage}]: ${text}`;
      return res.json({
        originalText: text,
        translatedText: demoResult,
        detectedSourceLanguage: 'English',
        targetLanguage,
        keyTerminologyMap: [
          { source: 'Photosynthesis', translated: 'प्रकाश संश्लेषण / Fotosíntesis', definition: 'Biological light-conversion process' },
          { source: 'Chloroplast', translated: 'हरितलवक / Cloroplasto', definition: 'Cellular food organelle' },
        ],
        academicNote: 'Demo Mode: Translations provided for demonstration. In live mode, Gemini translates with domain accuracy.',
        isDemo: true,
      });
    }

    const prompt = `You are OpenLearn AI's academic translator.
Translate the following educational material accurately into target language: "${targetLanguage}".
Source Language: "${sourceLanguage}".

CRITICAL INSTRUCTIONS:
1. Preserve structural formatting, markdown lists, bullet points, numbering, and formulas.
2. Keep scientific nomenclature accurate in the target script (e.g. Hindi, Marathi, Spanish, etc.), with standard transliteration or native scientific terms.
3. Provide a list of key technical terms mapped from source to translated term.
4. Include an honest academic review disclaimer if human verification is recommended for exams or publication.

TEXT TO TRANSLATE:
${text.slice(0, 15000)}
`;

    const response = await callGemini({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: { type: Type.STRING },
            detectedSourceLanguage: { type: Type.STRING },
            targetLanguage: { type: Type.STRING },
            keyTerminologyMap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  translated: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
                required: ['source', 'translated'],
              },
            },
            academicNote: { type: Type.STRING },
          },
          required: ['translatedText', 'detectedSourceLanguage', 'targetLanguage', 'keyTerminologyMap', 'academicNote'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      originalText: text,
      ...parsed,
      isDemo: false,
    });
  } catch (error: any) {
    console.error('Error in /api/translate:', error);
    return res.status(500).json({
      error: 'Failed to translate content. ' + (error?.message || 'Please try again.'),
    });
  }
});

// 5. Study Notes Generator
app.post('/api/notes', async (req: Request, res: Response) => {
  try {
    const { text, length = 'standard', preferredLanguage = 'en' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide material for generating study notes.' });
    }

    if (!ai) {
      return res.json({
        ...DEMO_NOTES,
        length,
        isDemo: true,
      });
    }

    const lengthGuide = {
      short: 'Concise executive cheat-sheet (1-2 main sections, bullet points, core definitions only).',
      standard: 'Balanced classroom revision notes (3-4 structured sections with explanations and examples).',
      detailed: 'In-depth comprehensive study guide (detailed sections, all subpoints, formulas, deep breakdowns).',
    }[length as 'short' | 'standard' | 'detailed'] || 'Standard notes';

    const prompt = `You are OpenLearn AI, a master academic note-taking assistant.
Transform the provided educational text into well-structured revision notes.

STYLE & LENGTH:
Length specification: ${length} (${lengthGuide})
Language: ${preferredLanguage}

REQUIREMENTS:
1. Ground strictly in the provided material. Do not invent page citations or facts.
2. Group logical concepts under clear headings.
3. Extract exact definitions and formulas if present in the text.
4. Provide a quick revision checklist of concepts the learner should be able to answer/recall.
5. Create a cohesive, accessible summary at the end.

SOURCE MATERIAL:
${text.slice(0, 25000)}
`;

    const response = await callGemini({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  content: { type: Type.STRING },
                  subpoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['heading', 'content'],
              },
            },
            definitions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
                required: ['term', 'definition'],
              },
            },
            formulas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  formula: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['name', 'formula', 'explanation'],
              },
            },
            revisionChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            finalSummary: { type: Type.STRING },
            sourceCitationNote: { type: Type.STRING },
          },
          required: [
            'title',
            'overview',
            'sections',
            'definitions',
            'formulas',
            'revisionChecklist',
            'finalSummary',
            'sourceCitationNote',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      length,
      isDemo: false,
    });
  } catch (error: any) {
    console.error('Error in /api/notes:', error);
    return res.status(500).json({
      error: 'Failed to generate study notes. ' + (error?.message || 'Please try again.'),
    });
  }
});

// 6. Flashcards and Quizzes
app.post('/api/activities', async (req: Request, res: Response) => {
  try {
    const { text, flashcardCount = 6, quizCount = 5, difficulty = 'medium', language = 'en' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide material for flashcards and quiz.' });
    }

    if (!ai) {
      return res.json({
        ...DEMO_ACTIVITIES,
        isDemo: true,
      });
    }

    const prompt = `You are OpenLearn AI educational activity creator.
Generate a set of flashcards and multiple-choice quiz questions based SOLELY on the provided educational material.

PARAMETERS:
Number of Flashcards: ${flashcardCount}
Number of Quiz Questions: ${quizCount}
Target Difficulty: ${difficulty}
Language: ${language}

REQUIREMENTS:
1. Questions must test genuine understanding, not trivial trivia.
2. For Quiz: Provide exactly 4 options per question. Only ONE option must be clearly correct. The other 3 must be plausible distractors based on the text.
3. Include an insightful, encouraging explanation for why the correct answer is right.
4. Avoid duplicate choices or ambiguous queries.
5. Provide helpful hints for flashcards.

SOURCE MATERIAL:
${text.slice(0, 20000)}
`;

    const response = await callGemini({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  hint: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ['id', 'question', 'answer'],
              },
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                },
                required: ['id', 'question', 'options', 'correctIndex', 'explanation'],
              },
            },
          },
          required: ['title', 'flashcards', 'quiz'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      isDemo: false,
    });
  } catch (error: any) {
    console.error('Error in /api/activities:', error);
    return res.status(500).json({
      error: 'Failed to generate activities. ' + (error?.message || 'Please try again.'),
    });
  }
});

// 7. Grounded Conversational Learning Assistant
app.post('/api/assistant', async (req: Request, res: Response) => {
  try {
    const { messages, documentContext, mode = 'general' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Please provide conversation messages.' });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';

    if (!ai) {
      return res.json({
        reply: `[Demo Mode] As an educational assistant, I can explain that "${lastMessage}" relates directly to the core principles of the material. In live mode with Gemini configured, I will ground every answer in your specific uploaded document, distinguishing source excerpts from external general knowledge.`,
        citations: ['Source document paragraph 1', 'Scientific overview'],
        isGroundedInSource: Boolean(documentContext && documentContext.trim().length > 0),
        limitationNote: 'Running in demo mode. Connect GEMINI_API_KEY for dynamic contextual learning chats.',
      });
    }

    const systemInstruction = `You are OpenLearn AI's accessible learning tutor.
Your mission is to help learners understand, question, and master educational material without intimidation.

GROUNDING RULES:
1. When DOCUMENT CONTEXT is provided, prioritize it above everything else.
2. If the user asks a question that CAN be answered from the document, cite specific phrases or sections from the source.
3. If the answer is NOT supported by the source, clearly state: "Based on general background knowledge (not found in your uploaded document)..."
4. If there is insufficient information in both the source and general consensus, admit the uncertainty honestly.
5. Guide the learner towards understanding concepts step by step rather than just blurt out raw answers.

ACTIVE MODE: ${mode}
${mode === 'simplify' ? 'Focus on ultra-clear, simple language and relatable analogies.' : ''}
${mode === 'step-by-step' ? 'Break down the problem into sequential, bite-sized numbered steps.' : ''}
${mode === 'example' ? 'Provide realistic, concrete everyday examples to illuminate the concept.' : ''}
${mode === 'compare' ? 'Create a structured side-by-side comparison of differences and similarities.' : ''}
`;

    let contextPrompt = '';
    if (documentContext && documentContext.trim().length > 0) {
      contextPrompt = `\n--- GROUNDING DOCUMENT CONTEXT ---\n${documentContext.slice(0, 15000)}\n--- END DOCUMENT CONTEXT ---\n`;
    }

    // Prepare conversational history
    const historyText = messages
      .slice(-6)
      .map((m: any) => `${m.role === 'user' ? 'Learner' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const fullPrompt = `${systemInstruction}\n${contextPrompt}\nConversation so far:\n${historyText}\n\nAssistant response:`;

    const response = await callGemini({
      contents: fullPrompt,
    });

    const replyText = response.text || "I'm sorry, I couldn't formulate a response. Please try rephrasing.";

    return res.json({
      reply: replyText,
      isGroundedInSource: Boolean(documentContext && documentContext.trim().length > 0),
    });
  } catch (error: any) {
    console.error('Error in /api/assistant:', error);
    return res.status(500).json({
      error: 'Learning assistant encountered an issue. ' + (error?.message || 'Please try again.'),
    });
  }
});

// -----------------------------------------------------------------------------
// Vite Middleware / Static Server
// -----------------------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OpenLearn AI] Server running at http://0.0.0.0:${PORT}`);
    console.log(`[OpenLearn AI] Gemini AI status: ${isAiConfigured ? 'CONNECTED' : 'DEMO MODE (No API key found)'}`);
  });
}

startServer().catch((err) => {
  console.error('[OpenLearn AI] Fatal error starting server:', err);
  process.exit(1);
});
