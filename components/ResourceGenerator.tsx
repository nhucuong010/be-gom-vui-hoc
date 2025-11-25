
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { HomeIcon, SpeakerIcon, CheckCircleIcon } from './icons';
import { playSound, decodeBase64, decodePcmAudioData, playAudioBuffer, soundData } from '../services/audioService';
import { SOUNDS } from '../types';
import { generateImageFromText, generateImageWithReference } from '../services/imageService';
import { generateSpeech } from '../services/ttsService';
import { spellingWordsByLevel, spellingRobotData, fillInTheBlankWords } from '../services/geminiService';
import { feedingProblemsBank, bakeryProblemsBank, simpleMathProblemsBank } from '../data/mathProblems';
import { imagePrompts } from '../data/imagePrompts';
import { englishLessons } from '../data/englishLessons';
import type { ImagePromptItem, VocabularyItem } from '../types';
import { sanitizeFilename, getVowelWithTone } from '../utils/textUtils';
import { getEquationText } from '../services/feedbackService';
import { princessCodeProblemsBank, numberCharacters } from '../data/princessCodeData';
import { restaurantCustomers, restaurantMenuItems, restaurantOrdersBank } from '../data/restaurantData';
import { gardenMemoryScenes } from '../data/gardenMemoryData';
import { problemBank as streetFoodProblemBank, MENU as STREET_FOOD_MENU } from '../data/streetFoodData';
import { capybaraAudioTexts } from '../data/capybaraRescueData';
import { timeAdventureQuestions } from '../data/timeAdventureData';
import { familyVocab, singlePersonActions, pairActions, characterActionMap, getStorySentences } from '../data/englishStoryData';
import { weatherAudioTexts } from '../data/weatherGameData';
import { WRITING_WORDS } from '../data/writingData';


// --- Types ---
type AssetStatus = 'checking' | 'pending' | 'loading' | 'generated' | 'exists' | 'error';

interface Asset {
    key: string;
    name: string;
    status: AssetStatus;
    data: string | null; // base64 for generated, null otherwise
    error: string | null;
    url: string; // The public URL on the server
}

interface ImageAsset extends Asset {
    type: 'image';
    promptItem: ImagePromptItem;
    referenceImage: string | null;
    selectedEffect: string | null;
}

interface AudioAsset extends Asset {
    type: 'audio';
    language: 'vi' | 'en';
    filename: string;
    subfolder?: string;
}

interface UiSoundAsset extends Asset {
    type: 'ui_sound';
    filename: string;
}

type AssetItem = ImageAsset | AudioAsset | UiSoundAsset;

type GameCategoryKey =
    | 'covers_home'
    | 'images_vn_common'
    | 'images_feeding'
    | 'images_bakery'
    | 'images_math'
    | 'images_memory_math'
    | 'images_english'
    | 'images_princess_code'
    | 'images_restaurant'
    | 'images_street_food'
    | 'images_bunny_rescue'
    | 'images_garden_memory'
    | 'images_capybara_rescue'
    | 'images_time_adventure'
    | 'images_online_shopping'
    | 'images_weather_explorer'
    | 'images_writing'
    | 'stickers'
    | 'audio_feeding'
    | 'audio_bakery'
    | 'audio_math_full'
    | 'audio_math_words'
    | 'audio_spelling_robot'
    | 'audio_fill_blank'
    | 'audio_vn_common_words'
    | 'audio_english_words'
    | 'audio_english_story'
    | 'audio_princess_code'
    | 'audio_restaurant'
    | 'audio_street_food'
    | 'audio_bunny_rescue'
    | 'audio_garden_memory'
    | 'audio_capybara_rescue'
    | 'audio_time_adventure'
    | 'audio_online_shopping'
    | 'audio_weather_explorer'
    | 'audio_writing_game'
    | 'audio_writing_game'
    | 'audio_catch_game'
    | 'audio_piano' // NEW
    | 'audio_common_feedback'
    | 'audio_common_effects';

// --- Helper Functions ---
const createWavBlob = (pcmData: Uint8Array): Blob => {
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcmData.length;
    const fileSize = 36 + dataSize;
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, fileSize, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); // PCM chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, dataSize, true);
    return new Blob([view, pcmData as any], { type: 'audio/wav' });
};

const downloadFile = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// --- Initial Asset Collection ---
const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app/assets';

// List of new English vocabulary files that should be in the /english/ folder
const newEnglishAssets = new Set([
    'acorn.png', 'alien.png', 'ambulance.png', 'angry.png', 'ant.png', 'artist.png', 'astronaut.png', 'aunt.png',
    'baby.png', 'backpack.png', 'badminton.png', 'bag.png', 'ball_pit.png', 'balloon_toy.png', 'basketball_ball.png',
    'bathtub.png', 'bear.png', 'bee.png', 'bench.png', 'bike.png', 'binoculars.png', 'black.png', 'blocks.png',
    'book.png', 'bored.png', 'bread.png', 'bus.png', 'chicken.png', 'circle.png', 'coat.png', 'cold.png',
    'computer.png', 'cookie.png', 'cousin.png', 'cow.png', 'crayon.png', 'crocodile.png', 'dance.png', 'diamond.png',
    'dinosaur.png', 'donkey.png', 'dress.png', 'drink.png', 'drum.png', 'ears.png', 'egg.png', 'eight.png',
    'elephant.png', 'eleven.png', 'english_bed.png', 'english_bird.png', 'english_blanket.png',
    'english_bookshelf.png', 'english_butterfly.png', 'english_campfire.png', 'english_castle.png',
    'english_caterpillar.png', 'english_chef.png', 'english_clock.png', 'english_cloud.png', 'english_comet.png',
    'english_compass.png', 'english_crown.png', 'english_cushion.png', 'english_doctor.png', 'english_dolphin.png',
    'english_dragon.png', 'english_dragonfly.png', 'english_drum_music.png', 'english_ducky.png', 'english_earth.png',
    'english_fairy.png', 'english_farmer.png', 'english_firefighter.png', 'english_firefly.png',
    'english_flashlight.png', 'english_flower.png', 'english_flute.png', 'english_forest.png',
    'english_gold_medal.png', 'english_grass.png', 'english_grasshopper.png', 'english_guitar.png', 'english_leaf.png',
    'english_moon.png', 'english_octopus.png', 'eraser.png', 'family.png', 'fifteen.png', 'fire_truck.png',
    'foggy.png', 'fourteen.png', 'giraffe.png', 'gloves.png', 'glue.png', 'goat.png', 'gold.png', 'grape.png',
    'gray.png', 'hair.png', 'hands.png', 'happy.png', 'heart.png', 'helicopter.png', 'hippo.png', 'hot.png',
    'hungry.png', 'icecream.png', 'jacket.png', 'swimming_goggles.png'
]);

