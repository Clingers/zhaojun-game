# P0 Plan: 关键选择分支 + 隐藏式"继续前行"

## 改动清单

### 1. 类型定义（types/index.ts）
- 新增 `ChoiceOption` 接口（id, text）
- `HotspotConfig.type` 增加 `'choice'`
- `HotspotConfig` 增加 `choices?: ChoiceOption[]` 和 `onChoice?: Record<string, string>`

### 2. 状态管理（gameStore.ts）
- 新增 `choices: Record<string, string>` 状态
- 新增 `makeChoice(hotspotId, optionId)` action
- 新增 `getChoice(hotspotId)` getter

### 3. 场景基类（BaseScene.ts）
- choice 类型处理：展示两个选项按钮，点击后记录选择
- 隐藏式继续：observationsClicked 集合追踪已点观察点
- continue 按钮默认隐藏，collected + observed 条件满足后渐显

### 4. 章节修改
- Ch05 雁门关：新增 choice "回头看中原" vs "头也不回"
- Ch06 草原：根据 Ch05 选择展示不同叙事文本
- Ch08 篝火：新增 choice "跟匈奴士兵说话" vs "独自烤火"
- Ch09/10：根据 Ch08 选择展示不同结局基调
- 所有章节：continue 按钮默认 hidden → 条件满足后 visible