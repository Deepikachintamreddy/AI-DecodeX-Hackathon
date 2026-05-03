// Vercel serverless function: handles ALL AI tasks via a "task" parameter.
// Tasks: extract | cluster | plan | predict | chat
// Uses Gemini 2.0 Flash (free, fast, supports PDF input natively).

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set on server' });
  }

  try {
    const { task, payload } = req.body || {};
    let parts;

    if (task === 'extract') {
      // payload: { fileBase64, mimeType, hintYear }
      parts = [
        { text: EXTRACT_PROMPT(payload.hintYear) },
        {
          inline_data: {
            mime_type: payload.mimeType || 'application/pdf',
            data: payload.fileBase64,
          },
        },
      ];
    } else if (task === 'cluster') {
      parts = [{ text: CLUSTER_PROMPT(payload.topics) }];
    } else if (task === 'plan') {
      parts = [{ text: PLAN_PROMPT(payload) }];
    } else if (task === 'predict') {
      parts = [{ text: PREDICT_PROMPT(payload) }];
    } else if (task === 'chat') {
      parts = [{ text: CHAT_PROMPT(payload) }];
    } else {
      return res.status(400).json({ error: 'Unknown task' });
    }

    const body = {
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: task === 'chat' ? 0.7 : 0.2,
      },
    };

    let r = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // Auto-retry once on 429 (Rate Limit)
    if (r.status === 429) {
      console.log('Quota exceeded, retrying in 2 seconds...');
      await new Promise((res) => setTimeout(res, 2000));
      r = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    if (!r.ok) {
      const errText = await r.text();
      console.error('Gemini API Error:', errText);
      return res.status(500).json({ error: `Gemini error: ${errText.substring(0, 100)}`, detail: errText });
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (task === 'chat') {
      return res.status(200).json({ text });
    }
    // For JSON tasks, parse and return.
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Strip code fences if Gemini wrapped output
      const cleaned = text.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ============ PROMPTS ============

const EXTRACT_PROMPT = (hintYear) => `You are an expert exam paper analyzer.

Analyze the attached past question paper. Extract every question and identify its core academic concept.

Return STRICT JSON (no prose, no markdown) with this exact schema:
{
  "year": "${hintYear || 'YYYY or null if not found'}",
  "subject": "<infer the subject, e.g. Physics, DBMS, Operating Systems>",
  "exam_name": "<e.g. Mid-Sem, End-Sem, GATE, JEE Main, or null>",
  "total_marks": <total marks visible on paper, or null>,
  "questions": [
    {
      "q_no": "1a",
      "text": "<full question text, max 240 chars>",
      "topic": "<SPECIFIC concept, e.g. 'Newton's Second Law' not 'Mechanics'>",
      "subtopic": "<more granular, e.g. 'F=ma derivation'>",
      "marks": <number or null>,
      "difficulty": "Easy" | "Medium" | "Hard",
      "type": "MCQ" | "Short" | "Long" | "Numerical" | "Derivation" | "Diagram" | "TrueFalse"
    }
  ]
}

RULES:
- Be specific with topics. "Sorting" is bad. "Quicksort partition logic" is good.
- Difficulty: Easy = direct recall/definition; Medium = application; Hard = multi-step / analysis / proof.
- If marks aren't shown, infer from question length: 1-2 marks for one-liner, 5 for paragraph, 10+ for multi-part.
- If you cannot read parts of the paper, skip those questions silently.
- Output ONLY valid JSON.`;

const CLUSTER_PROMPT = (topics) => `You are deduplicating exam topics. Many topics refer to the same concept with different wording.

INPUT topics (with frequencies):
${JSON.stringify(topics)}

Cluster these into canonical concepts. Merge variants like:
- "Newton 2nd law", "F=ma", "Second law of motion" -> "Newton's Second Law"
- "BST insertion", "Binary Search Tree insert" -> "Binary Search Tree Insertion"

Return STRICT JSON:
{
  "clusters": [
    {
      "canonical": "<clean canonical topic name>",
      "members": ["<original topic 1>", "<original topic 2>"]
    }
  ]
}
Output ONLY JSON.`;

const PLAN_PROMPT = ({ rankedTopics, daysAvailable, hoursPerDay }) => `You are an expert study coach.

The student has ${daysAvailable} days and ${hoursPerDay} hours per day until the exam.

Ranked topics (highest importance first) with importance scores 0-100:
${JSON.stringify(rankedTopics.slice(0, 25))}

Generate a day-by-day study plan. Front-load high-importance topics. Group related topics on same days. Reserve last day for revision + mock paper.

Return STRICT JSON:
{
  "plan": [
    {
      "day": 1,
      "date_offset": "Day 1",
      "focus": "<short headline>",
      "topics": ["<topic 1>", "<topic 2>"],
      "tasks": ["<concrete task with time estimate>", "..."],
      "expected_hours": <number>
    }
  ],
  "strategy_note": "<2-3 sentence strategic advice for this student>"
}
Output ONLY JSON.`;

const PREDICT_PROMPT = ({ rankedTopics, subject }) => `You are an exam prediction expert.

Subject: ${subject}
Ranked topics from past papers (with importance scores):
${JSON.stringify(rankedTopics.slice(0, 20))}

Predict the most likely structure of the NEXT exam paper. Generate a realistic mock paper.

Return STRICT JSON:
{
  "predicted_paper": {
    "title": "Predicted ${subject} Paper",
    "instructions": "<short, like a real paper>",
    "sections": [
      {
        "name": "Section A",
        "marks_each": 2,
        "questions": [
          { "q_no": 1, "text": "<predicted question>", "topic": "<topic>", "marks": 2 }
        ]
      }
    ],
    "total_marks": <number>,
    "rationale": "<2-3 sentences on why this paper structure is likely>"
  }
}
Output ONLY JSON.`;

const CHAT_PROMPT = ({ rankedTopics, gaps, userMessage, history }) => `You are a friendly, sharp study coach. The student has analyzed their past papers.

CONTEXT (top topics by importance):
${JSON.stringify(rankedTopics.slice(0, 12))}

SYLLABUS GAPS (in syllabus but rarely asked):
${JSON.stringify(gaps || [])}

CONVERSATION SO FAR:
${(history || []).map((m) => `${m.role}: ${m.content}`).join('\n')}

STUDENT: ${userMessage}

Reply concisely (under 120 words). Be specific and tactical. Reference their actual top topics by name.`;
