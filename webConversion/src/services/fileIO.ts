/**
 * File I/O Service
 * Handles saving and loading IL programs
 * Converted from src/save/Save.java
 */

import { FILE_CONFIG } from '../utils/constants';

/**
 * Service for file operations (save/load IL programs)
 */
export class FileIOService {
  /**
   * Save program to a text file
   * @param programText - The IL program text to save
   * @param filename - Optional filename (default: "program.txt")
   */
  static saveProgramToFile(programText: string, filename?: string): void {
    try {
      // Create filename with extension
      const fullFilename = filename
        ? filename.endsWith(FILE_CONFIG.PROGRAM_EXTENSION)
          ? filename
          : `${filename}${FILE_CONFIG.PROGRAM_EXTENSION}`
        : FILE_CONFIG.DEFAULT_FILENAME;

      // Create blob with program content
      const blob = new Blob([programText], { type: FILE_CONFIG.MIME_TYPE });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fullFilename;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving program:', error);
      throw new Error(`Failed to save program: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load program from a text file
   * @param file - The file object to load
   * @returns Promise with the program text
   */
  static async loadProgramFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.name.endsWith(FILE_CONFIG.PROGRAM_EXTENSION)) {
        reject(
          new Error(
            `Invalid file type. Expected ${FILE_CONFIG.PROGRAM_EXTENSION} file, got ${file.name}`
          )
        );
        return;
      }

      // Read file
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;

          if (!text) {
            reject(new Error('File is empty'));
            return;
          }

          resolve(text);
        } catch (error) {
          reject(
            new Error(
              `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
          );
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Create a file input element and trigger file selection
   * @returns Promise with the selected file
   */
  static async selectFile(): Promise<File> {
    return new Promise((resolve, reject) => {
      // Create file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = FILE_CONFIG.PROGRAM_EXTENSION;

      // Handle file selection
      input.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (file) {
          resolve(file);
        } else {
          reject(new Error('No file selected'));
        }
      };

      // Handle cancellation
      input.oncancel = () => {
        reject(new Error('File selection cancelled'));
      };

      // Trigger file selection dialog
      input.click();
    });
  }

  /**
   * Open file dialog and load program
   * Convenience method that combines selectFile and loadProgramFromFile
   * @returns Promise with the program text
   */
  static async openProgram(): Promise<string> {
    try {
      const file = await this.selectFile();
      return await this.loadProgramFromFile(file);
    } catch (error) {
      throw new Error(
        `Failed to open program: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate program text
   * Basic validation - checks if program is not empty
   * @param programText - The program text to validate
   * @returns true if valid, false otherwise
   */
  static validateProgram(programText: string): boolean {
    // Check if not empty
    if (!programText || programText.trim().length === 0) {
      return false;
    }

    // Basic check - at least one line with content
    const lines = programText.split('\n').filter((line) => line.trim().length > 0);
    return lines.length > 0;
  }

  /**
   * Get file extension from filename
   * @param filename - The filename
   * @returns The file extension (including dot)
   */
  static getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot === -1 ? '' : filename.substring(lastDot);
  }

  /**
   * Remove file extension from filename
   * @param filename - The filename
   * @returns The filename without extension
   */
  static removeFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot === -1 ? filename : filename.substring(0, lastDot);
  }
}
