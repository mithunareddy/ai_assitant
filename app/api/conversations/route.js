// import { auth } from '@clerk/nextjs/server' // replaced: wrong import for server-side route handlers
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, medicalForms } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

// GET all conversations for user
export async function GET(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userConversations = await db
      .select({
        id: conversations.id,
        userId: conversations.userId,
        formId: conversations.formId,
        title: conversations.title,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        medicalForm: {
          id: medicalForms.id,
          name: medicalForms.name,
          age: medicalForms.age,
        }
      })
      .from(conversations)
      .leftJoin(medicalForms, eq(conversations.formId, medicalForms.id))
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));

    console.log('Fetched conversations for user:', userId, userConversations.length);

    return NextResponse.json({
      conversations: userConversations
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    
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

// POST create new conversation
export async function POST(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { formId } = body;

    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    // Verify the form belongs to the user
    const form = await db
      .select()
      .from(medicalForms)
      .where(eq(medicalForms.id, formId))
      .limit(1);

    if (form.length === 0 || form[0].userId !== userId) {
      return NextResponse.json(
        { error: 'Form not found or unauthorized' },
        { status: 404 }
      );
    }

    // Create conversation
    const result = await db.insert(conversations).values({
      userId,
      formId,
      title: `Health Consultation - ${form[0].name}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning({ id: conversations.id });

    console.log('Conversation created:', result[0]);

    return NextResponse.json({
      success: true,
      conversationId: result[0].id,
      message: 'Conversation created successfully'
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    
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