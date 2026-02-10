# Hướng Dẫn Sử Dụng - Stable Diffusion Image Generator

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ThanhTrunggDEV/StableDiffusion/blob/main/StableDiffusion_Colab.ipynb)

## Giới Thiệu
Ứng dụng web tạo ảnh từ mô tả văn bản sử dụng Stable Diffusion và Flask.

## 🚀 Bắt Đầu Nhanh

### Cách 1: Chạy trên Google Colab (Dễ nhất - Không cần cài đặt!)
**Hoàn hảo để test mà không cần setup local**

1. Nhấn vào badge "Open in Colab" ở trên
2. Làm theo hướng dẫn trong notebook
3. Lấy ngrok token miễn phí tại [ngrok.com](https://ngrok.com/)
4. Chạy tất cả các cells và tận hưởng!

### Cách 2: Chạy trên máy local

## Yêu Cầu Hệ Thống (cho local)
- Python 3.8 trở lên
- GPU NVIDIA với CUDA (khuyến nghị) hoặc CPU
- 8GB RAM trở lên (16GB+ khuyến nghị cho GPU)
- 10GB dung lượng ổ cứng trống (cho model và dependencies)

## Cài Đặt

### Cách 1: Sử Dụng Script Tự Động (Khuyến nghị)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Cách 2: Cài Đặt Thủ Công

1. **Tạo môi trường ảo:**
```bash
python -m venv venv
```

2. **Kích hoạt môi trường ảo:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

3. **Cài đặt thư viện:**
```bash
pip install -r requirements.txt
```

## Chạy Ứng Dụng

### Cách 1: Sử Dụng Script

**Windows:**
```bash
run.bat
```

**Linux/Mac:**
```bash
chmod +x run.sh
./run.sh
```

### Cách 2: Chạy Trực Tiếp

1. Kích hoạt môi trường ảo
2. Chạy lệnh:
```bash
python app.py
```

3. Mở trình duyệt và truy cập:
```
http://localhost:5000
```

## Sử Dụng

### 1. Tạo Ảnh

1. Vào trang chủ
2. Nhập mô tả ảnh vào ô "Prompt" (bắt buộc)
   - Ví dụ: "A beautiful sunset over mountains, oil painting style"
3. (Tùy chọn) Nhập "Negative Prompt" - những gì bạn KHÔNG muốn thấy
   - Ví dụ: "blurry, low quality, distorted"
4. Điều chỉnh các thông số:
   - **Width/Height**: Kích thước ảnh (512x512 mặc định)
   - **Steps**: Số bước tạo ảnh (50 mặc định, càng cao càng chi tiết nhưng chậm hơn)
   - **Guidance Scale**: Mức độ tuân theo prompt (7.5 mặc định, 7-15 là tốt nhất)
   - **Seed**: Số ngẫu nhiên để tái tạo cùng một ảnh
5. Nhấn "Generate Image"
6. Đợi khoảng 5-10 giây (GPU) hoặc 1-5 phút (CPU)

### 2. Xem Thư Viện

- Nhấn "Gallery" trên menu
- Xem tất cả ảnh đã tạo
- Nhấn "View Full" để xem ảnh kích thước đầy đủ

## Mẹo Tạo Ảnh Đẹp

### Viết Prompt Hiệu Quả:
- **Cụ thể và chi tiết**: "A red dragon flying over snowy mountains at sunset"
- **Thêm phong cách**: "digital art", "oil painting", "photorealistic", "anime style"
- **Mô tả ánh sáng**: "dramatic lighting", "soft lighting", "golden hour"
- **Chất lượng**: "highly detailed", "8k", "masterpiece"

### Ví Dụ Prompt Hay:
```
A majestic castle on a cliff overlooking the ocean, dramatic sunset, 
fantasy art, highly detailed, trending on artstation
```

```
Portrait of a wise old wizard with long white beard, magical aura,
cinematic lighting, digital painting, 4k, detailed
```

### Negative Prompt Phổ Biến:
```
blurry, low quality, distorted, deformed, ugly, bad anatomy,
watermark, text, signature
```

## Cấu Hình Nâng Cao

### Thay Đổi Model

Mở [config.py](config.py) và thay đổi:
```python
MODEL_ID = "stabilityai/stable-diffusion-2-1"  # Hoặc model khác
```

### Sử Dụng CPU Thay Vì GPU

Mở [config.py](config.py) và thay đổi:
```python
DEVICE = "cpu"
```

### Thay Đổi Cổng Server

Mở [app.py](app.py) và thay đổi dòng cuối:
```python
app.run(debug=True, host='0.0.0.0', port=8080)  # Đổi 5000 thành 8080
```

## Xử Lý Lỗi Thường Gặp

### Lỗi: "CUDA out of memory"
- Giảm kích thước ảnh (ví dụ: 256x256 hoặc 384x384)
- Đóng các ứng dụng khác đang dùng GPU
- Chuyển sang CPU mode

### Lỗi: Model download failed
- Kiểm tra kết nối internet
- Thử lại, model sẽ tự động tải về (~4GB)

### Ảnh tạo ra không đẹp
- Viết prompt chi tiết hơn
- Tăng số steps (50-100)
- Thử guidance scale khác (7-15)
- Thêm negative prompt

### Tạo ảnh quá chậm
- Giảm số steps
- Giảm kích thước ảnh
- Đảm bảo đang dùng GPU nếu có

## Cấu Trúc Thư Mục

```
StableDiffusion/
├── app.py                  # Ứng dụng Flask chính
├── config.py              # Cấu hình
├── requirements.txt       # Thư viện Python
├── setup.bat/sh          # Script cài đặt
├── run.bat/sh           # Script chạy ứng dụng
├── utils/
│   └── image_generator.py # Logic tạo ảnh
├── static/
│   ├── css/              # File CSS
│   ├── js/               # File JavaScript
│   └── generated/        # Ảnh đã tạo
└── templates/            # Template HTML
    ├── index.html        # Trang chủ
    └── gallery.html      # Trang thư viện
```

## Models Stable Diffusion Khác

Bạn có thể thử các model khác từ Hugging Face:

- `runwayml/stable-diffusion-v1-5` (mặc định, cân bằng)
- `stabilityai/stable-diffusion-2-1` (mới hơn, chất lượng cao)
- `CompVis/stable-diffusion-v1-4` (phiên bản gốc)
- `dreamlike-art/dreamlike-photoreal-2.0` (phong cách ảnh thật)

## Giấy Phép
MIT License

## Hỗ Trợ
Nếu gặp vấn đề, kiểm tra:
1. Python version (phải >= 3.8)
2. Tất cả thư viện đã cài đặt đúng
3. Có đủ dung lượng ổ cứng
4. Môi trường ảo đã được kích hoạt

---
Chúc bạn tạo được những bức ảnh đẹp! 🎨
