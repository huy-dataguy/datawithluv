---
pubDatetime: 2025-07-02T00:00:00Z
title: "Tổng quan DataFrame trong Apache Spark: Khái niệm, Schema, và Partitioning"
slug: overview-dataframe
featured: false
draft: false
tags:
  - spark
  - dataframe
  - partition
  - schema
  - scala
description:
  Giới thiệu DataFrame trong Apache Spark — cấu trúc 2 chiều phân tán, hiểu
  Row/Column/Schema/Partitioning để làm việc hiệu quả với dữ liệu lớn.
---

## Table of contents

## 1. DataFrame là gì?

Trong Apache Spark, **DataFrame** là một cấu trúc dữ liệu 2 chiều giống như bảng (table), bao gồm:

- **Rows (hàng)**: đại diện cho từng bản ghi dữ liệu (Record), dưới dạng đối tượng `Row`.
- **Columns (cột)**: đại diện cho các trường dữ liệu (Field), có thể là một biểu thức hoặc phép toán.

DataFrame có thể hiểu như **DataTable trong Pandas** hoặc **table trong RDBMS** — nhưng được thiết kế để chạy phân tán, song song, với dung lượng cực lớn.

### Ví dụ

```scala
val df = Seq(10, 20, 30, 40, 50).toDF("value")
df.show()
```

Kết quả:

```
+-----+
|value|
+-----+
|   10|
|   20|
|   30|
|   40|
|   50|
+-----+
```

## 2. Schema — định nghĩa cấu trúc của DataFrame

Schema xác định:

- Tên từng cột
- Kiểu dữ liệu của mỗi cột (StringType, IntegerType, TimestampType, ...)

Ví dụ đọc file CSV với schema Spark tự suy diễn:

```scala
val flightData2015 = spark
  .read
  .option("inferSchema", "true")
  .option("header", "true")
  .csv("/data/flight-data/csv/2015-summary.csv")

flightData2015.printSchema()
```

Kết quả:

```
root
 |-- DEST_COUNTRY_NAME: string (nullable = true)
 |-- ORIGIN_COUNTRY_NAME: string (nullable = true)
 |-- count: integer (nullable = true)
```

## 3. Column — không chỉ là dữ liệu!

Trong Spark, mỗi cột (Column) là một **biểu thức** (expression). Điều này cho phép bạn áp dụng các phép biến đổi hoặc tính toán trên từng dòng dữ liệu một cách tối ưu.

```scala
val df2 = flightData2015.withColumn("count_plus_10", col("count") + 10)
df2.show()
```

## 4. Partitioning — cách dữ liệu được phân phối trên cluster

Khi xử lý dữ liệu lớn, Spark tự động chia nhỏ DataFrame thành các **partition** để xử lý song song trên nhiều node/CPU core.

**Partition là gì?**

- Là đơn vị xử lý song song trong Spark.
- Một DataFrame có thể có nhiều partition, mỗi partition chứa một phần dữ liệu.
- Partitioning scheme xác định cách dữ liệu được phân bổ — có thể do Spark tự quyết định (default) hoặc bạn tự chỉ định (custom partitioning).

Kiểm tra số lượng partition:

```scala
val numParts = flightData2015.rdd.getNumPartitions
println(s"Dataset hiện có $numParts partition(s)")
```

## 5. Tổng kết

| Thành phần | Giải thích                                      |
| ---------- | ----------------------------------------------- |
| Row        | Một dòng dữ liệu, kiểu `Row`                    |
| Column     | Biểu thức tính toán (không chỉ là dữ liệu tĩnh) |
| Schema     | Cấu trúc định nghĩa tên cột + kiểu dữ liệu      |
| Partition  | Đơn vị xử lý song song — tối ưu hiệu năng       |
