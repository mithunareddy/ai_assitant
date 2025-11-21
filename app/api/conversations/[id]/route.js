import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, medicalForms, messages } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request, { params }) {
  try {
    const { userId } = auth(); // unchanged usage; now resolves correctly
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversationId = params.id;

    // Fetch conversation with medical form
    const conversationResult = await db
      .select({
        id: conversations.id,
        userId: conversations.userId,
        formId: conversations.formId,
        title: conversations.title,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        medicalForm: medicalForms
      })
      .from(conversations)
      .leftJoin(medicalForms, eq(conversations.formId, medicalForms.id))
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (conversationResult.length === 0 || conversationResult[0].userId !== userId) {
      return NextResponse.json(
        { error: 'Conversation not found or unauthorized' },
        { status: 404 }
      );
    }

    // Fetch messages for this conversation
    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));

    console.log('Fetched conversation:', conversationId, 'with', conversationMessages.length, 'messages');

    return NextResponse.json({
      conversation: conversationResult[0],
      messages: conversationMessages
    });

  } catch (error) {
    console.error('Error fetching conversation:', error);
    
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