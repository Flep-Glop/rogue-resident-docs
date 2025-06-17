import { NextResponse } from 'next/server';
import { getAllData } from '@/lib/dataUtils';

export async function GET() {
  try {
    const cardsData = await getAllData('cards');
    return NextResponse.json(cardsData);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards data' },
      { status: 500 }
    );
  }
} 