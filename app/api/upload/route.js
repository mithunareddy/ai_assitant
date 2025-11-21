import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For this implementation, we're handling images as base64 strings
    // In a production app, you might want to upload to a cloud storage service
    const formData = await request.formData();
    const files = formData.getAll('files');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (file instanceof File && file.type.startsWith('image/')) {
        // Convert to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        
        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          data: dataUrl
        });
      }
    }

    console.log('Uploaded', uploadedFiles.length, 'files for user:', userId);

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: 'Files uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}