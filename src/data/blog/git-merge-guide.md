---
pubDatetime: 2026-05-12T10:00:00Z
title: "Git Merge: Hướng dẫn gộp code giữa các branch từ A đến Z"
slug: git-merge-guide
featured: false
draft: false
tags:
  - git
  - devops
  - tutorial
description:
  Hướng dẫn thực hành gộp code giữa các branch bằng Git merge - từ kiểm tra
  trạng thái, đánh giá conflict, đến merge an toàn và xử lý khi sai.
---

Làm việc với nhiều branch là thực tế hàng ngày của developer. Nhưng gộp code
(git merge) sai cách có thể gây conflict乱了, mất code, hoặc tệ hơn — hỏng build
trên server. Bài viết này là checklist từng bước để bạn merge code an toàn,
hiểu rõ chuyện gì đang xảy ra, và biết cách undo khi cần.

<figure>
  <img
    src="https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    alt="Git merge workflow - multiple branches converging"
  />
  <figcaption class="text-center">
    Merge code đúng cách giúp team tránh conflict và giữ codebase ổn định.
  </figcaption>
</figure>

## Table of contents

## Quy trình tổng quan

Git merge không phải một lệnh chạy một lần. Nó là một quy trình gồm 5 bước:

1. **Kiểm tra trạng thái hiện tại** — đang ở đâu, có gì chưa commit?
2. **Fetch** — cập nhật thông tin mới nhất từ remote.
3. **So sánh** — xem hai branch khác nhau thế nào.
4. **Đánh giá rủi ro** — file nào có khả năng conflict?
5. **Merge và xử lý kết quả** — gộp code, giải quyết conflict nếu có.

