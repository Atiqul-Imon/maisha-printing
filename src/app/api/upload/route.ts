import { NextRequest, NextResponse } from 'next/server';

const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/dtqqmnmqo';
const IMAGEKIT_PRIVATE_KEY = 'CELMONWRfc5WrCRuwKsW3raUqw=';

/**
 * Upload image to ImageKit using private key authentication
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'products';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${folder}/${timestamp}-${randomString}-${sanitizedFileName}`;

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString('base64');

    // Create form data for ImageKit upload
    const imageKitFormData = new FormData();
    imageKitFormData.append('file', base64File); // base64 encoded file
    imageKitFormData.append('fileName', fileName);
    imageKitFormData.append('useUniqueFileName', 'false'); // We're already creating unique names
    imageKitFormData.append('folder', folder);

    // Upload to ImageKit using their upload API
    // ImageKit expects authentication via Authorization header with private key
    const authHeader = Buffer.from(`${IMAGEKIT_PRIVATE_KEY}:`).toString('base64');

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
      },
      body: imageKitFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to upload image';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      console.error('ImageKit upload error:', errorMessage, response.status);
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: response.status || 500 }
      );
    }

    const result = await response.json();

    // Construct the full URL
    const imageUrl = result.url || `${IMAGEKIT_URL_ENDPOINT}/${result.filePath}`;

    // Return the ImageKit URL
    return NextResponse.json({
      success: true,
      data: {
        url: imageUrl,
        fileId: result.fileId,
        name: result.name || fileName,
        filePath: result.filePath,
        thumbnailUrl: result.thumbnailUrl || imageUrl,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

