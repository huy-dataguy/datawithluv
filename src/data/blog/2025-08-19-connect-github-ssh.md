---
pubDatetime: 2025-08-19T00:00:00Z
title: "Kết nối GitHub bằng SSH: Tạo và thêm SSH key"
slug: connect-github-ssh
featured: false
draft: false
tags:
  - git
  - github
  - ssh
description:
  Hướng dẫn tạo SSH key ed25519, thêm vào ssh-agent và cấu hình GitHub để
  push/pull mà không cần nhập mật khẩu mỗi lần.
---

## Table of contents

Khi làm việc với GitHub, thay vì nhập username và password mỗi lần push/pull, ta có thể dùng **SSH key** để xác thực an toàn và tiện lợi hơn.

## 1. Tạo SSH key mới

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

Nếu hệ thống không hỗ trợ `ed25519`, dùng RSA:

```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

Khi được hỏi **Enter a file in which to save the key**, nhấn `Enter` để lưu ở đường dẫn mặc định (`~/.ssh/id_ed25519`). Nếu đã có key trước đó, có thể đặt tên mới (ví dụ `id_ed25519_github`).

Tiếp theo, nhập passphrase để bảo mật key (hoặc để trống nếu muốn).

## 2. Thêm SSH key vào ssh-agent

Khởi động ssh-agent:

```bash
eval "$(ssh-agent -s)"
```

Thêm private key vào ssh-agent:

```bash
ssh-add ~/.ssh/id_ed25519
```

## 3. Thêm public key vào GitHub

Hiển thị public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy toàn bộ nội dung, sau đó vào GitHub: **Settings → SSH and GPG keys → New SSH key → Paste key**.

<figure>
  <img
    src="https://github.com/user-attachments/assets/9e427467-04e7-4e04-8a5f-59f9afb203b8"
    alt="Thêm SSH key vào GitHub"
  />
  <figcaption class="text-center">
    Thêm SSH key public vào GitHub Settings.
  </figcaption>
</figure>

## 4. Kiểm tra kết nối

Clone repo bằng SSH:

```bash
git clone git@github.com:user_name/repo_name.git
```

Nếu kết nối thành công, bạn sẽ không cần nhập username/password nữa.

## 5. Cấu hình Git (user.name & user.email)

Đây là cấu hình để Git ghi nhận ai là tác giả của commit:

```bash
git config --global user.email "your-email@example.com"
git config --global user.name "your-name"
```

- `user.email`: email của bạn trên GitHub.
- `user.name`: tên hiển thị trên commit (có thể khác username GitHub).
