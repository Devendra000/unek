// Fuzzy search implementation similar to VS Code
export function fuzzyMatch(query: string, text: string): { score: number; positions: number[] } {
  const queryLower = query.toLowerCase().trim();
  const textLower = text.toLowerCase();

  if (!queryLower) return { score: 1, positions: [] };
  
  // Handle multi-word queries (word-order independent)
  if (queryLower.includes(' ')) {
    const words = queryLower.split(' ').filter(w => w.length > 0);
    const allMatches: number[] = [];
    let totalScore = 0;
    
    // Check if all words are found in text
    for (const word of words) {
      if (!textLower.includes(word.charAt(0))) return { score: 0, positions: [] };
      
      const wordMatch = fuzzyMatchSingleWord(word, textLower);
      if (wordMatch.score === 0) return { score: 0, positions: [] };
      
      totalScore += wordMatch.score;
      allMatches.push(...wordMatch.positions);
    }
    
    // Sort positions for highlighting
    allMatches.sort((a, b) => a - b);
    return { score: totalScore / words.length, positions: allMatches };
  }
  
  return fuzzyMatchSingleWord(queryLower, textLower);
}

function fuzzyMatchSingleWord(query: string, text: string): { score: number; positions: number[] } {
  if (!query) return { score: 1, positions: [] };
  if (!text.includes(query.charAt(0))) return { score: 0, positions: [] };

  let queryIdx = 0;
  let textIdx = 0;
  let score = 0;
  let consecutiveMatches = 0;
  const positions: number[] = [];

  while (queryIdx < query.length && textIdx < text.length) {
    if (query[queryIdx] === text[textIdx]) {
      consecutiveMatches++;
      score += 10 + consecutiveMatches;
      positions.push(textIdx);
      queryIdx++;
    } else {
      consecutiveMatches = 0;
      score -= 0.5;  // Reduced penalty from 1 to 0.5
    }
    textIdx++;
  }

  if (queryIdx !== query.length) return { score: 0, positions: [] };

  score -= (textIdx - query.length) * 0.1;  // Reduced gap penalty

  if (text.indexOf(query.charAt(0)) === 0) {
    score += 20;
  }

  // Bonus for finding all characters of the query
  score += query.length * 2;

  return { score: Math.max(0, score), positions };
}

export interface FuzzyResult<T> {
  item: T;
  score: number;
  matchPositions: { [key: string]: number[] };
}

export function fuzzySearchWithPositions<T extends Record<string, any>>(
  query: string,
  items: T[],
  fields: string[]
): FuzzyResult<T>[] {
  if (!query.trim()) return items.map((item) => ({ item, score: 1, matchPositions: {} }));

  const results = items
    .map((item) => {
      let maxScore = 0;
      const matchPositions: { [key: string]: number[] } = {};
      
      for (const field of fields) {
        const value = item[field];
        if (typeof value === 'string') {
          const { score, positions } = fuzzyMatch(query, value);
          if (score > 0) {
            matchPositions[field] = positions;
          }
          maxScore = Math.max(maxScore, score);
        }
      }
      
      return { item, score: maxScore, matchPositions };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  return results;
}

export function fuzzySearch<T extends Record<string, any>>(
  query: string,
  items: T[],
  fields: string[]
): T[] {
  if (!query.trim()) return items;

  const results = items
    .map((item) => {
      let maxScore = 0;
      
      for (const field of fields) {
        const value = item[field];
        if (typeof value === 'string') {
          const { score } = fuzzyMatch(query, value);
          maxScore = Math.max(maxScore, score);
        }
      }
      
      return { item, score: maxScore };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item);

  return results;
}

export function highlightFuzzyMatches(text: string, positions: number[]): Array<{ text: string; highlighted: boolean }> {
  if (positions.length === 0) return [{ text, highlighted: false }];

  const posSet = new Set(positions);
  const parts: Array<{ text: string; highlighted: boolean }> = [];
  let highlightStart = -1;

  for (let i = 0; i < text.length; i++) {
    if (posSet.has(i)) {
      if (highlightStart === -1) {
        highlightStart = i;
      }
    } else {
      if (highlightStart !== -1) {
        parts.push({
          text: text.substring(highlightStart, i),
          highlighted: true,
        });
        highlightStart = -1;
      }
      parts.push({
        text: text[i],
        highlighted: false,
      });
    }
  }

  if (highlightStart !== -1) {
    parts.push({
      text: text.substring(highlightStart),
      highlighted: true,
    });
  }

  return parts;
}
