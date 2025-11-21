import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, messages, medicalForms } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { generateMedicalResponse, generateInitialAssessment } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, message, images = [] } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Verify conversation belongs to user and get medical form
    const conversationData = await db
      .select({
        conversation: conversations,
        medicalForm: medicalForms
      })
      .from(conversations)
      .leftJoin(medicalForms, eq(conversations.formId, medicalForms.id))
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (conversationData.length === 0 || conversationData[0].conversation.userId !== userId) {
      return NextResponse.json(
        { error: 'Conversation not found or unauthorized' },
        { status: 404 }
      );
    }

    const { conversation, medicalForm } = conversationData[0];

    // Get existing messages to check if this is the first interaction
    const existingMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId));

    let aiResponse;
    
    // If there are no existing messages, this is the initial assessment
    if (existingMessages.length === 0 && (!message || message.trim().length === 0)) {
      console.log('Generating initial assessment for conversation:', conversationId);
      aiResponse = await generateInitialAssessment(medicalForm);
      
      // Save the initial AI message
      await db.insert(messages).values({
        conversationId,
        role: 'assistant',
        content: aiResponse,
        images: null,
        createdAt: new Date(),
      });
      
    } else {
      // Regular message interaction
      if (!message || message.trim().length === 0) {
        return NextResponse.json(
          { error: 'Message is required' },
          { status: 400 }
        );
      }

      // Save user message first
      await db.insert(messages).values({
        conversationId,
        role: 'user',
        content: message,
        images: images.length > 0 ? images : null,
        createdAt: new Date(),
      });

      console.log('Generating AI response for user message in conversation:', conversationId);
      
      // Get recent message history for context (last 10 messages)
      const recentMessages = existingMessages
        .slice(-10)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
          images: msg.images
        }));

      // Generate AI response
      aiResponse = await generateMedicalResponse(
        message, 
        medicalForm, 
        images, 
        recentMessages
      );

      // Save AI response
      await db.insert(messages).values({
        conversationId,
        role: 'assistant',
        content: aiResponse,
        images: null,
        createdAt: new Date(),
      });
    }

    // Update conversation timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    console.log('Chat interaction completed for conversation:', conversationId);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      conversationId
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Check if it's a database connection error
    if (error.message?.includes('fetch failed') || error.code === 'UND_ERR_CONNECT_TIMEOUT') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}