import type { NumberCharacter, PrincessCodeProblem } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

export const numberCharacters: NumberCharacter[] = [
    { digit: 0, name: 'Quả trứng', imageUrl: `${ASSET_BASE_URL}/assets/images/number_char_0.png`, description: 'Số 0 giống quả trứng' },
    { digit: 1, name: 'Cây bút chì', imageUrl: `${ASSET_BASE_URL}/assets/images/number_char_1.png`, description: 'Số 1 giống cây bút chì' },
    { digit: 2, name: 'Con vịt', imageUrl: `${ASSET_BASE_URL}/assets/images/number_char_2.png`, description: 'Số 2 giống con vịt' },
    { digit: 3, name: 'Đôi tai thỏ', imageUrl: `${ASSET_BASE_URL}/assets/images/number_char_3.png`, description: 'Số 3 giống đôi tai thỏ' },
    { digit: 4, name: 'Cái ghế', imageUrl: `${ASSET_BASE_URL}/assets/images/number_char_4.png`, description: 'Số 4 giống cái ghế' },
    { digit: 5, name: 'Bàn tay', imageUrl: `${ASSET_BASE_URL}/assets/images/number_char_5.png`, description: 'Số 5 giống bàn tay' },
    { digit: 6, name: 'Con ốc sên', imageUrl: `${ASSET_BASE_URL}/assets/images/number_char_6.png`, description: 'Số 6 giống con ốc sên' },
    { digit: 7, name: 'Cây gậy phép', imageUrl: `${ASSET_BASE_URL}/assets/images/number_char_7.png`, description: 'Số 7 giống cây gậy phép' },
    { digit: 8, name: 'Người tuyết', imageUrl: `${ASSET_BASE_URL}/assets/images/number_char_8.png`, description: 'Số 8 giống người tuyết' },
    { digit: 9, name: 'Bóng bay', imageUrl: `${ASSET_BASE_URL}/assets/images/number_char_9.png`, description: 'Số 9 giống quả bóng bay' },
];

