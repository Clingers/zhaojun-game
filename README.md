# 昭君：一路向北

> 一个以王昭君出塞为灵感的Web互动叙事游戏

## 📖 项目简介

《昭君：一路向北》是一款互动叙事游戏，玩家扮演一只跟随商队的大雁，陪伴王昭君从长安出发，一路向北，经历十程风雨，最终抵达漠北。

**核心体验**：陪伴、收集、静默

**章节结构**：序章 + 10章 + 尾声

**设计原则**："静默是金" —— 最小化UI，慢节奏，充足留白

## 🛠️ 技术栈

| 技术 | 版本 |
|------|------|
| React | 18 |
| TypeScript | 5 |
| Vite | 5 |
| Phaser | 3 |
| GSAP | 3 |
| Web Audio API | - |
| Zustand | 4 |

## 📁 项目结构

```
zhaojun-game/
├── src/
│   ├── core/           # 游戏核心引擎
│   │   ├── AudioManager.ts
│   │   ├── GameEngine.ts
│   │   ├── SaveManager.ts
│   │   └── SceneManager.ts
│   ├── store/          # Zustand 状态管理
│   │   ├── gameStore.ts
│   │   └── collectiblesStore.ts
│   ├── scenes/         # Phaser 3 游戏场景
│   │   ├── BaseScene.ts
│   │   ├── PrologueScene.ts
│   │   ├── Chapter01Scene.ts ~ Chapter10Scene.ts
│   ├── data/           # 剧本与收集品数据
│   │   ├── collectibles.json
│   │   └── chapter_prompts.json
│   ├── types/          # TypeScript 类型定义
│   │   └── index.ts
│   ├── __tests__/      # 测试文件
│   │   ├── core.test.ts
│   │   └── setup.ts
│   ├── App.tsx         # React 根组件
│   └── main.tsx        # 应用入口
├── assets/             # 静态资源（图片、音频）
├── docs/               # 设计文档与剧本
│   ├── design/         # 技术设计文档
│   ├── story/          # 剧本文件（十章 + 序章）
│   └── references/     # 史料研究
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── ...
```

## 🎮 运行方式

### 开发模式

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建

```bash
npm run build
npm run preview
```

## 📝 设计文档

- [技术架构](docs/design/技术架构.md)
- [交互设计](docs/design/交互设计.md)
- [美术风格](docs/design/美术风格.md)
- [音频设计](docs/design/音频设计.md)

## 📜 剧本

- [序章](docs/story/03-序章.md)
- [章节框架](docs/design/章节框架.md)

## 📄 许可证

MIT License
