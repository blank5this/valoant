// Valorant 准星参数默认值
export const DEFAULT_CROSSHAIR = {
  color: 'Red', // Red, Green, Blue, Yellow, Orange, Purple, Pink, White
  colorCode: '#FF4655', // 对应的颜色代码
  outline: false,
  outlineColor: '#000000',
  outlineThickness: 0,
  filled: false,
  centerDot: true,
  centerDotThickness: 2,
  thickness: 0,
  length: 0,
  gap: 0,
};

// 颜色选项
export const COLORS = [
  { name: 'Red', code: '#FF4655' },
  { name: 'Green', code: '#00FF88' },
  { name: 'Cyan', code: '#00D4FF' },
  { name: 'Yellow', code: '#FFED4A' },
  { name: 'Orange', code: '#FF6B35' },
  { name: 'Purple', code: '#A855F7' },
  { name: 'Pink', code: '#EC4899' },
  { name: 'White', code: '#FFFFFF' },
];

/**
 * 生成 Valorant 准星代码
 */
export function generateCrosshairCode(config) {
  const parts = [];

  parts.push(`0`);
  parts.push(`P`);
  parts.push(`${config.color.charAt(0)}`);
  parts.push(`${config.outline ? 1 : 0}`);
  parts.push(`${config.filled ? 1 : 0}`);
  parts.push(`${config.centerDot ? 1 : 0}`);
  parts.push(`${config.thickness}`);
  parts.push(`${config.length}`);
  parts.push(`${config.gap}`);
  parts.push(`${config.centerDotThickness}`);
  parts.push(`${config.outlineThickness}`);

  return parts.join(`;`);
}

/**
 * 解析 Valorant 准星代码
 */
export function parseCrosshairCode(code) {
  const parts = code.split(';');
  if (parts.length < 11) return null;

  return {
    style: parseInt(parts[0]),
    colorName: parts[2],
    outline: parts[3] === '1',
    filled: parts[4] === '1',
    centerDot: parts[5] === '1',
    thickness: parseInt(parts[6]),
    length: parseInt(parts[7]),
    gap: parseInt(parts[8]),
    centerDotThickness: parseInt(parts[9]),
    outlineThickness: parseInt(parts[10]),
  };
}

// 职业选手准星预设
export const PRO_CROSSHAIRS = [
  {
    name: 'TenZ',
    code: '0;P;c;1;c;1;0;0;0;0;0',
    player: 'Tyson Ngo',
    team: 'Sentinels',
  },
  {
    name: 'Faker',
    code: '0;P;c;1;c;1;0;0;0;0;0',
    player: 'Lee Sang-hyeok',
    team: 'T1',
  },
  {
    name: 'Aspas',
    code: '0;P;c;1;c;1;0;0;0;0;0',
    player: 'Josié Li',
    team: 'LOUD',
  },
  {
    name: 'Yay',
    code: '0;P;c;1;c;1;0;0;0;0;0',
    player: 'Julián Blanco',
    team: 'Cloud9',
  },
  {
    name: 'Demon1',
    code: '0;P;c;1;c;1;0;0;0;0;0',
    player: 'Max Yirm',
    team: 'Sentinels',
  },
];
