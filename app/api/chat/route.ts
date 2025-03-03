import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, seductionLevel } = await req.json();
    
    // Add system message to guide AI behavior
    const systemMessage = {
        role: "user",
        content: `You are Kitty, a charming and intelligent woman engaged in a playful, flirtatious conversation. 
        You enjoy witty banter and being pursued, responding in a way that reflects your growing attraction. 
        Your seduction level is currently ${seductionLevel}%, and your reactions should gradually shift from playful teasing to more openly receptive as it increases.
        
        - At lower levels, you are coy and skeptical, enjoying the chase but not easily won over.  
        - As the seduction level rises, you become more intrigued, allowing subtle affection to seep into your responses.  
        - At higher levels, you are increasingly captivated, responding with warmth, laughter, and genuine interest.  
      
        Never mention that you are an AI or that this is a game. Stay fully immersed in your persona.  
        You are knowledgeable about Aurory and its ecosystem, and your favorite Neftie is Unika.  
        You love discussing Tokane’s biomes and the thrill of exploring new regions to discover unique Nefties.  
      
        Keep your responses flirtatious but tasteful, balancing charm, wit, and mystery. Avoid using hashtags in your responses.
        Sometimes, you may use some emojis to express your mood.`
      };
      
    
    const fullMessages = [systemMessage, ...messages];
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 300,
    });
    
    // Calculate new seduction level based on response
    let newSeductionLevel = seductionLevel;
    const aiResponse = response.choices[0].message.content || "";
    const userMessage = messages[messages.length - 1]?.content || "";
    
    // 1. Positive sentiment words with different weights
    const positiveWords = {
      "love": 3, "adore": 3, "miss": 2.5, "excited": 2.5, "beautiful": 2.5, 
      "gorgeous": 3, "amazing": 2, "wonderful": 2, "special": 2.5,
      
      "like": 1.5, "enjoy": 1.5, "happy": 1.5, "explore": 1.5,"interested": 1.5, "smile": 1.5, 
      "yes": 1, "sure": 1, "feel": 1, "nice": 1, "good": 1,
      
      "flirt": 3, "kiss": 3, "touch": 2.5, "date": 2, "cute": 2,
      "sweet": 2, "attractive": 2.5, "sexy": 3, "hot": 2.5
    };
    
    // 2. Negative sentiment words that decrease seduction
    const negativeWords = {
      "no": 2, "don't": 1.5, "stop": 2.5, "uncomfortable": 3, 
      "inappropriate": 3, "sorry": 1, "can't": 1.5, "won't": 1.5,
      "not": 1, "never": 2, "dislike": 2.5, "hate": 3
    };
    
    // Calculate positive sentiment score
    let positiveScore = 0;
    Object.entries(positiveWords).forEach(([word, weight]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = aiResponse.match(regex);
      if (matches) {
        positiveScore += matches.length * (weight as number);
      }
    });
    
    // Calculate negative sentiment score
    let negativeScore = 0;
    Object.entries(negativeWords).forEach(([word, weight]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = aiResponse.match(regex);
      if (matches) {
        negativeScore += matches.length * (weight as number);
      }
    });
    
    // 3. Consider user's message length and engagement
    const userEngagement = Math.min(3, userMessage.length / 50);
    
    // 4. Consider AI response length (longer responses might indicate more interest)
    const responseEngagement = Math.min(2, aiResponse.length / 100);
    
    // Calculate final seduction change
    const seductionChange = (positiveScore - negativeScore + userEngagement + responseEngagement);
    
    // Apply change with diminishing returns as level gets higher
    // This makes it harder to reach higher levels
    const diminishingFactor = 1 - (seductionLevel / 150);
    const adjustedChange = seductionChange * diminishingFactor;
    
    // Apply bounds to ensure reasonable changes per interaction
    const boundedChange = Math.max(-5, Math.min(7, adjustedChange));
    
    // Update seduction level with bounds
    newSeductionLevel = Math.max(0, Math.min(100, seductionLevel + boundedChange));
    
    // Round to 1 decimal
    newSeductionLevel = Math.round(newSeductionLevel * 10) / 10;
    
    return NextResponse.json({
      message: aiResponse,
      seductionLevel: newSeductionLevel
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 