const albumTracks = [
  {
    id: "track-01",
    number: "01",
    title: "三十三重天（33rd Heaven）",
    lyricsKey: "01",
    versions: [
      {
        label: "最终版",
        detail: "MP3",
        src: "assets/audio/01.mp3",
      },
      {
        label: "原版",
        detail: "MP3",
        src: "assets/audio/17.mp3",
      },
    ],
  },
  {
    id: "track-02",
    number: "02",
    title: "金丹紫露（Golden Pill Purple Dew）",
    lyricsKey: "02",
    versions: [
      {
        label: "最终版",
        detail: "MP3",
        src: "assets/audio/02.mp3",
      },
    ],
  },
  {
    id: "track-03",
    number: "03",
    title: "金身如此（Born Like This）",
    lyricsKey: "03",
    versions: [
      {
        label: "最终版",
        detail: "MP3",
        src: "assets/audio/03.mp3",
      },
    ],
  },
  {
    id: "track-04",
    number: "04",
    title: "新王母娘娘蟠桃会",
    lyricsKey: "04",
    versions: [
      {
        label: "最终版",
        detail: "MP3",
        src: "assets/audio/04.mp3",
      },
      {
        label: "蟠桃园原版",
        detail: "MP3",
        src: "assets/audio/15.mp3",
      },
    ],
  },
  {
    id: "track-05",
    number: "05",
    title: "紧箍咒幻肢痛（Phantom Pain）",
    lyricsKey: "05",
    versions: [
      {
        label: "最终版",
        detail: "MP3",
        src: "assets/audio/05.mp3",
      },
      {
        label: "Tightening Spell 原版",
        detail: "MP3",
        src: "assets/audio/14.mp3",
      },
      {
        label: "Tightening Spell 废版",
        detail: "MP3",
        src: "assets/audio/13.mp3",
      },
    ],
  },
  {
    id: "track-06",
    number: "06",
    title: "skit",
    lyricsKey: "06",
    versions: [
      {
        label: "最终版",
        detail: "MP3",
        src: "assets/audio/06.mp3",
      },
    ],
  },
  {
    id: "track-07",
    number: "07",
    title: "紧箍咒幻肢痛 pt.2（Phantom Pain Pt.2）",
    lyricsKey: "07",
    versions: [
      {
        label: "最终版",
        detail: "MP3",
        src: "assets/audio/07.mp3",
      },
      {
        label: "原版",
        detail: "MP3",
        src: "assets/audio/19.mp3",
      },
      {
        label: "大陆初版",
        detail: "MP3",
        src: "assets/audio/20.mp3",
      },
    ],
  },
  {
    id: "track-08",
    number: "08",
    title: "500个冬天（500 Winters）",
    lyricsKey: "08",
    versions: [
      {
        label: "最终版",
        detail: "MP3",
        src: "assets/audio/08.mp3",
      },
      {
        label: "原版",
        detail: "MP3",
        src: "assets/audio/12.mp3",
      },
    ],
  },
  {
    id: "track-09",
    number: "09",
    title: "500个冬天 pt.2（500 Winters Pt.2）",
    lyricsKey: "09",
    versions: [
      {
        label: "最终版",
        detail: "MP3",
        src: "assets/audio/09.mp3",
      },
    ],
  },
  {
    id: "track-10",
    number: "10",
    title: "六耳（Six Ear）",
    lyricsKey: "10",
    versions: [
      {
        label: "最终版",
        detail: "MP3",
        src: "assets/audio/10.mp3",
      },
      {
        label: "原版",
        detail: "MP3",
        src: "assets/audio/18.mp3",
      },
    ],
  },
  {
    id: "track-11",
    number: "11",
    title: "回归（OUTRO）",
    lyricsKey: "11",
    versions: [
      {
        label: "最终版",
        detail: "MP3",
        src: "assets/audio/11.mp3",
      },
    ],
  },
];

