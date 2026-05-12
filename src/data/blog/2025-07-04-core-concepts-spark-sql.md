---
pubDatetime: 2025-07-04T00:00:00Z
title: "Khái niệm cốt lõi trong Spark SQL: Hive, Metastore, Warehouse, Catalog và Managed/Unmanaged Tables"
slug: core-concepts-spark-sql
featured: false
draft: false
tags:
  - spark
  - spark-sql
  - hive
  - hive-metastore
  - catalog
description:
  Giải thích chi tiết Hive, Hive Metastore, Hive Warehouse, Catalog và
  Managed/Unmanaged Tables — các khái niệm dễ nhầm lẫn nhất khi học Spark SQL.
---

## Table of contents

## 1. Hive là gì?

**Apache Hive** là công cụ kho dữ liệu (data warehouse) trên Hadoop HDFS, cho phép dùng **HiveQL** để truy vấn dữ liệu lớn. Hive được phát triển bởi Facebook trước khi Spark ra đời.

### Vai trò trong Spark SQL

- **Tích hợp**: Spark SQL kế thừa khả năng Hive, cho phép sử dụng các bảng đã định nghĩa trong Hive thông qua Hive Metastore — giúp chuyển đổi từ Hive sang Spark dễ dàng.
- **Hiệu suất**: Spark SQL cải thiện hiệu suất so với Hive.
- **Không bắt buộc**: Có thể dùng Spark SQL mà không cần Hive, vì Spark có metastore nội bộ riêng.

---

## 2. Hive Metastore

**Hive Metastore** là cơ sở dữ liệu quan hệ (MySQL, PostgreSQL, Derby) lưu trữ **metadata** của các bảng, database, phân vùng, và các đối tượng khác. Metadata bao gồm:

- Cấu trúc bảng (tên cột, kiểu dữ liệu)
- Vị trí dữ liệu (đường dẫn trên HDFS, S3)
- Thông tin phân vùng
- Định dạng tệp (Parquet, ORC, CSV, ...)

### Lưu trữ bằng gì?

| Database | Ghi chú                                  |
| -------- | ---------------------------------------- |
| MySQL    | Phổ biến trong production               |
| PostgreSQL | Được sử dụng rộng rãi                 |
| Derby    | Database nhúng mặc định (dùng để test)  |

### Vai trò trong Spark SQL

- **Quản lý metadata**: Giúp Spark biết cách truy cập dữ liệu mà không cần quét toàn bộ tệp.
- **Tích hợp Hive**: Spark SQL kết nối Hive Metastore để tái sử dụng bảng hiện có.
- **Cải thiện hiệu suất**: Metadata giúp Spark xác định vị trí dữ liệu và cấu trúc bảng nhanh chóng.

### Cấu hình

Đặt các tệp cấu hình (`hive-site.xml`, `core-site.xml`, `hdfs-site.xml`) vào thư mục `conf/` của Spark.

Một số thuộc tính quan trọng:

- `spark.sql.hive.metastore.version`: Phiên bản Hive Metastore.
- `spark.sql.hive.metastore.jars`: Đường dẫn đến thư viện Hive.

### Ví dụ

```sql
CREATE TABLE flights (DEST_COUNTRY_NAME STRING, count LONG) USING parquet
```

Hive Metastore lưu metadata: tên bảng, cột, vị trí `/user/hive/warehouse/flights`, định dạng Parquet.

---

## 3. Hive Warehouse

**Hive Warehouse** là **thư mục** trên hệ thống tệp (HDFS, S3, ...) nơi Spark hoặc Hive lưu trữ **dữ liệu thực tế** của các **managed tables**. Đường dẫn mặc định: `/user/hive/warehouse`.

### Cấu trúc thư mục

```
/user/hive/warehouse/
├── flights/                          # managed table "flights"
├── partitioned_flights/
│   ├── DEST_COUNTRY_NAME=USA/
│   └── DEST_COUNTRY_NAME=Canada/
```

