# 🎨 Bé Gốm Vui Học

Một ứng dụng web giáo dục được cá nhân hóa và đầy màu sắc dành cho trẻ mầm non, giúp bé vừa học vừa chơi thông qua các trò chơi tương tác. Dự án được xây dựng bằng React, TypeScript và được tối ưu hóa với kiến trúc "ưu tiên tài nguyên tĩnh".

*(Bạn nên thêm một ảnh chụp màn hình hoặc GIF demo của ứng dụng tại đây để README thêm sinh động)*
`![Screenshot Màn hình chính](./public/assets/images/covers/screenshot.png)`

---

## ✨ Giới thiệu

**Bé Gốm Vui Học** được tạo ra như một món quà dành cho bé Gốm, với mục tiêu biến việc học các kỹ năng cơ bản (toán, tiếng Việt, tiếng Anh) trở nên thú vị và gần gũi. Ứng dụng tích hợp các nội dung được cá nhân hóa và một hệ thống khen thưởng hấp dẫn để khuyến khích bé học tập mỗi ngày.

Điểm đặc biệt của dự án là kiến trúc **Static-First**, được thiết kế để tối ưu hiệu suất, tiết kiệm chi phí và **tránh hoàn toàn giới hạn API (rate limit)** bằng cách tạo trước toàn bộ tài nguyên hình ảnh và âm thanh.

## 🚀 Tính năng nổi bật

-   **🎮 10+ Trò chơi đa dạng:**
    -   **Toán học:** Bé Học Toán, Tiệm Bánh Vui Vẻ, Cho Thú Ăn, Tung Xúc Xắc.
    -   **Ngôn ngữ:** Bé Ghép Chữ, Robot Ráp Tiếng, Bé Điền Chữ, Bé Học Tiếng Anh.
    -   **Tư duy:** Lật Thẻ Trí Nhớ.
-   **🌟 Hệ thống Khen thưởng:** Bé sẽ nhận được sticker ngộ nghĩnh sau khi hoàn thành một số lượng câu hỏi, và có thể xem bộ sưu tập trong "Sổ Dán Hình".
-   **🔊 Hỗ trợ Đọc thành tiếng:** Tất cả các câu hỏi và từ vựng đều có thể được phát âm bằng giọng nói AI (tạo bởi Gemini TTS) để hỗ trợ các bé chưa đọc thông thạo.
-   **⚡ Kiến trúc Ưu tiên Tài nguyên tĩnh (Static-First):**
    -   Hình ảnh và âm thanh được tạo một lần duy nhất bằng **Trình tạo Tài nguyên**.
    -   Toàn bộ tài nguyên được lưu trữ tĩnh trong thư mục `public/assets` và phục vụ qua CDN của Vercel, giúp ứng dụng tải cực nhanh.
    -   API của Gemini chỉ được gọi cho các nội dung thực sự "động" (ví dụ: các bài toán ngẫu nhiên), giảm thiểu chi phí và loại bỏ rủi ro bị giới hạn API.
-   **🔧 Trình tạo Tài nguyên Tích hợp:** Một công cụ mạnh mẽ cho phép tạo và quản lý tất cả tài nguyên hình ảnh, giọng nói cần thiết cho ứng dụng.

## 🛠️ Công nghệ & Kiến trúc

-   **Frontend:** [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **API:** [Google Gemini API](https://ai.google.dev/) (dùng để tạo tài nguyên)
-   **Cấu trúc thư mục:**
    -   `public/assets/`: Chứa tất cả tài nguyên tĩnh (hình ảnh, âm thanh).
    -   `src/components/games/`: Mỗi file là một component game độc lập.
    -   `src/components/common/`: Các component tái sử dụng (nút, popup...).
    -   `src/services/`: Logic nghiệp vụ (gọi API, xử lý âm thanh).
    -   `src/data/`: Dữ liệu tĩnh (danh sách từ vựng, prompts...).

##  Workflow Quy trình làm việc & Triển khai

Dự án được thiết kế để triển khai dễ dàng và hiệu quả trên các nền tảng như Vercel.

1.  **Tạo tài nguyên (Làm một lần):**
    -   Chạy dự án trên máy local.
    -   Truy cập vào `ResourceGenerator.tsx` (Trình tạo Tài nguyên).
    -   Tạo tất cả hình ảnh và âm thanh cần thiết và tải chúng về.

2.  **Lưu trữ tài nguyên:**
    -   Di chuyển tất cả các tệp đã tải về vào đúng cấu trúc thư mục trong `public/assets/`. Ví dụ:
        -   `public/assets/images/covers/math_game_cover.png`
        -   `public/assets/audio/voices/vi/meo.wav`

3.  **Triển khai:**
    -   Commit toàn bộ mã nguồn, bao gồm cả thư mục `public` đã chứa đầy đủ tài nguyên, lên Git.
    -   Kết nối repository với Vercel. Vercel sẽ tự động build và triển khai ứng dụng, phục vụ các tài nguyên tĩnh qua CDN toàn cầu của họ.

## 📦 Cài đặt & Chạy dự án

1.  **Clone repository:**
    ```bash
    git clone https://github.com/nhucuong010/be-gom-vui-hoc.git
    cd be-gom-vui-hoc
    ```

2.  **Tạo file môi trường:**
    -   Tạo một file tên là `.env` ở thư mục gốc.
    -   Thêm API Key của bạn vào file:
        ```
        API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
    *(Lưu ý: API Key chỉ cần thiết khi bạn muốn chạy Trình tạo Tài nguyên để tạo mới hoặc cập nhật tài nguyên.)*

3.  **Chạy ứng dụng:**
    -   Vì đây là một dự án React tĩnh, bạn chỉ cần mở file `index.html` bằng trình duyệt hoặc sử dụng một máy chủ live-server đơn giản.

## 🌱 Tương lai & Mở rộng

Cấu trúc module hóa giúp việc thêm các trò chơi mới trở nên cực kỳ đơn giản:
1.  Tạo một component game mới trong `src/components/games/`.
2.  (Tùy chọn) Thêm dữ liệu tĩnh vào `src/data/`.
3.  (Tùy chọn) Thêm logic mới vào `src/services/`.
4.  Thêm tài nguyên vào `public/assets/`.
5.  Kết nối game mới vào `App.tsx` và `HomeScreen.tsx`.

---
