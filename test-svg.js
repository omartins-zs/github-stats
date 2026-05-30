import fs from 'fs';
import { renderCard } from './src/render-card.js';

const dummyStats = {
  name: 'Gabriel Martins',
  totalStars: 120,
  totalCommits: 450,
  totalPRs: 20,
  totalIssues: 10
};

const svg = renderCard(dummyStats, 'prussian');
fs.writeFileSync('test.svg', svg);
console.log("test.svg generated");
