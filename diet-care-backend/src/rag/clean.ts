const DEFAULT_STOP_LINES = [
  /all rights reserved/i,
  /copyright/i,
  /isbn/i,
  /printed in/i,
  /no part of this/i,
  /for educational purposes/i,
  /not intended to diagnose/i,
  /medical advice/i,
  /hak cipta/i,
  /dilarang keras/i,
  /undang-?undang/i,
  /uu\s*no/i,
  /penerbit/i,
  /cv\./i,
  /anggota ikapi/i,
  /www\./i,
  /terbit pada/i,
  /editor\s*:/i,
  /tata letak\s*:/i,
  /desain cover\s*:/i,
  /ukuran\s*:/i,
  /halaman\s*:/i,
];

const TERM_NORMALIZATIONS: Array<[RegExp, string]> = [
  [/\bkcal\b/gi, "kalori"],
  [/\bkilocalories\b/gi, "kalori"],
  [/\bcalories\b/gi, "kalori"],
  [/\bcalorie\b/gi, "kalori"],
  [/\bgrams?\b/gi, "gram"],
  [/\bmilligrams?\b/gi, "miligram"],
];

const removeRepeatedLines = (lines: string[]) => {
  const frequency = new Map<string, number>();
  const normalized = lines.map((line) => line.trim());
  normalized.forEach((line) => {
    if (!line) return;
    frequency.set(line, (frequency.get(line) ?? 0) + 1);
  });

  return lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    const count = frequency.get(trimmed) ?? 0;
    if (count >= 5) return false; // likely header/footer
    return true;
  });
};

const removePageNumbers = (lines: string[]) => {
  return lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (/^page\s*\d+$/i.test(trimmed)) return false;
    if (/^\d{1,4}$/.test(trimmed)) return false;
    if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(trimmed)) return false;
    return true;
  });
};

const removeStopLines = (lines: string[]) => {
  return lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    return !DEFAULT_STOP_LINES.some((pattern) => pattern.test(trimmed));
  });
};

const normalizeWhitespace = (text: string) => {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const fixBrokenLines = (text: string) => {
  // Merge lines that were hard-wrapped by PDF extraction.
  return text.replace(/([a-z0-9,;:])\n([a-z0-9])/g, "$1 $2");
};

const removePublisherBlocks = (text: string) => {
  return text.replace(
    /(penerbit|cv\.)[\s\S]{0,600}?(isbn\s*:?.*|www\.[\w.-]+|hak cipta.*)/gi,
    ""
  );
};

const applyTerminology = (text: string) => {
  let result = text;
  TERM_NORMALIZATIONS.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });
  return result;
};

export const cleanText = (rawText: string): string => {
  const lines = rawText.split(/\r?\n/);
  const withoutStop = removeStopLines(removePageNumbers(removeRepeatedLines(lines)));
  const merged = withoutStop.join("\n");
  const fixed = fixBrokenLines(removePublisherBlocks(merged));
  const normalized = normalizeWhitespace(fixed);
  return applyTerminology(normalized);
};