### Đặc điểm

- Khi tạo managed table, Spark tự động lưu dữ liệu vào Hive Warehouse.
- Khi `DROP TABLE`, cả dữ liệu trong Hive Warehouse **và** metadata đều bị xóa.

---

## 4. Catalog

> Catalog là **giao diện trừu tượng** (abstraction) trong Spark SQL, dùng để truy cập và quản lý metadata của database, bảng, view, và hàm.

Hình dung: Catalog giống như **nhân viên lễ tân** trong thư viện — bạn hỏi về danh sách bảng, Catalog tra cứu trong Hive Metastore và trả lời.

### Các thao tác phổ biến

```python
# Liệt kê bảng, database, hàm
spark.catalog.listTables()
spark.catalog.listDatabases()
spark.catalog.listFunctions()

# Kiểm tra bảng tồn tại
spark.catalog.tableExists("flights")

# Cache bảng vào RAM
spark.catalog.cacheTable("flights")
```

Tương đương SQL:

```sql
SHOW TABLES
SHOW DATABASES
SHOW FUNCTIONS
```

### Ví dụ luồng hoạt động

Khi tạo bảng:

```sql
CREATE TABLE flights (DEST_COUNTRY_NAME STRING, count LONG) USING parquet
```

1. **Catalog** gửi yêu cầu lưu metadata → **Hive Metastore** lưu metadata → **Hive Warehouse** lưu dữ liệu Parquet.

Khi truy vấn:

```sql
SHOW TABLES
```

2. **Catalog** hỏi Hive Metastore → trả về danh sách bảng.

---

## 5. Managed vs. Unmanaged Tables

### Managed Tables

Spark quản lý cả **dữ liệu** (Hive Warehouse) và **metadata** (Hive Metastore).

```sql
CREATE TABLE flights (DEST_COUNTRY_NAME STRING, count LONG) USING parquet
INSERT INTO flights VALUES ('USA', 100)
```

- Dữ liệu lưu tại `/user/hive/warehouse/flights`.
- `DROP TABLE flights` → xóa **cả** dữ liệu lẫn metadata.

### Unmanaged Tables

Spark chỉ quản lý **metadata**, dữ liệu nằm ở vị trí bên ngoài.

```sql
CREATE EXTERNAL TABLE external_flights (DEST_COUNTRY_NAME STRING, count LONG)
LOCATION '/data/external/flights'
```

- Dữ liệu ở `/data/external/flights` (không thuộc Hive Warehouse).
- `DROP TABLE external_flights` → chỉ xóa metadata, dữ liệu vẫn còn.

### So sánh nhanh

| Đặc điểm        | Managed Table                    | Unmanaged Table                  |
| --------------- | -------------------------------- | -------------------------------- |
| Metadata        | Hive Metastore                   | Hive Metastore                   |
| Dữ liệu         | Hive Warehouse                   | Vị trí bên ngoài                 |
| DROP TABLE      | Xóa cả dữ liệu + metadata       | Chỉ xóa metadata                 |
| Tạo bảng        | `CREATE TABLE`                   | `CREATE EXTERNAL TABLE ... LOCATION` |

---

## 6. Tổng kết

| Khái niệm        | Vai trò                                                      |
| ---------------- | ------------------------------------------------------------ |
| Hive             | Công cụ kho dữ liệu, cung cấp HiveQL và Hive Metastore      |
| Hive Metastore   | Lưu **metadata** trong database quan hệ (MySQL, PostgreSQL)  |
| Hive Warehouse   | Lưu **dữ liệu** của managed tables trên hệ thống tệp        |
| Catalog          | Giao diện truy cập metadata — cầu nối tới Hive Metastore     |
| Managed Table    | Spark quản lý cả metadata + dữ liệu                          |
| Unmanaged Table  | Spark chỉ quản lý metadata, dữ liệu ở vị trí bên ngoài      |