const getImagePath = (item: ImagePromptItem): string => {
    if (item.game === 'cover') {
        return `${ASSET_BASE_URL}/images/covers/${item.filename}`;
    }
    if (item.game === 'english') {
        if (newEnglishAssets.has(item.filename)) {
            return `${ASSET_BASE_URL}/images/english/${item.filename}`;
        }
        return `${ASSET_BASE_URL}/images/${item.filename}`;
    }
    if (item.game === 'time_adventure') {
        return `${ASSET_BASE_URL}/images/thoitiet/${item.filename}`;
    }
    if (item.game === 'online_shopping') {
        return `${ASSET_BASE_URL}/images/muasam/${item.filename}`;
    }
    if (item.game === 'weather_explorer') {
        return `${ASSET_BASE_URL}/images/khampha/${item.filename}`;
    }
    if (item.game === 'writing') {
        return `${ASSET_BASE_URL}/images/chucai/${item.filename}`;
    }
    return `${ASSET_BASE_URL}/images/${item.filename}`;
};

// Constants for mapping character IDs to display names
const CHAR_NAMES: Record<string, string> = {
    'gom': 'Bé Gốm',
    'ba_cuong': 'Ba Cương',
    'me_huong': 'Mẹ Hương',
    'gao': 'Em Gạo',
    'ba_thom': 'Bà Nội (Thơm)',
    'ong_khoa': 'Ông Nội (Khoa)',
    'ba_bup': 'Bà Ngoại (Búp)',
    'anh_xoai': 'Anh Xoài',
    'chi_na': 'Chị Na',
    'em_gam': 'Em Gấm',
};

// --- Audio Categorization Sets ---
const onsetPronunciations: Record<string, string> = { 'B': 'bờ', 'C': 'cờ', 'CH': 'chờ', 'D': 'dờ', 'Đ': 'đờ', 'G': 'gờ', 'GH': 'gờ', 'H': 'hờ', 'K': 'ca', 'KH': 'khờ', 'L': 'lờ', 'M': 'mờ', 'N': 'nờ', 'NG': 'ngờ', 'NGH': 'ngờ', 'NH': 'nhờ', 'P': 'pờ', 'PH': 'phờ', 'QU': 'quờ', 'R': 'rờ', 'S': 'sờ', 'T': 'tờ', 'TH': 'thờ', 'TR': 'trờ', 'V': 'vờ', 'X': 'xờ', 'GI': 'giờ' };
const feedingAudioTexts = new Set([...feedingProblemsBank.flatMap(p => [p.question, p.animal]), "Cảm ơn Gốm! Tớ no rồi!"]);
const bakeryAudioTexts = new Set([...bakeryProblemsBank.flatMap(p => [p.question, p.customerName]), "Hôm nay tiệm bánh thật đông khách! Con giỏi quá!"]);
const spellingRobotAudioTexts = new Set([...Object.values(onsetPronunciations), 'ô', 'sắc', 'huyền', 'hỏi', 'ngã', 'nặng', ...spellingRobotData.flatMap(p => [`Bây giờ mình ráp tiếng ${p.targetWord} nhé!`, p.syllable.rime.toLowerCase(), p.syllable.onset ? (p.syllable.onset + p.syllable.rime).toLowerCase() : '']).filter(Boolean)]);
const fillBlankAudioTexts = new Set(fillInTheBlankWords.map(p => `Con ơi, thiếu chữ nào để được từ ${p.word}?`));
const commonVnWordsAudioTexts = new Set(Object.values(spellingWordsByLevel).flat().map(w => w.word));
const mathFullAudioTexts = new Set(simpleMathProblemsBank.map(p => getEquationText(p.problem, p.answer, p.type, true)).filter(Boolean));
const mathWordsAudioTexts = new Set((() => { const set = new Set<string>(); for (let i = 0; i <= 50; i++) set.add(String(i));['cộng', 'trừ', 'bằng', 'mấy', 'lớn hơn', 'bé hơn'].forEach(w => set.add(w)); return Array.from(set); })());
const feedbackAudioTexts = new Set(['Đúng rồi!', 'Tuyệt vời!', 'Con giỏi quá!', 'Chính xác!', 'Sai rồi, thử lại nhé!', 'Thử lại nhé!', 'Lỗi rồi!', 'Sai rồi!', 'Chưa đúng rồi! Thử lại nhé!', 'Chưa đúng', 'Con thử lại nhé']);
const englishAudioTexts = new Set(englishLessons.flatMap(l => l.vocabulary).flatMap(v => [v.word, v.sentence]));
const newEnglishAudioTexts = new Set([...englishLessons.flatMap(l => l.vocabulary).flatMap(v => [v.word, v.sentence]), "A big dinosaur.", "A big hippo.", "A big stone castle.", "A big trophy.", "A big truck.", "A blue shirt.", "A blue square.", "A boat on water.", "A brave prince.", "A brown bear.", "A colorful butterfly.", "A colorful planet.", "A colorful rainbow.", "A cute baby.", "A diamond shape."]);
const princessCodeAudioTexts = new Set([...princessCodeProblemsBank.flatMap(p => p.storySteps.flatMap(s => [s.question, ...s.choices.map(c => c.storySegment)])), ...numberCharacters.map(c => c.description), ...numberCharacters.flatMap(c => [`Chưa đúng rồi. Con nhớ lại xem, ${c.description} nhé.`, c.name]), 'Nhiệm vụ của bé!', 'Kho báu hôm nay có mật mã 3 số. Các bạn số này sẽ giúp chúng ta nhớ nhé:', 'Kho báu hôm nay có mật mã 4 số. Các bạn số này sẽ giúp chúng ta nhớ nhé:', 'Các bạn số này sẽ giúp chúng ta nhớ nhé:', 'Bắt đầu kể chuyện!', 'Câu chuyện của chúng ta là...', 'Nhân vật thứ 1 trong câu chuyện là ai?', 'Nhân vật thứ 2 trong câu chuyện là ai?', 'Nhân vật thứ 3 trong câu chuyện là ai?', 'Nhân vật thứ 4 trong câu chuyện là ai?', 'Nhân vật thứ 5 trong câu chuyện là ai?',]);
const allRestaurantAudioTexts = new Set([...restaurantMenuItems.map(i => i.name), 'Khách đang gọi món...', 'Bé phục vụ món nào!', 'Ai là người đã gọi...', 'Con giỏi quá! Bé đã phục vụ đúng hết tất cả các món!', 'Chưa đúng rồi, con nhớ lại xem!', ...restaurantOrdersBank.map(o => o.orderSentence)]);
const allStreetFoodAudioTexts = new Set([...streetFoodProblemBank.map(p => p.order.orderText), ...streetFoodProblemBank.map(p => `${p.order.payment} xu trừ ${p.order.total} xu bằng mấy xu?`), "Tổng cộng là bao nhiêu xu?", "Vừa đủ rồi, không cần thối tiền.", "Đồ ăn nóng hổi đây ạ! Chúc quý khách ngon miệng!", "Ngon quá! Hết bao nhiêu tiền vậy Gốm?", ...Object.values(STREET_FOOD_MENU).flatMap(item => item.steps.map(s => s.instruction))]);
const allBunnyRescueAudioTexts = new Set(["Bạn Thỏ Bông đang đợi ở cuối đường. Gốm ơi cứu tớ với!", "Bạn Thỏ Bông đang đợi ở cuối đường. Mỗi lần con tính đúng, con sẽ đặt thêm một viên đá để đi gần tới bạn Thỏ hơn nhé.", "Mình cùng đếm lại nhé!", "Hay quá! Nhảy một bước nào.", "Chưa đúng rồi, bạn Thỏ đang đợi, thử lại nhé.", "Tuyệt vời! Gốm đã cứu được Thỏ rồi.", "Cảm ơn Gốm đã cứu tớ nhé! Bạn thật tốt bụng."]);
const allGardenMemoryAudioTexts = new Set([...gardenMemoryScenes.map(s => s.intro_sentence), 'Hãy xem lại nhé!', ...gardenMemoryScenes.flatMap(s => s.questions.map(q => q.questionText))]);
const allCapybaraRescueAudioTexts = new Set([...capybaraAudioTexts, "Cảm ơn Gốm đã lấy bóng giúp tớ! Gốm giỏi quá!"]);
const timeAdventureAllAudioTexts = new Set(timeAdventureQuestions.map(q => q.questionText));
const weatherExplorerAudioTexts = new Set(weatherAudioTexts);
const writingGameAudioTexts = new Set([
    "Bé muốn tập viết chữ gì nào?",
    "Chúc mừng bé đã hoàn thành bài học!",
    "0977 670 306",
    "082 221 7493",
    "113",
    "114",
    "115",
    ...WRITING_WORDS.flatMap(c => c.words.map(w => w.label)),
    ...WRITING_WORDS.flatMap(c => c.words.flatMap(w => w.charIds.map(id => {
        const charCode = id.startsWith('num') ? `Số ${id.split('_')[1]}` : `Chữ ${id.split('_')[1]}`;
        return charCode;
    })))
]);

