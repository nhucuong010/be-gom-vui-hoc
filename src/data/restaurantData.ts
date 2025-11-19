import type { RestaurantCustomer, RestaurantMenuItem } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

export const restaurantCustomers: RestaurantCustomer[] = [
    { id: 'customer_cherry', name: 'Bé Cherry', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-cherry.png` },
    { id: 'customer_muoi', name: 'Bạn Muối', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-muoi.png` },
    { id: 'customer_gin', name: 'Bạn Gin', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-gin.png` },
    { id: 'customer_gam', name: 'Em Gấm', imageUrl: `${ASSET_BASE_URL}/assets/images/em-gam.png` },
    { id: 'customer_gao', name: 'Em Gạo', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-gao.png` },
    { id: 'customer_ba_cuong', name: 'Ba Cương', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-cuong.png` },
    { id: 'customer_me_huong', name: 'Mẹ Hương', imageUrl: `${ASSET_BASE_URL}/assets/images/me-huong.png` },
    { id: 'customer_anh_xoai', name: 'Anh Xoài', imageUrl: `${ASSET_BASE_URL}/assets/images/anh-xoai.png` },
    { id: 'customer_chi_na', name: 'Chị Na', imageUrl: `${ASSET_BASE_URL}/assets/images/chi-na.png` },
    { id: 'customer_ong_noi', name: 'Ông Nội', imageUrl: `${ASSET_BASE_URL}/assets/images/ong-khoa.png` },
    { id: 'customer_ba_noi', name: 'Bà Nội', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-thom.png` },
    { id: 'customer_ba_ngoai', name: 'Bà Ngoại', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-bup.png` },
    { id: 'customer_co_giao', name: 'Cô Giáo', imageUrl: `${ASSET_BASE_URL}/assets/images/customer_co_giao.png` },
    { id: 'customer_chu_cong_an', name: 'Chú Công An', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-police.png` },
    { id: 'customer_gau', name: 'Bạn Gấu', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-bear.png` },
    { id: 'customer_tho', name: 'Bạn Thỏ', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-rabbit.png` },
];

export const restaurantMenuItems: RestaurantMenuItem[] = [
    { id: 'item_che_dau_do', name: 'Chè đậu đỏ', imageUrl: `${ASSET_BASE_URL}/assets/images/item_che_dau_do.png` },
    { id: 'item_tra_dao', name: 'Trà đào', imageUrl: `${ASSET_BASE_URL}/assets/images/item_tra_dao.png` },
    { id: 'item_nuoc_cam', name: 'Nước cam', imageUrl: `${ASSET_BASE_URL}/assets/images/item_nuoc_cam.png` },
    { id: 'item_kem_dau', name: 'Kem dâu', imageUrl: `${ASSET_BASE_URL}/assets/images/item_kem_dau.png` },
    { id: 'item_sinh_to_xoai', name: 'Sinh tố xoài', imageUrl: `${ASSET_BASE_URL}/assets/images/item_sinh_to_xoai.png` },
    { id: 'item_banh_flan', name: 'Bánh flan', imageUrl: `${ASSET_BASE_URL}/assets/images/item_banh_flan.png` },
    { id: 'item_kem_socola', name: 'Kem socola', imageUrl: `${ASSET_BASE_URL}/assets/images/item_kem_socola.png` },
    { id: 'item_ca_phe_sua', name: 'Cà phê sữa', imageUrl: `${ASSET_BASE_URL}/assets/images/item_ca_phe_sua.png` },
    { id: 'item_tra_sua', name: 'Trà sữa', imageUrl: `${ASSET_BASE_URL}/assets/images/item_tra_sua.png` },
    { id: 'item_sua_chua', name: 'Sữa chua', imageUrl: `${ASSET_BASE_URL}/assets/images/item_sua_chua.png` },
    { id: 'item_tao_pho', name: 'Tào phớ', imageUrl: `${ASSET_BASE_URL}/assets/images/item_tao_pho.png` },
    { id: 'item_banh_mousse', name: 'Bánh mousse', imageUrl: `${ASSET_BASE_URL}/assets/images/item_banh_mousse.png` },
    { id: 'item_nuoc_dua_hau', name: 'Nước dưa hấu', imageUrl: `${ASSET_BASE_URL}/assets/images/item_nuoc_dua_hau.png` },
];

export interface RestaurantOrderBankItem {
  customerId: string;
  items: string[]; // array of item IDs
  orderSentence: string;
}

