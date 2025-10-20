/**
 * API endpoint to serve article JSON files
 * GET /api/articles/[filename]
 */

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { safeReadFile, fileExists, getDataDirectories } from '@/lib/filesystem';
import { isValidFilename } from '@/lib/sanitize';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Validate filename to prevent directory traversal attacks
    if (!isValidFilename(filename)) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    // Ensure filename has .json extension
    if (!filename.endsWith('.json')) {
      return NextResponse.json(
        { error: 'File must be a JSON file' },
        { status: 400 }
      );
    }

    // Construct full file path
    const { articles: articlesDir } = getDataDirectories();
    const filePath = path.join(articlesDir, filename);

    // Check if file exists
    if (!(await fileExists(filePath))) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read and parse JSON file
    const fileContent = await safeReadFile(filePath);
    const jsonData = JSON.parse(fileContent);

    // Return JSON with proper headers
    return NextResponse.json(jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error serving article file:', error);
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    );
  }
}
