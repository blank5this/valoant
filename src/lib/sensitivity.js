import { GAMES } from './games';

/**
 * 计算 cm/360°
 * @param {number} dpi - 鼠标 DPI
 * @param {number} sens - 游戏灵敏度
 * @param {number} factor - 游戏驱动系数
 * @returns {number} cm/360
 */
export function calcCm360(dpi, sens, factor) {
  if (dpi <= 0 || sens <= 0 || factor <= 0) return 0;
  return (2.54 * dpi) / (sens * factor);
}

/**
 * 转换灵敏度
 * @param {number} dpi - 鼠标 DPI
 * @param {string} fromGame - 源游戏 ID
 * @param {string} toGame - 目标游戏 ID
 * @param {number} fromSens - 源游戏灵敏度
 * @returns {{ sens: number, cm360: number } | null}
 */
export function convertSens(dpi, fromGame, toGame, fromSens) {
  if (!GAMES[fromGame] || !GAMES[toGame]) return null;
  if (dpi <= 0 || fromSens <= 0) return null;

  const cm360 = calcCm360(dpi, fromSens, GAMES[fromGame].factor);
  const toFactor = GAMES[toGame].factor;
  const toSens = (2.54 * dpi) / (cm360 * toFactor);

  return {
    sens: Math.round(toSens * 10000) / 10000,
    cm360: Math.round(cm360 * 100) / 100,
  };
}

/**
 * 计算 eDPI
 * @param {number} dpi - 鼠标 DPI
 * @param {number} sens - 游戏灵敏度
 * @returns {number} eDPI
 */
export function calcEdpi(dpi, sens) {
  return dpi * sens;
}
