---
pubDatetime: 2025-07-03T00:00:00Z
title: "Read/Write dữ liệu trong Apache Spark"
slug: read-write-datasource
featured: false
draft: false
tags:
  - spark
  - datasource
  - csv
  - json
  - parquet
  - jdbc
description:
  Hướng dẫn chi tiết cách đọc và ghi dữ liệu trong Spark — từ CSV, JSON,
  Parquet, ORC đến kết nối JDBC với cơ sở dữ liệu, kèm các mẹo tối ưu hiệu
  suất.
---

## Table of contents

## 1. Data Source là gì trong Apache Spark?

Apache Spark hỗ trợ **6 nguồn dữ liệu chính** (core data sources):

- **CSV**: File văn bản với các giá trị phân tách bằng dấu phẩy.
- **JSON**: File định dạng JSON, thường dùng trong ứng dụng web.
- **Parquet**: Định dạng cột tối ưu, tiết kiệm không gian và nhanh khi truy vấn.
- **ORC**: Định dạng cột tối ưu cho Hive, tương tự Parquet.
- **JDBC/ODBC**: Kết nối với cơ sở dữ liệu như MySQL, PostgreSQL, SQLite.
- **Text Files**: File văn bản thuần túy, mỗi dòng là một bản ghi.

---

## 2. Cách Spark đọc và ghi dữ liệu

Spark sử dụng hai công cụ chính:

- **DataFrameReader**: Đọc dữ liệu từ file hoặc database vào Spark.
- **DataFrameWriter**: Ghi dữ liệu từ Spark ra file hoặc database.

### 2.1. Đọc dữ liệu (DataFrameReader)

```scala
spark.read
  .format("định_dạng")
  .option("tùy_chọn", "giá_trị")
  .schema(mySchema)
  .load("đường_dẫn")
```

**Ví dụ đọc file CSV**:

```scala
spark.read.format("csv")
  .option("header", "true")
  .option("inferSchema", "true")
  .load("/data/flight-data/csv/2018-summary.csv")
  .show(5)
```

#### Chế độ đọc (Read Modes)

| Chế độ           | Ý nghĩa                                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| `permissive`     | Ghi `null` cho bản ghi lỗi, lưu lỗi vào cột `_corrupt_record`. Mặc định.       |
| `dropMalformed`  | Bỏ qua các bản ghi lỗi.                                                        |
| `failFast`       | Dừng ngay khi gặp bản ghi lỗi.                                                 |

```scala
spark.read.format("csv")
  .option("header", "true")
  .option("mode", "FAILFAST")
  .load("/data/flight-data/csv/2018-summary.csv")
```

### 2.2. Ghi dữ liệu (DataFrameWriter)

```scala
dataFrame.write
  .format("định_dạng")
  .option("tùy_chọn", "giá_trị")
  .mode("chế_độ_ghi")
  .save("đường_dẫn")
```

#### Chế độ ghi (Save Modes)

| Chế độ              | Ý nghĩa                                               |
| ------------------- | ------------------------------------------------------ |
| `append`            | Thêm dữ liệu mới vào file/database hiện có.            |
| `overwrite`         | Ghi đè hoàn toàn dữ liệu cũ.                          |
| `errorIfExists`     | Báo lỗi nếu dữ liệu đã tồn tại (mặc định).            |
| `ignore`            | Bỏ qua, không ghi nếu dữ liệu đã tồn tại.             |

---

## 3. Làm việc với các loại dữ liệu phổ biến

### 3.1. File CSV

```scala
val csvDF = spark.read.format("csv")
  .option("header", "true")
  .option("inferSchema", "true")
  .load("/data/flight-data/csv/2018-summary.csv")
csvDF.show(5)
```

Tạo schema thủ công:

```scala
import org.apache.spark.sql.types.{StructField, StructType, StringType, LongType}

val mySchema = StructType(Array(
  StructField("DEST_COUNTRY_NAME", StringType, true),
  StructField("ORIGIN_COUNTRY_NAME", StringType, true),
  StructField("count", LongType, false)
))

val csvDF = spark.read.format("csv")
  .option("header", "true")
  .option("mode", "FAILFAST")
  .schema(mySchema)
  .load("/data/flight-data/csv/2010-summary.csv")
csvDF.show(5)
```

#### Các tùy chọn CSV quan trọng

| Tùy chọn      | Ý nghĩa                                          |
| ------------- | ------------------------------------------------- |
| `sep`         | Ký tự phân tách (mặc định: `,`).                 |
| `header`      | Dòng đầu là tiêu đề (`true`/`false`).            |
| `inferSchema` | Tự đoán kiểu dữ liệu (`true`/`false`).           |
| `nullValue`   | Ký tự đại diện cho giá trị null.                 |
| `compression` | Nén file: `gzip`, `snappy`, ...                  |
| `multiline`   | Hỗ trợ bản ghi trải dài nhiều dòng.              |

Ghi file TSV:

```scala
csvDF.write.format("csv")
  .option("sep", "\t")
  .mode("overwrite")
  .save("/tmp/my-tsv-file.tsv")
```

### 3.2. File JSON