export const restaurantOrdersBank: RestaurantOrderBankItem[] = [
  // Single item orders
  { customerId: 'customer_ba_cuong', items: ['item_ca_phe_sua'], orderSentence: 'Cho ba 1 cà phê sữa nhé.' },
  { customerId: 'customer_me_huong', items: ['item_nuoc_cam'], orderSentence: 'Cho mẹ 1 nước cam nhé.' },
  { customerId: 'customer_cherry', items: ['item_kem_dau'], orderSentence: 'Cho con 1 kem dâu nhé.' },
  { customerId: 'customer_gin', items: ['item_tra_sua'], orderSentence: 'Cho bạn 1 trà sữa nhé.' },
  { customerId: 'customer_anh_xoai', items: ['item_sinh_to_xoai'], orderSentence: 'Cho anh 1 sinh tố xoài nhé.' },
  { customerId: 'customer_chi_na', items: ['item_tao_pho'], orderSentence: 'Cho chị 1 tào phớ nhé.' },
  { customerId: 'customer_ong_noi', items: ['item_tra_dao'], orderSentence: 'Cho ông 1 trà đào nhé.' },
  { customerId: 'customer_ba_noi', items: ['item_che_dau_do'], orderSentence: 'Cho bà 1 chè đậu đỏ nhé.' },
  { customerId: 'customer_gao', items: ['item_sua_chua'], orderSentence: 'Cho em 1 sữa chua nhé.' },
  { customerId: 'customer_co_giao', items: ['item_banh_flan'], orderSentence: 'Cho cô 1 bánh flan nhé.' },
  { customerId: 'customer_gau', items: ['item_kem_socola'], orderSentence: 'Cho bạn 1 kem socola nhé.' },
  { customerId: 'customer_tho', items: ['item_nuoc_dua_hau'], orderSentence: 'Cho bạn 1 nước dưa hấu nhé.' },
  
  // Two item orders
  { customerId: 'customer_gao', items: ['item_kem_dau', 'item_sua_chua'], orderSentence: 'Cho em 1 kem dâu và 1 sữa chua nhé.' },
  { customerId: 'customer_ba_cuong', items: ['item_ca_phe_sua', 'item_banh_flan'], orderSentence: 'Cho ba 1 cà phê sữa và 1 bánh flan nhé.' },
  { customerId: 'customer_me_huong', items: ['item_nuoc_cam', 'item_banh_mousse'], orderSentence: 'Cho mẹ 1 nước cam và 1 bánh mousse nhé.' },
  { customerId: 'customer_muoi', items: ['item_kem_socola', 'item_tra_sua'], orderSentence: 'Cho con 1 kem socola và 1 trà sữa nhé.' },
  { customerId: 'customer_gin', items: ['item_tra_dao', 'item_sua_chua'], orderSentence: 'Cho bạn 1 trà đào và 1 sữa chua nhé.' },
  { customerId: 'customer_anh_xoai', items: ['item_sinh_to_xoai', 'item_nuoc_dua_hau'], orderSentence: 'Cho anh 1 sinh tố xoài và 1 nước dưa hấu nhé.' },
  { customerId: 'customer_chi_na', items: ['item_tao_pho', 'item_che_dau_do'], orderSentence: 'Cho chị 1 tào phớ và 1 chè đậu đỏ nhé.' },
  { customerId: 'customer_ba_ngoai', items: ['item_banh_flan', 'item_tra_dao'], orderSentence: 'Cho bà 1 bánh flan và 1 trà đào nhé.' },
  { customerId: 'customer_co_giao', items: ['item_che_dau_do', 'item_sua_chua'], orderSentence: 'Cho cô 1 chè đậu đỏ và 1 sữa chua nhé.' },
  { customerId: 'customer_chu_cong_an', items: ['item_ca_phe_sua', 'item_sinh_to_xoai'], orderSentence: 'Cho chú 1 cà phê sữa và 1 sinh tố xoài nhé.' },
  { customerId: 'customer_gau', items: ['item_kem_socola', 'item_kem_dau'], orderSentence: 'Cho bạn 1 kem socola và 1 kem dâu nhé.' },
  { customerId: 'customer_tho', items: ['item_nuoc_dua_hau', 'item_nuoc_cam'], orderSentence: 'Cho bạn 1 nước dưa hấu và 1 nước cam nhé.' },
  { customerId: 'customer_gin', items: ['item_tra_dao', 'item_banh_flan'], orderSentence: 'Cho bạn 1 trà đào và 1 bánh flan nhé.' },
  { customerId: 'customer_ba_cuong', items: ['item_tra_dao', 'item_nuoc_cam'], orderSentence: 'Cho ba 1 trà đào và 1 nước cam nhé.' },
  { customerId: 'customer_me_huong', items: ['item_sinh_to_xoai', 'item_sua_chua'], orderSentence: 'Cho mẹ 1 sinh tố xoài và 1 sữa chua nhé.' },
  { customerId: 'customer_cherry', items: ['item_kem_dau', 'item_tra_sua'], orderSentence: 'Cho con 1 kem dâu và 1 trà sữa nhé.' },

  // Bổ sung thêm để đa dạng
  { customerId: 'customer_ba_ngoai', items: ['item_tao_pho'], orderSentence: 'Cho bà 1 tào phớ nhé.' },
  { customerId: 'customer_chu_cong_an', items: ['item_tra_sua'], orderSentence: 'Cho chú 1 trà sữa nhé.' },
  { customerId: 'customer_ong_noi', items: ['item_banh_flan'], orderSentence: 'Cho ông 1 bánh flan nhé.' },
  { customerId: 'customer_gam', items: ['item_sua_chua'], orderSentence: 'Cho em 1 sữa chua nhé.' },
  { customerId: 'customer_ba_noi', items: ['item_che_dau_do', 'item_banh_flan'], orderSentence: 'Cho bà 1 chè đậu đỏ và 1 bánh flan nhé.' },
  { customerId: 'customer_ong_noi', items: ['item_tra_dao', 'item_ca_phe_sua'], orderSentence: 'Cho ông 1 trà đào và 1 cà phê sữa nhé.' },
];
