import { themes } from './themes.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Import JSON dynamically to support module resolution in Vercel/Node
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const languageColorsPath = path.resolve(__dirname, 'languageColors.json');
const languageColors = JSON.parse(fs.readFileSync(languageColorsPath, 'utf-8'));

export const renderWakatimeCard = (stats, options = {}) => {
  const {
    themeName = 'default',
    layout = 'default',
    langsCount = 5
  } = options;

  const theme = themes[themeName] || themes.default;
  const width = 495;
  
  let languages = stats.languages || [];
  languages = languages.filter(l => l.hours || l.minutes).slice(0, langsCount);

  // Recalculate percentages to sum up to 100%
  const totalSum = languages.reduce((sum, lang) => sum + lang.percent, 0);
  if (totalSum > 0) {
    const weight = 100 / totalSum;
    languages.forEach(lang => {
      lang.percent = +(lang.percent * weight).toFixed(2);
    });
  }

  const titleText = "WakaTime Stats";
  let contentSvg = "";
  let height = 150;

  if (layout === 'compact') {
    height = 90 + Math.round(languages.length / 2) * 25;
    
    // Progress Bar
    const barWidth = width - 50;
    let progressOffset = 0;
    const progressBarHTML = languages.map(lang => {
      const progress = (barWidth * lang.percent) / 100;
      const color = languageColors[lang.name] || "#858585";
      const html = `<rect mask="url(#rect-mask)" x="${progressOffset}" y="0" width="${progress}" height="8" fill="${color}" />`;
      progressOffset += progress;
      return html;
    }).join("");

    // Text Columns
    const renderCol = (colLangs, xOffset) => {
      return colLangs.map((lang, idx) => {
        const color = languageColors[lang.name] || "#858585";
        return `
          <g transform="translate(${xOffset}, ${idx * 25})">
            <circle cx="5" cy="6" r="5" fill="${color}" />
            <text x="15" y="10" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="12px" font-weight="400" fill="#${theme.text_color}">
              ${lang.name} - ${lang.text}
            </text>
          </g>
        `;
      }).join("");
    };

    const mid = Math.ceil(languages.length / 2);
    const leftCol = languages.filter((_, idx) => idx % 2 === 0);
    const rightCol = languages.filter((_, idx) => idx % 2 !== 0);

    contentSvg = `
      <g transform="translate(25, 55)">
        <mask id="rect-mask">
          <rect x="0" y="0" width="${barWidth}" height="8" fill="white" rx="4"/>
        </mask>
        ${progressBarHTML}
      </g>
      <g transform="translate(25, 80)">
        ${renderCol(leftCol, 0)}
        ${renderCol(rightCol, 230)}
      </g>
    `;
  } else {
    // Default Layout
    height = Math.max(45 + (languages.length + 1) * 25, 150);
    
    contentSvg = languages.map((lang, index) => {
      const color = languageColors[lang.name] || "#858585";
      const progressWidth = width - 275;
      const progress = (progressWidth * lang.percent) / 100;
      
      return `
        <g transform="translate(25, ${55 + index * 25})">
          <text x="0" y="10" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="12px" font-weight="600" fill="#${theme.text_color}">
            ${lang.name}:
          </text>
          <text x="130" y="10" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="12px" font-weight="400" fill="#${theme.text_color}">
            ${lang.text}
          </text>
          <g transform="translate(250, 2)">
            <rect x="0" y="0" width="${progressWidth}" height="8" fill="#${theme.text_color}" opacity="0.2" rx="4"/>
            <rect x="0" y="0" width="${progress}" height="8" fill="${color}" rx="4"/>
          </g>
        </g>
      `;
    }).join("");
  }

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="4.5" fill="#${theme.bg_color}" stroke="#${theme.border_color}" stroke-width="1"/>
      <text x="25" y="35" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-weight="600" font-size="16px" fill="#${theme.title_color}">${titleText}</text>
      ${contentSvg}
    </svg>
  `.trim();
};
