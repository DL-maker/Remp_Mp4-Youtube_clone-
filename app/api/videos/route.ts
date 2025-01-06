import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for example - replace with your actual data fetching logic
    const videos = [
      { id: 1, title: 'Video 1', views: 1200, likes: 45, dislikes: 2, date: "2024-03-15" },
      { id: 2, title: 'Video 2', views: 800, likes: 30, dislikes: 5, date: "2024-03-16" },
    ];

    return NextResponse.json(videos);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
