// 支持的游戏及其驱动系数
export const GAMES = {
  valorant: { factor: 0.07, name: 'Valorant', icon: '🎯' },
  cs2: { factor: 3.18, name: 'CS2', icon: '🔫' },
  csgo: { factor: 3.18, name: 'CS:GO', icon: '🔫' },
  apex: { factor: 1.0, name: 'Apex Legends', icon: '🦅' },
  ow2: { factor: 1.0, name: 'Overwatch 2', icon: '🦸' },
  fortnite: { factor: 2.727, name: 'Fortnite', icon: '🧱' },
  r6: { factor: 1.0, name: 'Rainbow Six Siege', icon: '🏠' },
  destiny2: { factor: 1.0, name: 'Destiny 2', icon: '🌟' },
  halo: { factor: 0.5, name: 'Halo Infinite', icon: '👽' },
  cod: { factor: 1.0, name: 'Call of Duty', icon: '🎖️' },
  pubg: { factor: 1.0, name: 'PUBG', icon: '🪖' },
  warzone: { factor: 1.0, name: 'Warzone', icon: '💀' },
};

export const GAME_LIST = Object.entries(GAMES).map(([id, data]) => ({
  id,
  ...data,
}));
