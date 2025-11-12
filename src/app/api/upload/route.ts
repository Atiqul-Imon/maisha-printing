import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth-api';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

/**
 * Upload image to Cloudinary
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication using request-based method (more reliable in API routes)
    const session = await getSessionFromRequest(request);
    
    // Debug logging
    console.log('Upload route - Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      userId: session?.user?.id,
    });
    
    if (!session || !session.user) {
      console.error('Upload route - Authentication failed: No valid session');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Your account cannot be authenticated. Please log out and log in again.' 
        },
        { status: 401 }
      );
    }

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
    const fileName = `${timestamp}-${randomString}-${sanitizedFileName}`;

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Normalize folder path (remove leading/trailing slashes)
    const normalizedFolder = folder.replace(/^\/+|\/+$/g, '');

    console.log('Cloudinary upload request:', {
      fileName,
      folder: normalizedFolder || '(root)',
      fileSize: file.size,
      fileType: file.type,
    });

    // Convert buffer to stream for Cloudinary
    const stream = Readable.from(fileBuffer);

    // Upload to Cloudinary
    try {
      interface CloudinaryUploadResult {
        public_id: string;
        secure_url: string;
        url: string;
        width: number;
        height: number;
        original_filename?: string;
        format: string;
        bytes: number;
      }

      const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: normalizedFolder || undefined,
            public_id: fileName.replace(/\.[^/.]+$/, ''), // Remove extension for public_id
            resource_type: 'auto',
            overwrite: false,
            invalidate: true,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (!result) {
              reject(new Error('Cloudinary upload returned null result'));
            } else {
              resolve(result);
            }
          }
        );

        stream.pipe(uploadStream);
      });

      console.log('Cloudinary upload success:', {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
      });

      // Return the Cloudinary response
      return NextResponse.json({
        success: true,
        data: {
          url: uploadResult.secure_url,
          fileId: uploadResult.public_id,
          name: uploadResult.original_filename || fileName,
          filePath: uploadResult.public_id,
          thumbnailUrl: uploadResult.secure_url,
          width: uploadResult.width,
          height: uploadResult.height,
        },
      });
    } catch (uploadError: unknown) {
      // Handle Cloudinary errors
      console.error('Cloudinary upload error - Full details:', {
        error: uploadError,
        message: uploadError instanceof Error ? uploadError.message : 'Unknown error',
        errorType: uploadError instanceof Error ? uploadError.constructor.name : typeof uploadError,
      });

      let errorMessage = 'Failed to upload image to Cloudinary';
      
      if (uploadError instanceof Error) {
        errorMessage = uploadError.message;
      } else {
        errorMessage = String(uploadError) || 'Unknown error from Cloudinary';
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading image - Full error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred during image upload';
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to upload image: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}
