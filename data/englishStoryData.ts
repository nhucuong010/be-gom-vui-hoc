import type { VocabularyItem } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

// This data was moved from EnglishStoryGame.tsx to break a module dependency cycle.
export const familyVocab: readonly VocabularyItem[] = [
  { id: 'dad', word: 'dad', sentence: 'This is my dad.', vietnamese: 'Ba Cương', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-cuong.png`, gender: 'male' },
  { id: 'mom', word: 'mom', sentence: 'This is my mom.', vietnamese: 'Mẹ Hương', imageUrl: `${ASSET_BASE_URL}/assets/images/me-huong.png`, gender: 'female' },
  { id: 'sister', word: 'Gốm', sentence: 'This is me, Gốm.', vietnamese: 'Chị Gốm', imageUrl: `${ASSET_BASE_URL}/assets/images/gom-sac.png`, gender: 'female' },
  { id: 'baby_brother', word: 'baby brother', sentence: 'This is my baby brother.', vietnamese: 'Em Gạo', imageUrl: `${ASSET_BASE_URL}/assets/images/gao-nang.png`, gender: 'male' },
  { id: 'grandpa', word: 'grandpa', sentence: 'This is my grandpa.', vietnamese: 'Ông Nội', imageUrl: `${ASSET_BASE_URL}/assets/images/ong-khoa.png`, gender: 'male' },
  { id: 'grandma', word: 'grandma', sentence: 'This is my grandma.', vietnamese: 'Bà Nội', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-thom.png`, gender: 'female' },
  { id: 'grandma_bup', word: 'grandma', sentence: 'This is my grandma.', vietnamese: 'Bà Ngoại', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-bup.png`, gender: 'female' },
  { id: 'cousin_xoai', word: 'cousin', sentence: 'This is my cousin.', vietnamese: 'Anh Xoài', imageUrl: `${ASSET_BASE_URL}/assets/images/anh-xoai.png`, gender: 'male' },
  { id: 'cousin_na', word: 'cousin', sentence: 'This is my cousin.', vietnamese: 'Chị Na', imageUrl: `${ASSET_BASE_URL}/assets/images/chi-na.png`, gender: 'female' },
  { id: 'cousin_gam', word: 'cousin', sentence: 'This is my cousin.', vietnamese: 'Em Gấm', imageUrl: `${ASSET_BASE_URL}/assets/images/em-gam.png`, gender: 'female' },
];

export const singlePersonActions: Record<string, VocabularyItem> = {
  'introducing_self': { id: 'introducing_self', word: 'introducing myself', vietnamese: 'Giới thiệu bản thân', imageUrl: `${ASSET_BASE_URL}/assets/images/gom-sac.png`, sentence: 'I am a happy girl.', gender: 'female' },
  'reading_book': { id: 'reading_book', word: 'reading a book', vietnamese: 'Đọc sách', imageUrl: `${ASSET_BASE_URL}/assets/images/sach-sac.png`, sentence: '{pronoun} is reading a book.', gender: 'neutral' },
  'reading_comic': { id: 'reading_comic', word: 'reading a comic book', vietnamese: 'Đọc truyện tranh', imageUrl: `${ASSET_BASE_URL}/assets/images/reading-comic.png`, sentence: '{pronoun} is reading a comic book.', gender: 'neutral' },
  'watching_tv': { id: 'watching_tv', word: 'watching TV', vietnamese: 'Xem hoạt hình', imageUrl: `${ASSET_BASE_URL}/assets/images/watching-tv.png`, sentence: '{pronoun} is watching TV.', gender: 'neutral' },
  'riding_bike': { id: 'riding_bike', word: 'riding a bike', vietnamese: 'Đi xe đạp', imageUrl: `${ASSET_BASE_URL}/assets/images/xe-dap.png`, sentence: '{pronoun} is riding a bike.', gender: 'neutral' },
  'going_to_school': { id: 'going_to_school', word: 'going to school', vietnamese: 'Đi học', imageUrl: `${ASSET_BASE_URL}/assets/images/truong-hoc.png`, sentence: '{pronoun} is going to school.', gender: 'neutral' },
  'playing_with_friends': { id: 'playing_with_friends', word: 'playing with friends', vietnamese: 'Chơi với bạn bè', imageUrl: `${ASSET_BASE_URL}/assets/images/playing-with-friends.png`, sentence: '{pronoun} is playing with friends.', gender: 'neutral' },
  'going_to_beach': { id: 'going_to_beach', word: 'going to the beach', vietnamese: 'Đi biển', imageUrl: `${ASSET_BASE_URL}/assets/images/beach-day.png`, sentence: '{pronoun} is going to the beach.', gender: 'neutral' },
  'playing_in_park': { id: 'playing_in_park', word: 'playing in the park', vietnamese: 'Chơi ở công viên', imageUrl: `${ASSET_BASE_URL}/assets/images/cong-vien.png`, sentence: '{pronoun} is playing in the park.', gender: 'neutral' },
  'cooking': { id: 'cooking', word: 'cooking', vietnamese: 'Nấu ăn', imageUrl: `${ASSET_BASE_URL}/assets/images/cooking.png`, sentence: '{pronoun} is cooking.', gender: 'neutral' },
  'watering_plants': { id: 'watering_plants', word: 'watering the plants', vietnamese: 'Tưới cây', imageUrl: `${ASSET_BASE_URL}/assets/images/watering-can.png`, sentence: '{pronoun} is watering the plants.', gender: 'neutral' },
  'eating_snack': { id: 'eating_snack', word: 'eating a snack', vietnamese: 'Ăn vặt', imageUrl: `${ASSET_BASE_URL}/assets/images/item-cookie.png`, sentence: '{pronoun} is eating a snack.', gender: 'neutral' },
  'singing': { id: 'singing', word: 'singing a song', vietnamese: 'Ca hát', imageUrl: `${ASSET_BASE_URL}/assets/images/singing.png`, sentence: '{pronoun} is singing a song.', gender: 'neutral' },
  'drinking_milk': { id: 'drinking_milk', word: 'drinking milk', vietnamese: 'Uống sữa', imageUrl: `${ASSET_BASE_URL}/assets/images/item-milk.png`, sentence: '{pronoun} is drinking milk.', gender: 'neutral' },
  'playing_blocks': { id: 'playing_blocks', word: 'playing with blocks', vietnamese: 'Chơi xếp hình', imageUrl: `${ASSET_BASE_URL}/assets/images/blocks.png`, sentence: '{pronoun} is playing with blocks.', gender: 'neutral' },
  'playing_teddy': { id: 'playing_teddy', word: 'playing with a teddy bear', vietnamese: 'Chơi với gấu bông', imageUrl: `${ASSET_BASE_URL}/assets/images/teddy-bear.png`, sentence: '{pronoun} is playing with a teddy bear.', gender: 'neutral' },
  'sleeping': { id: 'sleeping', word: 'sleeping', vietnamese: 'Đang ngủ', imageUrl: `${ASSET_BASE_URL}/assets/images/bed.png`, sentence: '{pronoun} is sleeping.', gender: 'neutral' },
  'arranging_flowers': { id: 'arranging_flowers', word: 'arranging flowers', vietnamese: 'Cắm hoa', imageUrl: `${ASSET_BASE_URL}/assets/images/arranging-flowers.png`, sentence: '{pronoun} is arranging flowers.', gender: 'neutral' },
  'playing_ball': { id: 'playing_ball', word: 'playing with a ball', vietnamese: 'Chơi bóng', imageUrl: `${ASSET_BASE_URL}/assets/images/ball.png`, sentence: '{pronoun} is playing with a ball.', gender: 'neutral' },
  'running': { id: 'running', word: 'running', vietnamese: 'Chạy', imageUrl: `${ASSET_BASE_URL}/assets/images/run.png`, sentence: '{pronoun} is running.', gender: 'neutral' },
  'jumping': { id: 'jumping', word: 'jumping', vietnamese: 'Nhảy', imageUrl: `${ASSET_BASE_URL}/assets/images/jump.png`, sentence: '{pronoun} is jumping.', gender: 'neutral' },
  'drinking_coffee': { id: 'drinking_coffee', word: 'drinking coffee', vietnamese: 'Uống cà phê', imageUrl: `${ASSET_BASE_URL}/assets/images/uong-ca-phe.png`, sentence: '{pronoun} is drinking coffee.', gender: 'neutral' },
  'working': { id: 'working', word: 'working', vietnamese: 'Làm việc', imageUrl: `${ASSET_BASE_URL}/assets/images/lam-viec.png`, sentence: '{pronoun} is working on the computer.', gender: 'neutral' },
  'going_to_work': { id: 'going_to_work', word: 'going to work', vietnamese: 'Đi làm', imageUrl: `${ASSET_BASE_URL}/assets/images/di-lam.png`, sentence: '{pronoun} is going to work.', gender: 'neutral' },
};

export const pairActions: Record<string, VocabularyItem> = {
    'playing_together': { id: 'playing_together', word: 'playing together', vietnamese: 'Cùng chơi đồ chơi', imageUrl: `${ASSET_BASE_URL}/assets/images/playing-together.png`, sentence: 'are playing with toys together.', gender: 'neutral' },
    'reading_together': { id: 'reading_together', word: 'reading together', vietnamese: 'Cùng đọc sách', imageUrl: `${ASSET_BASE_URL}/assets/images/reading-together.png`, sentence: 'are reading a book together.', gender: 'neutral' },
    'eating_together': { id: 'eating_together', word: 'eating together', vietnamese: 'Cùng ăn vặt', imageUrl: `${ASSET_BASE_URL}/assets/images/item-cookie.png`, sentence: 'are eating a snack together.', gender: 'neutral' },
    'singing_together': { id: 'singing_together', word: 'singing together', vietnamese: 'Cùng ca hát', imageUrl: `${ASSET_BASE_URL}/assets/images/singing.png`, sentence: 'are singing a song together.', gender: 'neutral' },
    'park_together': { id: 'park_together', word: 'playing at the park', vietnamese: 'Chơi ở công viên', imageUrl: `${ASSET_BASE_URL}/assets/images/cong-vien.png`, sentence: 'are playing at the park together.', gender: 'neutral' },
    'beach_together': { id: 'beach_together', word: 'at the beach', vietnamese: 'Cùng đi biển', imageUrl: `${ASSET_BASE_URL}/assets/images/beach-day.png`, sentence: 'are at the beach together.', gender: 'neutral' },
    'watching_tv_together': { id: 'watching_tv_together', word: 'watching TV together', vietnamese: 'Cùng xem TV', imageUrl: `${ASSET_BASE_URL}/assets/images/watching-tv-together.png`, sentence: 'are watching TV together.', gender: 'neutral' },
    'biking_together': { id: 'biking_together', word: 'riding bikes together', vietnamese: 'Cùng đi xe đạp', imageUrl: `${ASSET_BASE_URL}/assets/images/xe-dap.png`, sentence: 'are riding bikes together.', gender: 'neutral' },
};

export const characterActionMap: Record<string, string[]> = {
  'dad': ['reading_book', 'reading_comic', 'going_to_beach', 'playing_in_park', 'running', 'drinking_coffee', 'working', 'going_to_work'],
  'mom': ['cooking', 'watering_plants', 'reading_book', 'going_to_beach', 'playing_in_park', 'arranging_flowers'],
  'sister': ['introducing_self', 'reading_book', 'reading_comic', 'watching_tv', 'riding_bike', 'going_to_school', 'playing_with_friends', 'going_to_beach', 'playing_in_park', 'eating_snack', 'singing', 'playing_teddy', 'playing_ball', 'running', 'jumping'],
  'baby_brother': ['playing_teddy', 'sleeping', 'drinking_milk', 'playing_blocks', 'watching_tv', 'going_to_beach', 'playing_in_park', 'playing_ball', 'running', 'jumping'],
  'grandpa': ['reading_book', 'reading_comic', 'going_to_beach', 'playing_in_park'],
  'grandma': ['cooking', 'watering_plants', 'reading_book', 'going_to_beach', 'playing_in_park'],
  'grandma_bup': ['cooking', 'reading_book', 'going_to_beach', 'playing_in_park'],
  'cousin_xoai': ['reading_comic', 'watching_tv', 'riding_bike', 'going_to_school', 'playing_with_friends', 'going_to_beach', 'playing_in_park', 'eating_snack', 'singing', 'playing_ball', 'running', 'jumping'],
  'cousin_na': ['reading_comic', 'watching_tv', 'riding_bike', 'going_to_school', 'playing_with_friends', 'going_to_beach', 'playing_in_park', 'eating_snack', 'singing', 'playing_ball', 'running', 'jumping'],
  'cousin_gam': ['watching_tv', 'playing_teddy', 'sleeping', 'eating_snack', 'going_to_beach', 'playing_in_park', 'playing_ball'],
};

type GameMode = 'single' | 'pair' | 'two_separate';

export const getStorySentences = (
    mode: GameMode | null,
    selectedChar1: VocabularyItem | null,
    selectedChar2: VocabularyItem | null,
    selectedAction: VocabularyItem | null,
    selectedAction2: VocabularyItem | null
): string[] => {
    if (mode === 'single') {
        if (!selectedChar1 || !selectedAction) return [];
        if (selectedChar1.id === 'sister') {
            const introSentence = `This is me, Gốm.`;
            if (selectedAction.id === 'introducing_self') {
                // This action already has its own full sentence.
                return [introSentence, selectedAction.sentence];
            }
            // Replace pronoun and verb for first-person perspective.
            const actionSentence = selectedAction.sentence
                .replace('{pronoun}', 'I')
                .replace(' is ', ' am ');
            return [introSentence, actionSentence];
        } else {
            const pronoun = selectedChar1.gender === 'male' ? 'He' : 'She';
            const introSentence = `This is my ${selectedChar1.word}.`;
            const actionSentence = selectedAction.sentence.replace('{pronoun}', pronoun);
            return [introSentence, actionSentence];
        }
    }
    if (mode === 'pair') {
        if (!selectedChar1 || !selectedChar2 || !selectedAction) return [];
        const isGomInvolved = selectedChar1.id === 'sister' || selectedChar2.id === 'sister';
        if (isGomInvolved) {
            const otherChar = selectedChar1.id === 'sister' ? selectedChar2 : selectedChar1;
            const subject = `My ${otherChar.word} and I`;
            const predicate = selectedAction.sentence;
            return [`${subject} ${predicate}`];
        } else {
            const subject = `My ${selectedChar1.word} and my ${selectedChar2.word}`;
            const predicate = selectedAction.sentence;
            return [`${subject} ${predicate}`];
        }
    }
    if (mode === 'two_separate') {
        if (!selectedChar1 || !selectedAction || !selectedChar2 || !selectedAction2) return [];

        let intro1, action1, intro2, action2;

        // --- Character 1's sentences ---
        if (selectedChar1.id === 'sister') {
            intro1 = 'This is me, Gốm.';
            action1 = selectedAction.sentence.replace('{pronoun}', 'I').replace(' is ', ' am ');
        } else {
            const pronoun1 = selectedChar1.gender === 'male' ? 'He' : 'She';
            intro1 = `This is my ${selectedChar1.word}.`;
            action1 = selectedAction.sentence.replace('{pronoun}', pronoun1);
        }

        // --- Character 2's sentences ---
        if (selectedChar2.id === 'sister') {
            intro2 = 'This is me, Gốm.';
            action2 = selectedAction2.sentence.replace('{pronoun}', 'I').replace(' is ', ' am ');
        } else {
            const pronoun2 = selectedChar2.gender === 'male' ? 'He' : 'She';
            intro2 = `This is my ${selectedChar2.word}.`;
            action2 = selectedAction2.sentence.replace('{pronoun}', pronoun2);
        }

        return [intro1, action1, intro2, action2];
    }
    return [];
};
