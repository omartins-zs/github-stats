import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { fetchStats } from './src/github-api.js';
import { renderCard } from './src/render-card.js';

// Configuration
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'omartins-zs';
const THEME = process.env.THEME || 'default';
const TOKEN = process.env.GITHUB_TOKEN;

const run = async () => {
  if (!TOKEN) {
    console.error("ERRO: GITHUB_TOKEN environment variable is missing.");
    process.exit(1);
  }

  console.log(`[GitHub Actions] Buscando estatísticas para ${GITHUB_USERNAME}...`);
  try {
    const stats = await fetchStats(GITHUB_USERNAME, TOKEN);
    console.log("[GitHub Actions] Estatísticas obtidas com sucesso!");

    const svg = renderCard(stats, THEME);
    
    // Create dist directory if it doesn't exist
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir);
    }

    const outputPath = path.join(distDir, 'stats.svg');
    fs.writeFileSync(outputPath, svg);
    console.log(`[GitHub Actions] Card SVG gerado com sucesso em: ${outputPath}`);
  } catch (error) {
    console.error("[GitHub Actions] Falha ao gerar o card:", error.message);
    process.exit(1);
  }
};

run();
