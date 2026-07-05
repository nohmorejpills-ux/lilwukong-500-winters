# lilwukong - 五百个冬天网页

这是一个静态专辑播放页，直接打开 `index.html` 就能预览。

## 文件替换

- 背景图放到 `assets/background.jpg`
- 全部音频已转为 MP3，按顺序放到 `assets/audio/01.mp3` 到 `assets/audio/20.mp3`
- 附加版本在页面里归到对应曲目的版本选择里，`石之心（删减曲目）` 单独显示在删减曲目板块
- 页面会读取 `assets/lyrics-data.js` 显示手动滚动歌词
- 歌名在 `app.js` 顶部的 `tracks` 数组里改

## 建议音频命名

```text
assets/audio/01.mp3
assets/audio/02.mp3
...
assets/audio/20.mp3
```

LRC 歌词文件仍保留在 `assets/lyrics/`，`assets/lyrics-data.js` 是从这些 LRC 生成出来的离线歌词数据。
