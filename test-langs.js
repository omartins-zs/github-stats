import fs from 'fs';
import dotenv from 'dotenv';
import { fetchTopLanguages } from './src/top-langs-api.js';
import { renderTopLangs } from './src/render-top-langs.js';

dotenv.config();

const test = async () => {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.error("No GITHUB_TOKEN in .env");
      return;
    }
    
    console.log("Fetching top languages...");
    const data = await fetchTopLanguages('omartins-zs', token, 6);
    console.log("Found languages:", data.langs.map(l => l.name).join(', '));
    
    const svg = renderTopLangs(data, 'nord'); // testing with 'nord' as requested in user's README
    
    fs.writeFileSync('./test-langs.svg', svg);
    console.log("test-langs.svg generated successfully!");
  } catch (error) {
    console.error(error);
  }
};

test();
