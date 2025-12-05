<h1 align="center">
    MultiPanel
</h1>
<h4 align="center">
支持动态区域分割和多个面板嵌套的前端组件.
</h4>
<p align="center">
  <a href="https://github.com/0xhappyboy/solana-trader/LICENSE"><img src="https://img.shields.io/badge/License-GPL3.0-d1d1f6.svg?style=flat&labelColor=1C2C2E&color=BEC5C9&logo=googledocs&label=license&logoColor=BEC5C9" alt="License"></a>
</p>
<p align="center">
<a href="./README_zh-CN.md">简体中文</a> | <a href="./README.md">English</a>
</p>

## 基本用法

### 双面板

```
function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MultiPanel direction="horizontal">
        <Panel style={{ backgroundColor: '#f5f5f5' }}>
          左侧面板
        </Panel>
        <Panel style={{ backgroundColor: '#e6f7ff' }}>
          右侧面板
        </Panel>
      </MultiPanel>
    </div>
  );
}
```

### 嵌套使用

```
<MultiPanel direction="horizontal">
  <MultiPanel direction="vertical">
    <Panel>左上方面板</Panel>
    <Panel>左下方面板</Panel>
  </MultiPanel>
  <MultiPanel direction="vertical">
    <Panel>右上方面板</Panel>
    <Panel>右下方面板</Panel>
  </MultiPanel>
</MultiPanel>
```

##

```
┌────────────────────────────────────────┐
│          初始状态 (等分)                │
├─────────────┬─────────────┬────────────┤
│     33%     │     33%     │     33%    │
│   Panel 1   │   Panel 2   │   Panel 3  │
└─────────────┴─────────────┴────────────┘
              用户拖拽分割线 ↓
┌────────────────────────────────────────┐
│          拖拽后状态                     │
├───────────┬───────────────┬────────────┤
│    25%    │      45%      │    30%     │
│  Panel 1  │   Panel 2     │  Panel 3   │
└───────────┴───────────────┴────────────┘
```

## 接口

### MultiPanel Props

| Prop                | Type                                   | Default        | Description              |
| ------------------- | -------------------------------------- | -------------- | ------------------------ |
| `direction`         | `'horizontal' \| 'vertical'`           | `'horizontal'` | 分割方向                 |
| `initialSizes`      | `number[]`                             | 等分           | 初始尺寸数组（像素值）   |
| `minSize`           | `number`                               | `50`           | 全局最小像素尺寸         |
| `splitterSize`      | `number`                               | `2`            | 分割线像素宽度           |
| `theme`             | `'light' \| 'dark' \| MultiPanelTheme` | `'light'`      | 主题配置                 |
| `onPaneSizesChange` | `(sizes: number[]) => void`            | -              | 面板尺寸变化时的回调函数 |
| `style`             | `React.CSSProperties`                  | -              | 自定义容器样式           |

### Panel Props

| Prop          | Type                  | Default | Description            |
| ------------- | --------------------- | ------- | ---------------------- |
| `minSize`     | `number`              | `10`    | 面板最小尺寸（百分比） |
| `defaultSize` | `number`              | -       | 面板默认尺寸（百分比） |
| `style`       | `React.CSSProperties` | -       | 自定义面板样式         |

### 预定义主题

```typescript
const MultiPanelThemes = {
  light: {
    splitterColor: "#e8e8e8",
    splitterHoverColor: "#d9d9d9",
    splitterActiveColor: "#e8e8e8",
  } as MultiPanelTheme,
  dark: {
    splitterColor: "#434343",
    splitterHoverColor: "#595959",
    splitterActiveColor: "#434343",
  } as MultiPanelTheme,
};
```
