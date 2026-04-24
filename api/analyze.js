export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'No image' });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: 'Analysiere dieses Lebensmittelbild. Antworte NUR mit JSON ohne weiteren Text: {"name":"Name auf Deutsch","kcalPer100":0,"proteinPer100":0,"carbsPer100":0,"fatPer100":0}' },
            { type: 'image_url', image_url: { url: image, detail: 'low' } }
          ]
        }],
        max_tokens: 300,
      }),
    });
    if (!response.ok) { const e = await response.text(); return res.status(500).json({ error: e }); }
    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Kein JSON');
    return res.status(200).json(JSON.parse(match[0]));
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