export const princessCodeProblemsBank: PrincessCodeProblem[] = [
    {
        id: 'level1_285',
        code: '285',
        level: 1,
        storySteps: [
            {
                question: 'Con vịt và người tuyết đang làm gì cùng nhau?',
                characterIndices: [0, 1], // Vịt, Người tuyết
                choices: [
                    { text: 'Vịt đội nón cho người tuyết.', storySegment: 'Có một chú vịt vàng đang đi chơi thì gặp một bạn người tuyết. Chú vịt tốt bụng đã đội chiếc nón của mình cho người tuyết để bạn không bị lạnh.' },
                    { text: 'Vịt và người tuyết cùng nhau nhảy múa.', storySegment: 'Dưới trời tuyết rơi, một chú vịt và một bạn người tuyết đang vui vẻ nhảy múa cùng nhau.' },
                    { text: 'Người tuyết cõng vịt đi chơi.', storySegment: 'Bạn người tuyết thật khỏe, bạn ấy cõng một chú vịt con trên vai để đi dạo chơi khắp nơi.' },
                ]
            },
            {
                question: 'Bỗng nhiên, bàn tay xuất hiện như thế nào?',
                characterIndices: [2], // Bàn tay
                choices: [
                    { text: 'Bàn tay vẫy chào tạm biệt.', storySegment: 'Sau khi chơi xong, một bàn tay xinh xắn đã vẫy chào tạm biệt hai bạn.' },
                    { text: 'Bàn tay cho các bạn một viên kẹo.', storySegment: 'Một bàn tay khổng lồ từ trên trời đưa xuống và cho hai bạn một viên kẹo ngọt ngào.' },
                    { text: 'Bàn tay giúp người tuyết đeo găng tay.', storySegment: 'Một bàn tay ấm áp xuất hiện và giúp người tuyết đeo đôi găng tay cho đỡ lạnh.' },
                ]
            }
        ]
    },
    {
        id: 'level1_629',
        code: '629',
        level: 1,
        storySteps: [
            {
                question: 'Con ốc sên và con vịt đang làm gì?',
                characterIndices: [0, 1], // Ốc sên, Vịt
                choices: [
                    { text: 'Cùng nhau đi dạo.', storySegment: 'Một hôm trời đẹp, có một bạn ốc sên và một bạn vịt đang cùng nhau đi dạo trong vườn hoa.' },
                    { text: 'Cùng nhau bơi lội.', storySegment: 'Dưới hồ nước trong xanh, bạn ốc sên đang ngồi trên lưng bạn vịt để cùng nhau bơi lội tung tăng.' },
                    { text: 'Cùng nhau xây nhà.', storySegment: 'Bạn ốc sên và bạn vịt đang hợp sức để xây một ngôi nhà nhỏ xinh bằng lá cây.' },
                ]
            },
            {
                question: 'Quả bóng bay xuất hiện và làm gì?',
                characterIndices: [2], // Bóng bay
                choices: [
                    { text: 'Mang ốc sên bay lên.', storySegment: 'Bỗng nhiên một quả bóng bay màu đỏ xuất hiện, nó buộc dây vào vỏ ốc sên và kéo bạn ấy bay lên trời cao.' },
                    { text: 'Tặng hoa cho vịt.', storySegment: 'Một quả bóng bay xinh xắn bay đến và thả xuống một bông hoa đẹp để tặng cho bạn vịt.' },
                    { text: 'Nổ tung và tạo ra mưa kẹo.', storySegment: 'Quả bóng bay bay đến gần hai bạn rồi nổ "bùm", từ trong đó rơi ra rất nhiều kẹo bảy màu.' },
                ]
            }
        ]
    },
    {
        id: 'level1_318',
        code: '318',
        level: 1,
        storySteps: [
            {
                question: 'Đôi tai thỏ và cây bút chì đã làm gì?',
                characterIndices: [0, 1], // Tai thỏ, Bút chì
                choices: [
                    { text: 'Vẽ ra một củ cà rốt.', storySegment: 'Một đôi tai thỏ đã cầm một cây bút chì và hí hoáy vẽ ra một củ cà rốt thật to và ngon mắt.' },
                    { text: 'Cùng nhau nhảy lò cò.', storySegment: 'Một cây bút chì và một đôi tai thỏ đang vui vẻ chơi trò nhảy lò cò trên sân cỏ.' },
                    { text: 'Trang trí cho một cuốn sách.', storySegment: 'Trên bìa một cuốn sách, có hình một cây bút chì đang vẽ thêm họa tiết cho một đôi tai thỏ.' },
                ]
            },
            {
                question: 'Người tuyết xuất hiện và chuyện gì đã xảy ra?',
                characterIndices: [2], // Người tuyết
                choices: [
                    { text: 'Được tặng đôi tai thỏ.', storySegment: 'Thấy bạn người tuyết không có tai, đôi tai thỏ đã nhảy lên đầu bạn ấy để làm thành một người tuyết tai thỏ đáng yêu.' },
                    { text: 'Được vẽ thêm mũi.', storySegment: 'Cây bút chì đã vẽ cho bạn người tuyết một cái mũi cà rốt màu cam thật xinh.' },
                    { text: 'Cả ba cùng nhau lăn tuyết.', storySegment: 'Người tuyết rủ đôi tai thỏ và cây bút chì cùng nhau lăn những quả cầu tuyết thật to để xây nhà.' },
                ]
            }
        ]
    },
    {
        id: 'level1_197',
        code: '197',
        level: 1,
        storySteps: [
            {
                question: 'Cây bút chì và quả bóng bay đang ở đâu?',
                characterIndices: [0, 1], // Bút chì, Bóng bay
                choices: [
                    { text: 'Bay lên trời xanh.', storySegment: 'Một cây bút chì thần kỳ đã vẽ ra một quả bóng bay thật to, và cả hai cùng nhau bay vút lên trời xanh.' },
                    { text: 'Ở trong lớp học.', storySegment: 'Trong lớp học, có một cây bút chì đang nằm cạnh một quả bóng bay bị xẹp lép.' },
                    { text: 'Cùng nhau đi câu cá.', storySegment: 'Thật kỳ lạ, một cây bút chì đang dùng một quả bóng bay làm phao câu để câu cá dưới hồ.' },
                ]
            },
            {
                question: 'Cây gậy phép đã làm gì?',
                characterIndices: [2], // Gậy phép
                choices: [
                    { text: 'Biến quả bóng thành màu hồng.', storySegment: 'Bỗng một cây gậy phép xuất hiện và "úm ba la", quả bóng biến thành màu hồng lấp lánh.' },
                    { text: 'Vẽ thêm một cây bút chì nữa.', storySegment: 'Cây gậy phép vung lên, và một cây bút chì y hệt nữa xuất hiện bên cạnh.' },
                    { text: 'Làm cho bút chì biết nói.', storySegment: 'Cây gậy phép chạm vào cây bút chì, và lạ thay, cây bút chì bỗng cất tiếng nói "Xin chào!".' },
                ]
            }
        ]
    },
    {
        id: 'level1_403',
        code: '403',
        level: 1,
        storySteps: [
            {
                question: 'Cái ghế và quả trứng làm bạn với nhau như thế nào?',
                characterIndices: [0, 1], // Ghế, Trứng
                choices: [
                    { text: 'Quả trứng ngồi nghỉ trên ghế.', storySegment: 'Có một quả trứng đang đi chơi và cảm thấy mỏi chân. May quá, có một cái ghế tốt bụng cho quả trứng ngồi nghỉ.' },
                    { text: 'Cái ghế bảo vệ quả trứng.', storySegment: 'Một quả trứng đang lăn xuống dốc, một cái ghế dũng cảm đã chạy ra để chặn lại, cứu quả trứng khỏi bị vỡ.' },
                    { text: 'Hai bạn cùng nhau đọc sách.', storySegment: 'Trên một cái ghế, có một quả trứng đang đeo kính và say sưa đọc sách.' },
                ]
            },
            {
                question: 'Rồi đôi tai thỏ tham gia câu chuyện ra sao?',
                characterIndices: [2], // Tai thỏ
                choices: [
                    { text: 'Mọc lên từ quả trứng.', storySegment: 'Bất ngờ, quả trứng nứt ra và từ đó mọc lên một đôi tai thỏ mềm mại, đáng yêu.' },
                    { text: 'Trang trí cho cái ghế.', storySegment: 'Một đôi tai thỏ được gắn lên lưng ghế, biến nó thành chiếc ghế tai thỏ xinh xắn nhất.' },
                    { text: 'Lắng nghe câu chuyện.', storySegment: 'Một đôi tai thỏ tò mò thò ra từ sau bụi cây để lắng nghe câu chuyện của ghế và trứng.' },
                ]
            }
        ]
    },
    {
        id: 'level2_0472',
        code: '0472',
        level: 2,
        storySteps: [
            {
                question: 'Quả trứng và cái ghế đang làm gì?',
                characterIndices: [0, 1], // Trứng, Ghế
                choices: [
                    { text: 'Quả trứng kể chuyện cho ghế nghe.', storySegment: 'Ngày xửa ngày xưa, có một quả trứng thông thái đang ngồi trên một chiếc ghế và kể cho chiếc ghế nghe những câu chuyện cổ tích thú vị.' },
                    { text: 'Cái ghế đang sơn màu cho quả trứng.', storySegment: 'Một chiếc ghế họa sĩ đang cẩn thận dùng cọ vẽ những họa tiết xinh đẹp lên một quả trứng trắng muốt.' },
                    { text: 'Hai bạn đang chơi bập bênh.', storySegment: 'Một quả trứng và một cái ghế đang cùng nhau chơi bập bênh ở công viên. Thật là vui!' },
                ]
            },
            {
                question: 'Sau đó, cây gậy phép và con vịt đã làm gì?',
                characterIndices: [2, 3], // Gậy phép, Vịt
                choices: [
                    { text: 'Biến quả trứng thành vàng.', storySegment: 'Bỗng nhiên, một chú vịt con cầm cây gậy phép đi tới. Chú vịt vung gậy và hô "biến hình", quả trứng liền biến thành quả trứng vàng lấp lánh.' },
                    { text: 'Làm cho cái ghế biết đi.', storySegment: 'Một chú vịt con tinh nghịch đã dùng cây gậy phép của mình để làm cho chiếc ghế có thể tự đi lại khắp nơi.' },
                    { text: 'Tạo ra một cơn mưa bỏng ngô.', storySegment: 'Chú vịt con cầm cây gậy phép và ước có một cơn mưa bỏng ngô. Ngay lập tức, bỏng ngô từ trên trời rơi xuống ngập tràn.' },
                ]
            }
        ]
    }
];