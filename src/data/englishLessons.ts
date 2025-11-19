import type { EnglishLesson } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

export const englishLessons: EnglishLesson[] = [
  {
    lesson: 1,
    title: 'Gia đình (Phần 1)',
    vocabulary: [
      { word: 'dad', vietnamese: 'ba', imageUrl: `${ASSET_BASE_URL}/assets/images/dad.png`, sentence: 'This is my dad.' },
      { word: 'mom', vietnamese: 'mẹ', imageUrl: `${ASSET_BASE_URL}/assets/images/mom.png`, sentence: 'This is my mom.' },
      { word: 'brother', vietnamese: 'anh/em trai', imageUrl: `${ASSET_BASE_URL}/assets/images/brother.png`, sentence: 'This is my brother.' },
    ],
  },
  {
    lesson: 2,
    title: 'Gia đình (Phần 2)',
    vocabulary: [
        { word: 'sister', vietnamese: 'chị/em gái', imageUrl: `${ASSET_BASE_URL}/assets/images/sister.png`, sentence: 'This is my sister.' },
        { word: 'grandpa', vietnamese: 'ông', imageUrl: `${ASSET_BASE_URL}/assets/images/grandpa.png`, sentence: 'This is my grandpa.' },
        { word: 'grandma', vietnamese: 'bà', imageUrl: `${ASSET_BASE_URL}/assets/images/grandma.png`, sentence: 'This is my grandma.' },
    ],
  },
   {
    lesson: 3,
    title: 'Đồ dùng học tập',
    vocabulary: [
        { word: 'chair', vietnamese: 'cái ghế', imageUrl: `${ASSET_BASE_URL}/assets/images/chair.png`, sentence: "It's a chair." },
        { word: 'door', vietnamese: 'cửa ra vào', imageUrl: `${ASSET_BASE_URL}/assets/images/door.png`, sentence: "It's a door." },
        { word: 'table', vietnamese: 'cái bàn', imageUrl: `${ASSET_BASE_URL}/assets/images/table.png`, sentence: "It's a table." },
        { word: 'window', vietnamese: 'cửa sổ', imageUrl: `${ASSET_BASE_URL}/assets/images/window.png`, sentence: "It's a window." },
    ],
  },
  {
    lesson: 4,
    title: 'Halloween vui vẻ',
    vocabulary: [
        { word: 'pumpkin', vietnamese: 'quả bí ngô', imageUrl: `${ASSET_BASE_URL}/assets/images/pumpkin.png`, sentence: "It's a pumpkin." },
        { word: 'ghost', vietnamese: 'con ma', imageUrl: `${ASSET_BASE_URL}/assets/images/ghost.png`, sentence: "It's a ghost." },
        { word: 'bat', vietnamese: 'con dơi', imageUrl: `${ASSET_BASE_URL}/assets/images/bat.png`, sentence: "It's a bat." },
        { word: 'cat', vietnamese: 'con mèo', imageUrl: `${ASSET_BASE_URL}/assets/images/cat.png`, sentence: "It's a cat." },
    ],
  },
  {
    lesson: 5,
    title: 'Động vật quanh em',
    vocabulary: [
        { word: 'dog', vietnamese: 'con chó', imageUrl: `${ASSET_BASE_URL}/assets/images/dog.png`, sentence: "It's a dog." },
        { word: 'duck', vietnamese: 'con vịt', imageUrl: `${ASSET_BASE_URL}/assets/images/duck.png`, sentence: "It's a duck." },
        { word: 'pig', vietnamese: 'con heo', imageUrl: `${ASSET_BASE_URL}/assets/images/pig.png`, sentence: "It's a pig." },
        { word: 'bird', vietnamese: 'con chim', imageUrl: `${ASSET_BASE_URL}/assets/images/bird.png`, sentence: "It's a bird." },
    ],
  },
  {
    lesson: 6,
    title: 'Màu sắc cơ bản',
    vocabulary: [
        { word: 'red', vietnamese: 'màu đỏ', imageUrl: `${ASSET_BASE_URL}/assets/images/red.png`, sentence: "It's red." },
        { word: 'blue', vietnamese: 'màu xanh dương', imageUrl: `${ASSET_BASE_URL}/assets/images/blue.png`, sentence: "It's blue." },
        { word: 'green', vietnamese: 'màu xanh lá', imageUrl: `${ASSET_BASE_URL}/assets/images/green.png`, sentence: "It's green." },
        { word: 'yellow', vietnamese: 'màu vàng', imageUrl: `${ASSET_BASE_URL}/assets/images/yellow.png`, sentence: "It's yellow." },
    ],
  },
    {
    lesson: 7,
    title: 'Bé tập đếm',
    vocabulary: [
        { word: 'one', vietnamese: 'số một', imageUrl: `${ASSET_BASE_URL}/assets/images/one.png`, sentence: "One apple." },
        { word: 'two', vietnamese: 'số hai', imageUrl: `${ASSET_BASE_URL}/assets/images/two.png`, sentence: "Two balls." },
        { word: 'three', vietnamese: 'số ba', imageUrl: `${ASSET_BASE_URL}/assets/images/three.png`, sentence: "Three cats." },
        { word: 'four', vietnamese: 'số bốn', imageUrl: `${ASSET_BASE_URL}/assets/images/four.png`, sentence: "Four cars." },
        { word: 'five', vietnamese: 'số năm', imageUrl: `${ASSET_BASE_URL}/assets/images/five.png`, sentence: "Five stars." },
    ],
  },
  {
    lesson: 8,
    title: 'Đồ chơi',
    vocabulary: [
      { word: 'ball', vietnamese: 'quả bóng', imageUrl: `${ASSET_BASE_URL}/assets/images/ball.png`, sentence: "It's a ball." },
      { word: 'doll', vietnamese: 'búp bê', imageUrl: `${ASSET_BASE_URL}/assets/images/doll.png`, sentence: "It's a doll." },
      { word: 'car', vietnamese: 'ô tô đồ chơi', imageUrl: `${ASSET_BASE_URL}/assets/images/car.png`, sentence: "It's a toy car." },
      { word: 'robot', vietnamese: 'người máy', imageUrl: `${ASSET_BASE_URL}/assets/images/robot.png`, sentence: "It's a robot." },
    ],
  },
  {
    lesson: 9,
    title: 'Cơ thể của bé',
    vocabulary: [
      { word: 'head', vietnamese: 'cái đầu', imageUrl: `${ASSET_BASE_URL}/assets/images/head.png`, sentence: "This is my head." },
      { word: 'eyes', vietnamese: 'đôi mắt', imageUrl: `${ASSET_BASE_URL}/assets/images/eyes.png`, sentence: "These are my eyes." },
      { word: 'nose', vietnamese: 'cái mũi', imageUrl: `${ASSET_BASE_URL}/assets/images/nose.png`, sentence: "This is my nose." },
      { word: 'mouth', vietnamese: 'cái miệng', imageUrl: `${ASSET_BASE_URL}/assets/images/mouth.png`, sentence: "This is my mouth." },
    ],
  },
  {
    lesson: 10,
    title: 'Đồ ăn',
    vocabulary: [
      { word: 'apple', vietnamese: 'quả táo', imageUrl: `${ASSET_BASE_URL}/assets/images/apple.png`, sentence: "I like apples." },
      { word: 'banana', vietnamese: 'quả chuối', imageUrl: `${ASSET_BASE_URL}/assets/images/banana.png`, sentence: "I like bananas." },
      { word: 'cake', vietnamese: 'bánh ngọt', imageUrl: `${ASSET_BASE_URL}/assets/images/cake.png`, sentence: "I like cake." },
      { word: 'milk', vietnamese: 'sữa', imageUrl: `${ASSET_BASE_URL}/assets/images/milk.png`, sentence: "I drink milk." },
    ],
  },
  {
    lesson: 11,
    title: 'Quần áo',
    vocabulary: [
      { word: 'shirt', vietnamese: 'áo sơ mi', imageUrl: `${ASSET_BASE_URL}/assets/images/shirt.png`, sentence: "This is a shirt." },
      { word: 'pants', vietnamese: 'quần dài', imageUrl: `${ASSET_BASE_URL}/assets/images/pants.png`, sentence: "These are pants." },
      { word: 'shoes', vietnamese: 'đôi giày', imageUrl: `${ASSET_BASE_URL}/assets/images/shoes.png`, sentence: "These are my shoes." },
      { word: 'hat', vietnamese: 'cái mũ', imageUrl: `${ASSET_BASE_URL}/assets/images/hat.png`, sentence: "It's a hat." },
    ],
  },
  {
    lesson: 12,
    title: 'Thời tiết',
    vocabulary: [
      { word: 'sunny', vietnamese: 'trời nắng', imageUrl: `${ASSET_BASE_URL}/assets/images/sunny.png`, sentence: "It is sunny today." },
      { word: 'rainy', vietnamese: 'trời mưa', imageUrl: `${ASSET_BASE_URL}/assets/images/rainy.png`, sentence: "It is rainy today." },
      { word: 'cloudy', vietnamese: 'trời nhiều mây', imageUrl: `${ASSET_BASE_URL}/assets/images/cloudy.png`, sentence: "It is cloudy today." },
      { word: 'windy', vietnamese: 'trời có gió', imageUrl: `${ASSET_BASE_URL}/assets/images/windy.png`, sentence: "It is windy today." },
    ],
  },
  {
    lesson: 13,
    title: 'Hành động',
    vocabulary: [
      { word: 'run', vietnamese: 'chạy', imageUrl: `${ASSET_BASE_URL}/assets/images/run.png`, sentence: "I can run fast." },
      { word: 'jump', vietnamese: 'nhảy', imageUrl: `${ASSET_BASE_URL}/assets/images/jump.png`, sentence: "I can jump high." },
      { word: 'sleep', vietnamese: 'ngủ', imageUrl: `${ASSET_BASE_URL}/assets/images/sleep.png`, sentence: "The baby is sleeping." },
      { word: 'eat', vietnamese: 'ăn', imageUrl: `${ASSET_BASE_URL}/assets/images/eat.png`, sentence: "I like to eat apples." },
    ],
  },
  {
    lesson: 14,
    title: 'Thiên nhiên',
    vocabulary: [
      { word: 'tree', vietnamese: 'cái cây', imageUrl: `${ASSET_BASE_URL}/assets/images/tree.png`, sentence: "This is a big tree." },
      { word: 'flower', vietnamese: 'bông hoa', imageUrl: `${ASSET_BASE_URL}/assets/images/flower.png`, sentence: "It's a beautiful flower." },
      { word: 'sun', vietnamese: 'mặt trời', imageUrl: `${ASSET_BASE_URL}/assets/images/sun.png`, sentence: "The sun is bright." },
      { word: 'moon', vietnamese: 'mặt trăng', imageUrl: `${ASSET_BASE_URL}/assets/images/moon.png`, sentence: "Look at the moon!" },
    ],
  },
];