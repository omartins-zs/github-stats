import { themes } from './themes.js';

export const renderTopLangs = (langData, themeName = 'default') => {
  const { langs, totalSize } = langData;
  const theme = themes[themeName] || themes.default;
  
  const width = 300;
  const height = 90 + Math.ceil(langs.length / 2) * 25; // 165 for 6 langs
  const barWidth = width - 50; // 250
  
  let progressOffset = 0;
  const progressBarHTML = langs.map(lang => {
    const percentage = parseFloat(((lang.size / totalSize) * barWidth).toFixed(2));
    const progress = percentage < 10 ? percentage + 10 : percentage; // Original code hack for visibility
    const html = `<rect mask="url(#rect-mask)" x="${progressOffset}" y="0" width="${progress}" height="8" fill="${lang.color}" />`;
    progressOffset += percentage;
    return html;
  }).join("");

  // Divide into two columns
  const mid = Math.ceil(langs.length / 2);
  const leftCol = langs.slice(0, mid);
  const rightCol = langs.slice(mid);

  const renderCol = (colLangs, xOffset) => {
    return colLangs.map((lang, idx) => {
      const percentage = ((lang.size / totalSize) * 100).toFixed(2);
      return `
        <g transform="translate(${xOffset}, ${idx * 25})">
          <circle cx="5" cy="6" r="5" fill="${lang.color}" />
          <text x="15" y="10" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-size="11px" font-weight="400" fill="#${theme.text_color}">
            ${lang.name} ${percentage}%
          </text>
        </g>
      `;
    }).join("");
  };

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="4.5" fill="#${theme.bg_color}" stroke="#${theme.border_color}" stroke-width="1"/>
      
      <text x="25" y="35" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-weight="600" font-size="16px" fill="#${theme.title_color}">Most Used Languages</text>
      
      <g transform="translate(25, 55)">
        <mask id="rect-mask">
          <rect x="0" y="0" width="${barWidth}" height="8" fill="white" rx="4"/>
        </mask>
        ${progressBarHTML}
      </g>

      <g transform="translate(25, 80)">
        ${renderCol(leftCol, 0)}
        ${renderCol(rightCol, 150)}
      </g>
    </svg>
  `.trim();
};
