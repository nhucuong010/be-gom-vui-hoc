# Hướng Dẫn Thêm Tranh Tô Màu

## Cách thêm tranh tô màu vào game "Họa Sĩ Tí Hon"

### Bước 1: Tìm hoặc tạo tranh tô màu

**Tùy chọn A - Tải tranh miễn phí từ internet:**
1. Truy cập các trang web sau để tải tranh miễn phí:
   - Vecteezy: https://www.vecteezy.com/png/dinosaur-coloring-page
   - Creative Kids Color: https://www.creativekidscolor.com/
   - Superstar Worksheets: https://www.superstarworksheets.com/
   
2. Tìm kiếm với từ khóa: "coloring pages for kids PNG" hoặc "tô màu trẻ em PNG"

3. Chọn tranh có:
   - **Đường nét đen rõ ràng**
   - **Nền trắng**
   - **Định dạng PNG** (tốt nhất)
   - **Kích thước từ 800x800px trở lên**

**Tùy chọn B - Tự vẽ hoặc scan:**
1. Vẽ tranh bằng bút đen trên giấy trắng
2. Chụp ảnh hoặc scan
3. Dùng phần mềm chỉnh sửa (Photoshop/GIMP) để:
   - Tăng độ tương phản
   - Làm nét đường vẽ
   - Làm trắng nền
   - Lưu dạng PNG

### Bước 2: Chuẩn bị file ảnh

1. Đổi tên file theo định dạng: `tên-tranh.png` (chữ thường, không dấu, dùng dấu gạch nối)
   - Ví dụ: `unicorn.png`, `princess.png`, `dinosaur.png`

2. Copy file ảnh vào thư mục:
   ```
   public/assets/images/coloring/
   ```

### Bước 3: Cập nhật danh sách tranh

Mở file `components/ColoringGame.tsx` và tìm dòng:
```typescript
const TEMPLATES = [
```

Thêm tranh mới vào danh sách:
```typescript
{ id: 'ten_tranh', name: 'Tên Hiển Thị 📷', image: '/assets/images/coloring/ten-tranh.png' },
```

Ví dụ:
```typescript
const TEMPLATES = [
    { id: 'unicorn', name: 'Kỳ Lân 🦄', image: '/assets/images/coloring/unicorn.png' },
    { id: 'princess', name: 'Công Chúa 👸', image: '/assets/images/coloring/princess.png' },
    { id: 'my_drawing', name: 'Tranh Của Bé 🎨', image: '/assets/images/coloring/my-drawing.png' }, // THÊM MỚI
];
```

### Bước 4: Test và Deploy

1. Chạy thử trên máy tính:
   ```bash
   npm run dev
   ```

2. Kiểm tra xem tranh hiển thị tốt không

3. Đẩy lên GitHub:
   ```bash
   git add .
   git commit -m "feat: add new coloring pages"
   git push origin main
   ```

4. Vercel sẽ tự động cập nhật sau 1-2 phút

---

## Gợi ý nguồn tranh miễn phí

### Chủ đề phổ biến cho trẻ em:
- 🦄 Kỳ lân (Unicorn)
- 👸 Công chúa (Princess)
- 🦕 Khủng long (Dinosaur)
- 🐱 Động vật dễ thương (Cute animals)
- 🚀 Tên lửa, vũ trụ (Space, rockets)
- 🦋 Bướm, côn trùng (Butterflies, insects)
- 🏰 Lâu đài (Castles)
- 🧜 Nàng tiên cá (Mermaids)
- 🚗 Xe cộ (Cars, trucks)
- 🌸 Hoa lá (Flowers, plants)

### Mẹo chọn tranh tốt:
✅ Đường nét dày, rõ ràng
✅ Vùng tô lớn, dễ dàng
✅ Không quá chi tiết phức tạp
✅ Phù hợp lứa tuổi bé (3-8 tuổi)
❌ Tránh chọn tranh có quá nhiều chi tiết nhỏ
❌ Tránh tranh đã tô sẵn màu
