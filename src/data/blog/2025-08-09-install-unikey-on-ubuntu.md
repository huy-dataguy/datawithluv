---
pubDatetime: 2025-08-09T00:00:00Z
title: "Cài đặt bộ gõ Tiếng Việt trên Ubuntu"
slug: install-unikey-on-ubuntu
featured: false
draft: false
tags:
  - ubuntu
  - unikey
  - fcitx5
description:
  Hướng dẫn cài đặt và cấu hình Fcitx5-Unikey để gõ tiếng Việt trên Ubuntu
  — từ cài đặt, thêm bộ gõ, chọn Telex/VNI đến thiết lập phím tắt chuyển đổi.
---

## Table of contents

## Fcitx5-Unikey là gì?

**Fcitx5** là hệ thống quản lý phương thức nhập liệu (input method framework) trên Linux. **Unikey** là input engine được tích hợp vào Fcitx5, chuyên xử lý nhập liệu tiếng Việt với các kiểu gõ Telex hoặc VNI.

## Bước 1: Cài đặt Fcitx5 và Unikey

```bash
sudo apt install fcitx5 fcitx5-unikey fcitx5-config-qt fcitx5-frontend-gtk3 fcitx5-frontend-gtk4
```

## Bước 2: Đặt Fcitx5 làm bộ gõ mặc định

```bash
im-config -n fcitx5
```

Sau đó **đăng xuất và đăng nhập lại** Ubuntu để áp dụng thay đổi.

## Bước 3: Thêm bộ gõ tiếng Việt Unikey

Mở công cụ cấu hình:

```bash
fcitx5-configtool
```

1. Chuyển sang tab **Input Method**.
2. Nhấn nút **"+"** để thêm bộ gõ (giữ nguyên Keyboard-English(US)).
3. Tìm kiếm **Unikey** hoặc **Vietnamese** trong danh sách.
4. Chọn **Unikey** → nhấn **OK**.

<figure>
  <img
    src="https://github.com/user-attachments/assets/a051408c-3eb9-455d-be3b-32ee271b1cc7"
    alt="Thêm Unikey vào Fcitx5"
  />
  <figcaption class="text-center">
    Thêm Unikey vào danh sách input method trong Fcitx5 Config Tool.
  </figcaption>
</figure>

## Bước 4: Cấu hình kiểu gõ

1. Trong danh sách bộ gõ, chọn **Unikey** → nhấn biểu tượng **bánh răng** để mở cài đặt.
2. Chọn kiểu gõ phù hợp: **Telex** hoặc **VNI**.
3. Nhấn **OK** để lưu.

<figure>
  <img
    src="https://github.com/user-attachments/assets/e7f427f4-8632-4a61-8019-a4017321e168"
    alt="Cấu hình kiểu gõ Telex/VNI"
  />
  <figcaption class="text-center">
    Chọn kiểu gõ Telex hoặc VNI trong cài đặt Unikey.
  </figcaption>
</figure>

## Bước 5: Chuyển đổi giữa các bộ gõ

Phím tắt mặc định: **Ctrl + Space** để chuyển qua lại giữa Unikey và bàn phím tiếng Anh.

Nếu phím tắt không hoạt động, thay đổi trong **Global Options** của `fcitx5-configtool`:

1. Tìm mục **Trigger Input Method**.
2. Nhấn **"-"** để xóa phím tắt hiện tại (Ctrl + Space).
3. Nhấn **"+"** và chọn phím mới, ví dụ: **Super + Space**.
4. Nhấn **OK** để lưu.

<figure>
  <img
    src="https://github.com/user-attachments/assets/0f861afb-c5c6-4b61-8d9d-e92e7fcf27f2"
    alt="Thay đổi phím tắt chuyển bộ gõ"
  />
  <figcaption class="text-center">
    Cấu hình phím tắt chuyển đổi input method trong Fcitx5.
  </figcaption>
</figure>

> Nếu phím chuyển ngôn ngữ của fcitx5-configtool trùng với keyboard shortcuts của Ubuntu thì bạn sẽ không chuyển được — cần tắt keyboard shortcuts đó trước.

## Khắc phục sự cố

**Không thấy bộ gõ Unikey?**

```bash
sudo apt install fcitx5-unikey
```

**Fcitx5 không hoạt động?**

```bash
fcitx5 -r
```
