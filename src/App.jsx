import { useState, useMemo } from 'react';
import { GAME_LIST } from './lib/games';
import { convertSens, calcCm360, calcEdpi } from './lib/sensitivity';
import { DEFAULT_CROSSHAIR, COLORS, generateCrosshairCode, PRO_CROSSHAIRS } from './lib/crosshair';
import { saveProfiles, loadProfiles } from './lib/storage';
import { Copy, Check, RotateCcw, Save, Trash2, MousePointer2, Crosshair } from 'lucide-react';

// Tab component
function Tab({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-gray-800 rounded-xl mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            active === tab.id
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Sensitivity Converter Tool
function SensitivityConverter() {
  const [dpi, setDpi] = useState(800);
  const [fromGame, setFromGame] = useState('cs2');
  const [fromSens, setFromSens] = useState(2.0);
  const [toGame, setToGame] = useState('valorant');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    return convertSens(dpi, fromGame, toGame, fromSens);
  }, [dpi, fromGame, toGame, fromSens]);

  const cm360 = useMemo(() => {
    if (!GAME_LIST.find(g => g.id === fromGame)) return 0;
    return calcCm360(dpi, fromSens, GAME_LIST.find(g => g.id === fromGame)?.factor || 1);
  }, [dpi, fromSens, fromGame]);

  const edpi = useMemo(() => {
    return calcEdpi(dpi, fromSens);
  }, [dpi, fromSens]);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.sens.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="bg-gray-800 rounded-2xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MousePointer2 className="w-5 h-5 text-red-400" />
          输入配置
        </h2>

        {/* DPI */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">鼠标 DPI</label>
          <input
            type="number"
            value={dpi}
            onChange={(e) => setDpi(Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <div className="flex gap-2 mt-2">
            {[400, 800, 1600, 3200].map((v) => (
              <button
                key={v}
                onClick={() => setDpi(v)}
                className={`px-3 py-1 rounded-lg text-sm font-mono transition ${
                  dpi === v ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* From Game */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">当前游戏</label>
          <select
            value={fromGame}
            onChange={(e) => setFromGame(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
          >
            {GAME_LIST.map((game) => (
              <option key={game.id} value={game.id}>
                {game.icon} {game.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sensitivity */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">当前灵敏度</label>
          <input
            type="number"
            step="0.001"
            value={fromSens}
            onChange={(e) => setFromSens(Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide">eDPI</div>
            <div className="text-2xl font-mono font-bold text-white">{edpi}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide">cm/360°</div>
            <div className="text-2xl font-mono font-bold text-white">{cm360.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Result Section */}
      <div className="bg-gray-800 rounded-2xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-red-400" />
          转换结果
        </h2>

        {/* To Game */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">目标游戏</label>
          <select
            value={toGame}
            onChange={(e) => setToGame(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
          >
            {GAME_LIST.map((game) => (
              <option key={game.id} value={game.id}>
                {game.icon} {game.name}
              </option>
            ))}
          </select>
        </div>

        {/* Result Display */}
        <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-8 text-center">
          <div className="text-sm text-gray-400 mb-2">
            {GAME_LIST.find(g => g.id === toGame)?.icon} {GAME_LIST.find(g => g.id === toGame)?.name} 灵敏度
          </div>
          <div className="text-5xl font-mono font-bold text-white mb-2">
            {result ? result.sens : '—'}
          </div>
          <button
            onClick={handleCopy}
            disabled={!result}
            className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '已复制!' : '复制灵敏度'}
          </button>
        </div>

        {/* Quick Reference */}
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">快速参考 (相同 DPI)</div>
          <div className="grid grid-cols-2 gap-2">
            {GAME_LIST.filter(g => g.id !== fromGame).slice(0, 6).map((game) => {
              const conv = convertSens(dpi, fromGame, game.id, fromSens);
              return (
                <div key={game.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{game.icon} {game.name}</span>
                  <span className="font-mono text-white">{conv ? conv.sens : '—'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Crosshair Generator Tool
function CrosshairGenerator() {
  const [config, setConfig] = useState(DEFAULT_CROSSHAIR);
  const [copied, setCopied] = useState(false);
  const [showPro, setShowPro] = useState(false);

  const code = useMemo(() => generateCrosshairCode(config), [config]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CROSSHAIR);
  };

  const applyProCrosshair = (proCode) => {
    // Parse and apply - for now just show the code
    setConfig({ ...DEFAULT_CROSSHAIR });
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    if (key === 'color') {
      const colorObj = COLORS.find(c => c.name === value);
      if (colorObj) {
        setConfig(prev => ({ ...prev, colorCode: colorObj.code }));
      }
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Preview */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">准星预览</h2>
        <div
          className="aspect-video bg-black rounded-xl flex items-center justify-center relative overflow-hidden"
          style={{ minHeight: '200px' }}
        >
          {/* Simulated crosshair */}
          <div
            className="relative"
            style={{
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%',
              position: 'absolute'
            }}
          >
            {/* Center dot */}
            {config.centerDot && (
              <div
                className="absolute rounded-full"
                style={{
                  width: config.centerDotThickness * 2,
                  height: config.centerDotThickness * 2,
                  backgroundColor: config.colorCode,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: config.outline ? `0 0 ${config.outlineThickness}px ${config.outlineColor}` : 'none',
                }}
              />
            )}
            {/* Top line */}
            {config.length > 0 && (
              <div
                className="absolute"
                style={{
                  width: config.thickness || 1,
                  height: config.length,
                  backgroundColor: config.filled ? config.colorCode : 'transparent',
                  borderLeft: config.filled ? 'none' : `${config.thickness || 1}px solid ${config.colorCode}`,
                  borderRight: config.filled ? 'none' : `${config.thickness || 1}px solid ${config.colorCode}`,
                  top: -(config.length + config.gap),
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: config.outline ? `0 0 ${config.outlineThickness}px ${config.outlineColor}` : 'none',
                }}
              />
            )}
            {/* Bottom line */}
            {config.length > 0 && (
              <div
                className="absolute"
                style={{
                  width: config.thickness || 1,
                  height: config.length,
                  backgroundColor: config.filled ? config.colorCode : 'transparent',
                  borderLeft: config.filled ? 'none' : `${config.thickness || 1}px solid ${config.colorCode}`,
                  borderRight: config.filled ? 'none' : `${config.thickness || 1}px solid ${config.colorCode}`,
                  bottom: -(config.length + config.gap),
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: config.outline ? `0 0 ${config.outlineThickness}px ${config.outlineColor}` : 'none',
                }}
              />
            )}
            {/* Left line */}
            {config.length > 0 && (
              <div
                className="absolute"
                style={{
                  height: config.thickness || 1,
                  width: config.length,
                  backgroundColor: config.filled ? config.colorCode : 'transparent',
                  borderTop: config.filled ? 'none' : `${config.thickness || 1}px solid ${config.colorCode}`,
                  borderBottom: config.filled ? 'none' : `${config.thickness || 1}px solid ${config.colorCode}`,
                  left: -(config.length + config.gap),
                  top: '50%',
                  transform: 'translateY(-50%)',
                  boxShadow: config.outline ? `0 0 ${config.outlineThickness}px ${config.outlineColor}` : 'none',
                }}
              />
            )}
            {/* Right line */}
            {config.length > 0 && (
              <div
                className="absolute"
                style={{
                  height: config.thickness || 1,
                  width: config.length,
                  backgroundColor: config.filled ? config.colorCode : 'transparent',
                  borderTop: config.filled ? 'none' : `${config.thickness || 1}px solid ${config.colorCode}`,
                  borderBottom: config.filled ? 'none' : `${config.thickness || 1}px solid ${config.colorCode}`,
                  right: -(config.length + config.gap),
                  top: '50%',
                  transform: 'translateY(-50%)',
                  boxShadow: config.outline ? `0 0 ${config.outlineThickness}px ${config.outlineColor}` : 'none',
                }}
              />
            )}
          </div>
        </div>

        {/* Export Code */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">准星代码</label>
          <div className="flex gap-2">
            <code className="flex-1 bg-gray-900 rounded-lg px-3 py-2 text-red-400 font-mono text-sm overflow-x-auto">
              {code}
            </code>
            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-lg font-medium transition ${
                copied ? 'bg-green-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
        >
          <RotateCcw className="w-4 h-4" />
          重置
        </button>
      </div>

      {/* Editor */}
      <div className="md:col-span-2 bg-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">参数调整</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">颜色</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setConfig(prev => ({ ...prev, color: c.name, colorCode: c.code }));
                  }}
                  className={`w-8 h-8 rounded-full transition ${
                    config.color === c.name ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
                  }`}
                  style={{ backgroundColor: c.code }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Center Dot */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">中心点</label>
            <div className="flex gap-2">
              <button
                onClick={() => setConfig(prev => ({ ...prev, centerDot: true }))}
                className={`px-4 py-2 rounded-lg transition ${
                  config.centerDot ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                }`}
              >
                开
              </button>
              <button
                onClick={() => setConfig(prev => ({ ...prev, centerDot: false }))}
                className={`px-4 py-2 rounded-lg transition ${
                  !config.centerDot ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                }`}
              >
                关
              </button>
            </div>
          </div>

          {/* Center Dot Thickness */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              中心点大小: {config.centerDotThickness}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={config.centerDotThickness}
              onChange={(e) => setConfig(prev => ({ ...prev, centerDotThickness: Number(e.target.value) }))}
              className="w-full accent-red-500"
            />
          </div>

          {/* Thickness */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              线宽: {config.thickness}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={config.thickness}
              onChange={(e) => setConfig(prev => ({ ...prev, thickness: Number(e.target.value) }))}
              className="w-full accent-red-500"
            />
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              线长: {config.length}
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={config.length}
              onChange={(e) => setConfig(prev => ({ ...prev, length: Number(e.target.value) }))}
              className="w-full accent-red-500"
            />
          </div>

          {/* Gap */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              间隙: {config.gap}
            </label>
            <input
              type="range"
              min="-5"
              max="20"
              value={config.gap}
              onChange={(e) => setConfig(prev => ({ ...prev, gap: Number(e.target.value) }))}
              className="w-full accent-red-500"
            />
          </div>

          {/* Outline */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">轮廓</label>
            <div className="flex gap-2">
              <button
                onClick={() => setConfig(prev => ({ ...prev, outline: true }))}
                className={`px-4 py-2 rounded-lg transition ${
                  config.outline ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                }`}
              >
                开
              </button>
              <button
                onClick={() => setConfig(prev => ({ ...prev, outline: false }))}
                className={`px-4 py-2 rounded-lg transition ${
                  !config.outline ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                }`}
              >
                关
              </button>
            </div>
          </div>

          {/* Filled */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">实心线条</label>
            <div className="flex gap-2">
              <button
                onClick={() => setConfig(prev => ({ ...prev, filled: true }))}
                className={`px-4 py-2 rounded-lg transition ${
                  config.filled ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                }`}
              >
                开
              </button>
              <button
                onClick={() => setConfig(prev => ({ ...prev, filled: false }))}
                className={`px-4 py-2 rounded-lg transition ${
                  !config.filled ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                }`}
              >
                关
              </button>
            </div>
          </div>
        </div>

        {/* Pro Crosshairs */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">职业选手准星</h3>
            <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded">PRO</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRO_CROSSHAIRS.map((pro) => (
              <button
                key={pro.name}
                onClick={() => {
                  const code = pro.code;
                  const parts = code.split(';');
                  setConfig({
                    color: parts[2] === 'c' ? 'Red' : parts[2],
                    colorCode: COLORS.find(c => c.name === (parts[2] === 'c' ? 'Red' : parts[2]))?.code || '#FF4655',
                    outline: parts[3] === '1',
                    filled: parts[4] === '1',
                    centerDot: parts[5] === '1',
                    thickness: parseInt(parts[6]),
                    length: parseInt(parts[7]),
                    gap: parseInt(parts[8]),
                    centerDotThickness: parseInt(parts[9]),
                    outlineThickness: parseInt(parts[10]),
                  });
                }}
                className="bg-gray-900 hover:bg-gray-700 rounded-lg p-3 text-left transition"
              >
                <div className="font-medium text-white text-sm">{pro.name}</div>
                <div className="text-xs text-gray-500">{pro.team}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App
function App() {
  const [activeTab, setActiveTab] = useState('sensitivity');

  const tabs = [
    { id: 'sensitivity', label: '灵敏度转换', icon: <MousePointer2 className="w-4 h-4" /> },
    { id: 'crosshair', label: '准星生成器', icon: <Crosshair className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                Valorant Tools
              </h1>
              <p className="text-gray-500 text-sm mt-1">灵敏度转换 & 准星生成器</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://reddit.com/r/Valorant"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white text-sm transition"
              >
                r/Valorant
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tab tabs={tabs} active={activeTab} onChange={setActiveTab} />

        {activeTab === 'sensitivity' && <SensitivityConverter />}
        {activeTab === 'crosshair' && <CrosshairGenerator />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          Built for Valorant players
        </div>
      </footer>
    </div>
  );
}

export default App;
