import type { StreetFoodProblem, StreetFoodMenuItem } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

export const MENU: Record<'pizza' | 'pasta' | 'fries' | 'hotdog', StreetFoodMenuItem> = {
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
  }
};

export const problemBank: StreetFoodProblem[] = [
    { level: 1, order: { customerId: 'ba_cuong', customerName: 'Ba Cương', customerImageUrl: `${ASSET_BASE_URL}/assets/images/ba-cuong.png`, orderText: "Con ơi, cho ba 1 pizza nhé.", items: ['pizza'], total: 6, payment: 10, change: 4 } },
    { level: 1, order: { customerId: 'me_huong', customerName: 'Mẹ Hương', customerImageUrl: `${ASSET_BASE_URL}/assets/images/me-huong.png`, orderText: "Cho mẹ 1 phần mì Ý với 1 phần khoai tây chiên nhé.", items: ['pasta', 'fries'], total: 9, payment: 10, change: 1 } },
    { level: 1, order: { customerId: 'anh_xoai', customerName: 'Anh Xoài', customerImageUrl: `${ASSET_BASE_URL}/assets/images/anh-xoai.png`, orderText: "Anh muốn 1 pizza và 1 khoai tây chiên.", items: ['pizza', 'fries'], total: 10, payment: 10, change: 0 } },
    { level: 1, order: { customerId: 'chi_na', customerName: 'Chị Na', customerImageUrl: `${ASSET_BASE_URL}/assets/images/chi-na.png`, orderText: "Cho chị một hotdog và một khoai tây chiên nha.", items: ['hotdog', 'fries'], total: 9, payment: 10, change: 1 } },
    { level: 1, order: { customerId: 'em_gao', customerName: 'Em Gạo', customerImageUrl: `${ASSET_BASE_URL}/assets/images/gao-nang.png`, orderText: "Em muốn một mì Ý và một hotdog.", items: ['pasta', 'hotdog'], total: 10, payment: 10, change: 0 } },
    { level: 1, order: { customerId: 'ba_thom', customerName: 'Bà Thơm', customerImageUrl: `${ASSET_BASE_URL}/assets/images/ba-thom.png`, orderText: "Cho bà một phần mì Ý thôi nhé.", items: ['pasta'], total: 5, payment: 10, change: 5 } },
];