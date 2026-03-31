const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getMealSuggestionsByMood = async (mood) => {
  const allowedMoods = ["hafif", "sağlıklı", "hızlı"];

  if (!allowedMoods.includes(mood)) {
    throw new Error("Geçersiz mood değeri");
  }

  const prompt = `
Kullanıcının seçtiği mood: "${mood}"

Bu mood'a uygun 3 yemek önerisi ver.
Cevabı sadece geçerli JSON formatında ver.

İstenen JSON formatı:
{
  "mood": "${mood}",
  "suggestions": [
    {
      "name": "Yemek adı",
      "description": "Kısa açıklama",
      "reason": "Bu mood için neden uygun"
    }
  ]
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "Sen yemek önerisi yapan bir asistansın. Sadece geçerli JSON çıktısı ver.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8,
  });

  const content = response.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error("AI çıktısı JSON formatında değil");
  }
};

const getCalorieAnalysis = async (recipe) => {
  const prompt = `
Sen bir beslenme uzmanı ve kalori hesaplama asistanısın.

Kullanıcının verdiği yemek tarifindeki malzemeleri ve miktarları analiz ederek:
1. Toplam yaklaşık kalori hesapla
2. Porsiyon başına kalori hesapla
3. Protein, karbonhidrat ve yağ durumunu (düşük / orta / yüksek) olarak belirt
4. Daha sağlıklı olması için kısa bir öneri ver

Kurallar:
- Tahmini değerler kullanabilirsin
- Sonuçları anlaşılır ve sade yaz
- Cevabı JSON formatında ver

JSON formatı şu şekilde olmalı:
{
  "totalCalories": number,
  "caloriesPerServing": number,
  "protein": "düşük | orta | yüksek",
  "carbs": "düşük | orta | yüksek",
  "fat": "düşük | orta | yüksek",
  "suggestion": "string"
}

Tarif:
${recipe}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "Sen bir beslenme uzmanı ve kalori hesaplama asistanısın. Sadece geçerli JSON çıktısı ver.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
  });

  const content = response.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error("AI çıktısı JSON formatında değil");
  }
};

module.exports = {
  getMealSuggestionsByMood,
  getCalorieAnalysis,
};