```scala
val jsonDF = spark.read.format("json")
  .option("mode", "FAILFAST")
  .option("inferSchema", "true")
  .load("/data/flight-data/json/2018-summary.json")
jsonDF.show(5)
```

#### Các tùy chọn JSON

| Tùy chọn        | Ý nghĩa                                                        |
| --------------- | --------------------------------------------------------------- |
| `multiline`     | Đọc file như một đối tượng JSON lớn.                            |
| `compression`   | Nén file: `gzip`, `snappy`, ...                                 |
| `dateFormat`    | Định dạng ngày (mặc định: `yyyy-MM-dd`).                        |
| `allowComments` | Cho phép comment trong JSON.                                    |

Ghi file JSON:

```scala
csvDF.write.format("json")
  .mode("overwrite")
  .save("/tmp/my-json-file.json")
```

### 3.3. File Parquet

Parquet là định dạng **mặc định** của Spark — hiệu suất cao, nén tốt, hỗ trợ kiểu phức tạp.

```scala
// Đọc
val parquetDF = spark.read.format("parquet")
  .load("/data/flight-data/parquet/2010-summary.parquet")
parquetDF.show(5)

// Ghi
csvDF.write.format("parquet")
  .mode("overwrite")
  .save("/tmp/my-parquet-file.parquet")
```

**Tại sao nên dùng Parquet?**

- **Nhanh**: Chỉ đọc cột cần thiết, không quét toàn bộ dữ liệu.
- **Nén tốt**: 1GB CSV có thể còn ~200MB Parquet.
- **Hỗ trợ phức tạp**: Array, map, struct.

### 3.4. File ORC

```scala
// Đọc
spark.read.format("orc").load("/data/flight-data/orc/2010-summary.orc")

// Ghi
csvDF.write.format("orc").mode("overwrite").save("/tmp/my-orc-file.orc")
```

### 3.5. File Text

```scala
// Đọc
spark.read.textFile("/data/flight-data/csv/2018-summary.csv")
  .selectExpr("split(value, ',') as rows")
  .show()

// Ghi (chỉ hỗ trợ một cột kiểu string)
csvDF.select("DEST_COUNTRY_NAME").write.text("/tmp/simple-text-file.txt")
```

### 3.6. Cơ sở dữ liệu (JDBC)

Đọc từ SQLite:

```scala
val url = "jdbc:sqlite:/tmp/my-sqlite.db"
val dbDF = spark.read.format("jdbc")
  .option("url", url)
  .option("dbtable", "flight_info")
  .option("driver", "org.sqlite.JDBC")
  .load()
dbDF.show(5)
```

Đọc từ PostgreSQL:

```scala
val pgDF = spark.read.format("jdbc")
  .option("driver", "org.postgresql.Driver")
  .option("url", "jdbc:postgresql://database_server")
  .option("dbtable", "schema.flight_info")
  .option("user", "username")
  .option("password", "my-secret-password")
  .load()
```

Ghi vào database:

```scala
val props = new java.util.Properties
props.setProperty("driver", "org.sqlite.JDBC")

csvDF.write
  .mode("overwrite")
  .jdbc("jdbc:sqlite:/tmp/my-sqlite.db", "flight_info", props)
```

#### Tối ưu với Query Pushdown

Đẩy bộ lọc xuống database để giảm dữ liệu tải về:

```scala
dbDF.filter("DEST_COUNTRY_NAME IN ('Anguilla', 'Sweden')").show()
```

Hoặc dùng truy vấn SQL trực tiếp:

```scala
val pushdownQuery = "(SELECT DISTINCT(DEST_COUNTRY_NAME) FROM flight_info) AS flight_info"
spark.read.format("jdbc")
  .option("url", url)
  .option("dbtable", pushdownQuery)
  .option("driver", driver)
  .load()
```

---

## 4. Tối ưu hiệu suất

### 4.1. Phân vùng dữ liệu (Partitioning)

Phân vùng giúp Spark chỉ đọc phần dữ liệu cần thiết khi lọc.

```scala
csvDF.write
  .partitionBy("DEST_COUNTRY_NAME")
  .format("parquet")
  .save("/tmp/partitioned-files.parquet")
```

> Chỉ phân vùng theo cột có giá trị lặp lại nhiều (quốc gia, ngày), tránh cột như ID duy nhất.

### 4.2. Kiểm soát số lượng file

```scala
csvDF.repartition(5)
  .write.format("csv")
  .save("/tmp/multiple.csv")
```

### 4.3. Giới hạn kích thước file

```scala
csvDF.write
  .option("maxRecordsPerFile", 5000)
  .format("parquet")
  .save("/tmp/output")
```

---

## 5. Tổng kết

| Định dạng | Ưu điểm                                                  |
| --------- | -------------------------------------------------------- |
| CSV       | Phổ biến, dễ dùng, cần cấu hình cẩn thận                |
| JSON      | Hỗ trợ dữ liệu phức tạp (array, map)                     |
| Parquet   | Tốt nhất cho dữ liệu lớn — nhanh, nén tốt               |
| ORC       | Tối ưu cho Hive                                          |
| JDBC      | Kết nối database, tận dụng query pushdown                |

**Tài liệu tham khảo**: [Apache Spark — SQL Data Sources](https://spark.apache.org/docs/latest/sql-data-sources.html)
