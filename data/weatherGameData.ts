
const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app/assets/images/khampha';

export type ScienceCategory = 'weather' | 'plant' | 'water_physics' | 'animal' | 'object' | 'tool' | 'geography' | 'body' | 'society' | 'transport' | 'emotion';

export interface ScienceItem {
    id: string;
    name: string;
    imageUrl: string;
    category: ScienceCategory;
}

export const scienceItems: ScienceItem[] = [
    // --- CATEGORY: WEATHER & SKY ---
    { id: 'sun', name: 'Mặt Trời', imageUrl: `${ASSET_BASE_URL}/we_sun.png`, category: 'weather' },
    { id: 'rain', name: 'Mưa', imageUrl: `${ASSET_BASE_URL}/we_cloud_rain.png`, category: 'weather' },
    { id: 'cloud', name: 'Mây', imageUrl: `${ASSET_BASE_URL}/we_cloud_dark.png`, category: 'weather' },
    { id: 'wind', name: 'Gió', imageUrl: `${ASSET_BASE_URL}/we_wind.png`, category: 'weather' },
    { id: 'rainbow', name: 'Cầu Vồng', imageUrl: `${ASSET_BASE_URL}/we_rainbow.png`, category: 'weather' },
    { id: 'moon', name: 'Mặt Trăng', imageUrl: `${ASSET_BASE_URL}/we_moon.png`, category: 'weather' },
    { id: 'star', name: 'Ngôi Sao', imageUrl: `${ASSET_BASE_URL}/we_star.png`, category: 'weather' },
    { id: 'thunder', name: 'Sấm Sét', imageUrl: `${ASSET_BASE_URL}/we_thunder.png`, category: 'weather' },
    
    // --- CATEGORY: PLANTS ---
    { id: 'seed', name: 'Hạt Giống', imageUrl: `${ASSET_BASE_URL}/we_seed.png`, category: 'plant' },
    { id: 'sprout', name: 'Mầm Non', imageUrl: `${ASSET_BASE_URL}/we_sprout.png`, category: 'plant' },
    { id: 'roots', name: 'Rễ Cây', imageUrl: `${ASSET_BASE_URL}/we_roots.png`, category: 'plant' },
    { id: 'leaf', name: 'Lá Cây', imageUrl: `${ASSET_BASE_URL}/we_leaf.png`, category: 'plant' },
    { id: 'flower', name: 'Hoa', imageUrl: `${ASSET_BASE_URL}/we_flower_bloom.png`, category: 'plant' },
    { id: 'fruit', name: 'Quả', imageUrl: `${ASSET_BASE_URL}/we_fruit_tree.png`, category: 'plant' },
    { id: 'tree', name: 'Cây Xanh', imageUrl: `${ASSET_BASE_URL}/we_tree.png`, category: 'plant' },
    { id: 'cactus', name: 'Xương Rồng', imageUrl: `${ASSET_BASE_URL}/we_cactus.png`, category: 'plant' },
    
    // --- CATEGORY: WATER & PHYSICS ---
    { id: 'ice', name: 'Cục Đá', imageUrl: `${ASSET_BASE_URL}/we_ice.png`, category: 'water_physics' },
    { id: 'puddle', name: 'Vũng Nước', imageUrl: `${ASSET_BASE_URL}/we_puddle.png`, category: 'water_physics' },
    { id: 'steam', name: 'Hơi Nước', imageUrl: `${ASSET_BASE_URL}/we_steam.png`, category: 'water_physics' },
    { id: 'river', name: 'Dòng Sông', imageUrl: `${ASSET_BASE_URL}/we_river.png`, category: 'water_physics' },
    { id: 'sea', name: 'Biển', imageUrl: `${ASSET_BASE_URL}/we_sea_sun.png`, category: 'water_physics' },
    { id: 'rock', name: 'Hòn Đá', imageUrl: `${ASSET_BASE_URL}/we_rock.png`, category: 'water_physics' },
    { id: 'leaf_float', name: 'Lá Nổi', imageUrl: `${ASSET_BASE_URL}/we_leaf_float.png`, category: 'water_physics' },
    { id: 'sugar', name: 'Đường', imageUrl: `${ASSET_BASE_URL}/we_sugar.png`, category: 'water_physics' },
    { id: 'water_glass', name: 'Ly Nước', imageUrl: `${ASSET_BASE_URL}/we_glass_water.png`, category: 'water_physics' },
    { id: 'shadow', name: 'Cái Bóng', imageUrl: `${ASSET_BASE_URL}/we_shadow.png`, category: 'water_physics' },
    { id: 'magnet', name: 'Nam Châm', imageUrl: `${ASSET_BASE_URL}/we_magnet.png`, category: 'water_physics' },
    { id: 'nails', name: 'Đinh Sắt', imageUrl: `${ASSET_BASE_URL}/we_nails.png`, category: 'water_physics' },
    { id: 'color_orange', name: 'Màu Cam', imageUrl: `${ASSET_BASE_URL}/we_color_orange.png`, category: 'water_physics' },
    { id: 'scale', name: 'Cái Cân', imageUrl: `${ASSET_BASE_URL}/we_scale.png`, category: 'water_physics' },

    // --- CATEGORY: ANIMALS ---
    { id: 'bee', name: 'Con Ong', imageUrl: `${ASSET_BASE_URL}/we_bee.png`, category: 'animal' },
    { id: 'egg', name: 'Quả Trứng', imageUrl: `${ASSET_BASE_URL}/we_egg.png`, category: 'animal' },
    { id: 'chick', name: 'Gà Con', imageUrl: `${ASSET_BASE_URL}/we_chick.png`, category: 'animal' },
    { id: 'caterpillar', name: 'Sâu Bướm', imageUrl: `${ASSET_BASE_URL}/we_caterpillar.png`, category: 'animal' },
    { id: 'cocoon', name: 'Kén', imageUrl: `${ASSET_BASE_URL}/we_cocoon.png`, category: 'animal' },
    { id: 'butterfly', name: 'Bướm Xinh', imageUrl: `${ASSET_BASE_URL}/we_butterfly.png`, category: 'animal' },
    { id: 'tadpole', name: 'Nòng Nọc', imageUrl: `${ASSET_BASE_URL}/we_tadpole.png`, category: 'animal' },
    { id: 'frog', name: 'Con Ếch', imageUrl: `${ASSET_BASE_URL}/we_frog.png`, category: 'animal' },
    { id: 'nest', name: 'Tổ Chim', imageUrl: `${ASSET_BASE_URL}/we_bird_nest.png`, category: 'animal' },
    { id: 'web', name: 'Mạng Nhện', imageUrl: `${ASSET_BASE_URL}/we_spider_web.png`, category: 'animal' },
    { id: 'cave', name: 'Hang Đá', imageUrl: `${ASSET_BASE_URL}/we_cave.png`, category: 'animal' },
    { id: 'penguin', name: 'Chim Cánh Cụt', imageUrl: `${ASSET_BASE_URL}/we_penguin.png`, category: 'animal' },
    { id: 'ant', name: 'Con Kiến', imageUrl: `${ASSET_BASE_URL}/we_ant.png`, category: 'animal' },

    // --- CATEGORY: OBJECTS / CLOTHING / TOOLS ---
    { id: 'umbrella', name: 'Cái Ô', imageUrl: `${ASSET_BASE_URL}/we_umbrella.png`, category: 'object' },
    { id: 'raincoat', name: 'Áo Mưa', imageUrl: `${ASSET_BASE_URL}/we_raincoat.png`, category: 'object' },
    { id: 'hat', name: 'Mũ', imageUrl: `${ASSET_BASE_URL}/we_hat_sun.png`, category: 'object' },
    { id: 'scarf', name: 'Khăn', imageUrl: `${ASSET_BASE_URL}/we_scarf.png`, category: 'object' },
    { id: 'jacket', name: 'Áo Ấm', imageUrl: `${ASSET_BASE_URL}/we_jacket.png`, category: 'object' },
    { id: 'kite', name: 'Cánh Diều', imageUrl: `${ASSET_BASE_URL}/we_kite.png`, category: 'object' },
    { id: 'pinwheel', name: 'Chong Chóng', imageUrl: `${ASSET_BASE_URL}/we_pinwheel.png`, category: 'object' },
    { id: 'trash', name: 'Thùng Rác', imageUrl: `${ASSET_BASE_URL}/we_trash_bin.png`, category: 'object' },
    { id: 'plastic_bottle', name: 'Chai Nhựa', imageUrl: `${ASSET_BASE_URL}/we_plastic_bottle.png`, category: 'object' },
    { id: 'planting', name: 'Trồng Cây', imageUrl: `${ASSET_BASE_URL}/we_planting.png`, category: 'object' },
    { id: 'light_switch', name: 'Công Tắc', imageUrl: `${ASSET_BASE_URL}/we_light_switch.png`, category: 'object' },
    { id: 'water_tap', name: 'Vòi Nước', imageUrl: `${ASSET_BASE_URL}/we_water_tap.png`, category: 'object' },

    // --- CATEGORY: TOOLS (SCIENCE) ---
    { id: 'magnifying_glass', name: 'Kính Lúp', imageUrl: `${ASSET_BASE_URL}/we_magnifying_glass.png`, category: 'tool' },
    { id: 'telescope', name: 'Kính Thiên Văn', imageUrl: `${ASSET_BASE_URL}/we_telescope.png`, category: 'tool' },
    { id: 'rocket', name: 'Tên Lửa', imageUrl: `${ASSET_BASE_URL}/we_rocket.png`, category: 'tool' },
    { id: 'stethoscope', name: 'Ống Nghe', imageUrl: `${ASSET_BASE_URL}/we_stethoscope.png`, category: 'tool' },
    { id: 'fire_truck', name: 'Xe Cứu Hỏa', imageUrl: `${ASSET_BASE_URL}/we_fire_truck.png`, category: 'tool' },

    // --- CATEGORY: GEOGRAPHY ---
    { id: 'volcano', name: 'Núi Lửa', imageUrl: `${ASSET_BASE_URL}/we_volcano.png`, category: 'geography' },
    { id: 'desert', name: 'Sa Mạc', imageUrl: `${ASSET_BASE_URL}/we_desert.png`, category: 'geography' },
    { id: 'south_pole', name: 'Nam Cực', imageUrl: `${ASSET_BASE_URL}/we_south_pole.png`, category: 'geography' },
    { id: 'earth', name: 'Trái Đất', imageUrl: `${ASSET_BASE_URL}/we_earth.png`, category: 'geography' },

    // --- CATEGORY: BODY ---
    { id: 'nose', name: 'Cái Mũi', imageUrl: `${ASSET_BASE_URL}/we_nose.png`, category: 'body' },
    { id: 'ear', name: 'Cái Tai', imageUrl: `${ASSET_BASE_URL}/we_ear.png`, category: 'body' },
    { id: 'eye', name: 'Con Mắt', imageUrl: `${ASSET_BASE_URL}/we_eye.png`, category: 'body' },
    { id: 'hand', name: 'Bàn Tay', imageUrl: `${ASSET_BASE_URL}/we_hand.png`, category: 'body' },
    { id: 'teeth_brush', name: 'Đánh Răng', imageUrl: `${ASSET_BASE_URL}/we_teeth_brush.png`, category: 'body' },
    { id: 'teeth', name: 'Răng', imageUrl: `${ASSET_BASE_URL}/we_teeth.png`, category: 'body' },

    // --- CATEGORY: SOCIETY ---
    { id: 'traffic_light', name: 'Đèn Giao Thông', imageUrl: `${ASSET_BASE_URL}/we_traffic_light.png`, category: 'society' },
    { id: 'doctor', name: 'Bác Sĩ', imageUrl: `${ASSET_BASE_URL}/we_doctor.png`, category: 'society' },
    { id: 'firefighter', name: 'Lính Cứu Hỏa', imageUrl: `${ASSET_BASE_URL}/we_firefighter.png`, category: 'society' },
    { id: 'astronaut', name: 'Phi Hành Gia', imageUrl: `${ASSET_BASE_URL}/we_astronaut.png`, category: 'society' },
    { id: 'paint_palette', name: 'Pha Màu', imageUrl: `${ASSET_BASE_URL}/we_paint_palette.png`, category: 'tool' },
    { id: 'lamp', name: 'Bóng Đèn', imageUrl: `${ASSET_BASE_URL}/we_light_switch.png`, category: 'object' },
    { id: 'flower_wilted', name: 'Cây Héo', imageUrl: `${ASSET_BASE_URL}/we_flower_wilted.png`, category: 'plant' },
    { id: 'clothes_wet', name: 'Quần Áo Ướt', imageUrl: `${ASSET_BASE_URL}/we_clothes_wet.png`, category: 'object' },
    { id: 'clothes_dry', name: 'Quần Áo Khô', imageUrl: `${ASSET_BASE_URL}/we_clothes_dry.png`, category: 'object' },

    // --- CATEGORY: TRANSPORT ---
    { id: 'car', name: 'Ô Tô', imageUrl: `${ASSET_BASE_URL}/we_car.png`, category: 'transport' },
    { id: 'airplane', name: 'Máy Bay', imageUrl: `${ASSET_BASE_URL}/we_airplane.png`, category: 'transport' },
    { id: 'boat', name: 'Tàu Thủy', imageUrl: `${ASSET_BASE_URL}/we_boat.png`, category: 'transport' },
    { id: 'submarine', name: 'Tàu Ngầm', imageUrl: `${ASSET_BASE_URL}/we_submarine.png`, category: 'transport' },
    { id: 'bicycle', name: 'Xe Đạp', imageUrl: `${ASSET_BASE_URL}/we_bicycle.png`, category: 'transport' },
    { id: 'road', name: 'Con Đường', imageUrl: `${ASSET_BASE_URL}/we_road.png`, category: 'transport' },
    { id: 'sky_blue', name: 'Bầu Trời', imageUrl: `${ASSET_BASE_URL}/we_sky_blue.png`, category: 'transport' },
    { id: 'ocean_surface', name: 'Mặt Biển', imageUrl: `${ASSET_BASE_URL}/we_ocean_surface.png`, category: 'transport' },
    { id: 'underwater', name: 'Đáy Biển', imageUrl: `${ASSET_BASE_URL}/we_underwater.png`, category: 'transport' },

    // --- CATEGORY: EMOTION ---
    { id: 'face_happy', name: 'Vui Vẻ', imageUrl: `${ASSET_BASE_URL}/we_face_happy.png`, category: 'emotion' },
    { id: 'face_sad', name: 'Buồn Bã', imageUrl: `${ASSET_BASE_URL}/we_face_sad.png`, category: 'emotion' },
    { id: 'face_angry', name: 'Tức Giận', imageUrl: `${ASSET_BASE_URL}/we_face_angry.png`, category: 'emotion' },
    { id: 'face_sleepy', name: 'Buồn Ngủ', imageUrl: `${ASSET_BASE_URL}/we_face_sleepy.png`, category: 'emotion' },
    { id: 'gift', name: 'Hộp Quà', imageUrl: `${ASSET_BASE_URL}/we_gift.png`, category: 'emotion' },
    { id: 'broken_toy', name: 'Đồ Chơi Hỏng', imageUrl: `${ASSET_BASE_URL}/we_broken_toy.png`, category: 'emotion' },
    { id: 'bed', name: 'Cái Giường', imageUrl: `${ASSET_BASE_URL}/we_bed.png`, category: 'emotion' },
];

