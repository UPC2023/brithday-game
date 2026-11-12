# 🎂 生日布置小游戏 (Birthday Decoration Interactive Game)

一款温馨治愈的互动式生日庆祝网页应用。亲手装点生日房间、许愿吹灭蜡烛，并在漫天礼炮烟花与星光贺卡中送上真挚的生日祝福。

---

## ✨ 核心特色与功能

### 🎈 1. 房间装点阶段 (Decorating Stage)
- **亲手布置各个元素**：包括横幅拉花、梦幻彩灯串、七彩气球、三层生日主蛋糕、心意礼品盒以及香槟杯塔。
- **即时交互音效**：基于 Web Audio API 实时生成的高清拟真音效（清脆泡泡声、清澈风铃音、星光闪烁音等）。
- **一键布置功能**：支持一键瞬间点亮所有装饰，流畅过渡至下一阶段。

### 🕯️ 2. 许愿熄灭蜡烛 (Wishing Stage)
- **氛围灯光渲染**：布置完成后房间背景渐暗，蜡烛燃起摇曳火苗。
- **拟真吹灭蜡烛**：
  - 点击/触控吹气交互
  - 拟真气流呼呼声、火苗渐灭飘烟动画与淡入祝福。

### 💌 3. 星光贺卡与礼炮烟花 (Celebration Stage)
- **华丽礼炮粒子**：自动触发五彩缤纷的星辰纸屑雨与烟花礼炮（Canvas Confetti）。
- **可自定义生日贺卡**：
  - 支持直接在界面上点击「修改祝福」实时编辑收件人、主祝福语、温情寄语与落款并即时保存。
  - 融入深邃幽蓝与星辰天体美学底纹，营造仪式感满满的生日庆贺氛围。
- **随时重来**：支持「再布置一次」，无缝重置房间。

### 🎵 4. 双场景独立 BGM 音频系统 (Dual-Scene BGM System)
- **独立音乐指定**：游戏布置界面与贺卡祝福界面各自拥有独立的背景音乐，互不干扰、平滑切换。
- **预设备选音乐库**：
  - 🍰 **Celebrate** — *Red Velvet*（游戏页初始默认）
  - 🎂 **Birthday Wish** — *NMIXX*（贺卡页初始默认）
  - 🎉 **Celebrate** — *TWICE*
  - 💖 **Love Me Like You Do** — *Ellie Goulding*
- **本地自定义音频上传**：支持上传本地音频（MP3 / M4A / AAC / WAV）替换当前场景音乐。
- **毫秒级解码校验与容错保护**：
  - 使用 Web Audio 引擎对上传音频进行快速解码检测，防止损坏或未转码的视频音轨导致播放停滞。
  - 提供醒目的错误提示与「**一键恢复默认音乐**」快捷按钮，随时轻松复原。
- **自动解锁机制**：兼容移动端及各大浏览器（Chrome / Safari / Edge）的自动播放策略，首次触碰即激活音频上下文。

---

## 🛠️ 技术栈 (Tech Stack)

- **核心框架**：React 19 + TypeScript
- **构建工具**：Vite 8
- **样式方案**：Tailwind CSS v4
- **动画特效**：Motion (Framer Motion / `motion/react`)
- **礼炮粒子**：Canvas-Confetti
- **图标库**：Lucide React
- **音频引擎**：Web Audio API + HTML5 Audio Element

---

## 📂 项目结构 (Directory Structure)

```text
├── public/
│   ├── audio/              # 场景背景音乐（MP3 / M4A 标准音轨）
│   │   ├── Celebrate-RedVelvet.mp3
│   │   ├── brithdaywish_nmixx.mp3
│   │   ├── Celebrate-Twice.mp3
│   │   └── LoveMeLikeYouDo-Ellie Goulding.mp3
│   └── assets/             # 贺卡星轨艺术背景图资源
├── src/
│   ├── components/
│   │   ├── RoomCanvas.tsx        # 互动布置房间核心画布
│   │   ├── DecorateGuide.tsx     # 步骤引导栏与一键装点
│   │   ├── CandleWishStage.tsx   # 熄灯许愿与吹蜡烛交互
│   │   ├── CelebrationModal.tsx  # 星辰贺卡祝福与礼炮烟花
│   │   ├── BgmModal.tsx          # 背景音乐指定与上传弹窗
│   │   └── TopBar.tsx            # 顶部导航、阶段切换与静音控制
│   ├── config/
│   │   └── audioConfig.ts        # 场景音乐库与默认曲目配置
│   ├── utils/
│   │   └── audio.ts              # 双场景音频控制器与 Web Audio 合成音效
│   ├── types/
│   │   └── game.ts               # 游戏阶段与布置项类型定义
│   ├── App.tsx                   # 根应用组件
│   └── main.tsx                  # 应用入口文件
├── package.json
└── vite.config.ts
```

---

## 🚀 快速开始 (Getting Started)

### 1. 安装依赖
```bash
npm install
```

### 2. 启动本地开发服务
```bash
npm run dev
```
启动后在浏览器打开 `http://localhost:3000` 即可体验。

### 3. 构建生产包
```bash
npm run build
```

### 4. 代码规范与类型检查
```bash
npm run lint
```

---

## 💡 使用贴士

1. **更换音乐**：点击顶部导航栏右上角的 **「BGM音乐」** 按钮，或者在贺卡页点击 **「换歌」** 按钮，即可在弹窗中为游戏页或贺卡页自由指定不同的歌曲。
2. **音频上传格式**：本地上传建议使用标准 `.mp3` 或 `.m4a` 格式。若从视频提取音频，请确保已转码为标准音频流封装。
3. **静音切换**：顶部导航栏音量图标支持一键全局静音/开启。
