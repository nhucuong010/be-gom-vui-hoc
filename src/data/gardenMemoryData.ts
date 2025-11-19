import type { GardenMemoryScene } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app/assets/images';

export const gardenMemoryScenes: GardenMemoryScene[] = [
  {
    id: 'garden_scene_1',
    imageUrl: `${ASSET_BASE_URL}/gm_scene_garden.png`,
    intro_sentence: 'Con hãy nhìn kỹ khu vườn nhé, xem có những gì trong đó.',
    questions: [
      {
        questionText: 'Có bao nhiêu quả táo trên cây?',
        options: [1, 2, 3],
        answer: 2,
      },
      {
        questionText: 'Có bao nhiêu chú bướm màu cam?',
        options: [2, 3, 4],
        answer: 3,
      },
      {
        questionText: 'Chú chim đang bay có màu gì?',
        options: ['Xanh dương', 'Vàng', 'Đỏ'],
        answer: 'Xanh dương',
      },
      {
        questionText: 'Có bao nhiêu bông hoa màu vàng?',
        options: [3, 4, 5],
        answer: 3,
      },
      {
        questionText: 'Có tất cả bao nhiêu quả táo và bông hoa?',
        options: [5, 6, 7],
        answer: 7, // 2 apples + 5 flowers
      },
    ],
  },
  {
    id: 'sea_scene_1',
    imageUrl: `${ASSET_BASE_URL}/gm_scene_sea.png`,
    intro_sentence: 'Con hãy nhìn kỹ thủy cung nhé, xem có những bạn nào dưới biển.',
    questions: [
      {
        questionText: 'Có tất cả bao nhiêu con cá?',
        options: [4, 5, 6],
        answer: 5,
      },
      {
        questionText: 'Con cua có màu gì?',
        options: ['Đỏ', 'Xanh', 'Vàng'],
        answer: 'Đỏ',
      },
      {
        questionText: 'Có bao nhiêu con sao biển màu tím?',
        options: [1, 2, 3],
        answer: 2,
      },
      {
        questionText: 'Dưới đáy biển có vật gì?',
        options: ['Rương kho báu', 'Quả bóng', 'Xe hơi'],
        answer: 'Rương kho báu',
      },
      {
        questionText: 'Có bao nhiêu con cá màu vàng?',
        options: [1, 2, 3],
        answer: 2,
      },
    ],
  },
  {
    id: 'playroom_scene_1',
    imageUrl: `${ASSET_BASE_URL}/gm_scene_playroom.png`,
    intro_sentence: 'Trong phòng đồ chơi có những gì nào, con hãy nhìn kỹ nhé.',
    questions: [
      {
        questionText: 'Có bao nhiêu chiếc xe hơi đồ chơi?',
        options: [1, 2, 3],
        answer: 2,
      },
      {
        questionText: 'Chú robot đồ chơi có màu gì?',
        options: ['Xanh lá', 'Xanh dương', 'Đỏ'],
        answer: 'Đỏ',
      },
      {
        questionText: 'Bạn búp bê mặc váy màu gì?',
        options: ['Hồng', 'Vàng', 'Tím'],
        answer: 'Hồng',
      },
      {
        questionText: 'Có bao nhiêu khối xếp hình được xếp chồng lên nhau?',
        options: [3, 4, 5],
        answer: 4,
      },
    ],
  },
  {
    id: 'party_scene_1',
    imageUrl: `${ASSET_BASE_URL}/gm_scene_party.png`,
    intro_sentence: 'Oa, một bữa tiệc sinh nhật! Con hãy quan sát xem có gì nào.',
    questions: [
      {
        questionText: 'Có bao nhiêu cây nến trên bánh sinh nhật?',
        options: [4, 5, 6],
        answer: 5,
      },
      {
        questionText: 'Có bao nhiêu quả bóng bay màu xanh dương?',
        options: [1, 2, 3],
        answer: 2,
      },
      {
        questionText: 'Có tất cả bao nhiêu hộp quà?',
        options: [2, 3, 4],
        answer: 3,
      },
      {
        questionText: 'Có tất cả bao nhiêu quả bóng bay?',
        options: [3, 4, 5],
        answer: 4,
      },
    ],
  },
  {
    id: 'farm_scene_1',
    imageUrl: `${ASSET_BASE_URL}/gm_scene_farm.png`,
    intro_sentence: 'Chào mừng con đến với nông trại! Con hãy nhìn kỹ xem có những bạn nào nhé.',
    questions: [
      {
        questionText: 'Có bao nhiêu con heo màu hồng?',
        options: [1, 2, 3],
        answer: 2,
      },
      {
        questionText: 'Có bao nhiêu chú gà con màu vàng?',
        options: [2, 3, 4],
        answer: 3,
      },
      {
        questionText: 'Có quả táo màu gì trong giỏ?',
        options: ['Xanh', 'Vàng', 'Đỏ'],
        answer: 'Đỏ',
      },
      {
        questionText: 'Có tất cả bao nhiêu con heo và con cừu?',
        options: [2, 3, 4],
        answer: 3, // 2 pigs + 1 sheep
      },
      {
        questionText: 'Trong tranh có con vật nào màu trắng?',
        options: ['Con heo', 'Con cừu', 'Con gà'],
        answer: 'Con cừu',
      },
    ],
  },
  {
    id: 'space_scene_1',
    imageUrl: `${ASSET_BASE_URL}/gm_scene_space.png`,
    intro_sentence: 'Chúng ta cùng du hành vũ trụ nào! Con hãy nhìn kỹ ngoài không gian nhé.',
    questions: [
      {
        questionText: 'Có bao nhiêu ngôi sao màu vàng?',
        options: [4, 5, 6],
        answer: 5,
      },
      {
        questionText: 'Người ngoài hành tinh có màu gì?',
        options: ['Xanh lá', 'Xanh dương', 'Tím'],
        answer: 'Xanh lá',
      },
      {
        questionText: 'Có tất cả bao nhiêu hành tinh?',
        options: [2, 3, 4],
        answer: 3,
      },
      {
        questionText: 'Tên lửa có màu gì?',
        options: ['Vàng', 'Đỏ', 'Bạc'],
        answer: 'Bạc',
      },
      {
        questionText: 'Có bao nhiêu hành tinh màu đỏ?',
        options: [1, 2, 3],
        answer: 1,
      },
    ],
  },
  {
    id: 'picnic_scene_1',
    imageUrl: `${ASSET_BASE_URL}/gm_scene_picnic.png`,
    intro_sentence: 'Một buổi dã ngoại thật vui! Con hãy nhìn kỹ xem trong giỏ có gì nhé.',
    questions: [
      {
        questionText: 'Có bao nhiêu quả dâu tây màu đỏ?',
        options: [2, 3, 4],
        answer: 3,
      },
      {
        questionText: 'Quả chuối có màu gì?',
        options: ['Vàng', 'Xanh', 'Đỏ'],
        answer: 'Vàng',
      },
      {
        questionText: 'Có mấy chú chim đang bay trên trời?',
        options: [1, 2, 3],
        answer: 2,
      },
      {
        questionText: 'Có bao nhiêu bông hoa màu tím?',
        options: [3, 4, 5],
        answer: 4,
      },
    ],
  },
  {
    id: 'butterfly_scene_1',
    imageUrl: `${ASSET_BASE_URL}/gm_scene_butterfly.png`,
    intro_sentence: 'Đồng cỏ bươm bướm thật đẹp! Con đếm xem có bao nhiêu bạn bướm nhé.',
    questions: [
      {
        questionText: 'Có bao nhiêu chú bươm bướm màu vàng?',
        options: [2, 3, 4],
        answer: 3,
      },
      {
        questionText: 'Có bao nhiêu chú bươm bướm màu cam?',
        options: [1, 2, 3],
        answer: 2,
      },
      {
        questionText: 'Có tất cả bao nhiêu bông hoa trong tranh?',
        options: [6, 7, 8],
        answer: 7,
      },
      {
        questionText: 'Bông hoa nhiều hơn có màu gì?',
        options: ['Hồng', 'Trắng', 'Vàng'],
        answer: 'Hồng',
      },
    ],
  },
  {
    id: 'forest_scene_1',
    imageUrl: `${ASSET_BASE_URL}/gm_scene_forest.png`,
    intro_sentence: 'Trong khu rừng có nhiều bạn nhỏ đáng yêu, con hãy quan sát nhé!',
    questions: [
      {
        questionText: 'Có mấy chú chim đang đậu trên cành cây?',
        options: [1, 2, 3],
        answer: 2,
      },
      {
        questionText: 'Cây nấm có màu gì?',
        options: ['Vàng', 'Đỏ', 'Xanh'],
        answer: 'Đỏ',
      },
      {
        questionText: 'Có bao nhiêu cây nấm trong tranh?',
        options: [3, 4, 5],
        answer: 4,
      },
      {
        questionText: 'Có con vật gì đang cầm hạt dẻ?',
        options: ['Sóc', 'Thỏ', 'Chim'],
        answer: 'Sóc',
      },
    ],
  },
];