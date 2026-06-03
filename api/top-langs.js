import { fetchTopLanguages } from '../src/top-langs-api.js';
import { renderTopLangs } from '../src/render-top-langs.js';

// Constant user since this is a private microservice
const GITHUB_USERNAME = 'omartins-zs';

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const theme = req.query.theme || 'default';

  if (!token) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(500).send(`
      <svg width="450" height="195" viewBox="0 0 450 195" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="449" height="194" rx="4.5" fill="#ffebee" stroke="#ef5350" />
        <text x="25" y="100" fill="#c62828" font-family="Segoe UI, Ubuntu, sans-serif" font-size="16" font-weight="600">
          Erro Vercel: Configure a Variavel GITHUB_TOKEN
        </text>
      </svg>
    `.trim());
  }

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, s-maxage=14400, stale-while-revalidate=86400"); // 4 hours

  try {
    const langData = await fetchTopLanguages(GITHUB_USERNAME, token, 6);
    const svg = renderTopLangs(langData, theme);
    return res.status(200).send(svg);
  } catch (error) {
    const errorSvg = `
      <svg width="450" height="195" viewBox="0 0 450 195" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="449" height="194" rx="4.5" fill="#ffebee" stroke="#ef5350" />
        <text x="25" y="100" fill="#c62828" font-family="Segoe UI, Ubuntu, sans-serif" font-size="16" font-weight="600">
          Erro ao carregar top langs: ${error.message}
        </text>
      </svg>
    `;
    return res.status(500).send(errorSvg.trim());
  }
}
