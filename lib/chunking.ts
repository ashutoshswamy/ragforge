interface Chunk {
  text: string;
  index: number;
}

const SEPARATORS = ["\n\n", "\n", ". ", " "];

function splitText(
  text: string,
  chunkSize: number,
  chunkOverlap: number,
  separatorIndex: number = 0
): string[] {
  if (text.length <= chunkSize) {
    return [text];
  }

  const separator = SEPARATORS[separatorIndex];
  if (separatorIndex >= SEPARATORS.length - 1) {
    // Last resort: hard split by characters
    const pieces: string[] = [];
    let start = 0;
    while (start < text.length) {
      pieces.push(text.slice(start, start + chunkSize));
      start += chunkSize - chunkOverlap;
    }
    return pieces;
  }

  const parts = text.split(separator);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const part of parts) {
    const candidate = currentChunk
      ? currentChunk + separator + part
      : part;

    if (candidate.length > chunkSize && currentChunk) {
      chunks.push(currentChunk);
      // Apply overlap: keep the tail of the current chunk
      if (chunkOverlap > 0 && currentChunk.length > chunkOverlap) {
        currentChunk = currentChunk.slice(-chunkOverlap) + separator + part;
      } else {
        currentChunk = part;
      }
    } else {
      currentChunk = candidate;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  // Recursively split any chunks that are still too large
  const result: string[] = [];
  for (const chunk of chunks) {
    if (chunk.length > chunkSize) {
      result.push(
        ...splitText(chunk, chunkSize, chunkOverlap, separatorIndex + 1)
      );
    } else {
      result.push(chunk);
    }
  }

  return result;
}

export function chunkText(
  text: string,
  chunkSize: number,
  chunkOverlap: number
): Chunk[] {
  const pieces = splitText(text.trim(), chunkSize, chunkOverlap);
  return pieces
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t, i) => ({ text: t, index: i }));
}