// --- Catch Game Audio Texts ---
const catchGameAudioTexts = new Set([
    "Chào mừng bé đến với trò chơi Hứng Chữ Số! Bé hãy chọn chủ đề nhé.",
    "Toán Học", "So Sánh", "Ghép Từ", "Chữ Cái Đầu", "Số Đếm", "Động Vật", "Thiên Nhiên", "Tổng Hợp", "Gia Đình",
    "Cộng", "Trừ", "Bằng", "Lớn hơn", "Bé hơn", "Bằng mấy",
    "Hứng tự do!",
    "Ngôi sao may mắn!",
    "Điền chữ còn thiếu cho từ",
    "bắt đầu bằng chữ gì?",
    "như thế nào so với",
    "Sai rồi"
]);

// --- Online Shopping Audio ---
const onlineShoppingAudioTexts = new Set([
    "Gốm ơi, lên mạng mua quà nào!",
    "Con hãy chọn 2 món đồ chơi nhé.",
    "Alo, Gốm ơi! Chú shipper đến rồi.",
    "Giao hàng cho bé Gốm đây! Con hãy mở hộp ra nhé!",
    "Gốm ơi, ra nhận hàng và thanh toán tiền cho chú nhé!",
    "Con tính xem hết bao nhiêu tiền?",
    "Cảm ơn shop! Hàng đẹp quá.",
    "Gấu Bông Hồng", "Búp Bê Xinh Xắn", "Cặp Sách Hồng", "Hộp Bút Màu", "Kẹp Tóc Xinh", "Váy Công Chúa", "Vở Tập Tô", "Hộp Đựng Bút",
    "Mũ Điệu Đà", "Giày Búp Bê", "Gối Ôm Mềm", "Đàn Đồ Chơi"
]);

// --- Piano Audio ---
const pianoAudioTexts = new Set([
    "Bé hãy đánh bài Happy Birthday 🎂 nhé!",
    "Bé hãy đánh bài Twinkle Twinkle ✨ nhé!",
    "Bé hãy đánh bài Jingle Bells 🔔 nhé!",
    "Bé hãy đánh bài Mary Had a Little Lamb 🐑 nhé!",
    "Bé hãy đánh bài Baby Shark 🦈 nhé!",
    "Tuyệt vời! Bé đã hoàn thành bài nhạc!",
    "Cố lên bé ơi, thử lại nốt này nhé!",
    "Bé hãy đánh bài Một Con Vịt 🦆 nhé!",
    "Bé hãy đánh bài Con Cò 🐦 nhé!",
    "Hoan hô! Bé giỏi quá!"
]);

