import { fetchWakatimeStats } from '../src/wakatime-api.js';
import { renderWakatimeCard } from '../src/render-wakatime.js';

export default async function handler(req, res) {
  const username = req.query.username;
  const themeQuery = req.query.theme || 'default';
  const themeName = typeof themeQuery === 'string' ? themeQuery.toLowerCase() : 'default';
  const layout = req.query.layout || 'default';

  if (!username) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(400).send(`
      <svg width="495" height="150" viewBox="0 0 495 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="494" height="149" rx="4.5" fill="#ffebee" stroke="#ef5350" />
        <text x="25" y="75" fill="#c62828" font-family="Segoe UI, Ubuntu, sans-serif" font-size="16" font-weight="600">
          Erro: Forneça o parâmetro ?username= na URL
        </text>
      </svg>
    `.trim());
  }

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, s-maxage=14400, stale-while-revalidate=86400"); // 4 hours

  try {
    const stats = await fetchWakatimeStats(username);
    const svg = renderWakatimeCard(stats, { themeName, layout });
    return res.status(200).send(svg);
  } catch (error) {
    const errorSvg = `
      <svg width="495" height="150" viewBox="0 0 495 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="494" height="149" rx="4.5" fill="#ffebee" stroke="#ef5350" />
        <text x="25" y="75" fill="#c62828" font-family="Segoe UI, Ubuntu, sans-serif" font-size="16" font-weight="600">
          Erro do WakaTime: ${error.message}
        </text>
      </svg>
    `;
    return res.status(500).send(errorSvg.trim());
  }
}
