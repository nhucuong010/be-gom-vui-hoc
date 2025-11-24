

import type { StreetFoodProblem, StreetFoodMenuItem } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

export const MENU: Record<'pizza' | 'pasta' | 'fries' | 'hotdog' | 'banhmi' | 'popcorn' | 'icecream', StreetFoodMenuItem> = {
  pizza: {
    id: 'pizza', name: 'Pizza', price: 6,
    steps: [
      { instruction: "Phết sốt cà chua", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pizza_step_0_base.png` },
      { instruction: "Rắc phô mai", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pizza_step_1_sauce.png` },
      { instruction: "Thêm xúc xích", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pizza_step_2_cheese.png` },
      { instruction: "Cho vào lò nướng", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pizza_step_3_pepperoni.png` },
      { instruction: "Nướng bánh...", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pizza_step_4_in_oven.png` },
      { instruction: "Bánh pizza đã xong!", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pizza_step_5_finished.png` },
    ]
  },
  pasta: {
    id: 'pasta', name: 'Mì Ý', price: 5,
    steps: [
      { instruction: "Cho mì vào nồi", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pasta_step_0_raw.png` },
      { instruction: "Bắt đầu luộc mì", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pasta_step_1_in_pot.png` },
      { instruction: "Mì đang sôi...", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pasta_step_2_boiling.png` },
      { instruction: "Vớt mì ra", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pasta_step_3_strained.png` },
      { instruction: "Cho mì ra đĩa", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pasta_step_4_plated.png` },
      { instruction: "Thêm sốt cà chua", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pasta_step_5_finished.png` },
    ]
  },
  fries: {
    id: 'fries', name: 'Khoai tây chiên', price: 4,
    steps: [
      { instruction: "Cho khoai vào rổ", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_fries_step_0_raw.png` },
      { instruction: "Bắt đầu chiên", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_fries_step_1_in_basket.png` },
      { instruction: "Chiên khoai...", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_fries_step_2_frying.png` },
      { instruction: "Khoai tây đã xong!", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_fries_step_3_finished.png` },
    ]
  },
  hotdog: {
    id: 'hotdog', name: 'Hotdog', price: 5,
    steps: [
      { instruction: "Lấy vỏ bánh", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_hotdog_step_0_bun.png` },
      { instruction: "Cho xúc xích", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_hotdog_step_1_sausage.png` },
      { instruction: "Thêm tương cà", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_hotdog_step_2_ketchup.png` },
      { instruction: "Thêm mù tạt!", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_hotdog_step_3_mustard.png` },
    ]
  },
  banhmi: {
    id: 'banhmi', name: 'Bánh Mì', price: 5,
    steps: [
      { instruction: "Xẻ bánh mì", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_banhmi_step_0_cut.png` },
      { instruction: "Phết pa-tê", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_banhmi_step_1_pate.png` },
      { instruction: "Thêm thịt nguội", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_banhmi_step_2_meat.png` },
      { instruction: "Thêm dưa leo", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_banhmi_step_3_cucumber.png` },
      { instruction: "Chan nước sốt", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_banhmi_step_4_sauce.png` },
      { instruction: "Bánh mì giòn tan!", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_banhmi_step_5_finished.png` },
    ]
  },
  popcorn: {
    id: 'popcorn', name: 'Bắp Rang Bơ', price: 4,
    steps: [
      { instruction: "Cho bắp vào nồi", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_popcorn_step_0_kernels.png` },
      { instruction: "Thêm bơ thơm lừng", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_popcorn_step_1_butter.png` },
      { instruction: "Đậy nắp lại", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_popcorn_step_2_lid.png` },
      { instruction: "Bắp đang nổ lốp bốp...", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_popcorn_step_3_popping.png` },
      { instruction: "Đổ ra hộp", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_popcorn_step_4_pouring.png` },
      { instruction: "Bắp rang bơ nóng hổi!", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_popcorn_step_5_finished.png` },
    ]
  },
  icecream: {
    id: 'icecream', name: 'Kem Ốc Quế', price: 3,
    steps: [
      { instruction: "Lấy bánh ốc quế", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_icecream_step_0_cone.png` },
      { instruction: "Múc kem dâu", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_icecream_step_1_scoop1.png` },
      { instruction: "Múc kem sô-cô-la", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_icecream_step_2_scoop2.png` },
      { instruction: "Rắc cốm màu", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_icecream_step_3_sprinkles.png` },
      { instruction: "Thêm bánh quế", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_icecream_step_4_wafer.png` },
      { instruction: "Kem mát lạnh đây!", imageUrl: `${ASSET_BASE_URL}/assets/images/sf_icecream_step_5_finished.png` },
    ]
  }
};

export const problemBank: StreetFoodProblem[] = [
    // Level 1: Phép trừ đơn giản (Phạm vi 10), số tiền khách đưa đa dạng
    { 
        level: 1, 
        order: { 
            customerId: 'ba_cuong', 
            customerName: 'Ba Cương', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/ba-cuong.png`, 
            orderText: "Con ơi, cho ba 1 pizza nhé.", 
            items: ['pizza'], 
            total: 6, 
            payment: 7, // Khách đưa 7 xu
            change: 1 // 7 - 6 = 1
        } 
    },
    { 
        level: 1, 
        order: { 
            customerId: 'chi_na', 
            customerName: 'Chị Na', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/chi-na.png`, 
            orderText: "Cho chị một phần khoai tây chiên nha.", 
            items: ['fries'], 
            total: 4, 
            payment: 5, // Khách đưa 5 xu
            change: 1 // 5 - 4 = 1
        } 
    },
    { 
        level: 1, 
        order: { 
            customerId: 'ba_thom', 
            customerName: 'Bà Thơm', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/ba-thom.png`, 
            orderText: "Cho bà một phần mì Ý thôi nhé.", 
            items: ['pasta'], 
            total: 5, 
            payment: 5, // Đưa vừa đủ
            change: 0 // 5 - 5 = 0
        } 
    },
    { 
        level: 1, 
        order: { 
            customerId: 'em_gao', 
            customerName: 'Em Gạo', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/gao-nang.png`, 
            orderText: "Em muốn một cái hotdog ạ.", 
            items: ['hotdog'], 
            total: 5, 
            payment: 8, // Khách đưa 8 xu
            change: 3 // 8 - 5 = 3
        } 
    },
    { 
        level: 1, 
        order: { 
            customerId: 'customer_muoi', 
            customerName: 'Bạn Muối', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/customer-muoi.png`, 
            orderText: "Cho tớ một phần khoai tây chiên.", 
            items: ['fries'], 
            total: 4, 
            payment: 10, // Khách đưa 10 xu
            change: 6 // 10 - 4 = 6
        } 
    },
    // New Items Level 1
    { 
        level: 1, 
        order: { 
            customerId: 'anh_xoai', 
            customerName: 'Anh Xoài', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/anh-xoai.png`, 
            orderText: "Làm cho anh một ổ bánh mì nhé.", 
            items: ['banhmi'], 
            total: 5, 
            payment: 8, 
            change: 3 // 8 - 5 = 3
        } 
    },
    { 
        level: 1, 
        order: { 
            customerId: 'customer_cherry', 
            customerName: 'Bé Cherry', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/customer-cherry.png`, 
            orderText: "Cho tớ một hộp bắp rang bơ.", 
            items: ['popcorn'], 
            total: 4, 
            payment: 9, 
            change: 5 // 9 - 4 = 5
        } 
    },
    { 
        level: 1, 
        order: { 
            customerId: 'em_gam', 
            customerName: 'Em Gấm', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/em-gam.png`, 
            orderText: "Em thích kem ốc quế!", 
            items: ['icecream'], 
            total: 3, 
            payment: 5, 
            change: 2 // 5 - 3 = 2
        } 
    },

    // Level 2: Phép cộng menu và trừ tiền thối
    { 
        level: 2, 
        order: { 
            customerId: 'me_huong', 
            customerName: 'Mẹ Hương', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/me-huong.png`, 
            orderText: "Cho mẹ 1 mì Ý và 1 khoai tây chiên nhé.", 
            items: ['pasta', 'fries'], // 5 + 4 = 9
            total: 9, 
            payment: 9, // Đưa vừa đủ
            change: 0 // 9 - 9 = 0
        } 
    },
    { 
        level: 2, 
        order: { 
            customerId: 'anh_xoai', 
            customerName: 'Anh Xoài', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/anh-xoai.png`, 
            orderText: "Anh muốn 1 pizza và 1 khoai tây chiên.", 
            items: ['pizza', 'fries'], // 6 + 4 = 10
            total: 10, 
            payment: 10, // Đưa vừa đủ
            change: 0 // 10 - 10 = 0
        } 
    },
    { 
        level: 2, 
        order: { 
            customerId: 'ong_khoa', 
            customerName: 'Ông Khoa', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/ong-khoa.png`, 
            orderText: "Ông ăn 1 hotdog và 1 khoai tây chiên nhé.", 
            items: ['hotdog', 'fries'], // 5 + 4 = 9
            total: 9, 
            payment: 10, // Đưa 10 xu
            change: 1 // 10 - 9 = 1
        } 
    },
    { 
        level: 2, 
        order: { 
            customerId: 'em_gam', 
            customerName: 'Em Gấm', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/em-gam.png`, 
            orderText: "Cho em 1 mì Ý và 1 hotdog.", 
            items: ['pasta', 'hotdog'], // 5 + 5 = 10
            total: 10, 
            payment: 10, 
            change: 0 
        } 
    },
    { 
        level: 2, 
        order: { 
            customerId: 'ba_bup', 
            customerName: 'Bà Búp', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/ba-bup.png`, 
            orderText: "Bà mua 2 phần khoai tây chiên.", 
            items: ['fries', 'fries'], // 4 + 4 = 8
            total: 8, 
            payment: 9, // Đưa 9 xu
            change: 1 // 9 - 8 = 1
        } 
    },
    { 
        level: 2, 
        order: { 
            customerId: 'customer_gin', 
            customerName: 'Bạn Gin', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/customer-gin.png`, 
            orderText: "Cho mình 1 pizza nhé.", 
            items: ['pizza'], 
            total: 6, 
            payment: 10, 
            change: 4 // 10 - 6 = 4
        } 
    },
    // New Items Level 2
    { 
        level: 2, 
        order: { 
            customerId: 'ba_cuong', 
            customerName: 'Ba Cương', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/ba-cuong.png`, 
            orderText: "Ba lấy 1 bánh mì và 1 kem ốc quế.", 
            items: ['banhmi', 'icecream'], // 5 + 3 = 8
            total: 8, 
            payment: 10, 
            change: 2 // 10 - 8 = 2
        } 
    },
    { 
        level: 2, 
        order: { 
            customerId: 'chi_na', 
            customerName: 'Chị Na', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/chi-na.png`, 
            orderText: "Cho chị 1 bắp rang bơ và 1 kem.", 
            items: ['popcorn', 'icecream'], // 4 + 3 = 7
            total: 7, 
            payment: 10, 
            change: 3 // 10 - 7 = 3
        } 
    },
    { 
        level: 2, 
        order: { 
            customerId: 'customer_muoi', 
            customerName: 'Bạn Muối', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/customer-muoi.png`, 
            orderText: "Cho tớ 2 cây kem nhé.", 
            items: ['icecream', 'icecream'], // 3 + 3 = 6
            total: 6, 
            payment: 10, 
            change: 4 // 10 - 6 = 4
        } 
    },
    { 
        level: 2, 
        order: { 
            customerId: 'me_huong', 
            customerName: 'Mẹ Hương', 
            customerImageUrl: `${ASSET_BASE_URL}/assets/images/me-huong.png`, 
            orderText: "Mẹ mua 1 bánh mì và 1 khoai tây chiên.", 
            items: ['banhmi', 'fries'], // 5 + 4 = 9
            total: 9, 
            payment: 10, 
            change: 1 // 10 - 9 = 1
        } 
    },
];