const initializeAssets = (): Record<string, AssetItem> => {
    const initialAssets: Record<string, AssetItem> = {};

    imagePrompts.forEach(item => {
        initialAssets[item.filename] = {
            type: 'image',
            key: item.filename,
            name: item.word,
            promptItem: item,
            status: 'checking',
            data: null,
            error: null,
            referenceImage: null,
            selectedEffect: null,
            url: getImagePath(item),
        };
    });

    const audioCollection = new Map<string, { name: string, language: 'vi' | 'en' }>();
    const addAudio = (name: string, language: 'vi' | 'en') => {
        const key = `${language}-${name.toLowerCase()}`;
        if (name && !audioCollection.has(key)) {
            audioCollection.set(key, { name, language });
        }
    };

    const allAudioSets = [
        { lang: 'vi', texts: feedbackAudioTexts },
        { lang: 'vi', texts: mathWordsAudioTexts },
        { lang: 'vi', texts: mathFullAudioTexts },
        { lang: 'vi', texts: feedingAudioTexts },
        { lang: 'vi', texts: bakeryAudioTexts },
        { lang: 'vi', texts: spellingRobotAudioTexts },
        { lang: 'vi', texts: commonVnWordsAudioTexts },
        { lang: 'vi', texts: fillBlankAudioTexts },
        { lang: 'vi', texts: princessCodeAudioTexts },
        { lang: 'vi', texts: allRestaurantAudioTexts },
        { lang: 'vi', texts: allStreetFoodAudioTexts },
        { lang: 'vi', texts: allBunnyRescueAudioTexts },
        { lang: 'vi', texts: allGardenMemoryAudioTexts },
        { lang: 'vi', texts: allCapybaraRescueAudioTexts },
        { lang: 'vi', texts: timeAdventureAllAudioTexts },
        { lang: 'vi', texts: onlineShoppingAudioTexts },
        { lang: 'vi', texts: weatherExplorerAudioTexts },
        { lang: 'vi', texts: writingGameAudioTexts },
        { lang: 'vi', texts: catchGameAudioTexts },
        { lang: 'vi', texts: pianoAudioTexts }, // Added Piano texts
        { lang: 'en', texts: englishAudioTexts },
    ];

    allAudioSets.forEach(({ lang, texts }) => {
        texts.forEach(text => addAudio(text, lang as 'vi' | 'en'));
    });

    audioCollection.forEach(({ name, language }) => {
        const filename = sanitizeFilename(name, 'wav');
        let subfolder: string | undefined;
        if (allRestaurantAudioTexts.has(name)) subfolder = 'nhahang';
        else if (allStreetFoodAudioTexts.has(name)) subfolder = 'nauan';
        else if (allGardenMemoryAudioTexts.has(name)) subfolder = 'khuvuon';
        else if (allBunnyRescueAudioTexts.has(name)) subfolder = 'bantho';
        else if (allCapybaraRescueAudioTexts.has(name)) subfolder = 'bongbay';
        else if (timeAdventureAllAudioTexts.has(name)) subfolder = 'thoitiet';
        else if (onlineShoppingAudioTexts.has(name)) subfolder = 'muasam';
        else if (newEnglishAudioTexts.has(name)) subfolder = 'english';
        else if (weatherExplorerAudioTexts.has(name)) subfolder = 'khampha';
        else if (writingGameAudioTexts.has(name)) subfolder = 'chucai';
        else if (catchGameAudioTexts.has(name)) subfolder = 'chucai';
        else if (pianoAudioTexts.has(name)) subfolder = 'piano'; // New subfolder

        const key = `audio_${language}_${name.replace(/\s/g, '_')}`;
        initialAssets[key] = {
            type: 'audio',
            key, name, language, filename, status: 'checking', data: null, error: null,
            subfolder,
            url: `${ASSET_BASE_URL}/audio/${subfolder ? subfolder + '/' : ''}${filename}`
        };
    });

    SOUNDS.forEach(name => {
        const key = `ui_sound_${name}`;
        initialAssets[key] = {
            type: 'ui_sound', key, name, filename: sanitizeFilename(name, 'wav'), status: 'exists',
            data: soundData[name].split(',')[1], error: null, url: soundData[name]
        };
    });

    return initialAssets;
};

