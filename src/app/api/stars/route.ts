import { NextResponse } from 'next/server';
import { getAllData } from '@/lib/dataUtils';

export async function GET() {
  try {
    const starsData = await getAllData('stars');
    return NextResponse.json(starsData);
  } catch (error) {
    console.error('Error fetching stars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stars data' },
      { status: 500 }
    );
  }
} 