import { NextRequest, NextResponse } from 'next/server';
import { generateExport, ExportOptions } from '@/lib/exportUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, includeSystems, includeRelated, maxTokens } = body;

    // Validate required fields
    if (!format || !includeSystems || !Array.isArray(includeSystems)) {
      return NextResponse.json(
        { error: 'Missing required fields: format, includeSystems' },
        { status: 400 }
      );
    }

    // Validate format
    const validFormats = ['claude-context', 'cursor-dev', 'team-review', 'system-overview'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format. Must be one of: ${validFormats.join(', ')}` },
        { status: 400 }
      );
    }

    const options: ExportOptions = {
      format,
      includeSystems,
      includeRelated: includeRelated || false,
      maxTokens: maxTokens || undefined,
    };

    const exportContent = await generateExport(options);

    return NextResponse.json({
      content: exportContent,
      format,
      generatedAt: new Date().toISOString(),
      systems: includeSystems,
    });
  } catch (error) {
    console.error('Error generating export:', error);
    return NextResponse.json(
      { error: 'Failed to generate export' },
      { status: 500 }
    );
  }
} 