const categorizeAssets = (assetList: AssetItem[]): Record<GameCategoryKey, { title: string, assets: AssetItem[] }> => {
    const categories: Record<GameCategoryKey, { title: string, assets: AssetItem[] }> = {
        covers_home: { title: 'Màn hình chính (Bìa game)', assets: [] },
        images_vn_common: { title: 'Game Học Chữ (Hình ảnh)', assets: [] },
        images_feeding: { title: 'Game Cho Thú Ăn (Hình ảnh)', assets: [] },
        images_bakery: { title: 'Game Tiệm Bánh (Hình ảnh)', assets: [] },
        images_math: { title: 'Toán Học (Hình ảnh số & dấu)', assets: [] },
        images_memory_math: { title: 'Game Lật Thẻ (Hình ảnh)', assets: [] },
        images_english: { title: 'Game Tiếng Anh (Hình ảnh)', assets: [] },
        images_princess_code: { title: 'Game Mật Mã Công Chúa (Hình ảnh)', assets: [] },
        images_restaurant: { title: 'Game Nhà Hàng Gốm (Hình ảnh)', assets: [] },
        images_street_food: { title: 'Game Quầy Streetfood (Hình ảnh)', assets: [] },
        images_bunny_rescue: { title: 'Game Đường Cứu Bạn Thỏ (Hình ảnh)', assets: [] },
        images_garden_memory: { title: 'Game Khu Vườn Gốm (Hình ảnh)', assets: [] },
        images_capybara_rescue: { title: 'Game Giải Cứu Bóng Bay (Hình ảnh)', assets: [] },
        images_time_adventure: { title: 'Game Khám Phá Thời Gian (Hình ảnh)', assets: [] },
        images_online_shopping: { title: 'Game Mua Sắm Online (Hình ảnh)', assets: [] },
        images_weather_explorer: { title: 'Game Bé Khám Phá Thời Tiết (Hình ảnh)', assets: [] },
        images_writing: { title: 'Game Bé Tập Viết (Hình ảnh /chucai/)', assets: [] },
        stickers: { title: 'Sổ Dán Hình (Stickers)', assets: [] },
        audio_feeding: { title: 'Game Cho Thú Ăn (Âm thanh)', assets: [] },
        audio_bakery: { title: 'Game Tiệm Bánh (Âm thanh)', assets: [] },
        audio_math_full: { title: 'Game Toán (Âm thanh - Câu hoàn chỉnh)', assets: [] },
        audio_math_words: { title: 'Game Toán (Âm thanh - Từ đơn)', assets: [] },
        audio_spelling_robot: { title: 'Game Học Đánh Vần (Âm thanh)', assets: [] },
        audio_fill_blank: { title: 'Game Điền Chữ (Âm thanh)', assets: [] },
        audio_vn_common_words: { title: 'Game Học Chữ (Âm thanh)', assets: [] },
        audio_english_words: { title: 'Game Tiếng Anh (Âm thanh - Từ & Câu)', assets: [] },
        audio_english_story: { title: 'Game Gia Đình Gốm (Âm thanh - /giadinhgom/)', assets: [] },
        audio_princess_code: { title: 'Game Mật Mã Công Chúa (Âm thanh)', assets: [] },
        audio_restaurant: { title: 'Game Nhà Hàng Gốm (Âm thanh)', assets: [] },
        audio_street_food: { title: 'Game Quầy Streetfood (Âm thanh)', assets: [] },
        audio_bunny_rescue: { title: 'Game Đường Cứu Bạn Thỏ (Âm thanh)', assets: [] },
        audio_garden_memory: { title: 'Game Khu Vườn Gốm (Âm thanh)', assets: [] },
        audio_capybara_rescue: { title: 'Game Giải Cứu Bóng Bay (Âm thanh)', assets: [] },
        audio_time_adventure: { title: 'Game Khám Phá Thời Gian (Âm thanh)', assets: [] },
        audio_online_shopping: { title: 'Game Mua Sắm Online (Âm thanh)', assets: [] },
        audio_weather_explorer: { title: 'Game Bé Khám Phá Thời Tiết (Âm thanh)', assets: [] },
        audio_writing_game: { title: 'Game Bé Tập Viết (Âm thanh /chucai/)', assets: [] },
        audio_catch_game: { title: 'Game Hứng Chữ Số (Âm thanh /chucai/)', assets: [] },
        audio_piano: { title: 'Game Đàn Piano (Âm thanh /piano/)', assets: [] }, // NEW CATEGORY
        audio_common_feedback: { title: 'Âm thanh Phản hồi Chung', assets: [] },
        audio_common_effects: { title: 'Âm thanh Hiệu ứng (UI)', assets: [] },
    };

    assetList.forEach(asset => {
        if (asset.type === 'image') {
            switch (asset.promptItem.game) {
                case 'cover': categories.covers_home.assets.push(asset); break;
                case 'sticker': categories.stickers.assets.push(asset); break;
                case 'english': categories.images_english.assets.push(asset); break;
                case 'bakery': categories.images_bakery.assets.push(asset); break;
                case 'feeding': categories.images_feeding.assets.push(asset); break;
                case 'math_visual': categories.images_math.assets.push(asset); break;
                case 'memory_math': categories.images_memory_math.assets.push(asset); break;
                case 'princess_code': categories.images_princess_code.assets.push(asset); break;
                case 'restaurant': categories.images_restaurant.assets.push(asset); break;
                case 'street_food': categories.images_street_food.assets.push(asset); break;
                case 'bunny_rescue': categories.images_bunny_rescue.assets.push(asset); break;
                case 'garden_memory': categories.images_garden_memory.assets.push(asset); break;
                case 'capybara_rescue': categories.images_capybara_rescue.assets.push(asset); break;
                case 'time_adventure': categories.images_time_adventure.assets.push(asset); break;
                case 'online_shopping': categories.images_online_shopping.assets.push(asset); break;
                case 'weather_explorer': categories.images_weather_explorer.assets.push(asset); break;
                case 'writing': categories.images_writing.assets.push(asset); break;
                case 'common': categories.images_vn_common.assets.push(asset); break;
            }
        } else if (asset.type === 'audio') {
            switch (asset.subfolder) {
                case 'giadinhgom': categories.audio_english_story.assets.push(asset); return;
                case 'nhahang': categories.audio_restaurant.assets.push(asset); return;
                case 'nauan': categories.audio_street_food.assets.push(asset); return;
                case 'khuvuon': categories.audio_garden_memory.assets.push(asset); return;
                case 'bantho': categories.audio_bunny_rescue.assets.push(asset); return;
                case 'bongbay': categories.audio_capybara_rescue.assets.push(asset); return;
                case 'thoitiet': categories.audio_time_adventure.assets.push(asset); return;
                case 'english': categories.audio_english_words.assets.push(asset); return;
                case 'muasam': categories.audio_online_shopping.assets.push(asset); return;
                case 'khampha': categories.audio_weather_explorer.assets.push(asset); return;
                case 'chucai':
                    if (catchGameAudioTexts.has(asset.name)) {
                        categories.audio_catch_game.assets.push(asset);
                    } else {
                        categories.audio_writing_game.assets.push(asset);
                    }
                    return;
                case 'piano':
                    categories.audio_piano.assets.push(asset);
                    return;
            }
            if (englishAudioTexts.has(asset.name)) categories.audio_english_words.assets.push(asset);
            else if (feedingAudioTexts.has(asset.name)) categories.audio_feeding.assets.push(asset);
            else if (bakeryAudioTexts.has(asset.name)) categories.audio_bakery.assets.push(asset);
            else if (mathFullAudioTexts.has(asset.name)) categories.audio_math_full.assets.push(asset);
            else if (mathWordsAudioTexts.has(asset.name)) categories.audio_math_words.assets.push(asset);
            else if (spellingRobotAudioTexts.has(asset.name)) categories.audio_spelling_robot.assets.push(asset);
            else if (fillBlankAudioTexts.has(asset.name)) categories.audio_fill_blank.assets.push(asset);
            else if (princessCodeAudioTexts.has(asset.name)) categories.audio_princess_code.assets.push(asset);
            else if (feedbackAudioTexts.has(asset.name)) categories.audio_common_feedback.assets.push(asset);
            else if (commonVnWordsAudioTexts.has(asset.name)) categories.audio_vn_common_words.assets.push(asset);
            else if (allCapybaraRescueAudioTexts.has(asset.name)) categories.audio_capybara_rescue.assets.push(asset);
            else if (timeAdventureAllAudioTexts.has(asset.name)) categories.audio_time_adventure.assets.push(asset);
            else if (onlineShoppingAudioTexts.has(asset.name)) categories.audio_online_shopping.assets.push(asset);
            else if (weatherExplorerAudioTexts.has(asset.name)) categories.audio_weather_explorer.assets.push(asset);
            else if (writingGameAudioTexts.has(asset.name)) categories.audio_writing_game.assets.push(asset);
            else categories.audio_common_effects.assets.push(asset);
        } else { // ui_sound
            categories.audio_common_effects.assets.push(asset);
        }
    });

    for (const key in categories) {
        categories[key as GameCategoryKey].assets.sort((a, b) => a.name.localeCompare(b.name));
    }

    return categories;
};


