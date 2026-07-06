# lilwukong - 五百个冬天网页

这是一个静态专辑播放页，直接打开 `index.html` 就能预览。

## 双语访问

页面会根据浏览器语言自动显示中文或英文，也可以用右上角的 `中 / EN` 手动切换。需要指定语言时，可以在网址后加参数：

```text
https://nohmorejpills-ux.github.io/lilwukong-500-winters/?lang=zh
https://nohmorejpills-ux.github.io/lilwukong-500-winters/?lang=en
```

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

## 轻量 NFC 防伪

所有 NFC 贴片可以统一写入同一个官方入口网址：

```text
https://nohmorejpills-ux.github.io/lilwukong-500-winters/?nfc=official
```

打开这个网址时，页面会显示“官方实体 NFC 入口”，并提醒用户认准官方域名：

```text
nohmorejpills-ux.github.io/lilwukong-500-winters
```

`nfc-url.txt` 里也保存了这条统一写入地址。这个方案适合批量快速写入；如果用户扫码进入的不是这个官方域名，就可以判断为异常入口。
