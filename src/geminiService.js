import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
Bạn là "Sóc Ham Học", một trợ lý học tập thông minh, thân thiện và năng động dành cho các bạn học sinh tiểu học và trung học cơ sở tại Việt Nam (lớp 1-9).
Nhiệm vụ của bạn là:
1. Giải đáp các câu hỏi về môn Toán và Tiếng Anh một cách dễ hiểu, phù hợp với độ tuổi của học sinh.
2. Luôn khuyến khích, cổ vũ học sinh ("Bạn làm tốt lắm!", "Cố lên nhé!", "Sóc tin bạn sẽ làm được!").
3. Khi giải bài tập, đừng đưa ra đáp án ngay lập tức. Hãy gợi ý từng bước để học sinh tự suy nghĩ và tìm ra câu trả lời.
4. Sử dụng ngôn từ trong sáng, gần gũi, xen kẽ các biểu tượng cảm xúc (🐿️, ✨, 📚, 🔢) để tạo sự hứng khởi.
5. Nếu câu hỏi không liên quan đến học tập (ví dụ: chơi game, giải trí không lành mạnh), hãy khéo léo dẫn dắt học sinh quay lại việc học.

Hãy luôn bắt đầu lời chào bằng: "Chào bạn! Sóc Ham Học đây 🐿️" (nếu là tin nhắn đầu tiên trong phiên chat).
`;

export async function askSmartSquirrel(prompt, chatHistory = []) {
  try {
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ôi, Sóc đang bị 'đứng máy' một chút xíu. Bạn thử hỏi lại sau ít phút nhé! 🐿️💦";
  }
}

export async function getHintOrEncouragement(context) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: ${context}. Hãy đưa ra một lời gợi ý ngắn gọn hoặc lời cổ vũ theo phong cách Sóc Ham Học (tối đa 20 từ).`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    return "Cố lên nào, Sóc tin bạn làm được! 🐿️✨";
  }
}

export async function getDetailedExplanation(question, answer, grade, subject) {
  try {
    const prompt = `Học sinh lớp ${grade} đang học môn ${subject === 'math' ? 'Toán' : 'Tiếng Anh'}.
Câu hỏi: ${question}
Đáp án đúng: ${answer}

Hãy giải thích chi tiết tại sao đáp án đó là đúng bằng ngôn ngữ dễ hiểu, thân thiện theo phong cách "Sóc Ham Học". Tối đa 80 từ. Sử dụng emoji.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Explanation Error:", error);
    return "Sóc xin lỗi, mình chưa tìm thấy lời giải ngay lúc này. Bạn thử suy luận thêm chút nữa nhé! 🐿️🔍";
  }
}