// --- Main Component ---
const ResourceGenerator: React.FC<{ onGoHome: () => void; isSoundOn: boolean; }> = ({ onGoHome, isSoundOn }) => {
    const [assets, setAssets] = useState<Record<string, AssetItem>>(initializeAssets);
    const [englishStoryAudioAssets, setEnglishStoryAudioAssets] = useState<AudioAsset[]>([]);
    const [isCheckingFiles, setIsCheckingFiles] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [generatingCategoryKey, setGeneratingCategoryKey] = useState<GameCategoryKey | 'all_images' | 'all_audio' | null>(null);
    const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
    const [hideCompletedCategories, setHideCompletedCategories] = useState(false);
    const [charRefs, setCharRefs] = useState<Record<string, string>>({}); // State for shared character references

    // List of characters that need shared references
    const uniqueCharacters = useMemo(() => {
        const ids = new Set<string>();
        imagePrompts.forEach(p => {
            if (p.characterId) ids.add(p.characterId);
        });
        return Array.from(ids);
    }, []);

    useEffect(() => {
        const analyzeAndCheckFiles = async () => {
            const sentenceSet = new Set<string>();
            // Mode: single
            for (const char of familyVocab) {
                const availableActions = characterActionMap[char.id!] || [];
                for (const actionId of availableActions) {
                    const action = singlePersonActions[actionId];
                    if (action) getStorySentences('single', char, null, action, null).forEach(s => sentenceSet.add(s));
                }
            }
            // Mode: pair
            for (let i = 0; i < familyVocab.length; i++) {
                for (let j = i + 1; j < familyVocab.length; j++) {
                    const char1 = familyVocab[i]; const char2 = familyVocab[j];
                    for (const actionKey in pairActions) {
                        getStorySentences('pair', char1, char2, pairActions[actionKey], null).forEach(s => sentenceSet.add(s));
                    }
                }
            }
            // Mode: two_separate
            for (let i = 0; i < familyVocab.length; i++) {
                for (let j = 0; j < familyVocab.length; j++) {
                    if (i === j) continue;
                    const char1 = familyVocab[i]; const char2 = familyVocab[j];
                    const actions1 = characterActionMap[char1.id!] || [];
                    const actions2 = characterActionMap[char2.id!] || [];
                    for (const action1Id of actions1) {
                        for (const action2Id of actions2) {
                            const action1 = singlePersonActions[action1Id]; const action2 = singlePersonActions[action2Id];
                            if (action1 && action2) getStorySentences('two_separate', char1, char2, action1, action2).forEach(s => sentenceSet.add(s));
                        }
                    }
                }
            }

            const dynamicAudioAssets: AudioAsset[] = Array.from(sentenceSet).map(sentence => {
                const filename = sanitizeFilename(sentence, 'wav');
                const key = `audio_en_story_${filename}`;
                return { type: 'audio', key, name: sentence, language: 'en', filename, status: 'checking', data: null, error: null, subfolder: 'giadinhgom', url: `${ASSET_BASE_URL}/audio/giadinhgom/${filename}` };
            });

            const assetsToCheck: AssetItem[] = [...(Object.values(assets) as AssetItem[]).filter(a => a.status === 'checking'), ...dynamicAudioAssets];
            const checks = assetsToCheck.map(asset =>
                fetch(asset.url, { method: 'HEAD', cache: 'no-store' })
                    .then(response => ({ key: asset.key, exists: response.ok }))
                    .catch(() => ({ key: asset.key, exists: false }))
            );

            const results = await Promise.all(checks);
            const statusMap: Map<string, AssetStatus> = new Map(results.map(r => [r.key, r.exists ? 'exists' : 'pending']));

            setAssets(prev => {
                const newAssets = { ...prev };
                Object.keys(newAssets).forEach(key => {
                    if (statusMap.has(key)) {
                        newAssets[key].status = statusMap.get(key)!;
                    }
                });
                return newAssets;
            });

            const finalDynamicAssets = dynamicAudioAssets.map(asset => ({ ...asset, status: statusMap.get(asset.key) || 'pending' }));
            setEnglishStoryAudioAssets(finalDynamicAssets);

            setIsCheckingFiles(false);
            setIsAnalyzing(false);
        };
        analyzeAndCheckFiles();
    }, []); // Only run once on mount

    const assetList = useMemo<AssetItem[]>(() => [...(Object.values(assets) as AssetItem[]), ...englishStoryAudioAssets], [assets, englishStoryAudioAssets]);
    const assetsByCategory = useMemo(() => categorizeAssets(assetList), [assetList]);

    const updateAssetState = (key: string, updates: Partial<AssetItem>) => {
        const isDynamic = key.startsWith('audio_en_story_');
        if (isDynamic) {
            setEnglishStoryAudioAssets(prev => prev.map(a => a.key === key ? { ...a, ...updates } as AudioAsset : a));
        } else {
            setAssets(prev => ({ ...prev, [key]: { ...prev[key], ...updates } as AssetItem }));
        }
    };

    const handleCharRefUpload = (charId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCharRefs(prev => ({ ...prev, [charId]: event.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async (asset: ImageAsset | AudioAsset, playClick = true) => {
        if (playClick) playSound('click', isSoundOn);

        updateAssetState(asset.key, { status: 'loading', error: null });
        try {
            let base64Data: string;
            if (asset.type === 'image') {
                let finalPrompt = asset.promptItem.prompt;
                if (asset.selectedEffect) finalPrompt += `, ${asset.selectedEffect}`;

                // Determine which reference image to use
                // Priority: 1. Explicit row override (asset.referenceImage), 2. Shared Character Ref
                const refImage = asset.referenceImage || (asset.promptItem.characterId ? charRefs[asset.promptItem.characterId] : null);

                if (refImage) {
                    // If using reference image, we MUST use referencePrompt if available, otherwise prompt
                    const promptText = asset.promptItem.referencePrompt || finalPrompt;

                    const [header, data] = refImage.split(',');
                    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
                    base64Data = await generateImageWithReference(promptText, data, mimeType);
                } else {
                    // Standard text-to-image
                    base64Data = await generateImageFromText(finalPrompt);
                }
            } else { // Audio
                base64Data = await generateSpeech(asset.name, asset.language);
            }
            updateAssetState(asset.key, { status: 'generated', data: base64Data });
        } catch (err) {
            updateAssetState(asset.key, { status: 'error', error: err instanceof Error ? err.message : 'Lỗi không xác định' });
            throw err;
        }
    };

    const handlePlayAudio = async (base64Data: string) => {
        if (!isSoundOn || !base64Data) return;
        try {
            const pcmBytes = decodeBase64(base64Data);
            const audioBuffer = await decodePcmAudioData(pcmBytes);
            playAudioBuffer(audioBuffer);
        } catch (error) { console.error("Failed to play audio:", error); }
    };

    const handleDownload = (asset: AssetItem) => {
        if (!asset.data) return;
        const filename = asset.type === 'image' ? asset.promptItem.filename : asset.filename;
        if (asset.type === 'image') {
            downloadFile(`data:image/png;base64,${asset.data}`, filename);
        } else { // Audio or UI Sound
            const isPcm = asset.type === 'audio';
            const bytes = decodeBase64(asset.data);
            const blob = isPcm ? createWavBlob(bytes) : new Blob([bytes as any], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            downloadFile(url, filename);
            URL.revokeObjectURL(url);
        }
    };

    const handleBulkGenerate = async (key: GameCategoryKey | 'all_images' | 'all_audio', assetsToProcess: AssetItem[]) => {
        playSound('click', isSoundOn);
        const pendingAssets = assetsToProcess.filter((a): a is (ImageAsset | AudioAsset) => {
            return (a.type === 'image' || a.type === 'audio') && (a.status === 'pending' || a.status === 'error');
        });
        if (pendingAssets.length === 0) return alert('Không có tài nguyên nào cần tạo trong mục này.');

        setGeneratingCategoryKey(key);
        setGenerationProgress({ current: 0, total: pendingAssets.length });

        for (const asset of pendingAssets) {
            try {
                await handleGenerate(asset, false);
            } catch (e) {
                console.error(`Lỗi hàng loạt cho ${asset.key}:`, e);
            } finally {
                setGenerationProgress(prev => ({ ...prev, current: prev.current + 1 }));
            }
        }
        setGeneratingCategoryKey(null);
    };

    const handleBulkDownload = async (assetsToDownload: AssetItem[]) => {
        playSound('click', isSoundOn);
        const generatedAssets = assetsToDownload.filter((a): a is AssetItem => a.status === 'generated' && !!a.data);
        if (generatedAssets.length === 0) return alert('Không có tài nguyên mới nào được tạo để tải về.');

        for (const asset of generatedAssets) {
            handleDownload(asset);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    };

    const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateAssetState(key, { referenceImage: event.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadFile = (key: string, file: File) => {
        playSound('click', isSoundOn);
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Url = event.target?.result as string;
            const base64Data = base64Url.split(',')[1];
            updateAssetState(key, {
                status: 'generated',
                data: base64Data,
                error: null,
            });
        };
        reader.onerror = (error) => {
            console.error("File reading error:", error);
            updateAssetState(key, { status: 'error', error: 'Lỗi đọc file.' });
        };
        reader.readAsDataURL(file);
    };

    const allImages = assetList.filter(a => a.type === 'image');
    const allAudios = assetList.filter(a => a.type === 'audio' || a.type === 'ui_sound');
    const imageEffects = ['High-quality sticker style', 'Whimsical 3D animation style, Pixar-inspired', 'Soft watercolor illustration', 'Cute storybook illustration'];
    const showLoading = isCheckingFiles || isAnalyzing;

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="w-full bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-xl p-6 relative">
                <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors z-10"><HomeIcon className="w-10 h-10" /></button>
                <h2 className="text-4xl font-bold text-center text-purple-700 mb-2 mt-12">Quản lý & Tạo Tài nguyên</h2>
                <p className="text-center text-lg text-gray-600 mb-4">Tự động kiểm tra, tạo và tải tài nguyên còn thiếu cho từng game.</p>
                {showLoading && <p className="text-center text-purple-600 font-semibold animate-pulse">Đang phân tích và kiểm tra file trên server...</p>}

                <div className="flex justify-center items-center gap-4 mb-6">
                    <label htmlFor="hide-completed-toggle" className="text-lg font-medium text-gray-700 cursor-pointer">Ẩn các mục đã hoàn thành</label>
                    <button
                        id="hide-completed-toggle"
                        onClick={() => setHideCompletedCategories(prev => !prev)}
                        className={`relative inline-flex items-center h-8 rounded-full w-16 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${hideCompletedCategories ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                        aria-pressed={hideCompletedCategories}
                    >
                        <span className="sr-only">Ẩn các mục đã hoàn thành</span>
                        <span
                            className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${hideCompletedCategories ? 'translate-x-9' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>

                {/* NEW: Shared Character Reference Section */}
                <div className="p-4 mb-6 bg-pink-50 rounded-2xl border border-pink-200">
                    <h3 className="text-2xl font-bold text-center text-pink-600 mb-4">Cấu hình Ảnh Nhân Vật (Dùng chung)</h3>
                    <p className="text-center text-sm text-gray-600 mb-4">Tải ảnh thật của bé và người thân lên đây. Hệ thống sẽ dùng ảnh này để tạo ra nhân vật hoạt hình cho tất cả các hành động tương ứng.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {uniqueCharacters.map(charId => (
                            <div key={charId} className="flex flex-col items-center bg-white p-3 rounded-xl shadow-sm border border-pink-100">
                                <p className="font-bold text-purple-800 mb-2">{CHAR_NAMES[charId] || charId}</p>
                                <div className="w-20 h-20 bg-gray-100 rounded-full mb-2 overflow-hidden flex items-center justify-center border-2 border-gray-200">
                                    {charRefs[charId] ? (
                                        <img src={charRefs[charId]} alt={charId} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400 text-xs text-center px-1">Chưa có ảnh</span>
                                    )}
                                </div>
                                <label className="cursor-pointer bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-1 px-3 rounded-full transition-colors">
                                    Tải ảnh
                                    <input type="file" accept="image/*" onChange={(e) => handleCharRefUpload(charId, e)} className="hidden" />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className="p-4 mb-6 bg-purple-50 rounded-2xl border border-purple-200">
                    <h3 className="text-2xl font-bold text-center text-purple-700 mb-4">Chức năng hàng loạt</h3>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button onClick={() => handleBulkGenerate('all_images', allImages)} disabled={!!generatingCategoryKey || showLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400">
                            {generatingCategoryKey === 'all_images' ? `Đang tạo... (${generationProgress.current}/${generationProgress.total})` : 'Tạo tất cả Hình ảnh'}
                        </button>
                        <button onClick={() => handleBulkGenerate('all_audio', allAudios)} disabled={!!generatingCategoryKey || showLoading} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400">
                            {generatingCategoryKey === 'all_audio' ? `Đang tạo... (${generationProgress.current}/${generationProgress.total})` : 'Tạo tất cả Âm thanh'}
                        </button>
                        <button onClick={() => handleBulkDownload(assetList)} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg">
                            Tải về tất cả file mới
                        </button>
                    </div>
                </div>

                <div className="space-y-8 mt-4">
                    {(Object.keys(assetsByCategory) as GameCategoryKey[]).map(categoryKey => {
                        const { title, assets: categoryAssets } = assetsByCategory[categoryKey];
                        if (!categoryAssets || categoryAssets.length === 0) return null;

                        const isCompleted = categoryAssets.every(asset => asset.status === 'exists' || asset.type === 'ui_sound');
                        if (hideCompletedCategories && isCompleted) {
                            return null;
                        }

                        const isGeneratingThisCategory = generatingCategoryKey === categoryKey;

                        return (
                            <div key={categoryKey} className="border-t-2 pt-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                    <h3 className="text-3xl font-bold text-pink-600 flex items-center gap-3">
                                        {title}
                                        {isCompleted && !showLoading && <CheckCircleIcon className="w-8 h-8 text-green-500" />}
                                    </h3>
                                    <div className="flex gap-2 mt-2 sm:mt-0">
                                        <button onClick={() => handleBulkGenerate(categoryKey, categoryAssets)} disabled={!!generatingCategoryKey || showLoading || categoryKey === 'audio_common_effects'} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors disabled:bg-gray-400">
                                            {isGeneratingThisCategory ? `Đang tạo... (${generationProgress.current}/${generationProgress.total})` : 'Tạo mục này'}
                                        </button>
                                        <button onClick={() => handleBulkDownload(categoryAssets)} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg text-sm">Tải file mới tạo</button>
                                    </div>
                                </div>
                                {categoryAssets.map(asset => (
                                    <div key={asset.key} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center bg-gray-50 p-3 rounded-lg shadow-sm mb-2">
                                        <div className="md:col-span-2">
                                            <p className="font-bold text-lg text-purple-800 capitalize">
                                                {asset.name}
                                                {asset.type === 'image' && asset.promptItem.characterId && (
                                                    <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                                                        {CHAR_NAMES[asset.promptItem.characterId] || asset.promptItem.characterId}
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500 font-mono">{asset.type === 'image' ? asset.promptItem.filename : asset.filename}</p>
                                        </div>
                                        <div className="md:col-span-2 flex items-center justify-center gap-4">
                                            <div className="flex flex-col gap-2 w-full">
                                                {asset.type === 'image' && asset.promptItem.referencePrompt && (
                                                    <div className="flex flex-col gap-2">
                                                        {/* Only show specific upload if user wants to override shared ref, or imply shared usage */}
                                                        {asset.promptItem.characterId && charRefs[asset.promptItem.characterId] && !asset.referenceImage && (
                                                            <p className="text-xs text-green-600 italic">Đang dùng ảnh chung của {CHAR_NAMES[asset.promptItem.characterId]}</p>
                                                        )}
                                                        <label className="text-sm font-semibold text-gray-700">
                                                            {asset.referenceImage ? "Ảnh riêng (Override):" : "Tải ảnh riêng (nếu cần):"}
                                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(asset.key, e)} className="text-xs ml-2" />
                                                        </label>
                                                        <div className="flex flex-wrap gap-1">
                                                            {imageEffects.map(effect => (
                                                                <button key={effect} onClick={() => updateAssetState(asset.key, { selectedEffect: asset.selectedEffect === effect ? null : effect })} className={`px-2 py-1 text-xs rounded-full ${asset.selectedEffect === effect ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                                                    {effect.split(',')[0]}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {(asset.type === 'image' || asset.type === 'audio') && (
                                                    <>
                                                        <input
                                                            type="file"
                                                            id={`upload-${asset.key}`}
                                                            className="hidden"
                                                            accept={asset.type === 'image' ? 'image/*' : 'audio/wav'}
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    handleUploadFile(asset.key, file);
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`upload-${asset.key}`}
                                                            className="w-full text-center cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                                        >
                                                            Tải lên thay thế
                                                        </label>
                                                        <button onClick={() => handleGenerate(asset as ImageAsset | AudioAsset)} disabled={asset.status === 'loading' || !!generatingCategoryKey} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 transition-colors">
                                                            {asset.status === 'loading' ? 'Đang tạo...' : 'Tạo / Tạo lại'}
                                                        </button>
                                                    </>
                                                )}
                                                {(asset.status === 'generated' || asset.type === 'ui_sound') && asset.data && (
                                                    <button onClick={() => handleDownload(asset)} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Tải về</button>
                                                )}
                                                {(asset.type === 'audio' || asset.type === 'ui_sound') && asset.data && (
                                                    <button onClick={() => handlePlayAudio(asset.data!)} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                                        <SpeakerIcon className="w-5 h-5" /> Nghe
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-1 flex flex-col items-center justify-center w-28 h-28 bg-white rounded-md shadow-inner mx-auto p-2 relative">
                                            {(() => {
                                                const StatusIndicator = () => {
                                                    switch (asset.status) {
                                                        case 'checking': return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>;
                                                        case 'loading': return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>;
                                                        case 'exists': return <div className="text-center"><span className="text-4xl" role="img" aria-label="Có">✅</span><p className="text-xs font-semibold text-green-700 mt-1">Có</p></div>;
                                                        case 'generated': return <div className="text-center"><span className="text-4xl" role="img" aria-label="Mới tạo">🟢</span><p className="text-xs font-semibold text-green-600 mt-1">Mới tạo</p></div>;
                                                        case 'pending': return <div className="text-center"><span className="text-4xl" role="img" aria-label="Không có">❌</span><p className="text-xs font-semibold text-red-600 mt-1">Không có</p></div>;
                                                        case 'error': return <p className="text-red-500 text-center text-xs">{asset.error}</p>;
                                                        default: return null;
                                                    }
                                                };

                                                if (asset.type === 'image') {
                                                    const imageUrl = asset.data ? `data:image/png;base64,${asset.data}` : asset.referenceImage || (asset.status === 'exists' ? asset.url : null);
                                                    if (imageUrl) {
                                                        return <img src={imageUrl} alt={asset.name} className="w-full h-full object-contain rounded-md" />;
                                                    }
                                                }
                                                return <StatusIndicator />;
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ResourceGenerator;