export interface ScienceLevel {
    id: number;
    title: string;
    introAudio: string;
    questionAudio: string;
    successAudio: string;
    centralImageId: string; // Initial state image
    successImageId: string; // Final state image (after interaction)
    correctItemId: string;
    background: string; // CSS class
}

export const scienceLevels: ScienceLevel[] = [
    // --- Chapter 1: Plants ---
    {
        id: 1, title: 'Hạt Giống', background: 'bg-amber-100',
        introAudio: "Bé nhìn xem, hạt giống đang ngủ trong đất.", questionAudio: "Muốn hạt nảy mầm, bé cần tưới gì cho hạt?", successAudio: "Đúng rồi! Có nước mát, hạt đã nảy mầm rồi kìa!",
        centralImageId: 'seed', successImageId: 'sprout', correctItemId: 'rain'
    },
    {
        id: 2, title: 'Mầm Non', background: 'bg-sky-100',
        introAudio: "Mầm non nhú lên rồi, nhưng trời tối quá.", questionAudio: "Mầm non cần ai sưởi ấm để xanh tốt nhỉ?", successAudio: "Tuyệt vời! Ánh nắng mặt trời giúp cây lớn nhanh.",
        centralImageId: 'sprout', successImageId: 'tree', correctItemId: 'sun'
    },
    {
        id: 3, title: 'Rễ Cây', background: 'bg-orange-50',
        introAudio: "Cây đứng vững được là nhờ cái gì bám sâu vào đất?", questionAudio: "Bé hãy chọn bộ phận giúp cây uống nước từ đất nhé.", successAudio: "Chính xác! Đó là rễ cây.",
        centralImageId: 'tree', successImageId: 'roots', correctItemId: 'roots'
    },
    {
        id: 4, title: 'Lá Cây', background: 'bg-green-50',
        introAudio: "Trên cành cây có rất nhiều bạn màu xanh.", questionAudio: "Đố bé biết, ai giúp cây hít thở và đón nắng?", successAudio: "Đúng rồi! Là những chiếc lá xinh xắn.",
        centralImageId: 'tree', successImageId: 'leaf', correctItemId: 'leaf'
    },
    {
        id: 5, title: 'Ra Quả', background: 'bg-pink-50',
        introAudio: "Bông hoa rụng cánh rồi, chuyện gì xảy ra tiếp theo?", questionAudio: "Bé đoán xem bông hoa sẽ biến thành gì?", successAudio: "Woa! Hoa đã kết thành quả ngon rồi.",
        centralImageId: 'flower', successImageId: 'fruit', correctItemId: 'fruit'
    },
    {
        id: 6, title: 'Thụ Phấn', background: 'bg-yellow-50',
        introAudio: "Khu vườn nhiều hoa thơm quá.", questionAudio: "Ai giúp các bông hoa kết trái nhỉ?", successAudio: "Cảm ơn bạn Ong chăm chỉ nhé!",
        centralImageId: 'flower', successImageId: 'bee', correctItemId: 'bee'
    },

    // --- Chapter 2: Water & Physics ---
    {
        id: 7, title: 'Tan Chảy', background: 'bg-orange-100',
        introAudio: "Trời nắng nóng quá!", questionAudio: "Cục đá lạnh để ngoài nắng sẽ biến thành gì?", successAudio: "Đá tan thành vũng nước rồi!",
        centralImageId: 'ice', successImageId: 'puddle', correctItemId: 'puddle'
    },
    {
        id: 8, title: 'Bốc Hơi', background: 'bg-blue-100',
        introAudio: "Mặt trời chiếu xuống mặt biển nóng hổi.", questionAudio: "Nước biển sẽ biến thành gì bay lên trời?", successAudio: "Đúng rồi! Nước bốc hơi thành hơi nước.",
        centralImageId: 'sea', successImageId: 'steam', correctItemId: 'steam'
    },
    {
        id: 9, title: 'Ngưng Tụ', background: 'bg-sky-200',
        introAudio: "Hơi nước bay lên cao tít.", questionAudio: "Hơi nước tụ lại thành gì trắng xốp trên bầu trời?", successAudio: "Đúng rồi, thành những đám mây!",
        centralImageId: 'steam', successImageId: 'cloud', correctItemId: 'cloud'
    },
    {
        id: 10, title: 'Vật Nổi', background: 'bg-blue-200',
        introAudio: "Gốm thả một chiếc lá xuống nước.", questionAudio: "Chiếc lá sẽ chìm hay nổi?", successAudio: "Đúng rồi! Chiếc lá nhẹ nên nổi lềnh bềnh.",
        centralImageId: 'puddle', successImageId: 'leaf_float', correctItemId: 'leaf_float'
    },
    {
        id: 11, title: 'Vật Chìm', background: 'bg-blue-200',
        introAudio: "Gốm thả một hòn đá xuống nước.", questionAudio: "Hòn đá nặng quá, nó sẽ thế nào?", successAudio: "Ùm! Hòn đá chìm nghỉm xuống đáy rồi.",
        centralImageId: 'puddle', successImageId: 'rock', correctItemId: 'rock'
    },
    {
        id: 12, title: 'Hòa Tan', background: 'bg-purple-50',
        introAudio: "Gốm cho đường vào cốc nước và khuấy đều.", questionAudio: "Đường đi đâu mất rồi?", successAudio: "Đường đã tan trong nước rồi đó bé ơi.",
        centralImageId: 'sugar', successImageId: 'water_glass', correctItemId: 'water_glass'
    },

    // --- Chapter 3: Animals ---
    {
        id: 13, title: 'Sâu Bướm', background: 'bg-green-100',
        introAudio: "Bạn sâu bướm ăn no, ngủ trong kén ấm áp.", questionAudio: "Khi thức dậy, bạn ấy biến thành gì xinh đẹp?", successAudio: "Woa! Thành một chú bướm rực rỡ!",
        centralImageId: 'cocoon', successImageId: 'butterfly', correctItemId: 'butterfly'
    },
    {
        id: 14, title: 'Nòng Nọc', background: 'bg-teal-100',
        introAudio: "Bạn nòng nọc bơi dưới nước, rụng đuôi mọc chân.", questionAudio: "Bạn ấy lớn lên thành con gì kêu ộp ộp?", successAudio: "Chính là chú Ếch xanh!",
        centralImageId: 'tadpole', successImageId: 'frog', correctItemId: 'frog'
    },
    {
        id: 15, title: 'Gà Con', background: 'bg-yellow-100',
        introAudio: "Cốc cốc cốc! Ai đang gõ cửa trong quả trứng thế?", questionAudio: "Ai chui ra từ quả trứng vậy bé?", successAudio: "Chào bạn Gà con lông vàng!",
        centralImageId: 'egg', successImageId: 'chick', correctItemId: 'chick'
    },
    {
        id: 16, title: 'Xây Tổ', background: 'bg-amber-50',
        introAudio: "Chim mẹ muốn đẻ trứng.", questionAudio: "Chim cần làm cái gì để đựng trứng?", successAudio: "Đúng rồi, một cái tổ ấm áp.",
        centralImageId: 'egg', successImageId: 'nest', correctItemId: 'nest'
    },
    {
        id: 17, title: 'Giăng Lưới', background: 'bg-slate-200',
        introAudio: "Bạn Nhện muốn bắt muỗi.", questionAudio: "Nhện cần giăng cái gì?", successAudio: "Một chiếc mạng nhện thật chắc chắn!",
        centralImageId: 'tree', successImageId: 'web', correctItemId: 'web'
    },
    {
        id: 18, title: 'Ngủ Đông', background: 'bg-gray-200',
        introAudio: "Mùa đông lạnh quá, tuyết rơi đầy trời.", questionAudio: "Gấu đi đâu để ngủ cho ấm?", successAudio: "Gấu ngủ trong hang đá suốt mùa đông.",
        centralImageId: 'jacket', successImageId: 'cave', correctItemId: 'cave'
    },

    // --- Chapter 4: Sky ---
    {
        id: 19, title: 'Ban Ngày', background: 'bg-sky-300',
        introAudio: "Gà gáy ò ó o, trời sáng rồi.", questionAudio: "Ai tỏa nắng vàng rực rỡ?", successAudio: "Chào ông Mặt Trời!",
        centralImageId: 'tree', successImageId: 'sun', correctItemId: 'sun'
    },
    {
        id: 20, title: 'Ban Đêm', background: 'bg-indigo-900',
        introAudio: "Bé đi ngủ, trời tối đen.", questionAudio: "Ai canh gác bầu trời đêm nay?", successAudio: "Chị Hằng Nga và Mặt Trăng đó.",
        centralImageId: 'star', successImageId: 'moon', correctItemId: 'moon'
    },
    {
        id: 21, title: 'Ngôi Sao', background: 'bg-slate-900',
        introAudio: "Bầu trời đêm nay đẹp quá.", questionAudio: "Cái gì lấp lánh như những viên kim cương?", successAudio: "Là những ngôi sao nhỏ!",
        centralImageId: 'moon', successImageId: 'star', correctItemId: 'star'
    },
    {
        id: 22, title: 'Cầu Vồng', background: 'bg-blue-100',
        introAudio: "Mưa tạnh rồi, nắng lên rồi.", questionAudio: "Cái gì 7 màu cong cong trên trời?", successAudio: "Cầu vồng rực rỡ quá!",
        centralImageId: 'rain', successImageId: 'rainbow', correctItemId: 'rainbow'
    },
    {
        id: 23, title: 'Gió Thổi', background: 'bg-emerald-100',
        introAudio: "Chong chóng đứng im lìm.", questionAudio: "Cái gì làm chong chóng quay tít?", successAudio: "Gió thổi vi vu, chong chóng quay đều!",
        centralImageId: 'pinwheel', successImageId: 'wind', correctItemId: 'wind'
    },

    // --- Chapter 5: Life Skills & Review ---
    {
        id: 24, title: 'Trời Mưa', background: 'bg-slate-400',
        introAudio: "Trời mưa to quá!", questionAudio: "Đi học bé cần mang gì để không ướt?", successAudio: "Nhớ mang ô hoặc mặc áo mưa nhé.",
        centralImageId: 'rain', successImageId: 'umbrella', correctItemId: 'umbrella'
    },
    {
        id: 25, title: 'Trời Nắng', background: 'bg-yellow-100',
        introAudio: "Nắng chang chang, chói mắt quá.", questionAudio: "Bé cần đội gì khi ra đường?", successAudio: "Đội mũ để bảo vệ đầu nhé.",
        centralImageId: 'sun', successImageId: 'hat', correctItemId: 'hat'
    },
    {
        id: 26, title: 'Trời Lạnh', background: 'bg-cyan-100',
        introAudio: "Gió lạnh rít từng cơn.", questionAudio: "Bé mặc gì cho ấm cổ?", successAudio: "Quàng khăn ấm vào nhé.",
        centralImageId: 'wind', successImageId: 'scarf', correctItemId: 'scarf'
    },
    {
        id: 27, title: 'Phơi Đồ', background: 'bg-green-100',
        introAudio: "Mẹ vừa giặt quần áo xong.", questionAudio: "Cần gì để quần áo khô nhanh?", successAudio: "Nắng và gió làm khô quần áo.",
        centralImageId: 'clothes_wet', successImageId: 'clothes_dry', correctItemId: 'sun'
    },
    {
        id: 28, title: 'Thả Diều', background: 'bg-sky-200',
        introAudio: "Gốm muốn thả diều.", questionAudio: "Diều cần gì để bay cao?", successAudio: "Gió nâng cánh diều bay lên cao.",
        centralImageId: 'kite', successImageId: 'wind', correctItemId: 'wind'
    },
    {
        id: 29, title: 'Cây Khát', background: 'bg-orange-50',
        introAudio: "Cây héo rũ vì khát nước.", questionAudio: "Cây cần gì để tươi tỉnh lại?", successAudio: "Mưa rơi xuống cây tươi tốt ngay.",
        centralImageId: 'flower_wilted', successImageId: 'rain', correctItemId: 'rain'
    },
    {
        id: 30, title: 'Môi Trường', background: 'bg-lime-100',
        introAudio: "Muốn không khí trong lành, mát mẻ.", questionAudio: "Chúng mình nên làm gì?", successAudio: "Trồng thêm nhiều cây xanh nhé!",
        centralImageId: 'tree', successImageId: 'planting', correctItemId: 'planting'
    },

    // --- NEW LEVELS (31-50) ---
    // --- Physics & Tools ---
    {
        id: 31, title: 'Nam Châm', background: 'bg-gray-200',
        introAudio: "Bé có một cục nam châm kỳ diệu.", questionAudio: "Nam châm sẽ hút được vật gì nào?", successAudio: "Giỏi quá! Nam châm hút được đinh sắt.",
        centralImageId: 'magnet', successImageId: 'nails', correctItemId: 'nails'
    },
    {
        id: 32, title: 'Cái Bóng', background: 'bg-zinc-300',
        introAudio: "Trời nắng to, Gốm đi trên đường.", questionAudio: "Cái gì đen thui bám theo Gốm dưới đất?", successAudio: "Là cái bóng của Gốm đó!",
        centralImageId: 'sun', successImageId: 'shadow', correctItemId: 'shadow'
    },
    {
        id: 33, title: 'Kính Lúp', background: 'bg-teal-50',
        introAudio: "Gốm muốn quan sát một chú kiến bé xíu.", questionAudio: "Gốm cần dùng cái gì để nhìn rõ hơn?", successAudio: "Kính lúp giúp phóng to mọi vật.",
        centralImageId: 'ant', successImageId: 'magnifying_glass', correctItemId: 'magnifying_glass'
    },
    {
        id: 34, title: 'Kính Thiên Văn', background: 'bg-indigo-900',
        introAudio: "Gốm muốn ngắm các ngôi sao trên trời cao.", questionAudio: "Gốm nên dùng dụng cụ gì?", successAudio: "Kính thiên văn giúp nhìn xa thật xa.",
        centralImageId: 'star', successImageId: 'telescope', correctItemId: 'telescope'
    },
    {
        id: 35, title: 'Cái Cân', background: 'bg-stone-100',
        introAudio: "Gốm muốn biết quả táo hay quả cam nặng hơn.", questionAudio: "Gốm dùng cái gì để so sánh?", successAudio: "Dùng cái cân để biết bên nào nặng hơn nhé.",
        centralImageId: 'fruit', successImageId: 'scale', correctItemId: 'scale'
    },

    // --- Geography & Nature ---
    {
        id: 36, title: 'Núi Lửa', background: 'bg-red-100',
        introAudio: "Ngọn núi này đang tức giận và phun trào.", questionAudio: "Nó phun ra cái gì nóng bỏng vậy bé?", successAudio: "Núi lửa phun dung nham nóng rực.",
        centralImageId: 'volcano', successImageId: 'volcano', correctItemId: 'volcano'
    },
    {
        id: 37, title: 'Sa Mạc', background: 'bg-yellow-200',
        introAudio: "Ở sa mạc rất nóng và ít nước.", questionAudio: "Cây gì sống được ở nơi khô cằn này?", successAudio: "Cây xương rồng chịu khát rất giỏi.",
        centralImageId: 'desert', successImageId: 'cactus', correctItemId: 'cactus'
    },
    {
        id: 38, title: 'Nam Cực', background: 'bg-cyan-100',
        introAudio: "Nam Cực lạnh giá, toàn là băng tuyết.", questionAudio: "Bạn chim nào sống ở nơi lạnh lẽo này?", successAudio: "Chào bạn Chim Cánh Cụt dễ thương!",
        centralImageId: 'south_pole', successImageId: 'penguin', correctItemId: 'penguin'
    },
    {
        id: 39, title: 'Trái Đất', background: 'bg-blue-900',
        introAudio: "Chúng ta đang sống trên một hành tinh xanh.", questionAudio: "Hành tinh đó tên là gì?", successAudio: "Đó là Trái Đất thân yêu của chúng ta.",
        centralImageId: 'rocket', successImageId: 'earth', correctItemId: 'earth'
    },
    {
        id: 40, title: 'Tái Chế', background: 'bg-green-100',
        introAudio: "Gốm uống xong chai nước rồi.", questionAudio: "Vỏ chai nhựa nên bỏ vào đâu để bảo vệ môi trường?", successAudio: "Bỏ vào thùng rác tái chế nhé!",
        centralImageId: 'plastic_bottle', successImageId: 'trash', correctItemId: 'trash'
    },

    // --- Body & Senses ---
    {
        id: 41, title: 'Khứu Giác', background: 'bg-rose-50',
        introAudio: "Bông hoa này thơm quá.", questionAudio: "Bé dùng cái gì để ngửi mùi hương?", successAudio: "Cái mũi dùng để ngửi.",
        centralImageId: 'flower', successImageId: 'nose', correctItemId: 'nose'
    },
    {
        id: 42, title: 'Thính Giác', background: 'bg-purple-50',
        introAudio: "Tiếng chim hót líu lo nghe thật vui.", questionAudio: "Bé dùng cái gì để nghe âm thanh?", successAudio: "Cái tai giúp bé nghe mọi điều.",
        centralImageId: 'bird', successImageId: 'ear', correctItemId: 'ear'
    },
    {
        id: 43, title: 'Thị Giác', background: 'bg-sky-50',
        introAudio: "Cầu vồng bảy sắc rực rỡ.", questionAudio: "Bé dùng cái gì để nhìn thấy cầu vồng?", successAudio: "Đôi mắt sáng long lanh.",
        centralImageId: 'rainbow', successImageId: 'eye', correctItemId: 'eye'
    },
    {
        id: 44, title: 'Xúc Giác', background: 'bg-orange-50',
        introAudio: "Lông chú mèo thật mềm mại.", questionAudio: "Bé dùng cái gì để vuốt ve chú mèo?", successAudio: "Bàn tay nhỏ xinh.",
        centralImageId: 'cat', successImageId: 'hand', correctItemId: 'hand'
    },
    {
        id: 45, title: 'Vệ Sinh', background: 'bg-blue-50',
        introAudio: "Ăn kẹo xong rồi.", questionAudio: "Bé cần làm gì để sâu không ăn răng?", successAudio: "Nhớ đánh răng thật sạch nhé!",
        centralImageId: 'teeth', successImageId: 'teeth_brush', correctItemId: 'teeth_brush'
    },

    // --- Society & Safety ---
    {
        id: 46, title: 'Giao Thông', background: 'bg-gray-100',
        introAudio: "Đến ngã tư đường phố.", questionAudio: "Đèn màu gì bật lên thì bé phải dừng lại?", successAudio: "Đèn đỏ dừng lại, đèn xanh được đi.",
        centralImageId: 'traffic_light', successImageId: 'traffic_light', correctItemId: 'traffic_light'
    },
    {
        id: 47, title: 'Bác Sĩ', background: 'bg-green-50',
        introAudio: "Bé bị ốm sốt rồi.", questionAudio: "Ai sẽ khám bệnh và giúp bé khỏe lại?", successAudio: "Bác sĩ sẽ chăm sóc cho bé.",
        centralImageId: 'bed', successImageId: 'doctor', correctItemId: 'doctor'
    },
    {
        id: 48, title: 'Cứu Hỏa', background: 'bg-red-50',
        introAudio: "Ôi, có đám cháy lớn!", questionAudio: "Ai dũng cảm đến dập lửa cứu người?", successAudio: "Chú lính cứu hỏa và xe chữa cháy.",
        centralImageId: 'fire_truck', successImageId: 'firefighter', correctItemId: 'firefighter'
    },
    {
        id: 49, title: 'Tiết Kiệm', background: 'bg-yellow-50',
        introAudio: "Gốm đi ra khỏi phòng.", questionAudio: "Gốm cần làm gì với bóng đèn để tiết kiệm điện?", successAudio: "Nhớ tắt công tắc điện nhé!",
        centralImageId: 'lamp', successImageId: 'light_switch', correctItemId: 'light_switch'
    },
    {
        id: 50, title: 'Pha Màu', background: 'bg-pink-100',
        introAudio: "Gốm có màu Đỏ và màu Vàng.", questionAudio: "Trộn hai màu này lại sẽ ra màu gì?", successAudio: "Ra màu Cam rực rỡ!",
        centralImageId: 'paint_palette', successImageId: 'color_orange', correctItemId: 'color_orange'
    },

    // --- NEW LEVELS (51-60) ---
    // --- Chapter 10: Transport ---
    {
        id: 51, title: 'Đường Bộ', background: 'bg-gray-200',
        introAudio: "Bíp bíp! Xe cộ đi lại tấp nập.", questionAudio: "Xe ô tô chạy ở đâu vậy bé?", successAudio: "Đúng rồi, xe chạy trên con đường.",
        centralImageId: 'car', successImageId: 'road', correctItemId: 'road'
    },
    {
        id: 52, title: 'Bầu Trời', background: 'bg-sky-200',
        introAudio: "Nhìn lên cao kìa, bầu trời xanh ngát.", questionAudio: "Phương tiện nào bay lượn trên bầu trời?", successAudio: "Máy bay bay vút trên cao.",
        centralImageId: 'sky_blue', successImageId: 'airplane', correctItemId: 'airplane'
    },
    {
        id: 53, title: 'Mặt Nước', background: 'bg-blue-300',
        introAudio: "Biển xanh mênh mông sóng vỗ.", questionAudio: "Cái gì nổi lềnh bềnh và đi trên mặt nước?", successAudio: "Tàu thủy rẽ sóng ra khơi.",
        centralImageId: 'ocean_surface', successImageId: 'boat', correctItemId: 'boat'
    },
    {
        id: 54, title: 'Dưới Biển', background: 'bg-indigo-800',
        introAudio: "Sâu dưới lòng đại dương bí ẩn.", questionAudio: "Tàu gì có thể lặn sâu xuống nước?", successAudio: "Tàu ngầm thám hiểm đáy biển.",
        centralImageId: 'underwater', successImageId: 'submarine', correctItemId: 'submarine'
    },
    {
        id: 55, title: 'Sức Người', background: 'bg-green-100',
        introAudio: "Gốm muốn đi dạo trong công viên.", questionAudio: "Xe gì Gốm phải dùng chân đạp mới chạy được?", successAudio: "Xe đạp giúp bé khỏe đôi chân.",
        centralImageId: 'road', successImageId: 'bicycle', correctItemId: 'bicycle'
    },

    // --- Chapter 11: Emotions ---
    {
        id: 56, title: 'Vui Vẻ', background: 'bg-yellow-100',
        introAudio: "Hôm nay Gốm được đi chơi công viên.", questionAudio: "Gốm cảm thấy thế nào?", successAudio: "Gốm cười tươi vui vẻ.",
        centralImageId: 'face_happy', successImageId: 'face_happy', correctItemId: 'face_happy'
    },
    {
        id: 57, title: 'Buồn Bã', background: 'bg-blue-50',
        introAudio: "Ôi, đồ chơi của Gốm bị hỏng mất rồi.", questionAudio: "Gốm sẽ cảm thấy sao?", successAudio: "Gốm buồn thiu và muốn khóc.",
        centralImageId: 'broken_toy', successImageId: 'face_sad', correctItemId: 'face_sad'
    },
    {
        id: 58, title: 'Tức Giận', background: 'bg-red-50',
        introAudio: "Có bạn giành đồ chơi của Gốm.", questionAudio: "Gốm cau mày, Gốm đang cảm thấy gì?", successAudio: "Gốm đang tức giận đó.",
        centralImageId: 'face_angry', successImageId: 'face_angry', correctItemId: 'face_angry'
    },
    {
        id: 59, title: 'Buồn Ngủ', background: 'bg-indigo-100',
        introAudio: "Đã đến giờ đi ngủ rồi, Gốm ngáp dài.", questionAudio: "Gốm đang cảm thấy gì nhỉ?", successAudio: "Gốm buồn ngủ díu cả mắt.",
        centralImageId: 'bed', successImageId: 'face_sleepy', correctItemId: 'face_sleepy'
    },
    {
        id: 60, title: 'Yêu Thương', background: 'bg-pink-100',
        introAudio: "Mẹ tặng quà sinh nhật cho Gốm.", questionAudio: "Gốm nhận quà và cảm thấy thế nào?", successAudio: "Gốm rất vui và hạnh phúc!",
        centralImageId: 'gift', successImageId: 'face_happy', correctItemId: 'face_happy'
    },
];

// Collect all audio texts for pre-generation
export const weatherAudioTexts = [
    ...scienceLevels.map(l => l.introAudio),
    ...scienceLevels.map(l => l.questionAudio),
    ...scienceLevels.map(l => l.successAudio),
    "Đúng rồi!", "Sai rồi!", "Hoan hô!", "Chưa đúng!", "Chưa đúng rồi, bé chọn lại nhé!"
];
