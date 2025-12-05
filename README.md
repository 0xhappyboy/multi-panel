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

## Features

- **Dynamic Panel Splitting**: Support for both horizontal and vertical splitting with draggable splitters.
- **Nested Layouts**: MultiPanel can be nested within another MultiPanel to create complex layouts.
- **Customizable Sizes**: Set initial sizes, minimum sizes, and default sizes for each panel.
- **Theme Support**: Built-in light and dark themes, or provide a custom theme object.
- **Event Callbacks**: Get notified when panel sizes change.
- **Pixel Precision**: Control over splitter width and panel minimum sizes in pixels.

## Installation

```bash
npm i multi-panel
```

```bash
yarn add multi-panel
```

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
```

## API

### MultiPanel Props

| Prop                | Type                                   | Default        | Description                               |
| ------------------- | -------------------------------------- | -------------- | ----------------------------------------- |
| `direction`         | `'horizontal' \| 'vertical'`           | `'horizontal'` | Split direction                           |
| `initialSizes`      | `number[]`                             | Equal division | Initial size array (in pixels)            |
| `minSize`           | `number`                               | `50`           | Global minimum size in pixels             |
| `splitterSize`      | `number`                               | `2`            | Splitter width in pixels                  |
| `theme`             | `'light' \| 'dark' \| MultiPanelTheme` | `'light'`      | Theme configuration                       |
| `onPaneSizesChange` | `(sizes: number[]) => void`            | -              | Callback function when panel sizes change |
| `style`             | `React.CSSProperties`                  | -              | Custom container styles                   |

### Panel Props

| Prop          | Type                  | Default | Description                        |
| ------------- | --------------------- | ------- | ---------------------------------- |
| `minSize`     | `number`              | `10`    | Panel minimum size (in percentage) |
| `defaultSize` | `number`              | -       | Panel default size (in percentage) |
| `style`       | `React.CSSProperties` | -       | Custom panel styles                |

### Predefined Themes

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
