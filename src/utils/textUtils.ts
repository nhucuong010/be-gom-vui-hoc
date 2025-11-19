/**
 * Chuẩn hóa một chuỗi văn bản để sử dụng làm tên file an toàn.
 * - Chuyển thành chữ thường.
 * - Bỏ dấu tiếng Việt.
 * - Thay thế khoảng trắng bằng dấu gạch ngang.
 * - Xóa các ký tự không hợp lệ.
 * @param text Văn bản đầu vào.
 * @param extension Đuôi file (ví dụ: 'png', 'wav').
 * @returns Tên file đã được chuẩn hóa.
 */

// A map of all toned characters to their tone.
const charToTone: { [key: string]: string } = {
  'á': 'sac', 'ắ': 'sac', 'ấ': 'sac', 'é': 'sac', 'ế': 'sac', 'í': 'sac', 'ó': 'sac', 'ố': 'sac', 'ớ': 'sac', 'ú': 'sac', 'ứ': 'sac', 'ý': 'sac',
  'à': 'huyen', 'ằ': 'huyen', 'ầ': 'huyen', 'è': 'huyen', 'ề': 'huyen', 'ì': 'huyen', 'ò': 'huyen', 'ồ': 'huyen', 'ờ': 'huyen', 'ù': 'huyen', 'ừ': 'huyen', 'ỳ': 'huyen',
  'ả': 'hoi', 'ẳ': 'hoi', 'ẩ': 'hoi', 'ẻ': 'hoi', 'ể': 'hoi', 'ỉ': 'hoi', 'ỏ': 'hoi', 'ổ': 'hoi', 'ở': 'hoi', 'ủ': 'hoi', 'ử': 'hoi', 'ỷ': 'hoi',
  'ã': 'nga', 'ẵ': 'nga', 'ẫ': 'nga', 'ẽ': 'nga', 'ễ': 'nga', 'ĩ': 'nga', 'õ': 'nga', 'ỗ': 'nga', 'ỡ': 'nga', 'ũ': 'nga', 'ữ': 'nga', 'ỹ': 'nga',
  'ạ': 'nang', 'ặ': 'nang', 'ậ': 'nang', 'ẹ': 'nang', 'ệ': 'nang', 'ị': 'nang', 'ọ': 'nang', 'ộ': 'nang', 'ợ': 'nang', 'ụ': 'nang', 'ự': 'nang', 'ỵ': 'nang'
};

function getToneFromWord(word: string): string {
    for (const char of word.toLowerCase()) {
        if (charToTone[char]) {
            return charToTone[char];
        }
    }
    return 'ngang';
}

// Special cases for phonetic sounds that don't follow standard word sanitization rules.
const phoneticFilenameExceptions: { [key: string]: string } = {
    'ngờ': 'ngo',
    'giờ': 'gio',
    'quờ': 'quo',
    'dờ': 'zo-huyen', // To distinguish from 'đờ' which becomes 'do-huyen'
};


export const sanitizeFilename = (text: string, extension: string): string => {
    const trimmedText = text.trim();
    if (!trimmedText) return `default.${extension}`;
    
    // Handle purely numeric strings first
    if (/^\d+$/.test(trimmedText)) {
        return `${trimmedText}.${extension}`;
    }

    const lowerTrimmedText = trimmedText.toLowerCase();
    if (phoneticFilenameExceptions[lowerTrimmedText]) {
        return `${phoneticFilenameExceptions[lowerTrimmedText]}.${extension}`;
    }


    // Nếu là cụm từ (có chứa khoảng trắng), sử dụng phương pháp cũ
    if (trimmedText.includes(' ')) {
        const baseName = trimmedText
            .toLowerCase()
            .normalize("NFD") 
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[\s_]+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        return `${baseName}.${extension}`;
    }

    // Nếu là từ đơn, sử dụng phương pháp mới dựa trên dấu thanh
    const tone = getToneFromWord(trimmedText);
    const baseName = trimmedText
        .toLowerCase()
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]/g, ''); // Chỉ cho phép chữ và số cho từ đơn

    return `${baseName}-${tone}.${extension}`;
};


// --- Vietnamese Tone Helpers (moved from SpellingRobotGame) ---

export const vowelToneMap: Record<string, Record<string, string>> = {
    'A': { 'sắc': 'Á', 'huyền': 'À', 'hỏi': 'Ả', 'ngã': 'Ã', 'nặng': 'Ạ' },
    'Ă': { 'sắc': 'Ắ', 'huyền': 'Ằ', 'hỏi': 'Ẳ', 'ngã': 'Ẵ', 'nặng': 'Ặ' },
    'Â': { 'sắc': 'Ấ', 'huyền': 'Ầ', 'hỏi': 'Ẩ', 'ngã': 'Ẫ', 'nặng': 'Ậ' },
    'E': { 'sắc': 'É', 'huyền': 'È', 'hỏi': 'Ẻ', 'ngã': 'Ẽ', 'nặng': 'Ẹ' },
    'Ê': { 'sắc': 'Ế', 'huyền': 'Ề', 'hỏi': 'Ể', 'ngã': 'Ễ', 'nặng': 'Ệ' },
    'I': { 'sắc': 'Í', 'huyền': 'Ì', 'hỏi': 'Ỉ', 'ngã': 'Ĩ', 'nặng': 'Ị' },
    'O': { 'sắc': 'Ó', 'huyền': 'Ò', 'hỏi': 'Ỏ', 'ngã': 'Õ', 'nặng': 'Ọ' },
    'Ô': { 'sắc': 'Ố', 'huyền': 'Ồ', 'hỏi': 'Ổ', 'ngã': 'Ỗ', 'nặng': 'Ộ' },
    'Ơ': { 'sắc': 'Ớ', 'huyền': 'Ờ', 'hỏi': 'Ở', 'ngã': 'Ỡ', 'nặng': 'Ợ' },
    'U': { 'sắc': 'Ú', 'huyền': 'Ù', 'hỏi': 'Ủ', 'ngã': 'Ũ', 'nặng': 'Ụ' },
    'Ư': { 'sắc': 'Ứ', 'huyền': 'Ừ', 'hỏi': 'Ử', 'ngã': 'Ữ', 'nặng': 'Ự' },
    'Y': { 'sắc': 'Ý', 'huyền': 'Ỳ', 'hỏi': 'Ỷ', 'ngã': 'Ỹ', 'nặng': 'Ỵ' },
};

export const getVowelWithTone = (vowel: string, tone: string): string => {
    if (tone === 'ngang') return vowel;
    return vowelToneMap[vowel.toUpperCase()]?.[tone] || vowel;
};