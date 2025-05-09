import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return new NextResponse('Key parameter is required', { status: 400 });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    const { Body, ContentLength, ContentType } = await s3Client.send(command);

    if (!Body) {
      return new NextResponse('Video not found', { status: 404 });
    }

    // Convertir le corps de la réponse en ReadableStream
    const stream = Readable.toWeb(Body as Readable);

    const reader = stream.getReader();

    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': ContentType || 'video/mp4',
          'Content-Length': ContentLength?.toString() || '',
          'Accept-Ranges': 'bytes',
        },
      }
    );
  } catch (error) {
    console.error('Error streaming video:', error);
    return new NextResponse('Error streaming video', { status: 500 });
  }
}