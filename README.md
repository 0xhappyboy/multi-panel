<h1 align="center">
   MultiPanel
</h1>
<h4 align="center">
A front-end component that supports dynamic area segmentation and nesting of multiple panels.
</h4>
<p align="center">
  <a href="https://github.com/0xhappyboy/solana-trader/LICENSE"><img src="https://img.shields.io/badge/License-GPL3.0-d1d1f6.svg?style=flat&labelColor=1C2C2E&color=BEC5C9&logo=googledocs&label=license&logoColor=BEC5C9" alt="License"></a>
</p>
<p align="center">
<a href="./README_zh-CN.md">简体中文</a> | <a href="./README.md">English</a>
</p>

## Basic Usage

### Double Panel

```ts
function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MultiPanel direction="horizontal">
        <Panel style={{ backgroundColor: "#f5f5f5" }}>Left Panel</Panel>
        <Panel style={{ backgroundColor: "#e6f7ff" }}>Right Panel</Panel>
      </MultiPanel>
    </div>
  );
}
```

### Nested Use

```
<MultiPanel direction="horizontal">
  <MultiPanel direction="vertical">
    <Panel>Top-Left Panel</Panel>
    <Panel>Bottom-Left Panel</Panel>
  </MultiPanel>
  <MultiPanel direction="vertical">
    <Panel>Top-Right Panel</Panel>
    <Panel>Bottom-Right Panel</Panel>
  </MultiPanel>
</MultiPanel>
```

## How It Works

```
┌────────────────────────────────────────┐
│          Initial State (Equal)         │
├─────────────┬─────────────┬────────────┤
│     33%     │     33%     │     33%    │
│   Panel 1   │   Panel 2   │   Panel 3  │
└─────────────┴─────────────┴────────────┘
        User Drags Splitter ↓
┌────────────────────────────────────────┐
│          After Dragging                │
├───────────┬───────────────┬────────────┤
│    25%    │      45%      │    30%     │
│  Panel 1  │   Panel 2     │  Panel 3   │
└───────────┴───────────────┴────────────┘
└───────────┴───────────────┴────────────┘
```

## API

### MultiPanel Props

| Prop           | Type                                   | Default        | Description                   |
| -------------- | -------------------------------------- | -------------- | ----------------------------- |
| `direction`    | `'horizontal' \| 'vertical'`           | `'horizontal'` | Split direction               |
| `initialSizes` | `number[]`                             | Equal          | Initial size percentage array |
| `minSize`      | `number`                               | `50`           | Minimum pixel size for panels |
| `splitterSize` | `number`                               | `2`            | Splitter width in pixels      |
| `theme`        | `'light' \| 'dark' \| MultiPanelTheme` | `'light'`      | Theme configuration           |

### Panel Props

| Prop      | Type                  | Default | Description        |
| --------- | --------------------- | ------- | ------------------ |
| `minSize` | `number`              | `50`    | Minimum pixel size |
| `style`   | `React.CSSProperties` | -       | Custom styles      |
