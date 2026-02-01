import { searchNutrition } from "../services/rag.service.js";

type EvalCase = {
  query: string;
  mustInclude?: string[];
};

const cases: EvalCase[] = [
  { query: "kebutuhan kalori harian", mustInclude: ["kalori"] },
  { query: "fungsi protein", mustInclude: ["protein"] },
  { query: "karbohidrat kompleks", mustInclude: ["karbohidrat"] },
  { query: "lemak jenuh dan tidak jenuh", mustInclude: ["lemak"] },
  { query: "serat pangan", mustInclude: ["serat"] },
  { query: "vitamin larut lemak", mustInclude: ["vitamin"] },
  { query: "gizi seimbang", mustInclude: ["gizi"] },
  { query: "angka kecukupan gizi", mustInclude: ["kecukupan"] },
  { query: "antropometri", mustInclude: ["antropometri"] },
  { query: "status gizi", mustInclude: ["status", "gizi"] },
];

const containsAny = (text: string, terms: string[]) => {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
};

const scoreResults = (content: string[], terms: string[] | undefined) => {
  if (!terms || terms.length === 0) return false;
  return content.some((item) => containsAny(item, terms));
};

const evalCases = async () => {
  let hitAt3 = 0;
  let hitAt5 = 0;

  for (const evalCase of cases) {
    const { results } = await searchNutrition(evalCase.query, 5);
    const contents = results.map((result) => result.content);

    const rAt3 = scoreResults(contents.slice(0, 3), evalCase.mustInclude);
    const rAt5 = scoreResults(contents.slice(0, 5), evalCase.mustInclude);

    if (rAt3) hitAt3 += 1;
    if (rAt5) hitAt5 += 1;

    console.log(`Query: ${evalCase.query}`);
    console.log(`  R@3: ${rAt3 ? "hit" : "miss"}`);
    console.log(`  R@5: ${rAt5 ? "hit" : "miss"}`);
    console.log(`  Top result: ${results[0]?.content?.slice(0, 120) ?? "n/a"}...`);
    console.log("");
  }

  const total = cases.length;
  console.log("=== Summary ===");
  console.log(`R@3: ${hitAt3}/${total} = ${(hitAt3 / total * 100).toFixed(1)}%`);
  console.log(`R@5: ${hitAt5}/${total} = ${(hitAt5 / total * 100).toFixed(1)}%`);
};

// Usage:
// npx tsx src/rag/eval.ts
evalCases().catch((error) => {
  console.error(error);
  process.exit(1);
});
