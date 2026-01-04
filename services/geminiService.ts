import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ReframeResult, FairyTale, AdaptationResult } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Transforms negative text into healing advice and generates an image.
 */
export const reframeLanguage = async (inputText: string): Promise<ReframeResult> => {
  // 1. Text Analysis & Reframing
  const textModel = 'gemini-3-flash-preview';
  const textPrompt = `
    你是一位温暖、富有同理心的心理咨询师，专门帮助受过欺凌的青少年。
    用户输入了一段话： "${inputText}"
    这段话可能是别人对他们说的伤害性语言，或者是他们的自我否定。

    请以JSON格式返回以下三个字段（不要使用Markdown代码块，直接返回JSON字符串）：
    {
      "warmExplanation": "用极其温暖、像大哥哥大姐姐一样的口吻安抚用户，解释这句话。",
      "psychAnalysis": "从心理学角度简要分析为什么对方会说这种话（例如对方的投射、嫉妒等），或者为什么用户会有这种自我否定（例如习得性无助）。避免教科书式的枯燥表达，要通俗易懂。",
      "solution": "给出一个非常具体、微小、可执行的行动建议，适合边缘青少年的行为模式。例如：'今天试着戴上耳机听一首喜欢的歌'，而不是'去交新朋友'。"
    }
  `;

  let reframeData: Omit<ReframeResult, 'originalText' | 'timestamp'> = {
    warmExplanation: "抱歉，我现在有点累，没能理解你的话。",
    psychAnalysis: "请稍后再试。",
    solution: "休息一下吧。"
  };

  try {
    const textResponse: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: textPrompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (textResponse.text) {
      reframeData = JSON.parse(textResponse.text);
    }
  } catch (error) {
    console.error("Text reframe error:", error);
  }

  // 2. Image Generation for Healing
  // We use the 'gemini-2.5-flash-image' model as per guidelines for general image tasks.
  let imageUrl = undefined;
  try {
    const imagePrompt = `A soft, healing, warm illustration style, dreamlike, pastel colors, cute art style. Concept: ${reframeData.warmExplanation.substring(0, 50)}. No text in image.`;
    
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: imagePrompt }]
      },
      config: {
        // No responseMimeType for image generation
      }
    });

    // Extract image from response parts
    if (imageResponse.candidates && imageResponse.candidates[0].content.parts) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
        }
      }
    }
  } catch (error) {
    console.error("Image generation error:", error);
    // Fallback image if generation fails
    imageUrl = "https://picsum.photos/400/400?blur=2"; 
  }

  return {
    originalText: inputText,
    timestamp: Date.now(),
    ...reframeData,
    imageUrl
  };
};

/**
 * Provides warm, specific advice for social scenarios.
 */
export const getAdaptationAdvice = async (scenario: string): Promise<AdaptationResult> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    你是一位温柔的青少年成长向导。
    用户是一位正在尝试重返校园、曾经受过欺凌的青少年。
    他们担心或关注的场景是： "${scenario}"

    请以JSON格式返回以下内容（不要使用Markdown）：
    {
      "warmAdvice": "用非常治愈、接纳的语气，告诉用户这种担心是正常的，并给出安抚。",
      "actionStep": "给出一个非常简单、具体、低压力的应对步骤。要适合社恐或敏感时期的青少年去执行。例如：'提前5分钟到教室'，'带一本喜欢的书作为掩护'等。"
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        scenario,
        warmAdvice: data.warmAdvice,
        actionStep: data.actionStep,
        timestamp: Date.now()
      };
    }
  } catch (error) {
    console.error("Adaptation advice error:", error);
  }

  return {
    scenario,
    warmAdvice: "现在的感觉也许有些难熬，但你已经很勇敢了。",
    actionStep: "深呼吸三次，告诉自己：这就足够了。",
    timestamp: Date.now()
  };
};

/**
 * Weaves diary entries into a fairy tale.
 */
export const weaveStory = async (entries: string[]): Promise<FairyTale> => {
  const model = 'gemini-3-pro-preview'; // Using Pro for better creative writing
  
  const entriesText = entries.join("\n---\n");
  const prompt = `
    以下是一位青少年的日记片段：
    ${entriesText}

    请作为一位治愈系童话作家，将这些日记中的情绪和事件，改编成一个温暖、短小的童话故事。
    日记中的困境应该化作故事中的冒险，主角最终获得了勇气或安宁。
    
    请返回JSON格式：
    {
      "title": "故事标题",
      "content": "故事内容（300字以内）"
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        title: data.title,
        content: data.content,
        generatedDate: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error("Story weaving error:", error);
  }

  return {
    title: "未命名的故事",
    content: "魔法似乎暂时失效了，请稍后再试...",
    generatedDate: new Date().toISOString()
  };
};

/**
 * Generates a personalized healing letter for the user.
 */
export const generateHealingLetter = async (name: string, experience: string): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    你是一位温暖、富有智慧和同理心的青少年成长导师（类似大哥哥/大姐姐的角色）。
    在此刻，你要给一位名字叫 ${name} 的青少年写一封信。
    
    他/她的经历是：
    "${experience}"

    信件要求：
    1. 根据他的经历，进行温柔的总结，让他感到被看见、被接纳。
    2. 对他的痛苦进行安抚，告诉他这不怪他。
    3. 给予他力量和疗愈，鼓励他相信未来。
    4. 语气要亲切、温暖、真诚，不要有说教感。
    5. 字数在 200-300 字左右。
    6. 不要使用Markdown格式，直接返回纯文本内容。
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    if (response.text) {
      return response.text;
    }
  } catch (error) {
    console.error("Healing letter generation error:", error);
  }

  return `亲爱的 ${name}，\n\n很高兴你能来到这里。虽然我无法立刻抹去所有的伤痛，但请相信，你并不孤单。你经历的一切我都看在眼里，你已经做得很好了。请给自己一点时间，慢慢来，阳光终会再次照耀。`;
};

/**
 * Generates a celebration share poster.
 */
export const generateSharePoster = async (theme: 'daily' | 'completion' = 'daily'): Promise<string> => {
  try {
    let prompt = "";
    if (theme === 'completion') {
       prompt = `A heartwarming digital illustration of a small boat arriving at a warm, light-filled shore, leaving a dark river behind. A lighthouse or warm cottage light is welcoming them. The scene represents hope, safety, and a new beginning. High quality, artistic style, warm golden lighting.`;
    } else {
       prompt = `A serene and hopeful digital illustration of a small wooden boat floating on a river, holding a glowing warm lantern that lights up the dark water nearby. Soft, healing art style, magical atmosphere.`;
    }
    
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    if (imageResponse.candidates && imageResponse.candidates[0].content.parts) {
       for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
  } catch (error) {
    console.error("Poster generation error:", error);
  }
  return "https://picsum.photos/400/600?blur=2"; // Fallback
};