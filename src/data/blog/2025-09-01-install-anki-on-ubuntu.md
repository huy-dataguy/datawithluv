---
pubDatetime: 2025-09-01T00:00:00Z
title: "Cài đặt và tạo shortcut cho Anki trên Linux"
slug: install-anki-on-ubuntu
featured: false
draft: false
tags:
  - ubuntu
  - anki
  - shortcut
description:
  Hướng dẫn cài đặt Anki trên Ubuntu/Linux và tạo file .desktop shortcut để
  hiển thị trong menu ứng dụng.
---

## Table of contents

## 1. Cài đặt các thư viện cần thiết

```bash
sudo apt install libxcb-xinerama0 libxcb-cursor0 libnss3 zstd mpv
```

## 2. Tải Anki

Truy cập trang chính thức: [Download Anki](https://apps.ankiweb.net/)

Sau khi tải, file sẽ nằm trong thư mục `~/Downloads`.

## 3. Giải nén và di chuyển Anki

```bash
cd ~/Downloads
tar xaf anki-2XXX-linux-qt6.tar.zst
mkdir -p ~/Applications
mv anki-2XXX-linux-qt6 ~/Applications/anki
```

`2XXX` là số version (ví dụ: `anki-25.07.5-linux-qt6`).

## 4. Tạo shortcut để Anki hiển thị trong menu

Tạo file `.desktop`:

```bash
vim ~/.local/share/applications/anki.desktop
```

Nội dung (chỉnh lại đường dẫn đúng với máy bạn):

```ini
[Desktop Entry]
Name=Anki
Exec=/home/dataguy/Applications/anki/anki
Icon=/home/dataguy/Applications/anki/anki.png
Type=Application
Categories=Education;
Terminal=false
```

## 5. Cấp quyền và cập nhật database

```bash
chmod +x ~/.local/share/applications/anki.desktop
update-desktop-database ~/.local/share/applications
```

Giờ bạn có thể tìm **Anki** trực tiếp trong menu ứng dụng Linux.
