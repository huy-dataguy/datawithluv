---
pubDatetime: 2025-09-01T00:00:00Z
title: "Cài đặt và tạo shortcut cho Mendeley Reference Manager trên Linux"
slug: install-mendeley-shortcut
featured: false
draft: false
tags:
  - ubuntu
  - mendeley
  - appimage
description:
  Hướng dẫn cài đặt Mendeley Reference Manager dạng AppImage trên Ubuntu/Linux
  và tạo shortcut hiển thị trong menu ứng dụng.
---

## Table of contents

## 1. Tải Mendeley Reference Manager

Truy cập trang chính thức: [Download Mendeley Reference Manager](https://www.mendeley.com/download-reference-manager)

File tải về có dạng:

```
mendeley-reference-manager-2.137.0-x86_64.AppImage
```

## 2. Di chuyển AppImage sang thư mục Applications

```bash
mkdir -p ~/Applications
mv ~/Downloads/mendeley-reference-manager-2.137.0-x86_64.AppImage ~/Applications/mendeley.AppImage
```

## 3. Cấp quyền thực thi

```bash
chmod +x ~/Applications/mendeley.AppImage
```

Cài thêm thư viện cần thiết cho AppImage:

```bash
sudo apt install libfuse2
```

## 4. Tạo shortcut trong menu ứng dụng

Tạo file `.desktop`:

```bash
vim ~/.local/share/applications/mendeley.desktop
```

Dán nội dung sau (chỉnh lại đường dẫn theo máy bạn):

```ini
[Desktop Entry]
Name=Mendeley Reference Manager
Exec=/home/dataguy/Applications/mendeley.AppImage --no-sandbox
Icon=/home/dataguy/Applications/mendeley.png
Type=Application
Categories=Office;
Terminal=false
```

> Có thể tải icon chính thức hoặc dùng icon `.png` bất kỳ, lưu tại `~/Applications/mendeley.png`.

## 5. Kích hoạt shortcut

```bash
chmod +x ~/.local/share/applications/mendeley.desktop
update-desktop-database ~/.local/share/applications
```

Giờ bạn có thể mở menu ứng dụng và tìm **Mendeley Reference Manager**.
