/**
 * Filesystem utilities for safe file operations
 * Server-side only - uses Node.js fs module
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Ensures a directory exists, creates it if it doesn't
 * @param dirPath Absolute path to directory
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    // Directory doesn't exist, create it
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Safely writes content to a file
 * Creates parent directory if it doesn't exist
 * @param filePath Absolute path to file
 * @param content Content to write
 */
export async function safeWriteFile(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);
  await ensureDir(dir);
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Reads a file safely
 * @param filePath Absolute path to file
 * @returns File content as string
 */
export async function safeReadFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, 'utf-8');
}

/**
 * Checks if a file exists
 * @param filePath Absolute path to file
 * @returns true if file exists, false otherwise
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets project root directory
 * @returns Absolute path to project root
 */
export function getProjectRoot(): string {
  return process.cwd();
}

/**
 * Gets paths for data directories
 */
export function getDataDirectories() {
  const root = getProjectRoot();
  return {
    logs: path.join(root, 'logs'),
    reports: path.join(root, 'reports'),
    articles: path.join(root, 'articles'),
  };
}
