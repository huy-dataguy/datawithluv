---
pubDatetime: 2025-08-22T00:00:00Z
title: "Cài đặt Apache Spark và Jupyter Lab trên Ubuntu với pip"
slug: spark-jupyter-setup
featured: false
draft: false
tags:
  - spark
  - pyspark
  - jupyter
  - ubuntu
  - pip
  - miniconda
description:
  Hướng dẫn từng bước cài Apache Spark trên Ubuntu, cấu hình Jupyter Lab để
  chạy PySpark — bao gồm cả tùy chọn dùng Miniconda.
---

## Table of contents

## 0. Một số khái niệm

- **PySpark** = dùng Spark bằng Python.
- **findspark** = thư viện Python hỗ trợ tìm Spark trong máy.
- **virtualenv (venv)/conda + ipykernel** = công cụ tạo môi trường ảo, tách biệt thư viện cho từng project.

## 1. Cài đặt Java JDK

Spark chạy trên JVM, nên cần Java trước.

```bash
sudo apt update
sudo apt install openjdk-11-jdk -y
java -version
```

## 2. Cài đặt Python và pip

```bash
python3 --version
```

Nếu thiếu pip:

```bash
sudo apt install python3-pip -y
```

## 3. Tải Apache Spark

Truy cập [Spark Download](https://dlcdn.apache.org/spark/) và lấy link bản mới nhất. Ví dụ Spark 3.5.6:

```bash
wget https://dlcdn.apache.org/spark/spark-3.5.6/spark-3.5.6-bin-hadoop3.tgz
tar -xvzf spark-3.5.6-bin-hadoop3.tgz
mv spark-3.5.6-bin-hadoop3 /opt/spark
```

## 4. Cấu hình biến môi trường

Mở file `~/.bashrc`:

```bash
vim ~/.bashrc
```

Thêm cuối file:

```bash
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
export SPARK_HOME=/opt/spark
export PATH=$SPARK_HOME/bin:$PATH
```

Nạp lại:

```bash
source ~/.bashrc
```

## 5. Cài đặt PySpark và Jupyter Lab bằng pip

Tạo môi trường ảo:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Cài thư viện:

```bash
pip install pyspark findspark jupyterlab
```

Đăng ký kernel:

```bash
python -m ipykernel install --user --name=.venv --display-name "Python (.venv)"
```

## 6. Kiểm tra

Chạy thử Spark shell:

```bash
pyspark
```

Chạy Jupyter Lab:

```bash
jupyter lab
```

Trong Jupyter, tạo notebook và chọn kernel **Python (.venv)** để chạy Spark.

<figure>
  <img
    src="https://github.com/user-attachments/assets/719247d8-b8e8-4f99-865b-848884380f89"
    alt="Chạy PySpark trong Jupyter Lab"
  />
  <figcaption class="text-center">
    PySpark chạy thành công trong Jupyter Lab.
  </figcaption>
</figure>

## 7. Ví dụ

**test.txt**:

```text
I am a final year student of HCMUTE, I am passionate about BigData, and spark is one of my favorite tools.
spark is a very powerful tool in BigData processing
```

<figure>
  <img
    src="https://github.com/user-attachments/assets/1c841219-3dde-4f4f-b89b-bb6f41fe2270"
    alt="Ví dụ PySpark word count"
  />
  <figcaption class="text-center">
    Ví dụ Word Count bằng PySpark trong Jupyter.
  </figcaption>
</figure>

## 8. Hướng dẫn cài thêm bằng Miniconda

### a. Cài đặt Miniconda

Xem hướng dẫn tại: [Miniconda Install](https://www.anaconda.com/docs/getting-started/miniconda/install)

### b. Tạo và activate môi trường ảo

```bash
conda create -n myvenv python=3.10
conda activate myvenv
```

### c. Cài đặt Jupyter Lab và đăng ký kernel

```bash
pip install jupyterlab
pip install pyspark==3.5.3
python -m ipykernel install --user --name=myvenv --display-name "Python (pyspark)"
```
