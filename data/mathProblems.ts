
import type { FeedingProblem, BakeryProblem } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

// --- Local Helper Functions (Moved from feedbackService) ---
const getFeedingQuestion = (
    animalName: string,
    foodNamePlural: string,
    initialAmount: number,
    changeAmount: number,
    operation: 'add' | 'subtract'
): string => {
    if (operation === 'add') {
        return `Bạn ${animalName} có ${initialAmount} ${foodNamePlural} Con cho bạn thêm ${changeAmount} ${foodNamePlural} nữa nhé Hỏi bạn ${animalName} có tất cả mấy ${foodNamePlural}`;
    } else {
        return `Bạn ${animalName} có ${initialAmount} ${foodNamePlural} Con lấy đi ${changeAmount} ${foodNamePlural} Hỏi bạn ${animalName} còn lại mấy ${foodNamePlural}`;
    }
};

const getBakeryQuestion = (
    customerName: string,
    customerPronoun: string,
    itemPlural: string,
    itemQuantifier: string,
    initialAmount: number,
    changeAmount: number,
    operation: 'add' | 'subtract'
): string => {
    if (operation === 'add') {
        return `${customerName} có ${initialAmount} ${itemPlural} và muốn mua thêm ${changeAmount} ${itemQuantifier} nữa Con hãy tính giúp ${customerPronoun} xem có tất cả bao nhiêu ${itemPlural} nhé`;
    } else {
        return `Trên quầy của Gốm có ${initialAmount} ${itemPlural} ${customerName} đã mua hết ${changeAmount} ${itemQuantifier} Hỏi trên quầy còn lại mấy ${itemPlural}`;
    }
};


// --- Data definitions ---
const feedingGameData = [
    { animal: 'Thỏ', food: 'cà rốt', foodPlural: 'củ cà rốt', animalImageUrl: `${ASSET_BASE_URL}/assets/images/rabbit.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/carrot.png` },
    { animal: 'Khỉ', food: 'chuối', foodPlural: 'quả chuối', animalImageUrl: `${ASSET_BASE_URL}/assets/images/monkey.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/banana.png` },
    { animal: 'Gấu', food: 'mật ong', foodPlural: 'hũ mật ong', animalImageUrl: `${ASSET_BASE_URL}/assets/images/english/bear.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/honey.png` },
    { animal: 'Mèo', food: 'cá', foodPlural: 'con cá', animalImageUrl: `${ASSET_BASE_URL}/assets/images/cat.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/fish.png` },
    { animal: 'Chó', food: 'khúc xương', foodPlural: 'khúc xương', animalImageUrl: `${ASSET_BASE_URL}/assets/images/dog.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/bone.png` },
    { animal: 'Sóc', food: 'hạt dẻ', foodPlural: 'hạt dẻ', animalImageUrl: `${ASSET_BASE_URL}/assets/images/squirrel.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/english/acorn.png` },
    { animal: 'Chim cánh cụt', food: 'cá', foodPlural: 'con cá', animalImageUrl: `${ASSET_BASE_URL}/assets/images/penguin.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/fish.png` },
    { animal: 'Gà mái', food: 'ngô', foodPlural: 'bắp ngô', animalImageUrl: `${ASSET_BASE_URL}/assets/images/english/chicken.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/corn.png` },
    { animal: 'Ngựa', food: 'cỏ', foodPlural: 'bó cỏ', animalImageUrl: `${ASSET_BASE_URL}/assets/images/horse.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/grass.png` },
    { animal: 'Voi', food: 'mía', foodPlural: 'khúc mía', animalImageUrl: `${ASSET_BASE_URL}/assets/images/english/elephant.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/sugarcane.png` },
    { animal: 'Gấu Trúc', food: 'tre', foodPlural: 'khúc tre', animalImageUrl: `${ASSET_BASE_URL}/assets/images/panda.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/bamboo.png` },
    { animal: 'Heo', food: 'cám', foodPlural: 'bát cám', animalImageUrl: `${ASSET_BASE_URL}/assets/images/pig.png`, foodImageUrl: `${ASSET_BASE_URL}/assets/images/bran.png` },
];