const cutTracks = [
  {
    id: "cut-01",
    number: "D1",
    title: "石之心（删减曲目）",
    lyricsKey: "",
    versions: [
      {
        label: "删减曲目",
        detail: "MP3",
        src: "assets/audio/16.mp3",
      },
    ],
  },
];

const playbackOrder = [...albumTracks, ...cutTracks];

const audio = document.querySelector("#audio");
const playlist = document.querySelector("#playlist");
const cutPlaylist = document.querySelector("#cutPlaylist");
const versionSelector = document.querySelector("#versionSelector");
const playPause = document.querySelector("#playPause");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const seek = document.querySelector("#seek");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const trackNumber = document.querySelector("#trackNumber");
const trackTitle = document.querySelector("#trackTitle");
const trackVersion = document.querySelector("#trackVersion");
const status = document.querySelector("#status");
const loopAlbum = document.querySelector("#loopAlbum");
const trackCount = document.querySelector("#trackCount");
const cutCount = document.querySelector("#cutCount");
const lyricsList = document.querySelector("#lyricsList");
const lyricsClock = document.querySelector("#lyricsClock");
const authPanel = document.querySelector("#authPanel");
const authStatus = document.querySelector("#authStatus");
const authCode = document.querySelector("#authCode");
const authMeta = document.querySelector("#authMeta");

const OFFICIAL_NFC_HOST = "nohmorejpills-ux.github.io";

let currentTrackId = albumTracks[0].id;
let currentVersionIndex = 0;
let currentLyrics = [];
let lyricElements = [];
let currentLyricIndex = -1;
let isSeeking = false;

function currentTrack() {
  return playbackOrder.find((track) => track.id === currentTrackId) || albumTracks[0];
}

function currentVersion() {
  const track = currentTrack();
  return track.versions[currentVersionIndex] || track.versions[0];
}

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatVerificationDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "刚刚";

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function isOfficialNfcEntry() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("nfc") || "").trim().toLowerCase() === "official";
}

function getLocalAuthRecord() {
  const storageKey = "lilwukong-official-nfc-entry";
  const now = new Date().toISOString();

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    const record = {
      firstSeen: saved?.firstSeen || now,
      scans: Number(saved?.scans || 0) + 1,
    };
    localStorage.setItem(storageKey, JSON.stringify(record));
    return record;
  } catch {
    return { firstSeen: now, scans: 1 };
  }
}

function renderAuthPanel() {
  if (!authPanel || !isOfficialNfcEntry()) return;

  authPanel.hidden = false;
  authPanel.classList.remove("is-invalid");
  authStatus.textContent = "官方实体 NFC 入口";
  authCode.textContent = "OFFICIAL ALBUM PAGE";

  const record = getLocalAuthRecord();
  authMeta.textContent = `请认准 ${OFFICIAL_NFC_HOST} · 本机第 ${record.scans} 次进入 · 首次 ${formatVerificationDate(record.firstSeen)}`;
}

function updateSeekProgress(value = Number(seek.value)) {
  const progress = Math.min(Math.max(value, 0), 1000) / 10;
  seek.style.setProperty("--progress", `${progress}%`);
}

function setStatus(message = "") {
  status.textContent = message;
}

function syncPlayButton(isPlaying) {
  playPause.classList.toggle("is-playing", isPlaying);
  playPause.setAttribute("aria-label", isPlaying ? "暂停" : "播放");
  playPause.title = isPlaying ? "暂停" : "播放";
}

function parseLrc(rawLrc = "") {
  const grouped = new Map();
  const timestampPattern = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?]/g;

  rawLrc.split(/\r?\n/).forEach((line) => {
    const matches = [...line.matchAll(timestampPattern)];
    const text = line.replace(timestampPattern, "").trim();
    if (matches.length === 0 || text.length === 0) return;

    matches.forEach((match) => {
      const minutes = Number(match[1]);
      const seconds = Number(match[2]);
      const fraction = (match[3] || "0").padEnd(3, "0").slice(0, 3);
      const time = minutes * 60 + seconds + Number(`0.${fraction}`);
      const key = time.toFixed(3);

      if (!grouped.has(key)) {
        grouped.set(key, { time, lines: [] });
      }
      grouped.get(key).lines.push(text);
    });
  });

  return [...grouped.values()].sort((a, b) => a.time - b.time);
}

