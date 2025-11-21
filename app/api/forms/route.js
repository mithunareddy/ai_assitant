import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { medicalForms, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request) {
  try { // <-- added: wrap handler logic in try
    const { userId } = auth(); // unchanged usage; now resolves correctly
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      age,
      gender,
      weight,
      height,
      bloodType,
      currentComplications,
      breakfastDetails,
      lunchDetails,
      dinnerDetails,
      medications,
      allergies,
      chronicConditions,
      uploadedImages
    } = body;

    // Validate required fields
    if (!name || !age || !gender || !weight || !height) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Ensure user exists in database
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (existingUser.length === 0) {
      // Get user email from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);
      const userEmail = clerkUser.emailAddresses[0]?.emailAddress || '';
      
      // Create user record if it doesn't exist
      await db.insert(users).values({
        id: userId,
        email: userEmail,
        firstName: clerkUser.firstName || name.split(' ')[0] || '',
        lastName: clerkUser.lastName || name.split(' ').slice(1).join(' ') || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert medical form
    const result = await db.insert(medicalForms).values({
      userId,
      name,
      age: parseInt(age),
      gender,
      weight,
      height,
      bloodType: bloodType || null,
      currentComplications: currentComplications || null,
      breakfastDetails: breakfastDetails || null,
      lunchDetails: lunchDetails || null,
      dinnerDetails: dinnerDetails || null,
      medications: medications || null,
      allergies: allergies || null,
      chronicConditions: chronicConditions || null,
      uploadedImages: uploadedImages || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning({ id: medicalForms.id });

    console.log('Medical form created:', result[0]);

    return NextResponse.json({
      success: true,
      formId: result[0].id,
      message: 'Medical form submitted successfully'
    });
  } catch (error) { // <-- existing catch now matches the try above
    console.error('Error creating medical form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}