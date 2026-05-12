---
pubDatetime: 2025-07-01T00:00:00Z
title: "Reusable Utils & Code Snippets"
slug: utils-reference
featured: false
draft: false
tags:
  - pyspark
  - spark
  - spark-sql
  - utils
description:
  Tổng hợp các đoạn codesnippet dùng lại thường xuyên khi làm việc với Spark,
  Spark-SQL và Scala.
---

## Table of contents

## 1. Spark

### a. Write data to console

```scala
(df.write
    .format("console")
    .option("truncate", false)
    .save())
```

## 2. Spark-SQL

### a. Show info of table in database

```scala
spark.read.table("spark_catalog.bronze.reddit_submission").show()
```

```scala
spark.read.table("spark_catalog.bronze.reddit_submission").printSchema()
```

```scala
spark.read.table("spark_catalog.bronze.reddit_submission").count()
```

```scala
val df = spark.read.table("spark_catalog.bronze.reddit_submission")
df.columns.length
```

```scala
spark.sql("DESCRIBE FORMATTED spark_catalog.bronze.reddit_submission").show(200, false)
```

## 3. Spark — Tắt log dư thừa

```scala
val sc = SparkContext("local[2]", "HashtagCountApp")
sc.setLogLevel("ERROR")
```

Chỉ hiển thị log ở mức **ERROR** trở lên, tất cả log mức **WARN** và **INFO** sẽ bị ẩn.

- **INFO** → chi tiết quá trình (nhiều dòng thừa).
- **WARN** → cảnh báo (không phải lỗi, nhưng vẫn in ra).
- **ERROR** → chỉ in lỗi thật sự.
