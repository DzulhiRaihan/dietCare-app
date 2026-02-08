import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MealType } from "@prisma/client";
import { prisma } from "../database/prisma.js";

type FoodRow = {
  foodName_id: string;
  foodName_en: string;
  category: string;
  mealType: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_FILE = path.resolve(__dirname, "../data/final_translated_food_items.csv");

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
        continue;
      }
      if (ch === '"') {
        inQuotes = false;
        continue;
      }
      field += ch;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ',') {
      row.push(field);
      field = "";
      continue;
    }

    if (ch === '\n') {
      row.push(field);
      field = "";
      if (row.some((v) => v.length > 0)) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    if (ch === '\r') {
      continue;
    }

    field += ch;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function toNumber(value: string): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeCategory(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed
    .split("/")
    .map((part) =>
      part
        .trim()
        .toLowerCase()
        .replace(/(^|[-\s])([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
    )
    .join("/");
}

function mapMealType(value: string): MealType | null {
  const v = value.trim().toLowerCase();
  if (!v) return null;
  const map: Record<string, string> = {
    breakfast: "BREAKFAST",
    lunch: "LUNCH",
    dinner: "DINNER",
    snack: "SNACK",
    side: "SIDE",
  };
  return (map[v] ?? null) as MealType | null;
}

function extractServingLabel(name: string): { name: string; servingLabel: string | null } {
  const match = name.match(/^(.*)\(([^)]+)\)\s*$/);
  if (!match || !match[1] || !match[2]) return { name: name.trim(), servingLabel: null };
  return {
    name: match[1].trim(),
    servingLabel: match[2].trim(),
  };
}

async function importFoods(filePath: string, reset: boolean) {
  const csvText = fs.readFileSync(filePath, "utf8");
  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    throw new Error("CSV appears to be empty or missing header.");
  }

  const [header, ...data] = rows;
  if (!header) {
    throw new Error("CSV header is missing.");
  }
  const idx = Object.fromEntries(header.map((h, i) => [h, i])) as Record<string, number>;

  const foods = data
    .map((row) => {
      const record: FoodRow = {
        foodName_id: row[idx["foodName_id"] ?? -1] ?? "",
        foodName_en: row[idx["foodName_en"] ?? -1] ?? "",
        category: row[idx["category"] ?? -1] ?? "",
        mealType: row[idx["mealType"] ?? -1] ?? "",
        calories: row[idx["calories"] ?? -1] ?? "",
        protein: row[idx["protein"] ?? -1] ?? "",
        carbs: row[idx["carbs"] ?? -1] ?? "",
        fat: row[idx["fat"] ?? -1] ?? "",
      };

      const { name, servingLabel } = extractServingLabel(record.foodName_id);
      return {
        name,
        nameEn: record.foodName_en?.trim() || null,
        servingLabel,
        mealType: mapMealType(record.mealType),
        category: normalizeCategory(record.category),
        calories: toNumber(record.calories),
        protein: toNumber(record.protein),
        carbs: toNumber(record.carbs),
        fat: toNumber(record.fat),
      };
    })
    .filter((item) => item.name.length > 0);

  if (reset) {
    await prisma.food.deleteMany();
  }

  const batchSize = 500;
  for (let i = 0; i < foods.length; i += batchSize) {
    const batch = foods.slice(i, i + batchSize);
    await prisma.food.createMany({ data: batch });
  }

  return foods.length;
}

const args = new Set(process.argv.slice(2));
const fileArgIndex = process.argv.findIndex((arg) => arg === "--file");
const filePath = fileArgIndex > -1 ? process.argv[fileArgIndex + 1] : DEFAULT_FILE;
const reset = args.has("--reset");

if (!filePath) {
  throw new Error("Missing --file argument value.");
}

importFoods(path.resolve(filePath), reset)
  .then((count) => {
    console.log(`Imported ${count} foods.`);
  })
  .catch((err) => {
    console.error("Food import failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