function renderLyrics() {
  lyricsList.innerHTML = "";
  lyricElements = [];
  currentLyricIndex = -1;

  if (currentLyrics.length === 0) {
    const placeholder = document.createElement("div");
    placeholder.className = "lyric-placeholder";
    placeholder.textContent = "暂无歌词";
    lyricsList.append(placeholder);
    return;
  }

  currentLyrics.forEach((lyric, index) => {
    const line = document.createElement("div");
    line.className = "lyric-line";
    line.dataset.index = String(index);

    lyric.lines.forEach((text) => {
      const span = document.createElement("span");
      span.textContent = text;
      line.append(span);
    });

    lyricsList.append(line);
    lyricElements.push(line);
  });

  lyricsList.scrollTop = 0;
}

function updateActiveLyric(time) {
  let nextIndex = -1;

  for (let index = 0; index < currentLyrics.length; index += 1) {
    if (currentLyrics[index].time <= time + 0.08) {
      nextIndex = index;
    } else {
      break;
    }
  }

  if (nextIndex === currentLyricIndex) return;

  if (currentLyricIndex >= 0) {
    lyricElements[currentLyricIndex]?.classList.remove("is-active");
  }

  currentLyricIndex = nextIndex;

  if (currentLyricIndex < 0) return;

  lyricElements[currentLyricIndex]?.classList.add("is-active");
}

function loadLyrics(track) {
  currentLyrics = parseLrc(window.LYRICS?.[track.lyricsKey] || "");
  renderLyrics();
  updateActiveLyric(0);
}

function renderVersionButtons(track, container, shouldPlayOnClick) {
  container.innerHTML = "";

  if (track.versions.length <= 1) {
    container.hidden = true;
    return;
  }

  container.hidden = false;

  track.versions.forEach((version, versionIndex) => {
    const button = document.createElement("button");
    const isSelected = track.id === currentTrackId && versionIndex === currentVersionIndex;
    button.className = `version-chip${isSelected ? " is-selected" : ""}`;
    button.type = "button";
    button.textContent = version.label;
    button.setAttribute("aria-pressed", String(isSelected));
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectTrack(track.id, versionIndex, shouldPlayOnClick);
    });

    container.append(button);
  });
}

function renderTrackList(tracks, container, countElement, emptyText) {
  const visibleTracks = tracks;

  container.innerHTML = "";
  countElement.textContent =
    container === playlist ? `${visibleTracks.length} 首 · ${tracks.reduce((sum, track) => sum + track.versions.length, 0)} 个版本` : `${visibleTracks.length} 首`;

  if (visibleTracks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }

  visibleTracks.forEach((track) => {
    const isActive = track.id === currentTrackId;
    const item = document.createElement("li");
    item.className = `track-item${isActive ? " is-active" : ""}${track.versions.length > 1 ? " has-versions" : ""}`;

    const button = document.createElement("button");
    button.className = "track-button";
    button.type = "button";
    button.dataset.number = track.number;
    button.setAttribute("aria-label", `播放 ${track.title}`);

    const title = document.createElement("span");
    title.className = "track-title";
    title.textContent = track.title;

    const file = document.createElement("span");
    file.className = "track-file";
    file.textContent = track.versions.length > 1 ? `${track.versions.length} 版本` : track.versions[0].label;

    button.append(title, file);
    button.addEventListener("click", () => {
      const versionIndex = isActive ? currentVersionIndex : 0;
      selectTrack(track.id, versionIndex, true);
    });

    item.append(button);

    const versionRow = document.createElement("div");
    versionRow.className = "track-version-row";
    renderVersionButtons(track, versionRow, true);
    versionRow.hidden = !isActive || track.versions.length <= 1;
    item.append(versionRow);

    container.append(item);
  });
}