const bakeryGameData = {
    customers: [
        { name: 'Chú Gấu', pronoun: 'chú ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-bear.png` },
        { name: 'Cô Thỏ', pronoun: 'cô ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-rabbit.png` },
        { name: 'Bé Gái Tóc Xoăn', pronoun: 'bạn ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-girl.png` },
        { name: 'Cậu Bé Siêu Nhân', pronoun: 'bạn ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-superhero.png` },
        { name: 'Bác Phi Công', pronoun: 'bác ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-pilot.png` },
        { name: 'Em Gạo', pronoun: 'em ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-gao.png` },
        { name: 'Bạn Gin', pronoun: 'bạn ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-gin.png` },
        { name: 'Bà Cú', pronoun: 'bà ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-owl.png` },
        { name: 'Chú Cảnh Sát', pronoun: 'chú ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-police.png` },
        { name: 'Cô Y Tá', pronoun: 'cô ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-nurse.png` },
        { name: 'Bé Cherry', pronoun: 'bạn ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-cherry.png` },
        { name: 'Bạn Muối', pronoun: 'bạn ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-muoi.png` },
        { name: 'Khách Hàng Rô Bốt', pronoun: 'bạn ấy', imageUrl: `${ASSET_BASE_URL}/assets/images/customer-robot.png` },
    ],
    items: [
        { name: 'bánh donut', plural: 'cái bánh donut', quantifier: 'cái', imageUrl: `${ASSET_BASE_URL}/assets/images/item-donut.png` },
        { name: 'bánh quy', plural: 'cái bánh quy', quantifier: 'cái', imageUrl: `${ASSET_BASE_URL}/assets/images/item-cookie.png` },
        { name: 'cupcake', plural: 'cái cupcake', quantifier: 'cái', imageUrl: `${ASSET_BASE_URL}/assets/images/item-cupcake.png` },
        { name: 'hộp sữa', plural: 'hộp sữa', quantifier: 'hộp', imageUrl: `${ASSET_BASE_URL}/assets/images/item-milk.png` },
        { name: 'bánh mì', plural: 'ổ bánh mì', quantifier: 'ổ', imageUrl: `${ASSET_BASE_URL}/assets/images/item-bread.png` },
        { name: 'bánh kem', plural: 'miếng bánh kem', quantifier: 'miếng', imageUrl: `${ASSET_BASE_URL}/assets/images/item-cake.png` },
        { name: 'nước cam', plural: 'ly nước cam', quantifier: 'ly', imageUrl: `${ASSET_BASE_URL}/assets/images/item-juice.png` },
    ]
};


// --- Template Definitions for the Banks ---

interface FeedingTemplate {
  animal: string;
  food: string;
  initialAmount: number;
  changeAmount: number;
  operation: 'add' | 'subtract';
}

interface BakeryTemplate {
  customerName: string;
  item: string;
  initialAmount: number;
  changeAmount: number;
  operation: 'add' | 'subtract';
}

// A curated list of problems to ensure variety and control.
const feedingProblemTemplates: FeedingTemplate[] = [
    // Original problems
    { animal: 'Thỏ', food: 'cà rốt', initialAmount: 2, changeAmount: 1, operation: 'add' },
    { animal: 'Khỉ', food: 'chuối', initialAmount: 3, changeAmount: 2, operation: 'add' },
    { animal: 'Gấu', food: 'mật ong', initialAmount: 4, changeAmount: 1, operation: 'add' },
    { animal: 'Mèo', food: 'cá', initialAmount: 3, changeAmount: 3, operation: 'add' },
    { animal: 'Chó', food: 'khúc xương', initialAmount: 5, changeAmount: 2, operation: 'add' },
    { animal: 'Sóc', food: 'hạt dẻ', initialAmount: 4, changeAmount: 3, operation: 'add' },
    { animal: 'Chim cánh cụt', food: 'cá', initialAmount: 6, changeAmount: 2, operation: 'add' },
    { animal: 'Khỉ', food: 'chuối', initialAmount: 4, changeAmount: 2, operation: 'subtract' },
    { animal: 'Thỏ', food: 'cà rốt', initialAmount: 5, changeAmount: 3, operation: 'subtract' },
    { animal: 'Gấu', food: 'mật ong', initialAmount: 3, changeAmount: 1, operation: 'subtract' },
    { animal: 'Mèo', food: 'cá', initialAmount: 6, changeAmount: 2, operation: 'subtract' },
    { animal: 'Chó', food: 'khúc xương', initialAmount: 4, changeAmount: 1, operation: 'subtract' },
    { animal: 'Sóc', food: 'hạt dẻ', initialAmount: 7, changeAmount: 3, operation: 'subtract' },
    { animal: 'Chim cánh cụt', food: 'cá', initialAmount: 5, changeAmount: 2, operation: 'subtract' },
    { animal: 'Thỏ', food: 'cà rốt', initialAmount: 1, changeAmount: 3, operation: 'add' },
    { animal: 'Khỉ', food: 'chuối', initialAmount: 6, changeAmount: 1, operation: 'subtract' },
    // New feeding problems
    { animal: 'Chim cánh cụt', food: 'cá', initialAmount: 2, changeAmount: 1, operation: 'add' },
    { animal: 'Chim cánh cụt', food: 'cá', initialAmount: 2, changeAmount: 2, operation: 'add' },
    { animal: 'Chim cánh cụt', food: 'cá', initialAmount: 5, changeAmount: 1, operation: 'add' },
    { animal: 'Chó', food: 'khúc xương', initialAmount: 1, changeAmount: 1, operation: 'add' },
    { animal: 'Chó', food: 'khúc xương', initialAmount: 4, changeAmount: 1, operation: 'add' },
    { animal: 'Chó', food: 'khúc xương', initialAmount: 4, changeAmount: 3, operation: 'add' },
    { animal: 'Chó', food: 'khúc xương', initialAmount: 6, changeAmount: 2, operation: 'add' },
    { animal: 'Gà mái', food: 'ngô', initialAmount: 1, changeAmount: 3, operation: 'add' },
    { animal: 'Gà mái', food: 'ngô', initialAmount: 6, changeAmount: 1, operation: 'add' },
    { animal: 'Gà mái', food: 'ngô', initialAmount: 6, changeAmount: 3, operation: 'add' },
    { animal: 'Gấu', food: 'mật ong', initialAmount: 5, changeAmount: 1, operation: 'add' },
    { animal: 'Gấu', food: 'mật ong', initialAmount: 7, changeAmount: 1, operation: 'add' },
    { animal: 'Gấu Trúc', food: 'tre', initialAmount: 5, changeAmount: 1, operation: 'add' },
    { animal: 'Gấu Trúc', food: 'tre', initialAmount: 5, changeAmount: 3, operation: 'add' },
    { animal: 'Heo', food: 'cám', initialAmount: 1, changeAmount: 2, operation: 'add' },
    { animal: 'Heo', food: 'cám', initialAmount: 4, changeAmount: 1, operation: 'add' },
    { animal: 'Khỉ', food: 'chuối', initialAmount: 5, changeAmount: 2, operation: 'add' },
    { animal: 'Mèo', food: 'cá', initialAmount: 4, changeAmount: 3, operation: 'add' },
    { animal: 'Ngựa', food: 'cỏ', initialAmount: 2, changeAmount: 2, operation: 'add' },
    { animal: 'Ngựa', food: 'cỏ', initialAmount: 3, changeAmount: 2, operation: 'add' },
    { animal: 'Ngựa', food: 'cỏ', initialAmount: 3, changeAmount: 3, operation: 'add' },
    { animal: 'Ngựa', food: 'cỏ', initialAmount: 4, changeAmount: 2, operation: 'add' },
    { animal: 'Ngựa', food: 'cỏ', initialAmount: 5, changeAmount: 2, operation: 'add' },
    { animal: 'Ngựa', food: 'cỏ', initialAmount: 5, changeAmount: 3, operation: 'add' },
    { animal: 'Sóc', food: 'hạt dẻ', initialAmount: 3, changeAmount: 2, operation: 'add' },
    { animal: 'Thỏ', food: 'cà rốt', initialAmount: 5, changeAmount: 3, operation: 'add' },
    { animal: 'Voi', food: 'mía', initialAmount: 3, changeAmount: 3, operation: 'add' },
    { animal: 'Voi', food: 'mía', initialAmount: 6, changeAmount: 2, operation: 'add' },
    { animal: 'Chim cánh cụt', food: 'cá', initialAmount: 3, changeAmount: 1, operation: 'subtract' },
    { animal: 'Chó', food: 'khúc xương', initialAmount: 4, changeAmount: 2, operation: 'subtract' },
    { animal: 'Chó', food: 'khúc xương', initialAmount: 5, changeAmount: 1, operation: 'subtract' },
    { animal: 'Chó', food: 'khúc xương', initialAmount: 8, changeAmount: 5, operation: 'subtract' },
    { animal: 'Chó', food: 'khúc xương', initialAmount: 8, changeAmount: 6, operation: 'subtract' },
    { animal: 'Gà mái', food: 'ngô', initialAmount: 4, changeAmount: 1, operation: 'subtract' },
    { animal: 'Gà mái', food: 'ngô', initialAmount: 4, changeAmount: 2, operation: 'subtract' },
    { animal: 'Gà mái', food: 'ngô', initialAmount: 5, changeAmount: 1, operation: 'subtract' },
    { animal: 'Gà mái', food: 'ngô', initialAmount: 7, changeAmount: 5, operation: 'subtract' },
    { animal: 'Gấu', food: 'mật ong', initialAmount: 3, changeAmount: 1, operation: 'subtract' },
    { animal: 'Gấu', food: 'mật ong', initialAmount: 10, changeAmount: 7, operation: 'subtract' },
    { animal: 'Gấu Trúc', food: 'tre', initialAmount: 3, changeAmount: 1, operation: 'subtract' },
    { animal: 'Gấu Trúc', food: 'tre', initialAmount: 4, changeAmount: 2, operation: 'subtract' },
    { animal: 'Gấu Trúc', food: 'tre', initialAmount: 6, changeAmount: 1, operation: 'subtract' },
    { animal: 'Gấu Trúc', food: 'tre', initialAmount: 6, changeAmount: 3, operation: 'subtract' },
    { animal: 'Gấu Trúc', food: 'tre', initialAmount: 7, changeAmount: 5, operation: 'subtract' },
    { animal: 'Gấu Trúc', food: 'tre', initialAmount: 8, changeAmount: 4, operation: 'subtract' },
    { animal: 'Gấu Trúc', food: 'tre', initialAmount: 9, changeAmount: 7, operation: 'subtract' },
    { animal: 'Heo', food: 'cám', initialAmount: 5, changeAmount: 1, operation: 'subtract' },
    { animal: 'Heo', food: 'cám', initialAmount: 5, changeAmount: 3, operation: 'subtract' },
    { animal: 'Heo', food: 'cám', initialAmount: 9, changeAmount: 4, operation: 'subtract' },
    { animal: 'Heo', food: 'cám', initialAmount: 10, changeAmount: 8, operation: 'subtract' },
    { animal: 'Khỉ', food: 'chuối', initialAmount: 4, changeAmount: 2, operation: 'subtract' },
    { animal: 'Khỉ', food: 'chuối', initialAmount: 8, changeAmount: 6, operation: 'subtract' },
    { animal: 'Mèo', food: 'cá', initialAmount: 3, changeAmount: 1, operation: 'subtract' },
    { animal: 'Mèo', food: 'cá', initialAmount: 6, changeAmount: 1, operation: 'subtract' },
    { animal: 'Mèo', food: 'cá', initialAmount: 7, changeAmount: 1, operation: 'subtract' },
    { animal: 'Mèo', food: 'cá', initialAmount: 7, changeAmount: 5, operation: 'subtract' },
    { animal: 'Mèo', food: 'cá', initialAmount: 8, changeAmount: 3, operation: 'subtract' },
    { animal: 'Mèo', food: 'cá', initialAmount: 8, changeAmount: 4, operation: 'subtract' },
    { animal: 'Mèo', food: 'cá', initialAmount: 8, changeAmount: 6, operation: 'subtract' },
    { animal: 'Ngựa', food: 'cỏ', initialAmount: 6, changeAmount: 4, operation: 'subtract' },
    { animal: 'Ngựa', food: 'cỏ', initialAmount: 8, changeAmount: 3, operation: 'subtract' },
    { animal: 'Ngựa', food: 'cỏ', initialAmount: 9, changeAmount: 5, operation: 'subtract' },
    { animal: 'Sóc', food: 'hạt dẻ', initialAmount: 6, changeAmount: 3, operation: 'subtract' },
    { animal: 'Sóc', food: 'hạt dẻ', initialAmount: 8, changeAmount: 5, operation: 'subtract' },
    { animal: 'Thỏ', food: 'cà rốt', initialAmount: 4, changeAmount: 2, operation: 'subtract' },
    { animal: 'Thỏ', food: 'cà rốt', initialAmount: 5, changeAmount: 2, operation: 'subtract' },
    { animal: 'Thỏ', food: 'cà rốt', initialAmount: 6, changeAmount: 4, operation: 'subtract' },
    { animal: 'Thỏ', food: 'cà rốt', initialAmount: 8, changeAmount: 4, operation: 'subtract' },
    { animal: 'Thỏ', food: 'cà rốt', initialAmount: 8, changeAmount: 5, operation: 'subtract' },
    { animal: 'Thỏ', food: 'cà rốt', initialAmount: 8, changeAmount: 6, operation: 'subtract' },
    { animal: 'Voi', food: 'mía', initialAmount: 9, changeAmount: 6, operation: 'subtract' },
    { animal: 'Voi', food: 'mía', initialAmount: 10, changeAmount: 4, operation: 'subtract' },
];

const bakeryProblemTemplates: BakeryTemplate[] = [
    // Original problems
    { customerName: 'Chú Gấu', item: 'bánh donut', initialAmount: 3, changeAmount: 2, operation: 'add' },
    { customerName: 'Cô Thỏ', item: 'bánh quy', initialAmount: 5, changeAmount: 1, operation: 'add' },
    { customerName: 'Bé Gái Tóc Xoăn', item: 'cupcake', initialAmount: 2, changeAmount: 2, operation: 'add' },
    { customerName: 'Cậu Bé Siêu Nhân', item: 'hộp sữa', initialAmount: 4, changeAmount: 3, operation: 'add' },
    { customerName: 'Bác Phi Công', item: 'bánh mì', initialAmount: 3, changeAmount: 1, operation: 'add' },
    { customerName: 'Em Gạo', item: 'bánh quy', initialAmount: 2, changeAmount: 3, operation: 'add' },
    { customerName: 'Bạn Gin', item: 'cupcake', initialAmount: 1, changeAmount: 2, operation: 'add' },
    { customerName: 'Chú Gấu', item: 'bánh donut', initialAmount: 4, changeAmount: 2, operation: 'subtract' },
    { customerName: 'Cô Thỏ', item: 'bánh quy', initialAmount: 6, changeAmount: 3, operation: 'subtract' },
    { customerName: 'Bé Gái Tóc Xoăn', item: 'cupcake', initialAmount: 5, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Cậu Bé Siêu Nhân', item: 'hộp sữa', initialAmount: 4, changeAmount: 3, operation: 'subtract' },
    { customerName: 'Bác Phi Công', item: 'bánh mì', initialAmount: 3, changeAmount: 2, operation: 'subtract' },
    { customerName: 'Em Gạo', item: 'bánh quy', initialAmount: 5, changeAmount: 2, operation: 'subtract' },
    { customerName: 'Bạn Gin', item: 'cupcake', initialAmount: 4, changeAmount: 1, operation: 'subtract' },
    // New bakery problems
    { customerName: 'Bà Cú', item: 'bánh quy', initialAmount: 1, changeAmount: 3, operation: 'add' },
    { customerName: 'Bác Phi Công', item: 'bánh mì', initialAmount: 4, changeAmount: 3, operation: 'add' },
    { customerName: 'Bạn Gin', item: 'bánh kem', initialAmount: 5, changeAmount: 2, operation: 'add' },
    { customerName: 'Bạn Muối', item: 'nước cam', initialAmount: 2, changeAmount: 3, operation: 'add' },
    { customerName: 'Bé Cherry', item: 'bánh mì', initialAmount: 4, changeAmount: 1, operation: 'add' },
    { customerName: 'Bé Gái Tóc Xoăn', item: 'cupcake', initialAmount: 5, changeAmount: 4, operation: 'add' },
    { customerName: 'Cậu Bé Siêu Nhân', item: 'bánh quy', initialAmount: 2, changeAmount: 1, operation: 'add' },
    { customerName: 'Cậu Bé Siêu Nhân', item: 'bánh donut', initialAmount: 5, changeAmount: 1, operation: 'add' },
    { customerName: 'Chú Cảnh Sát', item: 'bánh donut', initialAmount: 2, changeAmount: 4, operation: 'add' },
    { customerName: 'Chú Cảnh Sát', item: 'nước cam', initialAmount: 2, changeAmount: 1, operation: 'add' },
    { customerName: 'Chú Gấu', item: 'bánh mì', initialAmount: 3, changeAmount: 1, operation: 'add' },
    { customerName: 'Chú Gấu', item: 'cupcake', initialAmount: 4, changeAmount: 3, operation: 'add' },
    { customerName: 'Cô Thỏ', item: 'hộp sữa', initialAmount: 3, changeAmount: 4, operation: 'add' },
    { customerName: 'Cô Y Tá', item: 'bánh quy', initialAmount: 5, changeAmount: 2, operation: 'add' },
    { customerName: 'Em Gạo', item: 'hộp sữa', initialAmount: 2, changeAmount: 2, operation: 'add' },
    { customerName: 'Em Gạo', item: 'hộp sữa', initialAmount: 5, changeAmount: 2, operation: 'add' },
    { customerName: 'Em Gạo', item: 'bánh mì', initialAmount: 5, changeAmount: 3, operation: 'add' },
    { customerName: 'Cô Thỏ', item: 'bánh donut', initialAmount: 3, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Bé Cherry', item: 'bánh kem', initialAmount: 3, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Bé Cherry', item: 'bánh mì', initialAmount: 3, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Chú Gấu', item: 'bánh mì', initialAmount: 3, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Bác Phi Công', item: 'bánh quy', initialAmount: 4, changeAmount: 2, operation: 'subtract' },
    { customerName: 'Cậu Bé Siêu Nhân', item: 'bánh quy', initialAmount: 4, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Em Gạo', item: 'bánh quy', initialAmount: 4, changeAmount: 2, operation: 'subtract' },
    { customerName: 'Bạn Gin', item: 'cupcake', initialAmount: 4, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Bé Gái Tóc Xoăn', item: 'cupcake', initialAmount: 4, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Bé Gái Tóc Xoăn', item: 'hộp sữa', initialAmount: 4, changeAmount: 2, operation: 'subtract' },
    { customerName: 'Em Gạo', item: 'hộp sữa', initialAmount: 4, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Bác Phi Công', item: 'bánh mì', initialAmount: 4, changeAmount: 2, operation: 'subtract' },
    { customerName: 'Bác Phi Công', item: 'bánh quy', initialAmount: 5, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Cô Y Tá', item: 'bánh quy', initialAmount: 5, changeAmount: 2, operation: 'subtract' },
    { customerName: 'Cậu Bé Siêu Nhân', item: 'bánh kem', initialAmount: 5, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Bạn Gin', item: 'cupcake', initialAmount: 6, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Bạn Muối', item: 'bánh donut', initialAmount: 7, changeAmount: 5, operation: 'subtract' },
    { customerName: 'Bạn Gin', item: 'nước cam', initialAmount: 7, changeAmount: 4, operation: 'subtract' },
    { customerName: 'Bé Cherry', item: 'nước cam', initialAmount: 7, changeAmount: 3, operation: 'subtract' },
    { customerName: 'Em Gạo', item: 'nước cam', initialAmount: 7, changeAmount: 3, operation: 'subtract' },
    { customerName: 'Khách Hàng Rô Bốt', item: 'bánh kem', initialAmount: 7, changeAmount: 2, operation: 'subtract' },
    { customerName: 'Bé Gái Tóc Xoăn', item: 'bánh kem', initialAmount: 7, changeAmount: 2, operation: 'subtract' },
    { customerName: 'Khách Hàng Rô Bốt', item: 'bánh mì', initialAmount: 7, changeAmount: 5, operation: 'subtract' },
    { customerName: 'Bạn Gin', item: 'bánh quy', initialAmount: 8, changeAmount: 3, operation: 'subtract' },
    { customerName: 'Chú Cảnh Sát', item: 'bánh quy', initialAmount: 8, changeAmount: 5, operation: 'subtract' },
    { customerName: 'Bạn Gin', item: 'cupcake', initialAmount: 8, changeAmount: 1, operation: 'subtract' },
    { customerName: 'Em Gạo', item: 'bánh mì', initialAmount: 8, changeAmount: 3, operation: 'subtract' },
];


// --- Bank Generation ---

export const feedingProblemsBank: FeedingProblem[] = feedingProblemTemplates.map(template => {
    const data = feedingGameData.find(d => d.animal === template.animal);
    if (!data) throw new Error(`Feeding data not found for animal: ${template.animal}`);
    
    const answer = template.operation === 'add' 
        ? template.initialAmount + template.changeAmount 
        : template.initialAmount - template.changeAmount;

    return {
        ...template,
        animalImageUrl: data.animalImageUrl,
        foodImageUrl: data.foodImageUrl,
        question: getFeedingQuestion(
            data.animal,
            data.foodPlural,
            template.initialAmount,
            template.changeAmount,
            template.operation
        ),
        answer,
    };
});

export const bakeryProblemsBank: BakeryProblem[] = bakeryProblemTemplates.map(template => {
    const customerData = bakeryGameData.customers.find(c => c.name === template.customerName);
    const itemData = bakeryGameData.items.find(i => i.name === template.item);
    if (!customerData) throw new Error(`Customer data not found for name: ${template.customerName}`);
    if (!itemData) throw new Error(`Item data not found for name: ${template.item}`);

    const answer = template.operation === 'add'
        ? template.initialAmount + template.changeAmount
        : template.initialAmount - template.changeAmount;

    return {
        ...template,
        customerImageUrl: customerData.imageUrl,
        item: {
            name: itemData.name,
            plural: itemData.plural,
            imageUrl: itemData.imageUrl,
        },
        question: getBakeryQuestion(
            customerData.name,
            customerData.pronoun,
            itemData.plural,
            itemData.quantifier,
            template.initialAmount,
            template.changeAmount,
            template.operation
        ),
        answer,
    };
});

// NEW: Bank for simple MathGame problems to pre-generate audio
export const simpleMathProblemsBank = [
    // Simple Addition (up to 10)
    { problem: '1 + 1', answer: 2, type: 'calculation' as const },
    { problem: '1 + 2', answer: 3, type: 'calculation' as const },
    { problem: '2 + 1', answer: 3, type: 'calculation' as const },
    { problem: '2 + 2', answer: 4, type: 'calculation' as const },
    { problem: '2 + 3', answer: 5, type: 'calculation' as const },
    { problem: '3 + 2', answer: 5, type: 'calculation' as const },
    { problem: '3 + 3', answer: 6, type: 'calculation' as const },
    { problem: '4 + 1', answer: 5, type: 'calculation' as const },
    { problem: '4 + 2', answer: 6, type: 'calculation' as const },
    { problem: '5 + 1', answer: 6, type: 'calculation' as const },
    { problem: '5 + 2', answer: 7, type: 'calculation' as const },
    { problem: '5 + 3', answer: 8, type: 'calculation' as const },
    { problem: '5 + 4', answer: 9, type: 'calculation' as const },
    { problem: '5 + 5', answer: 10, type: 'calculation' as const },
    { problem: '6 + 1', answer: 7, type: 'calculation' as const },
    { problem: '6 + 2', answer: 8, type: 'calculation' as const },
    { problem: '7 + 1', answer: 8, type: 'calculation' as const },
    { problem: '8 + 1', answer: 9, type: 'calculation' as const },
    { problem: '9 + 1', answer: 10, type: 'calculation' as const },
    
    // Simple Subtraction (from up to 10)
    { problem: '2 - 1', answer: 1, type: 'calculation' as const },
    { problem: '3 - 1', answer: 2, type: 'calculation' as const },
    { problem: '3 - 2', answer: 1, type: 'calculation' as const },
    { problem: '4 - 2', answer: 2, type: 'calculation' as const },
    { problem: '4 - 3', answer: 1, type: 'calculation' as const },
    { problem: '5 - 1', answer: 4, type: 'calculation' as const },
    { problem: '5 - 2', answer: 3, type: 'calculation' as const },
    { problem: '5 - 3', answer: 2, type: 'calculation' as const },
    { problem: '5 - 4', answer: 1, type: 'calculation' as const },
    { problem: '6 - 3', answer: 3, type: 'calculation' as const },
    { problem: '7 - 4', answer: 3, type: 'calculation' as const },
    { problem: '8 - 5', answer: 3, type: 'calculation' as const },
    { problem: '9 - 6', answer: 3, type: 'calculation' as const },
    { problem: '10 - 5', answer: 5, type: 'calculation' as const },
];
