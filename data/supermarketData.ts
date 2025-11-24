
import type { SupermarketItem } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

export const supermarketItems: SupermarketItem[] = [
    // Quầy Trái Cây (Fruit)
    { id: 'apple', name: 'Quả Táo Đỏ', imageUrl: `${ASSET_BASE_URL}/assets/images/apple.png`, price: 2, category: 'fruit' },
    { id: 'banana', name: 'Quả Chuối Vàng', imageUrl: `${ASSET_BASE_URL}/assets/images/banana.png`, price: 1, category: 'fruit' },
    { id: 'grape', name: 'Chùm Nho Tím', imageUrl: `${ASSET_BASE_URL}/assets/images/english/grape.png`, price: 3, category: 'fruit' },
    { id: 'strawberry', name: 'Dâu Tây Ngọt', imageUrl: `${ASSET_BASE_URL}/assets/images/dau-ngang.png`, price: 2, category: 'fruit' },
    { id: 'orange', name: 'Quả Cam', imageUrl: `${ASSET_BASE_URL}/assets/images/qua-cam.png`, price: 2, category: 'fruit' },
    
    // Quầy Rau Củ (Vegetable)
    { id: 'carrot', name: 'Củ Cà Rốt', imageUrl: `${ASSET_BASE_URL}/assets/images/carrot.png`, price: 1, category: 'vegetable' },
    { id: 'corn', name: 'Bắp Ngô', imageUrl: `${ASSET_BASE_URL}/assets/images/corn.png`, price: 2, category: 'vegetable' },
    { id: 'mushroom', name: 'Cây Nấm', imageUrl: `${ASSET_BASE_URL}/assets/images/br_item_mushroom.png`, price: 2, category: 'vegetable' },
    { id: 'broccoli', name: 'Bông Cải Xanh', imageUrl: `${ASSET_BASE_URL}/assets/images/bong-cai.png`, price: 3, category: 'vegetable' },

    // Quầy Sữa & Trứng (Animal Product -> Dairy/Eggs)
    { id: 'egg', name: 'Quả Trứng Gà', imageUrl: `${ASSET_BASE_URL}/assets/images/english/egg.png`, price: 1, category: 'animal_product' },
    { id: 'milk', name: 'Hộp Sữa Tươi', imageUrl: `${ASSET_BASE_URL}/assets/images/item-milk.png`, price: 3, category: 'animal_product' },
    { id: 'yogurt', name: 'Hộp Sữa Chua', imageUrl: `${ASSET_BASE_URL}/assets/images/item_sua_chua.png`, price: 2, category: 'animal_product' },
    { id: 'cheese', name: 'Phô Mai', imageUrl: `${ASSET_BASE_URL}/assets/images/sf_pizza_step_2_cheese.png`, price: 4, category: 'animal_product' },
    { id: 'sausage', name: 'Cây Xúc Xích', imageUrl: `${ASSET_BASE_URL}/assets/images/sf_hotdog_step_1_sausage.png`, price: 3, category: 'animal_product' },

    // Quầy Bánh Kẹo (Prepared Food)
    { id: 'bread', name: 'Bánh Mì', imageUrl: `${ASSET_BASE_URL}/assets/images/english/bread.png`, price: 2, category: 'prepared_food' },
    { id: 'cake', name: 'Bánh Kem', imageUrl: `${ASSET_BASE_URL}/assets/images/item-cake.png`, price: 5, category: 'prepared_food' },
    { id: 'cookie', name: 'Bánh Quy', imageUrl: `${ASSET_BASE_URL}/assets/images/item-cookie.png`, price: 1, category: 'prepared_food' },
    { id: 'donut', name: 'Bánh Vòng', imageUrl: `${ASSET_BASE_URL}/assets/images/item-donut.png`, price: 3, category: 'prepared_food' },
    { id: 'icecream', name: 'Kem Ốc Quế', imageUrl: `${ASSET_BASE_URL}/assets/images/english/icecream.png`, price: 4, category: 'prepared_food' },
    
    // Quầy Giải Khát (Drink)
    { id: 'juice', name: 'Nước Ép Cam', imageUrl: `${ASSET_BASE_URL}/assets/images/item-juice.png`, price: 3, category: 'drink' },
    { id: 'water', name: 'Chai Nước Lọc', imageUrl: `${ASSET_BASE_URL}/assets/images/water.png`, price: 1, category: 'drink' },
];

export const shoppers = [
    { id: 'me_huong', name: 'Mẹ Hương', imageUrl: `${ASSET_BASE_URL}/assets/images/me-huong.png` },
    { id: 'ba_cuong', name: 'Ba Cương', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-cuong.png` },
    { id: 'ba_thom', name: 'Bà Nội', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-thom.png` },
    { id: 'anh_xoai', name: 'Anh Xoài', imageUrl: `${ASSET_BASE_URL}/assets/images/anh-xoai.png` },
    { id: 'chi_na', name: 'Chị Na', imageUrl: `${ASSET_BASE_URL}/assets/images/chi-na.png` },
    { id: 'em_gao', name: 'Em Gạo', imageUrl: `${ASSET_BASE_URL}/assets/images/gao-nang.png` },
];

export const categoryNames: Record<string, string> = {
    'fruit': 'Trái Cây',
    'vegetable': 'Rau Củ',
    'animal_product': 'Sữa & Trứng', 
    'prepared_food': 'Bánh Kẹo',
    'drink': 'Đồ Uống'
};
