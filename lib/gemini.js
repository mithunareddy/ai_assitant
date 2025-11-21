import { GoogleGenerativeAI } from '@google/generative-ai';
import { MEDICAL_ASSISTANT_SYSTEM_PROMPT } from './system-prompt';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: MEDICAL_ASSISTANT_SYSTEM_PROMPT
});

/**
 * Generate AI response for medical consultation
 * @param {string} userMessage - The user's message
 * @param {Object} medicalForm - The user's medical form data
 * @param {Array} images - Array of base64 image data (optional)
 * @param {Array} messageHistory - Previous messages for context (optional)
 * @returns {Promise<string>} - AI response
 */
export async function generateMedicalResponse(userMessage, medicalForm = null, images = [], messageHistory = []) {
  try {
    // Prepare the conversation context
    let contextMessage = '';
    
    // Add medical form context if this is the first message or if form data is provided
    if (medicalForm) {
      contextMessage += `\n\n=== PATIENT MEDICAL INFORMATION ===\n`;
      contextMessage += `Name: ${medicalForm.name}\n`;
      contextMessage += `Age: ${medicalForm.age} years\n`;
      contextMessage += `Gender: ${medicalForm.gender}\n`;
      contextMessage += `Weight: ${medicalForm.weight}\n`;
      contextMessage += `Height: ${medicalForm.height}\n`;
      
      if (medicalForm.bloodType) {
        contextMessage += `Blood Type: ${medicalForm.bloodType}\n`;
      }
      
      if (medicalForm.currentComplications) {
        contextMessage += `\nCurrent Health Issues:\n${medicalForm.currentComplications}\n`;
      }
      
      if (medicalForm.chronicConditions) {
        contextMessage += `\nChronic Conditions:\n${medicalForm.chronicConditions}\n`;
      }
      
      if (medicalForm.medications) {
        contextMessage += `\nCurrent Medications:\n${medicalForm.medications}\n`;
      }
      
      if (medicalForm.allergies) {
        contextMessage += `\nKnown Allergies:\n${medicalForm.allergies}\n`;
      }
      
      // Diet information
      const dietInfo = [];
      if (medicalForm.breakfastDetails) dietInfo.push(`Breakfast: ${medicalForm.breakfastDetails}`);
      if (medicalForm.lunchDetails) dietInfo.push(`Lunch: ${medicalForm.lunchDetails}`);
      if (medicalForm.dinnerDetails) dietInfo.push(`Dinner: ${medicalForm.dinnerDetails}`);
      
      if (dietInfo.length > 0) {
        contextMessage += `\nDiet Information:\n${dietInfo.join('\n')}\n`;
      }
      
      contextMessage += `\n=== END PATIENT INFORMATION ===\n\n`;
    }

    // Prepare message parts
    const parts = [];
    
    // Add context and user message
    const fullMessage = contextMessage + (userMessage || "Please analyze my medical information and provide personalized health recommendations and guidance.");
    parts.push({ text: fullMessage });
    
    // Add images if provided
    if (images && images.length > 0) {
      for (const image of images) {
        // Convert base64 to the format Gemini expects
        if (image.startsWith('data:image/')) {
          const base64Data = image.split(',')[1];
          const mimeType = image.split(';')[0].split(':')[1];
          
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          });
        }
      }
    }

    console.log('Generating AI response with', parts.length, 'parts (text + images)');

    // Generate response
    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    console.log('AI response generated successfully, length:', text.length);
    return text;

  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Return a fallback response
    return `I apologize, but I'm experiencing technical difficulties at the moment. Please try again in a few moments. 

In the meantime, if you're experiencing any urgent medical concerns, please:
- Contact your healthcare provider immediately
- Call 911 for emergencies
- Visit your nearest urgent care or emergency room

I'll be back to help you with your health questions soon. Thank you for your patience.`;
  }
}

/**
 * Generate initial assessment based on medical form
 * @param {Object} medicalForm - The user's medical form data
 * @returns {Promise<string>} - Initial assessment response
 */
export async function generateInitialAssessment(medicalForm) {
  const initialMessage = `Please provide a comprehensive initial health assessment based on the medical information provided. Include:

1. A summary of the patient's current health status
2. Analysis of any concerning symptoms or conditions
3. Personalized recommendations for diet, lifestyle, and health management
4. Important safety considerations and when to seek immediate medical attention
5. Questions the patient should discuss with their healthcare provider

Please be thorough, empathetic, and focus on actionable advice while emphasizing the importance of professional medical care.`;

  return generateMedicalResponse(initialMessage, medicalForm);
}

export default {
  generateMedicalResponse,
  generateInitialAssessment
};