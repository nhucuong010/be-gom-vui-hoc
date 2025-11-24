
import type { TimeAdventureQuestion } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

export const timeAdventureQuestions: TimeAdventureQuestion[] = [
    // --- SEASONS (MÙA) ---
    {
        id: 'season_spring',
        type: 'season',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_season_spring.png`,
        questionText: 'Mùa gì mà hoa nở đẹp, cây cối đâm chồi nảy lộc?',
        options: [
            { text: 'Mùa Xuân', english: 'Spring', ipa: '/sprɪŋ/', isCorrect: true },
            { text: 'Mùa Đông', english: 'Winter', ipa: '/ˈwɪn.tər/', isCorrect: false },
            { text: 'Mùa Hè', english: 'Summer', ipa: '/ˈsʌm.ər/', isCorrect: false }
        ]
    },
    {
        id: 'season_summer',
        type: 'season',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_season_summer.png`,
        questionText: 'Mùa nào nắng vàng rực rỡ, cả nhà hay đi tắm biển?',
        options: [
            { text: 'Mùa Thu', english: 'Autumn', ipa: '/ˈɔː.təm/', isCorrect: false },
            { text: 'Mùa Hè', english: 'Summer', ipa: '/ˈsʌm.ər/', isCorrect: true },
            { text: 'Mùa Đông', english: 'Winter', ipa: '/ˈwɪn.tər/', isCorrect: false }
        ]
    },
    {
        id: 'season_autumn',
        type: 'season',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_season_autumn.png`,
        questionText: 'Mùa nào lá vàng rơi rụng, gió thổi mát mẻ?',
        options: [
            { text: 'Mùa Hè', english: 'Summer', ipa: '/ˈsʌm.ər/', isCorrect: false },
            { text: 'Mùa Thu', english: 'Autumn', ipa: '/ˈɔː.təm/', isCorrect: true },
            { text: 'Mùa Xuân', english: 'Spring', ipa: '/sprɪŋ/', isCorrect: false }
        ]
    },
    {
        id: 'season_winter',
        type: 'season',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_season_winter.png`,
        questionText: 'Mùa nào trời lạnh giá, mình phải mặc áo ấm?',
        options: [
            { text: 'Mùa Xuân', english: 'Spring', ipa: '/sprɪŋ/', isCorrect: false },
            { text: 'Mùa Hè', english: 'Summer', ipa: '/ˈsʌm.ər/', isCorrect: false },
            { text: 'Mùa Đông', english: 'Winter', ipa: '/ˈwɪn.tər/', isCorrect: true }
        ]
    },

    // --- TIME OF DAY (BUỔI TRONG NGÀY) ---
    {
        id: 'time_morning',
        type: 'time',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_time_morning.png`,
        questionText: 'Ông mặt trời vừa thức dậy, bé chuẩn bị đi học, là buổi nào?',
        options: [
            { text: 'Buổi Tối', english: 'Evening', ipa: '/ˈiːv.nɪŋ/', isCorrect: false },
            { text: 'Buổi Sáng', english: 'Morning', ipa: '/ˈmɔːr.nɪŋ/', isCorrect: true },
            { text: 'Buổi Trưa', english: 'Noon', ipa: '/nuːn/', isCorrect: false }
        ]
    },
    {
        id: 'time_noon',
        type: 'time',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_time_noon.png`,
        questionText: 'Mặt trời lên cao nhất, bé ăn trưa ở trường, là buổi nào?',
        options: [
            { text: 'Buổi Sáng', english: 'Morning', ipa: '/ˈmɔːr.nɪŋ/', isCorrect: false },
            { text: 'Buổi Trưa', english: 'Noon', ipa: '/nuːn/', isCorrect: true },
            { text: 'Buổi Tối', english: 'Evening', ipa: '/ˈiːv.nɪŋ/', isCorrect: false }
        ]
    },
    {
        id: 'time_afternoon',
        type: 'time',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_time_afternoon.png`,
        questionText: 'Mặt trời sắp lặn, ba mẹ đón bé đi học về, là buổi nào?',
        options: [
            { text: 'Buổi Chiều', english: 'Afternoon', ipa: '/ˌæf.tɚˈnuːn/', isCorrect: true },
            { text: 'Buổi Sáng', english: 'Morning', ipa: '/ˈmɔːr.nɪŋ/', isCorrect: false },
            { text: 'Buổi Tối', english: 'Evening', ipa: '/ˈiːv.nɪŋ/', isCorrect: false }
        ]
    },
    {
        id: 'time_night',
        type: 'time',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_time_night.png`,
        questionText: 'Trời tối đen, có trăng sao, bé đi ngủ, là buổi nào thế?',
        options: [
            { text: 'Buổi Sáng', english: 'Morning', ipa: '/ˈmɔːr.nɪŋ/', isCorrect: false },
            { text: 'Buổi Chiều', english: 'Afternoon', ipa: '/ˌæf.tɚˈnuːn/', isCorrect: false },
            { text: 'Buổi Tối', english: 'Evening', ipa: '/ˈiːv.nɪŋ/', isCorrect: true }
        ]
    },

    // --- ACTIVITIES MATCHING (HOẠT ĐỘNG TƯƠNG ỨNG) ---
    // GIỮ LẠI CÂU HỎI CŨ (Có tên nhân vật) NHƯNG SỬA ĐÁP ÁN (Bỏ tên nhân vật)
    
    {
        id: 'act_spring_tet',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_season_spring.png`,
        questionText: 'Mùa xuân đến, Gốm được làm gì?',
        options: [
            { text: 'Nhận lì xì', english: 'Get lucky money', ipa: '/ˈlʌk.i ˈmʌn.i/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_gom_lixi.png`, isCorrect: true },
            { text: 'Trang trí cây', english: 'Decorate tree', ipa: '/ˈdek.ə.reɪt triː/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_family_xmas.png`, isCorrect: false },
            { text: 'Tắm biển', english: 'Go swimming', ipa: '/swɪm/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_ba_swim.png`, isCorrect: false }
        ]
    },
    {
        id: 'act_summer_beach',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_season_summer.png`,
        questionText: 'Mùa hè nóng bức, Ba Cương thích làm gì?',
        options: [
            { text: 'Đi ngủ', english: 'Sleep', ipa: '/sliːp/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_action_sleep.png`, isCorrect: false },
            { text: 'Tắm biển', english: 'Go swimming', ipa: '/swɪm/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_ba_swim.png`, isCorrect: true },
            { text: 'Mặc áo ấm', english: 'Wear coat', ipa: '/weər kəʊt/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_gao_winter.png`, isCorrect: false }
        ]
    },
    {
        id: 'act_autumn_picnic',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_season_autumn.png`,
        questionText: 'Mùa thu mát mẻ, cả nhà đi đâu chơi?',
        options: [
            { text: 'Tắm biển', english: 'Go swimming', ipa: '/swɪm/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_ba_swim.png`, isCorrect: false },
            { text: 'Đi dã ngoại', english: 'Go picnic', ipa: '/ˈpɪk.nɪk/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_me_picnic.png`, isCorrect: true },
            { text: 'Trồng cây', english: 'Plant tree', ipa: '/plænt triː/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_ba_plant.png`, isCorrect: false }
        ]
    },
    {
        id: 'act_winter_xmas',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_season_winter.png`,
        questionText: 'Giáng sinh đến, cả nhà làm gì?',
        options: [
            { text: 'Trang trí cây', english: 'Decorate tree', ipa: '/ˈdek.ə.reɪt triː/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_family_xmas.png`, isCorrect: true },
            { text: 'Tắm biển', english: 'Go swimming', ipa: '/swɪm/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_ba_swim.png`, isCorrect: false },
            { text: 'Ăn kem', english: 'Eat ice cream', ipa: '/ˈaɪs ˌkriːm/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_gom_icecream.png`, isCorrect: false }
        ]
    },
    {
        id: 'act_winter_coat',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_season_winter.png`,
        questionText: 'Trời lạnh quá, Em Gạo phải làm gì?',
        options: [
            { text: 'Mặc áo ấm', english: 'Wear coat', ipa: '/weər kəʊt/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_gao_winter.png`, isCorrect: true },
            { text: 'Ăn kem', english: 'Eat ice cream', ipa: '/ˈaɪs ˌkriːm/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_gom_icecream.png`, isCorrect: false },
            { text: 'Thả diều', english: 'Fly a kite', ipa: '/flaɪ ə kaɪt/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_xoai_kite.png`, isCorrect: false }
        ]
    },

    // Theo Buổi (Giữ câu hỏi cũ, sửa đáp án)
    {
        id: 'act_morning_school',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_time_morning.png`,
        questionText: 'Buổi sáng, Bé Gốm đi đâu?',
        options: [
            { text: 'Đi ngủ', english: 'Sleep', ipa: '/sliːp/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_action_sleep.png`, isCorrect: false },
            { text: 'Đi học', english: 'Go to school', ipa: '/ɡoʊ tu skuːl/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_gom_school.png`, isCorrect: true },
            { text: 'Đọc truyện', english: 'Read story', ipa: '/riːd ˈstɔː.ri/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_me_read_story.png`, isCorrect: false }
        ]
    },
    {
        id: 'act_noon_lunch',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_time_noon.png`,
        questionText: 'Buổi trưa đói bụng, Gốm làm gì?',
        options: [
            { text: 'Ăn trưa', english: 'Eat lunch', ipa: '/iːt lʌntʃ/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_routine_lunch.png`, isCorrect: true },
            { text: 'Thả diều', english: 'Fly a kite', ipa: '/flaɪ ə kaɪt/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_xoai_kite.png`, isCorrect: false },
            { text: 'Đánh răng', english: 'Brush teeth', ipa: '/brʌʃ tiːθ/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_routine_brush_teeth.png`, isCorrect: false }
        ]
    },
    {
        id: 'act_afternoon_kite',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_time_afternoon.png`,
        questionText: 'Buổi chiều gió mát, Anh Xoài làm gì?',
        options: [
            { text: 'Đi ngủ', english: 'Sleep', ipa: '/sliːp/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_action_sleep.png`, isCorrect: false },
            { text: 'Thả diều', english: 'Fly a kite', ipa: '/flaɪ ə kaɪt/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_xoai_kite.png`, isCorrect: true },
            { text: 'Ăn cơm', english: 'Eat lunch', ipa: '/iːt lʌntʃ/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_routine_lunch.png`, isCorrect: false }
        ]
    },
    {
        id: 'act_night_story',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_time_night.png`,
        questionText: 'Buổi tối, Mẹ Hương làm gì?',
        options: [
            { text: 'Đi học', english: 'Go to school', ipa: '/skuːl/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_gom_school.png`, isCorrect: false },
            { text: 'Đọc truyện', english: 'Read story', ipa: '/riːd ˈstɔː.ri/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_me_read_story.png`, isCorrect: true },
            { text: 'Thả diều', english: 'Fly a kite', ipa: '/kaɪt/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_xoai_kite.png`, isCorrect: false }
        ]
    },

    // --- DAILY ROUTINE (SINH HOẠT HÀNG NGÀY) ---
    {
        id: 'act_brush_teeth',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_time_morning.png`,
        questionText: 'Vừa ngủ dậy, mình làm gì cho răng trắng tinh?',
        options: [
            { text: 'Đánh răng', english: 'Brush teeth', ipa: '/brʌʃ tiːθ/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_routine_brush_teeth.png`, isCorrect: true },
            { text: 'Đi ngủ', english: 'Sleep', ipa: '/sliːp/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_action_sleep.png`, isCorrect: false },
            { text: 'Ăn kem', english: 'Eat ice cream', ipa: '/ˈaɪs ˌkriːm/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_gom_icecream.png`, isCorrect: false }
        ]
    },
    {
        id: 'act_wash_face',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_routine_wash_face.png`,
        questionText: 'Để khuôn mặt sạch sẽ, bé cần làm gì?',
        options: [
            { text: 'Rửa mặt', english: 'Wash face', ipa: '/wɒʃ feɪs/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_routine_wash_face.png`, isCorrect: true },
            { text: 'Ăn cơm', english: 'Eat lunch', ipa: '/iːt lʌntʃ/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_routine_lunch.png`, isCorrect: false },
            { text: 'Thả diều', english: 'Fly a kite', ipa: '/flaɪ ə kaɪt/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_xoai_kite.png`, isCorrect: false }
        ]
    },
    // NEW QUESTIONS (Các câu mới bổ sung)
    {
        id: 'event_mid_autumn',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_event_mid_autumn.png`,
        questionText: 'Vào đêm Trung Thu, các bạn nhỏ làm gì?',
        options: [
            { text: 'Rước đèn', english: 'Lantern parade', ipa: '/ˈlæn.tən pəˈreɪd/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_event_mid_autumn.png`, isCorrect: true },
            { text: 'Gói bánh', english: 'Wrap cake', ipa: '/ræp keɪk/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_event_tet_cake.png`, isCorrect: false },
            { text: 'Tắm biển', english: 'Swim', ipa: '/swɪm/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_ba_swim.png`, isCorrect: false }
        ]
    },
    {
        id: 'event_tet_cake',
        type: 'action',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_event_tet_cake.png`,
        questionText: 'Ngày Tết cổ truyền, cả nhà cùng làm món gì?',
        options: [
            { text: 'Gói Bánh Chưng', english: 'Make Chung cake', ipa: '/meɪk tʃʌŋ keɪk/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_event_tet_cake.png`, isCorrect: true },
            { text: 'Ăn kem', english: 'Eat ice cream', ipa: '/ˈaɪs ˌkriːm/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_gom_icecream.png`, isCorrect: false },
            { text: 'Thả đèn', english: 'Float lanterns', ipa: '/floʊt ˈlæn.tənz/', imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_event_lanterns.png`, isCorrect: false }
        ]
    },
    {
        id: 'nat_rainbow',
        type: 'weather',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_weather_rainbow.png`,
        questionText: 'Sau cơn mưa, vòng cung 7 màu trên trời là gì?',
        options: [
            { text: 'Cầu vồng', english: 'Rainbow', ipa: '/ˈreɪn.boʊ/', isCorrect: true },
            { text: 'Cây cầu', english: 'Bridge', ipa: '/brɪdʒ/', isCorrect: false },
            { text: 'Dải lụa', english: 'Ribbon', ipa: '/ˈrɪb.ən/', isCorrect: false }
        ]
    },
    {
        id: 'nat_thunder',
        type: 'weather',
        imageUrl: `${ASSET_BASE_URL}/assets/images/thoitiet/ta_nature_thunder.png`,
        questionText: 'Khi trời mưa to, ánh sáng lóe lên gọi là gì?',
        options: [
            { text: 'Sấm sét', english: 'Thunder', ipa: '/ˈθʌn.dɚ/', isCorrect: true },
            { text: 'Mặt trời', english: 'Sun', ipa: '/sʌn/', isCorrect: false },
            { text: 'Cầu vồng', english: 'Rainbow', ipa: '/ˈreɪn.boʊ/', isCorrect: false }
        ]
    }
];