function renderPlaylist() {
  renderTrackList(albumTracks, playlist, trackCount, "没有匹配的专辑曲目");
  renderTrackList(cutTracks, cutPlaylist, cutCount, "没有匹配的删减曲目");
}

function renderPlayerVersions(track) {
  renderVersionButtons(track, versionSelector, true);
}

function updateTrackMeta() {
  const track = currentTrack();
  const version = currentVersion();
  trackNumber.textContent = track.number.startsWith("D") ? "Cut Track" : `Track ${track.number}`;
  trackTitle.textContent = track.title;
  trackVersion.textContent = version.label;
  audio.src = version.src;
  duration.textContent = "0:00";
  currentTime.textContent = "0:00";
  lyricsClock.textContent = "0:00";
  seek.value = "0";
  updateSeekProgress(0);
  setStatus("");
  loadLyrics(track);
  renderPlayerVersions(track);
  renderPlaylist();
}

async function playCurrent() {
  try {
    await audio.play();
    syncPlayButton(true);
  } catch {
    setStatus("播放失败，请检查浏览器是否允许本地音频。");
  }
}

function pauseCurrent() {
  audio.pause();
  syncPlayButton(false);
}

function selectTrack(trackId, versionIndex = 0, shouldPlay = false) {
  const nextTrack = playbackOrder.find((track) => track.id === trackId);
  if (!nextTrack) return;

  currentTrackId = nextTrack.id;
  currentVersionIndex = Math.min(Math.max(versionIndex, 0), nextTrack.versions.length - 1);
  updateTrackMeta();
  if (shouldPlay) {
    playCurrent();
  }
}

function stepTrack(direction) {
  const currentOrderIndex = playbackOrder.findIndex((track) => track.id === currentTrackId);
  const nextIndex = (currentOrderIndex + direction + playbackOrder.length) % playbackOrder.length;
  selectTrack(playbackOrder[nextIndex].id, 0, !audio.paused);
}

playPause.addEventListener("click", () => {
  if (audio.paused) {
    playCurrent();
  } else {
    pauseCurrent();
  }
});

previous.addEventListener("click", () => stepTrack(-1));
next.addEventListener("click", () => stepTrack(1));

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
  updateSeekProgress();
});

audio.addEventListener("timeupdate", () => {
  if (!isSeeking && Number.isFinite(audio.duration) && audio.duration > 0) {
    seek.value = String((audio.currentTime / audio.duration) * 1000);
    updateSeekProgress();
  }

  const formattedTime = formatTime(audio.currentTime);
  currentTime.textContent = formattedTime;
  lyricsClock.textContent = formattedTime;
  updateActiveLyric(audio.currentTime);
});

audio.addEventListener("play", () => {
  syncPlayButton(true);
});

audio.addEventListener("pause", () => {
  syncPlayButton(false);
});

audio.addEventListener("ended", () => {
  const currentOrderIndex = playbackOrder.findIndex((track) => track.id === currentTrackId);
  if (currentOrderIndex < playbackOrder.length - 1 || loopAlbum.checked) {
    stepTrack(1);
  } else {
    pauseCurrent();
  }
});

audio.addEventListener("error", () => {
  setStatus(`找不到 ${currentVersion().src}`);
});

seek.addEventListener("input", () => {
  isSeeking = true;
  updateSeekProgress();
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    const nextTime = (Number(seek.value) / 1000) * audio.duration;
    currentTime.textContent = formatTime(nextTime);
    lyricsClock.textContent = formatTime(nextTime);
  }
});

seek.addEventListener("change", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    const nextTime = (Number(seek.value) / 1000) * audio.duration;
    audio.currentTime = nextTime;
    updateActiveLyric(nextTime);
    updateSeekProgress();
  }
  isSeeking = false;
});

document.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement) return;

  if (event.code === "Space") {
    event.preventDefault();
    playPause.click();
  }

  if (event.key === "ArrowLeft") {
    stepTrack(-1);
  }

  if (event.key === "ArrowRight") {
    stepTrack(1);
  }
});

renderAuthPanel();
updateTrackMeta();