> Nếu bạn chỉ cần lệnh merge nhanh và không muốn đọc thêm, nhảy thẳng xuống
> [Quick Reference](#quick-reference).

---

## Bước 1: Kiểm tra trạng thái hiện tại

Trước khi làm bất cứ điều gì, bạn cần biết mình đang đứng ở đâu.

### Branch nào đang active?

```bash
git branch --show-current
```

### Có file nào đang sửa chưa commit?

```bash
git status --short
```

Cách đọc output:

| Ký hiệu | Ý nghĩa |
|----------|----------|
| `M  file.py` | File đã staged, sẵn sàng commit |
| ` M file.py` | File đã sửa nhưng chưa staged |
| `?? file.py` | File mới, chưa được Git theo dõi |
| `D  file.py` | File đã staged để xóa |

<figure>
  <img
    src="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    alt="Checking git status in terminal"
  />
  <figcaption class="text-center">
    Luôn kiểm tra <code>git status</code> trước khi merge để tránh mất code chưa commit.
  </figcaption>
</figure>

### 5 commit gần nhất?

```bash
git log --oneline -5
```

### Nếu có uncommitted changes

**Phải commit trước khi merge.** Uncommitted changes có thể gây conflict không
cần thiết hoặc khiến merge thất bại.

```bash
# Xem đầy đủ file nào thay đổi
git status

# Thêm từng file (kiểm soát tốt hơn)
git add file1.py file2.py

# Hoặc thêm tất cả (cẩn thận — có thể thêm file không mong muốn)
git add -A

# Commit
git commit -m "describe what changed"
```

> **Tip:** Nếu chưa muốn commit nhưng cần merge gấp, dùng `git stash` để cất
> tạm thay đổi, merge xong rồi `git stash pop` lấy lại.

---

## Bước 2: Cập nhật thông tin từ remote

```bash
git fetch origin
```

**Tại sao `fetch` thay vì `pull`?**

| Lệnh | Hành động | Rủi ro |
|------|-----------|--------|
| `git fetch` | Chỉ tải metadata về máy local | Không thay đổi file nào — an toàn |
| `git pull` | Fetch + merge ngay vào branch hiện tại | Có thể gây conflict bất ngờ |

`fetch` cho bạn xem trước những gì sắp xảy ra, rồi quyết định có merge hay
không. `pull` thì đã merge rồi — không có cơ hội xem trước.

---

## Bước 3: So sánh hai branch

Sau khi fetch, bạn đã có thông tin mới nhất. Giờ xem hai branch khác nhau thế nào.

### Branch mục tiêu có commit gì mà branch hiện tại chưa có?

```bash
git log --oneline <branch-hien-tai>..<branch-muc-tieu>
```

Ví dụ: xem `feature/LibCrawler` có gì mới hơn `server/RunTest`:

```bash
git log --oneline server/RunTest..origin/feature/LibCrawler

# Output ví dụ:
# a1b2c3d add symbol fetcher module
# e4f5g6h update config for crawler
# i7j8k9l fix: handle empty response
```

### File nào bị thay đổi?

```bash
git diff --stat <branch-hien-tai>..<branch-muc-tieu>
```

Ví dụ:

```bash
git diff --stat server/RunTest..origin/feature/LibCrawler

# Output ví dụ:
#  src/symbol_fetcher.py  | 45 ++++++++++++++
#  configs/config.yaml    | 12 ++--
#  requirements.txt       |  2 +
#  3 files changed, 51 insertions(+), 6 deletions(-)
```

<figure>
  <img
    src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    alt="Comparing branches before merging"
  />
  <figcaption class="text-center">
    Luôn so sánh trước khi merge để đánh giá rủi ro conflict.
  </figcaption>
</figure>

---

## Bước 4: Đánh giá rủi ro conflict

Sau khi có danh sách file từ Bước 3, đối chiếu với file bạn đang sửa trên branch hiện tại.

### Trường hợp 1 — File không giao nhau (AN TOAN)

```
Branch A sửa:  symbol_fetcher.py, .lock files
Branch B sửa:  configs/, docker-compose.yml
```

Hai branch chạm vào hoàn toàn khác file → **không conflict** → merge luôn.

### Trường hợp 2 — Cùng file, khác dòng (THƯỜNG AN TOÀN)

```
Branch A sửa dòng 1–10 của file X
Branch B sửa dòng 50–60 của file X
```

Git đủ thông minh để tự merge trong trường hợp này. **Thường** không conflict,
nhưng nên kiểm tra kỹ sau merge.

### Trường hợp 3 — Cùng file, cùng dòng (CÓ CONFLICT)

```
Branch A đổi dòng 5 thành "datalab"
Branch B đổi dòng 5 thành "aragserving"
```

Git không thể tự quyết định giữ cái nào → **conflict** → phải giải quyết thủ
công.

> **Nguyên tắc:** Conflict không phải lỗi. Nó chỉ là Git hỏi bạn: *"Bạn muốn
> giữ code nào?"*

---

## Bước 5: Thực hiện merge

### Merge không conflict

```bash
# Đảm bảo đang ở branch nhận (branch muốn lấy code về)
git checkout server/RunTest

# Merge
git merge origin/feature/LibCrawler
```

Nếu may mắn, output sẽ giống thế này:

```
Merge made by the 'ort' strategy.
 src/symbol_fetcher.py | 45 ++++++++++++++
 configs/config.yaml   | 12 ++--
 2 files changed, 51 insertions(+), 6 deletions(-)
```

### Merge có conflict — Cách xử lý

Khi conflict xảy ra, Git sẽ báo:

```
CONFLICT (content): Merge conflict in configs/config.yaml
Automatic merge failed; fix conflicts and then commit the result.
```

**Quy trình xử lý từng bước:**

Bước 1 — Mở file bị conflict. Git đánh dấu như sau:

```yaml
# <<<<<<< HEAD        ← code của bạn (branch hiện tại)
database_host: datalab
# =======             ← phân cách
database_host: aragserving
# >>>>>>> origin/feature/LibCrawler  ← code từ branch kia
```

Bước 2 — Chỉnh sửa file: chọn code muốn giữ, xóa các dòng đánh dấu
`<<<<<<<`, `=======`, `>>>>>>>`.

Bước 3 — Đánh dấu đã giải quyết:

```bash
git add configs/config.yaml
```

Bước 4 — Hoàn tất merge:

```bash
git commit -m "merge feature/LibCrawler into server/RunTest"
```

<figure>
  <img
    src="https://images.pexels.com/photos/160107/pexels-photo-160107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    alt="Resolving merge conflicts in code editor"
  />
  <figcaption class="text-center">
    Conflict chỉ là Git hỏi bạn chọn code nào — không phải lỗi.
  </figcaption>
</figure>

### Merge sai — Undo ngay

Nếu merge bị conflict quá nhiều, hoặc bạn nhận ra merge nhầm branch — đừng
hoảng:

```bash
# Hủy merge, trở lại trạng thái trước đó
git merge --abort
```

Lệnh này **chỉ hoạt động** khi merge chưa commit. Sau khi commit rồi, phải dùng
`git reset` — cẩn thận hơn.

---

## Mẹo: Dùng git stash khi chưa muốn commit

Đang làm dở việc trên branch A, cần merge gấp nhưng không muốn commit code
dở? Dùng `git stash`:

```bash
# Cất tạm tất cả thay đổi chưa commit
git stash

# Thực hiện merge bình thường
git merge origin/feature/something

# Lấy lại thay đổi đã cất
git stash pop
```

---

## Quick Reference

Các lệnh dùng thường xuyên nhất, gom lại một bảng để tra nhanh:

| Lệnh | Ý nghĩa | Khi nào dùng |
|------|---------|--------------|
| `git branch --show-current` | Xem branch hiện tại | Luôn — trước mọi thao tác |
| `git status` | Xem trạng thái file | Luôn — trước mọi thao tác |
| `git log --oneline -10` | Xem 10 commit gần nhất | Cần hiểu bối cảnh code |
| `git fetch origin` | Cập nhật thông tin từ remote | Trước khi merge hoặc so sánh |
| `git diff --stat A..B` | So sánh file giữa hai branch | Đánh giá rủi ro trước merge |
| `git log --oneline A..B` | Xem commit B có mà A chưa có | Hiểu code sắp merge vào |
| `git merge <branch>` | Gộp branch vào branch hiện tại | Sau khi đã kiểm tra kỹ |
| `git merge --abort` | Hủy merge đang làm dở | Conflict quá nhiều / merge nhầm |
| `git stash` | Cất tạm thay đổi chưa commit | Cần merge gấp nhưng chưa xong việc |
| `git stash pop` | Lấy lại thay đổi đã cất | Sau khi merge xong |
| `git add <file>` | Stage file | Sau khi giải quyết conflict |
| `git commit -m "msg"` | Commit | Hoàn tất merge |

---

## Tóm tắt — 5 nguyên tắc vàng

1. **Luôn `fetch` trước `merge`** — Biết rõ gì sắp xảy ra trước để quyết định.
2. **Luôn commit trước khi merge** — Có uncommitted changes mà merge là tự rước
   rủi ro. Nếu chưa muốn commit, dùng `git stash`.
3. **Luôn so sánh trước** — Dùng `git diff --stat` và `git log` để xem hai
   branch khác nhau thế nào.
4. **Không sợ conflict** — Nó bình thường, chỉ là Git hỏi bạn muốn giữ code
   nào. Xử lý từng file, test kỹ sau merge.
5. **Nhớ `git merge --abort`** — Nếu merge sai hoặc conflict quá nhiều, abort
   và hỏi người có kinh nghiệm. Không cố gắng xử lý khi chưa hiểu rõ.
