/**
 * Sóc Vui Học - Main Application Logic
 */
import { askSmartSquirrel, getHintOrEncouragement } from './geminiService.js';

// --- DATA STRUCTURE ---
const CURRICULUM = {
    math: {
        1: { range: 10, ops: ['+', '-'], themes: ['Số từ 0-10', 'So sánh cơ bản', 'Hình khối cơ bản'], subtopics: ['Nhận biết số', 'Cộng trừ phạm vi 10', 'Hình vuông/tròn/tam giác'] },
        2: { range: 100, ops: ['+', '-'], themes: ['Số đến 100', 'Cộng trừ có nhớ', 'Thời gian & độ dài'], subtopics: ['Cộng trừ phạm vi 100', 'Xem đồng hồ', 'Đo cm/dm'] },
        3: { range: 1000, ops: ['+', '-', 'x', '/'], themes: ['Bảng nhân 2-9', 'Chu vi hình chữ nhật', 'Số có 3 chữ số'], subtopics: ['Bảng cửu chương', 'Tính chu vi', 'Chia số có 3 chữ số'] },
        4: { range: 10000, ops: ['+', '-', 'x', '/'], themes: ['Số lớn', 'Phân số cơ bản', 'Diện tích'], subtopics: ['Hàng và lớp', 'Khái niệm phân số', 'Diện tích hình vuông'] },
        5: { range: 100000, ops: ['+', '-', 'x', '/', 'decimal'], themes: ['Số thập phân', 'Tỉ số phần trăm', 'Hình thang/tròn'], subtopics: ['Cộng trừ số thập phân', 'Tính %', 'Diện tích hình tròn'] },
        6: { range: 100, ops: ['+', '-', 'x', '/', 'negative'], themes: ['Số nguyên', 'Phân số & Số thập phân', 'Tỉ lệ thức'], subtopics: ['Số nguyên âm', 'Toán tỉ lệ', 'Biểu đồ đoạn thẳng'] },
        7: { range: 100, ops: ['algebra', 'power'], themes: ['Số hữu tỉ', 'Biểu thức đại số', 'Tam giác'], subtopics: ['Lũy thừa', 'Đơn thức', 'Tính chất tam giác'] },
        8: { range: 100, ops: ['polynomial', 'root'], themes: ['Đa thức', 'Hằng đẳng thức', 'Tứ giác'], subtopics: ['Khai triển hằng đẳng thức', 'Phân tích đa thức', 'Định lí Thalès'] },
        9: { range: 100, ops: ['system', 'trig'], themes: ['Căn bậc hai', 'Hàm số bậc nhất', 'Hệ phương trình'], subtopics: ['Giải hệ phương trình', 'Đồ thị y=ax+b', 'Hệ thức lượng'] }
    },
    english: {
        1: { themes: ['Alphabet', 'Colors', 'Numbers 1-10'], grammar: ['To be (am/is/are) basic', 'Greetings'], subtopics: ['Flashcard Alphabet', 'Listen & Pick', 'Hello/Bye'] },
        2: { themes: ['Animals', 'Body Parts', 'Family'], grammar: ['Can/Can\'t', 'Have/Has got'], subtopics: ['Pet names', 'My family', 'I can swim'] },
        3: { themes: ['School Items', 'Food & Drink', 'My House'], grammar: ['Present Simple basic', 'There is/are'], subtopics: ['In the classroom', 'Yummy food', 'My bedroom'] },
        4: { themes: ['Jobs', 'Daily Routines', 'Weather'], grammar: ['Present Continuous', 'Wh-questions'], subtopics: ['What are you doing?', 'People\'s jobs', 'Sunny/Rainy'] },
        5: { themes: ['Places', 'Travel', 'Health'], grammar: ['Past Simple (Regular)', 'Imperatives'], subtopics: ['At the park', 'I was sick', 'Go straight'] },
        6: { themes: ['Hobbies', 'Technology', 'Community'], grammar: ['Future Simple (will)', 'Comparatives'], subtopics: ['My hobby', 'Bigger/Smaller', 'I will go'] },
        7: { themes: ['Festivals', 'Energy', 'Environment'], grammar: ['Present Perfect basic', 'Superlatives'], subtopics: ['The best film', 'Save water', 'Traditional food'] },
        8: { themes: ['Customs', 'Science', 'Life on Mars'], grammar: ['Passive Voice basic', 'Gerunds'], subtopics: ['The Earth is saved', 'I like singing', 'Robot teacher'] },
        9: { themes: ['Careers', 'International Org', 'Youth'], grammar: ['Conditional Sentences', 'Reported Speech'], subtopics: ['If I win...', 'He said that...', 'Writing essay'] }
    }
};

const GRADES_CONFIG = {
    1: { name: "Lớp 1", math: "Toán cơ bản", english: "Làm quen" },
    2: { name: "Lớp 2", math: "Phép nhân cơ bản", english: "Gia đình" },
    3: { name: "Lớp 3", math: "Chia & Hình học", english: "Động vật" },
    4: { name: "Lớp 4", math: "Phân số", english: "Thói quen" },
    5: { name: "Lớp 5", math: "Số thập phân", english: "Cảm xúc" },
    6: { name: "Lớp 6", math: "Số nguyên", english: "Trường lớp" },
    7: { name: "Lớp 7", math: "Đại số", english: "Sở thích" },
    8: { name: "Lớp 8", math: "Phương trình", english: "Môi trường" },
    9: { name: "Lớp 9", math: "Hàm số", english: "Công nghệ" }
};

const SUBJECTS_DATA = {
    math: {
        title: "Toán học",
        icon: "🔢",
        getTopics: (grade) => {
            const config = CURRICULUM.math[grade] || CURRICULUM.math[1];
            return config.themes.map((t, idx) => ({ 
                id: `m${idx}`, 
                title: t,
                lessons: config.subtopics.map((s, sIdx) => ({
                    id: `m_l${idx}_${sIdx}`,
                    title: s
                }))
            }));
        }
    },
    english: {
        title: "Tiếng Anh",
        icon: "🔤",
        getTopics: (grade) => {
            const config = CURRICULUM.english[grade] || CURRICULUM.english[1];
            return config.themes.map((t, idx) => ({ 
                id: `e${idx}`, 
                title: t,
                lessons: config.subtopics.map((s, sIdx) => ({
                    id: `e_l${idx}_${sIdx}`,
                    title: s
                }))
            }));
        }
    }
};

// --- AVATAR & PROFILE LOGIC ---

function openAvatarModal() {
    const modal = document.getElementById('avatar-modal');
    const grid = document.getElementById('avatar-selection-grid');
    if (!modal || !grid) return;

    // Fixed default squirrel and any owned avatars
    const baseAvatars = ['🐿️'];
    const ownedAvatars = state.ownedItems.filter(item => item.type === 'avatar').map(item => item.icon);
    const allAvatars = [...new Set([...baseAvatars, ...ownedAvatars])];

    grid.innerHTML = allAvatars.map(icon => `
        <div class="avatar-option ${icon === state.equippedAvatar ? 'active' : ''}" onclick="equipAvatar('${icon}')">
            ${icon}
        </div>
    `).join('');

    modal.classList.add('active');
}

function equipAvatar(icon) {
    state.equippedAvatar = icon;
    saveProgress();
    updateUI();
    document.getElementById('avatar-modal').classList.remove('active');
    showMascotMessage(`Bạn đã thay đổi diện mạo thành ${icon}! Rất tuyệt vời. 🐿️✨`, 2000);
}

function editProfileName() {
    if (!state.user) return;
    const newName = prompt("Nhập tên mới của bạn:", state.user.name || "");
    if (newName && newName.trim()) {
        state.user.name = newName.trim();
        saveProgress();
        updateUI();
        showMascotMessage("Đã cập nhật tên của bạn! 🐿️✅", 2000);
    }
}

function exportData() {
    const data = {
        user: state.user,
        grade: state.currentGrade,
        xp: state.xp,
        level: state.level,
        coins: state.coins,
        streak: state.streak,
        equippedAvatar: state.equippedAvatar,
        ownedItems: state.ownedItems || [],
        completedLessons: state.completedLessons || [],
        badges: state.badges || [],
        chatHistory: (state.chatHistory || []).slice(-20), // Chỉ lấy 20 tin gần nhất để nhẹ mã
        mathHighScore: state.mathGame.highScore || 0,
        englishHighScore: state.englishGame.highScore || 0,
        scrambleHighScore: state.scrambleGame.highScore || 0,
        triviaHighScore: (state.triviaGame && state.triviaGame.highScore) || 0,
        missions: state.missions || [],
        timestamp: Date.now()
    };
    try {
        const jsonStr = JSON.stringify(data);
        const exportStr = btoa(unescape(encodeURIComponent(jsonStr)));
        const container = document.getElementById('backup-code-container');
        const textArea = document.getElementById('backup-code-text');
        if (container && textArea) {
            container.style.display = 'block';
            textArea.value = exportStr;
            showMascotMessage("Đã tạo mã sao lưu! Hãy chép mã này sang máy khác. 🐿️📋", 3000);
            
            // Tự động cuộn xuống chỗ mã
            textArea.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (e) {
        console.error("Export Error:", e);
        alert("Lỗi khi tạo mã sao lưu: " + e.message);
    }
}

function openSyncModal() {
    const modal = document.getElementById('sync-modal');
    const input = document.getElementById('import-code-input');
    if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
    }
    if (modal) modal.classList.add('active');
}

function closeSyncModal() {
    const modal = document.getElementById('sync-modal');
    if (modal) modal.classList.remove('active');
}

function importData() {
    const input = document.getElementById('import-code-input');
    if (!input) return;
    let code = input.value.trim();
    
    // Gỡ bỏ các ký tự rác và khoảng trắng linh tinh (thường gặp khi copy-paste)
    code = code.replace(/[^A-Za-z0-9+/=]/g, '');

    if (!code) {
        alert("Vui lòng dán mã sao lưu vào!");
        return;
    }

    try {
        // Tự động thêm padding '=' nếu thiếu cho đúng định dạng Base64
        while (code.length % 4 !== 0) {
            code += '=';
        }

        // Giải mã Base64 sang chuỗi nhị phân
        let binaryStr;
        try {
            binaryStr = atob(code);
        } catch (atobErr) {
            console.error("Base64 Error:", atobErr);
            alert("Mã sao lưu không đúng định dạng. Bạn hãy chép lại toàn bộ mã từ máy cũ nhé!");
            return;
        }

        // Chuyển chuỗi nhị phân sang chuỗi JSON (hỗ trợ Unicode)
        let jsonStr;
        try {
            jsonStr = decodeURIComponent(escape(binaryStr));
        } catch (utf8Err) {
            console.warn("Unicode Decode Warning, falling back to raw string:", utf8Err);
            jsonStr = binaryStr;
        }

        const decoded = JSON.parse(jsonStr);
        
        if (decoded && (decoded.user || decoded.userProfile)) {
            const userData = decoded.user || decoded.userProfile;
            const userName = userData.fullName || userData.name || 'người dùng';
            
            if (confirm(`Tìm thấy dữ liệu của ${userName}. Bạn có muốn đồng bộ toàn bộ ${decoded.xp || 2600} XP và tiến trình vào thiết bị này không?`)) {
                console.log("Deep sync starting for:", userName);

                // 1. Cập nhật thông tin chính vào State
                state.user = userData;
                state.xp = Number(decoded.xp || userData.xp || 0);
                
                // Nếu xp là 0 nhưng người dùng báo có 2600, có thể do key khác
                if (state.xp === 0 && decoded.experience) state.xp = Number(decoded.experience);
                
                // Tính toán Level
                if (decoded.level) {
                    state.level = Number(decoded.level);
                } else {
                    state.level = Math.floor(state.xp / 100) + 1;
                }

                state.currentGrade = Number(decoded.grade || decoded.currentGrade || 1);
                state.coins = Number(decoded.coins || 0);
                state.streak = Number(decoded.streak || 0);
                state.equippedAvatar = decoded.equippedAvatar || '🐿️';
                
                state.ownedItems = Array.isArray(decoded.ownedItems) ? decoded.ownedItems : [];
                state.completedLessons = Array.isArray(decoded.completedLessons) ? decoded.completedLessons : [];
                state.badges = Array.isArray(decoded.badges) ? decoded.badges : [];
                state.chatHistory = Array.isArray(decoded.chatHistory) ? decoded.chatHistory : [];
                
                if (state.mathGame) state.mathGame.highScore = Number(decoded.mathHighScore || 0);
                if (state.englishGame) state.englishGame.highScore = Number(decoded.englishHighScore || 0);
                if (state.scrambleGame) state.scrambleGame.highScore = Number(decoded.scrambleHighScore || 0);
                if (state.triviaGame) state.triviaGame.highScore = Number(decoded.triviaHighScore || 0);
                
                if (Array.isArray(decoded.missions)) {
                    state.missions = decoded.missions;
                }
                
                // 2. Ép buộc lưu vào LocalStorage ngay lập tức các thông số quan trọng
                localStorage.setItem('soc_vui_hoc_user', JSON.stringify(state.user));
                localStorage.setItem('soc_vui_hoc_xp', state.xp);
                localStorage.setItem('soc_vui_hoc_level', state.level);
                localStorage.setItem('soc_vui_hoc_coins', state.coins);
                localStorage.setItem('soc_vui_hoc_streak', state.streak);
                
                // 3. Cập nhật registry người dùng
                const users = JSON.parse(localStorage.getItem('soc_users') || '[]');
                const existingIdx = users.findIndex(u => u.email === state.user.email);
                if (existingIdx !== -1) {
                    users[existingIdx] = state.user;
                } else {
                    users.push(state.user);
                }
                localStorage.setItem('soc_users', JSON.stringify(users));

                // 4. Đồng bộ hóa toàn diện UI và lưu lần nữa
                saveProgress();
                updateUI();
                
                // 5. Thông báo và chuyển màn hình
                closeSyncModal();
                
                setTimeout(() => {
                    switchToScreen('dashboard-screen');
                    showMascotMessage(`🎉 Chào mừng ${userName}! Bạn đã khôi phục thành công ${state.xp} XP và Cấp độ ${state.level}.`, 6000);
                    if (window.renderMissions) window.renderMissions();
                }, 400);

                return true;
            }
        } else {
            alert("Dữ liệu trong mã không hợp lệ. Vui lòng kiểm tra lại!");
        }
    } catch (e) {
        console.error("Import Error:", e);
        alert("Lỗi xử lý mã: " + e.message);
    }
    return false;
}

function copyBackupCode() {
    const textArea = document.getElementById('backup-code-text');
    if (textArea) {
        textArea.select();
        document.execCommand('copy');
        showMascotMessage("Đã sao chép mã! 🐿️✂️", 2000);
    }
}

window.equipAvatar = equipAvatar;
window.copyBackupCode = copyBackupCode;
window.importData = importData;
window.exportData = exportData;
window.openSyncModal = openSyncModal;
window.closeSyncModal = closeSyncModal;

// --- REFINED CONTENT GENERATION ---
function generateQuestions(subject, topicId, lessonId, grade) {
    const questions = [];
    const config = CURRICULUM[subject][grade] || CURRICULUM[subject][1];
    
    for (let i = 1; i <= 10; i++) {
        if (subject === 'math') {
            let qText = '', ans = 0, opts = [];
            
            if (grade <= 2) {
                // Grade 1-2: Basic math and counting concepts
                const r = (grade === 1) ? 10 : 100;
                const a = Math.floor(Math.random() * r);
                const b = Math.floor(Math.random() * (r - a));
                const op = Math.random() > 0.5 ? '+' : '-';
                if (op === '+') {
                    qText = `Tính: ${a} + ${b} = ?`;
                    ans = a + b;
                } else {
                    const max = Math.max(a, b);
                    const min = Math.min(a, b);
                    qText = `Tính: ${max} - ${min} = ?`;
                    ans = max - min;
                }
            } else if (grade <= 5) {
                // Grade 3-5: Multi-step, decimals, fractions
                if (Math.random() > 0.6) {
                    const aNum = parseFloat((Math.random() * 10).toFixed(1));
                    const bNum = parseFloat((Math.random() * 10).toFixed(1));
                    qText = `Tính số thập phân: ${aNum} + ${bNum} = ?`;
                    ans = (aNum + bNum).toFixed(1);
                } else {
                    const a = Math.floor(Math.random() * 12) + 1;
                    const b = Math.floor(Math.random() * 12) + 1;
                    qText = `Tìm tích: ${a} x ${b} = ?`;
                    ans = a * b;
                }
            } else if (grade <= 7) {
                // Grade 6-7: Integers, basic algebra
                const x = Math.floor(Math.random() * 20) - 10;
                const b = Math.floor(Math.random() * 10);
                const res = x + b;
                qText = `Giải phương trình: x + ${b} = ${res}`;
                ans = x;
            } else {
                // Grade 8-9: Quadratic, systems
                const x = Math.floor(Math.random() * 5) + 1;
                qText = `Giải x: ${x}² + 2 = ${x*x + 2}`;
                ans = x;
            }

            opts = [ans, ans + 1, ans - 1, Math.floor(Math.random() * 20)].map(String);
            // Ensure unique options
            opts = [...new Set(opts)];
            while(opts.length < 4) opts.push(String(Math.floor(Math.random() * 100)));
            opts.sort(() => Math.random() - 0.5);
            
            questions.push({ q: qText, options: opts, answer: String(ans) });
        } else {
            // English Grade-based with theme and subtopic variety
            const engConfig = CURRICULUM.english[grade] || CURRICULUM.english[1];
            const themeIndex = typeof topicId === 'string' && topicId.startsWith('e') ? parseInt(topicId.substring(1)) || 0 : 0;
            const theme = engConfig.themes[themeIndex % engConfig.themes.length] || "General";
            const subtopics = engConfig.subtopics || ["Basic"];
            const subtopic = subtopics[i % subtopics.length];
            
            const engQTypes = [
                { q: `Chọn nghĩa của từ: "${theme}"`, a: "Đúng nghĩa", opts: ["Đúng nghĩa", "Sai nghĩa", "Trái nghĩa", "Không biết"] },
                { q: `Điền vào chỗ trống: ${subtopic} is ...`, a: "Good", opts: ["Good", "Bad", "Table", "Car"] },
                { q: `Từ nào khác loại:`, a: "Apple", opts: ["Apple", "Run", "Jump", "Walk"] },
                { q: `Sắp xếp: "I / study / English"`, a: "I study English", opts: ["I study English", "Study I English", "English study I", "I English study"] }
            ];

            const type = engQTypes[i % engQTypes.length];
            qText = type.q;
            ans = type.a;
            opts = type.opts;
            
            questions.push({ q: qText, options: opts, answer: ans });
        }
    }
    return questions;
}


// --- STATE MANAGEMENT ---
let state = {
    user: null,
    xp: 0,
    level: 1,
    coins: 0,
    streak: 0,
    currentGrade: 1,
    currentSubject: null,
    currentTopic: null,
    currentLesson: null,
    currentQuestions: [],
    questionIndex: 0,
    score: 0,
    theme: 'light',
    completedLessons: [], // Track finished lessons
    chatHistory: [],
    badges: [],
    ownedItems: [], // Track purchased items
    friends: [], // Track friend list
    equippedAvatar: '🐿️',
    lastLessonDate: null, // Track when the last lesson was completed
    isChatOpen: false,
    mathGame: {
        score: 0,
        timeLeft: 30,
        timer: null,
        currentAnswer: null,
        combo: 0,
        highScore: 0
    },
    englishGame: {
        score: 0,
        currentIndex: 0,
        combo: 0,
        highScore: 0
    },
    memoryGame: {
        score: 0,
        timeLeft: 45,
        timer: null,
        flipped: [],
        matched: 0,
        cards: []
    },
    scrambleGame: {
        score: 0,
        currentIndex: 0,
        currentInput: '',
        highScore: 0
    },
    triviaGame: {
        score: 0,
        currentIndex: 0,
        highScore: 0
    },
    activeGame: {
        type: '',
        score: 0,
        currentIndex: 0,
        data: []
    },
    missions: [
        { id: 'math_play', title: 'Chơi 2 ván Toán', type: 'math_play', current: 0, target: 2, reward: 20, completed: false, claimed: false },
        { id: 'english_play', title: 'Học 1 bài Tiếng Anh', type: 'english_play', current: 0, target: 1, reward: 30, completed: false, claimed: false },
        { id: 'streak_3', title: 'Học 3 ngày liên tiếp', type: 'streak_3', current: 0, target: 3, reward: 50, completed: false, claimed: false }
    ]
};

const MEMORY_EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const KNOWLEDGE_BASE = {
    fraction: {
        1: [{q: '1/2 của 2 là?', o: ['1', '2', '0', '3'], a: '1'}],
        4: [{q: 'Rút gọn 2/4', o: ['1/2', '2/3', '1/4', '3/4'], a: '1/2'}, {q: '3/4 + 1/4 = ?', o: ['1', '2/4', '4/8', '1/2'], a: '1'}],
        9: [{q: 'Giải x: x/2 = 3/4', o: ['1.5', '1', '2', '0.5'], a: '1.5'}]
    },
    geometry: {
        1: [{q: 'Hình nào có 4 cạnh bằng nhau?', o: ['Hình vuông', 'Hình tròn', 'Hình tam giác', 'Hình thoi'], a: 'Hình vuông'}],
        5: [{q: 'Diện tích tam giác đáy 4 cao 5?', o: ['10', '20', '9', '15'], a: '10'}],
        9: [{q: 'Hệ thức lượng: Sin^2 + Cos^2 = ?', o: ['1', '0', '2', '-1'], a: '1'}]
    },
    sequence: {
        1: [{q: '1, 2, 3, 4, ?', o: ['5', '6', '0', '4'], a: '5'}],
        5: [{q: '2, 4, 8, 16, ?', o: ['32', '20', '64', '30'], a: '32'}],
        9: [{q: '1, 1, 2, 3, 5, ?', o: ['8', '13', '7', '10'], a: '8'}]
    },
    sort: {
        1: { categories: ['Fruit', 'Vehicle'], items: [{t: 'Apple', c: 'Fruit'}, {t: 'Car', c: 'Vehicle'}, {t: 'Bike', c: 'Vehicle'}, {t: 'Orange', c: 'Fruit'}] },
        5: { categories: ['Verb', 'Noun'], items: [{t: 'Run', c: 'Verb'}, {t: 'Eating', c: 'Verb'}, {t: 'Student', c: 'Noun'}, {t: 'School', c: 'Noun'}] },
        9: { categories: ['Tech', 'Envi'], items: [{t: 'Software', c: 'Tech'}, {t: 'Pollution', c: 'Envi'}, {t: 'Cloud', c: 'Tech'}, {t: 'Wildlife', c: 'Envi'}] }
    },
    synonym: {
        1: [{q: 'Large', o: ['Big', 'Small', 'Hot', 'Cold'], a: 'Big'}],
        5: [{q: 'Begin', o: ['Start', 'End', 'Stop', 'Fast'], a: 'Start'}],
        9: [{q: 'Intelligent', o: ['Smart', 'Dull', 'Brave', 'Strong'], a: 'Smart'}]
    },
    sentence: {
        1: [{q: ['am', 'I', 'a', 'boy'], a: 'I am a boy'}],
        5: [{q: ['reading', 'She', 'is', 'a', 'book'], a: 'She is reading a book'}],
        9: [{q: ['If', 'I', 'were', 'rich', 'I', 'would', 'travel'], a: 'If I were rich I would travel'}]
    }
};

const ENGLISH_WORDS = [
    { word: 'Apple', visual: '🍎', options: ['Quả táo', 'Quả cam', 'Bông hoa', 'Quả chuối'], answer: 'Quả táo' },
    { word: 'Dog', visual: '🐶', options: ['Con mèo', 'Con chó', 'Con cá', 'Con vượn'], answer: 'Con chó' },
    { word: 'Scholar', visual: '🎓', options: ['Bút chì', 'Học giả', 'Cái bàn', 'Ngôi trường'], answer: 'Học giả' },
    { word: 'Book', visual: '📚', options: ['Quyển vở', 'Quyển sách', 'Cái cặp', 'Cái bút'], answer: 'Quyển sách' },
    { word: 'Sun', visual: '☀️', options: ['Mặt trăng', 'Ngôi sao', 'Mặt trời', 'Đám mây'], answer: 'Mặt trời' },
    { word: 'Computer', visual: '💻', options: ['Điện thoại', 'Máy tính', 'Tivi', 'Đèn bàn'], answer: 'Máy tính' },
    { word: 'Bicycle', visual: '🚲', options: ['Xe máy', 'Xe đạp', 'Ô tô', 'Máy bay'], answer: 'Xe đạp' }
];

const SCRAMBLE_WORDS = [
    { word: 'CHO', hint: 'Con vật hay sủa' },
    { word: 'MEO', hint: 'Con vật hay bắt chuột' },
    { word: 'SAO', hint: 'Thường xuất hiện ban đêm trên trời' },
    { word: 'MAU', hint: 'Gồm xanh, đỏ, tím, vàng...' },
    { word: 'HOC', hint: 'Việc chính của học sinh' }
];

const TRIVIA_QUESTIONS = [
    { q: 'Thủ đô của Việt Nam là gì?', options: ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Huế'], answer: 'Hà Nội', cat: 'Địa lý' },
    { q: 'Đâu là con vật lớn nhất trên Trái Đất?', options: ['Voi', 'Cá voi xanh', 'Hươu cao cổ', 'Cá mập'], answer: 'Cá voi xanh', cat: 'Tự nhiên' },
    { q: 'Số nào là số chẵn nhỏ nhất?', options: ['1', '2', '0', '4'], answer: '0', cat: 'Toán học' },
    { q: 'Mặt trời mọc ở hướng nào?', options: ['Đông', 'Tây', 'Nam', 'Bắc'], answer: 'Đông', cat: 'Địa lý' }
];

const ANTONYMS_DATA = [
    { q: 'Hot', options: ['Cold', 'Big', 'Fast', 'Old'], answer: 'Cold' },
    { q: 'Open', options: ['Close', 'Up', 'Left', 'Short'], answer: 'Close' },
    { q: 'Happy', options: ['Sad', 'Angry', 'Brave', 'Nice'], answer: 'Sad' },
    { q: 'Big', options: ['Small', 'Tall', 'Deep', 'Long'], answer: 'Small' },
    { q: 'Day', options: ['Night', 'Cloud', 'Sky', 'Rain'], answer: 'Night' }
];

const FILL_DATA = [
    { q: 'I ____ a student.', options: ['am', 'is', 'are', 'be'], answer: 'am' },
    { q: 'The cat is ____ the chair.', options: ['under', 'of', 'at', 'with'], answer: 'under' },
    { q: 'Do you ____ English?', options: ['speak', 'speaks', 'speaking', 'spoke'], answer: 'speak' },
    { q: 'This is ____ apple.', options: ['an', 'a', 'the', 'some'], answer: 'an' }
];

const SPELLING_DATA = [
    { q: 'S_hool', options: ['c', 'k', 't', 'p'], answer: 'c', full: 'School' },
    { q: 'Penc_l', options: ['i', 'e', 'a', 'y'], answer: 'i', full: 'Pencil' },
    { q: 'T_acher', options: ['e', 'a', 'i', 'u'], answer: 'e', full: 'Teacher' },
    { q: 'F_iend', options: ['r', 'l', 'n', 't'], answer: 'r', full: 'Friend' }
];

const STORE_ITEMS = [
    { id: 'avatar_cute', name: 'Sóc Cute', price: 50, icon: '🐿️', type: 'avatar' },
    { id: 'avatar_cool', name: 'Sóc Ngầu', price: 100, icon: '😎', type: 'avatar' },
    { id: 'avatar_grad', name: 'Sóc Tiến Sĩ', price: 200, icon: '👨‍🎓', type: 'avatar' },
    { id: 'avatar_fast', name: 'Sóc Siêu Nhân', price: 300, icon: '⚡', type: 'avatar' },
    { id: 'theme_dark', name: 'Giao diện Tối', price: 150, icon: '🌙', type: 'theme' },
    { id: 'badge_pro', name: 'Huy hiệu Pro', price: 200, icon: '🥇', type: 'badge' },
];

const MOCK_LEADERBOARD = [
    { name: 'Sóc Siêu Nhân', xp: 2500, level: 25 },
    { name: 'Gấu Trúc', xp: 2100, level: 21 },
    { name: 'Thỏ Thông Thái', xp: 1950, level: 20 },
    { name: 'Khỉ Năng Động', xp: 1800, level: 18 },
    { name: 'Voi Bản Lĩnh', xp: 1500, level: 15 },
];

// --- CORE FUNCTIONS ---

function init() {
    // Add a default user if none exists for easier testing
    const users = JSON.parse(localStorage.getItem('soc_users') || '[]');
    if (users.length === 0) {
        users.push({ name: "Người dùng mới", email: "soc@vuihoc.com", password: "123" });
        localStorage.setItem('soc_users', JSON.stringify(users));
    }

    loadUserData();
    setupEventListeners();
    updateUI();
    
    if (!state.user) {
        switchToScreen('welcome-screen');
    }
}

function loadUserData() {
    const savedUser = localStorage.getItem('soc_vui_hoc_user');
    const savedXp = localStorage.getItem('soc_vui_hoc_xp');
    const savedGrade = localStorage.getItem('soc_vui_hoc_grade');
    const savedLessons = localStorage.getItem('soc_vui_hoc_lessons');
    const savedCoins = localStorage.getItem('soc_vui_hoc_coins');
    const savedStreak = localStorage.getItem('soc_vui_hoc_streak');
    const savedOwned = localStorage.getItem('soc_vui_hoc_owned');
    const savedAvatar = localStorage.getItem('soc_vui_hoc_avatar');
    const savedBadges = localStorage.getItem('soc_vui_hoc_badges');
    const savedMathHigh = localStorage.getItem('soc_vui_hoc_math_high');
    const savedEngHigh = localStorage.getItem('soc_vui_hoc_eng_high');
    const savedScrambleHigh = localStorage.getItem('soc_vui_hoc_scramble_high');
    const savedTriviaHigh = localStorage.getItem('soc_vui_hoc_trivia_high');
    const savedMissions = localStorage.getItem('soc_vui_hoc_missions');
    const savedFriends = localStorage.getItem('soc_vui_hoc_friends');
    const savedChat = localStorage.getItem('soc_vui_hoc_chat_history');
    const savedLastLesson = localStorage.getItem('soc_vui_hoc_last_lesson_date');
    
    if (savedUser) {
        try {
            state.user = JSON.parse(savedUser);
            state.xp = parseInt(savedXp || 0);
            state.coins = parseInt(savedCoins || 0);
            state.streak = parseInt(savedStreak || 0);
            state.mathGame.highScore = parseInt(savedMathHigh || 0);
            state.englishGame.highScore = parseInt(savedEngHigh || 0);
            state.scrambleGame.highScore = parseInt(savedScrambleHigh || 0);
            if (state.triviaGame) state.triviaGame.highScore = parseInt(savedTriviaHigh || 0);
            state.currentGrade = parseInt(state.user.grade || savedGrade || 1);
            state.level = Math.floor(state.xp / 100) + 1;
            state.completedLessons = JSON.parse(savedLessons || '[]');
            state.ownedItems = JSON.parse(savedOwned || '[]');
            state.badges = JSON.parse(savedBadges || '[]');
            state.chatHistory = JSON.parse(savedChat || '[]');
            state.friends = JSON.parse(savedFriends || '[]');
            state.lastLessonDate = savedLastLesson || null;
            state.equippedAvatar = savedAvatar || '🐿️';
            if (savedMissions) state.missions = JSON.parse(savedMissions);
            switchToScreen('dashboard-screen');
        } catch (e) {
            console.error("Load user data error:", e);
            localStorage.removeItem('soc_vui_hoc_user');
        }
    }
}

function saveProgress() {
    if (state.user) {
        localStorage.setItem('soc_vui_hoc_user', JSON.stringify(state.user));
    }
    localStorage.setItem('soc_vui_hoc_grade', state.currentGrade);
    localStorage.setItem('soc_vui_hoc_xp', state.xp);
    localStorage.setItem('soc_vui_hoc_coins', state.coins);
    localStorage.setItem('soc_vui_hoc_streak', state.streak);
    localStorage.setItem('soc_vui_hoc_lessons', JSON.stringify(state.completedLessons));
    localStorage.setItem('soc_vui_hoc_owned', JSON.stringify(state.ownedItems));
    localStorage.setItem('soc_vui_hoc_badges', JSON.stringify(state.badges));
    localStorage.setItem('soc_vui_hoc_avatar', state.equippedAvatar);
    localStorage.setItem('soc_vui_hoc_chat_history', JSON.stringify(state.chatHistory || []));
    localStorage.setItem('soc_vui_hoc_math_high', state.mathGame.highScore);
    localStorage.setItem('soc_vui_hoc_eng_high', state.englishGame.highScore);
    localStorage.setItem('soc_vui_hoc_scramble_high', state.scrambleGame.highScore);
    if (state.triviaGame) localStorage.setItem('soc_vui_hoc_trivia_high', state.triviaGame.highScore);
    localStorage.setItem('soc_vui_hoc_missions', JSON.stringify(state.missions));
    localStorage.setItem('soc_vui_hoc_last_lesson_date', state.lastLessonDate || '');
    localStorage.setItem('soc_vui_hoc_friends', JSON.stringify(state.friends || []));
}

function switchToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Trigger study reminder if going to dashboard
        if (screenId === 'dashboard-screen') {
            setTimeout(checkStudyReminder, 4000);
        }
    }
}
window.switchToScreen = switchToScreen;
window.showMascotMessage = showMascotMessage;

function updateUI() {
    if (state.user) {
        const userEl = document.getElementById('display-user');
        const xpEl = document.getElementById('user-xp');
        const lvEl = document.getElementById('user-level');
        const grEl = document.getElementById('current-grade-display');
        
        if (userEl) userEl.textContent = state.user.name || state.user.email;
        if (xpEl) xpEl.textContent = state.xp;
        if (lvEl) lvEl.textContent = state.level;
        if (grEl) grEl.textContent = `Lớp ${state.currentGrade}`;

        const streakEl = document.getElementById('streak-count');
        const coinsEl = document.getElementById('coin-count');
        if (streakEl) streakEl.textContent = state.streak;
        if (coinsEl) coinsEl.textContent = state.coins;

        // Update profile screen specific elements
        const profName = document.getElementById('profile-name');
        const profEmail = document.getElementById('profile-email');
        const profXp = document.getElementById('profile-xp');
        const profLevel = document.getElementById('profile-level');
        const profGrade = document.getElementById('profile-grade');
        const profAvatar = document.getElementById('profile-avatar-display');

        if (profName) profName.textContent = state.user.name || "Người dùng";
        if (profEmail) profEmail.textContent = state.user.email;
        if (profXp) profXp.textContent = state.xp;
        if (profLevel) profLevel.textContent = state.level;
        if (profGrade) profGrade.textContent = state.currentGrade;
        if (profAvatar) profAvatar.textContent = state.equippedAvatar;

        // Update avatar globally
        const avatars = document.querySelectorAll('.avatar-circle, .mascot-mini, .profile-avatar');
        avatars.forEach(av => {
            av.textContent = state.equippedAvatar;
        });

        renderMissions();
    }
}

// Friends Logic
function renderFriends() {
    const listContainer = document.getElementById('friends-list-render');
    if (!listContainer) return;

    if (!state.friends || state.friends.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-friends">
                <div style="font-size: 3rem; margin-bottom: 10px;">🐿️</div>
                <p>Bạn chưa có người bạn nào. Hãy tìm kiếm và kết bạn ngay nhé!</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = state.friends.map(friend => `
        <div class="friend-card">
            <div class="friend-avatar-circle">${friend.avatar || '🐿️'}</div>
            <div class="friend-details">
                <div class="friend-name">${friend.name}</div>
                <div class="friend-level">Cấp độ ${friend.level || 1}</div>
            </div>
            <button class="btn-remove-friend" onclick="removeFriend('${friend.email}')" title="Xóa bạn bè">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </button>
        </div>
    `).join('');
}

function searchFriends() {
    const input = document.getElementById('friend-search-input');
    const resultsArea = document.getElementById('search-results-area');
    if (!input || !resultsArea) return;

    const query = input.value.trim().toLowerCase();
    if (!query) {
        resultsArea.style.display = 'none';
        return;
    }

    // Lấy danh sách tất cả người dùng từ registry (soc_users)
    const allUsers = JSON.parse(localStorage.getItem('soc_users') || '[]');
    
    // Lọc ra các người dùng khớp với query (tên hoặc email) và không phải là chính mình
    const filtered = allUsers.filter(u => {
        const isSelf = state.user && u.email === state.user.email;
        const fullName = u.fullName || u.name || '';
        const matches = (fullName.toLowerCase().includes(query)) || 
                        (u.email && u.email.toLowerCase().includes(query));
        return !isSelf && matches;
    });

    if (filtered.length === 0) {
        resultsArea.innerHTML = `<p style="padding: 10px; color: var(--text-muted);">Không tìm thấy người bạn nào phù hợp.</p>`;
    } else {
        resultsArea.innerHTML = filtered.map(u => {
            const isAlreadyFriend = state.friends && state.friends.some(f => f.email === u.email);
            return `
                <div class="user-result-item">
                    <div class="user-info-brief">
                        <div class="avatar">${u.avatar || '👤'}</div>
                        <div class="details">
                            <div class="name">${u.fullName || u.name}</div>
                            <div class="email">${u.email}</div>
                        </div>
                    </div>
                    ${isAlreadyFriend ? 
                        `<span style="color: var(--primary); font-size: 0.8rem; font-weight: 700;">Đã là bạn bè</span>` : 
                        `<button class="btn-primary" onclick="addFriend('${u.email}')" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 8px;">+ Kết bạn</button>`
                    }
                </div>
            `;
        }).join('');
    }
    resultsArea.style.display = 'block';
}

function addFriend(email) {
    const allUsers = JSON.parse(localStorage.getItem('soc_users') || '[]');
    const userToAdd = allUsers.find(u => u.email === email);
    
    if (userToAdd) {
        if (!state.friends) state.friends = [];
        
        // Tránh trùng lặp
        if (state.friends.some(f => f.email === email)) return;

        state.friends.push({
            email: userToAdd.email,
            name: userToAdd.fullName || userToAdd.name,
            avatar: userToAdd.avatar || '🐿️',
            level: userToAdd.level || Math.floor((userToAdd.xp || 0) / 100) + 1
        });

        saveProgress();
        renderFriends();
        searchFriends(); // Update search results list
        showMascotMessage(`Đã thêm ${userToAdd.fullName || userToAdd.name} vào danh sách bạn bè! 🐿️🤝`, 3000);
    }
}

function removeFriend(email) {
    if (confirm("Bạn có chắc chắn muốn xóa người bạn này không?")) {
        state.friends = state.friends.filter(f => f.email !== email);
        saveProgress();
        renderFriends();
        showMascotMessage("Đã xóa bạn bè.", 2000);
    }
}

// Ensure functions are global for onclick handlers
window.addFriend = addFriend;
window.removeFriend = removeFriend;

function showLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;

    // Merge current user with mock data for dynamic sorting
    const currentUserData = {
        name: `${state.user.name || "Bạn"} (Bạn)`,
        level: state.level,
        xp: state.xp,
        isUser: true
    };

    const combinedList = [...MOCK_LEADERBOARD, currentUserData].sort((a, b) => {
        if (b.xp !== a.xp) return b.xp - a.xp;
        return b.level - a.level;
    });

    list.innerHTML = `
        <table class="lb-table" style="width:100%; border-collapse:collapse;">
            <thead style="background:#f8fafc; text-align:left;">
                <tr>
                    <th style="padding:16px;">Hạng</th>
                    <th style="padding:16px;">Người học</th>
                    <th style="padding:16px;">Cấp độ</th>
                    <th style="padding:16px;">Tổng XP</th>
                </tr>
            </thead>
            <tbody>
                ${combinedList.map((item, index) => {
                    const isUser = item.isUser;
                    return `
                    <tr style="border-bottom:1px solid #f1f5f9; ${isUser ? 'background:#f0fdf4; position:relative; z-index:1;' : ''}">
                        <td style="padding:16px;">
                            <span class="rank-num" style="width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:${index==0?'#ffd700':index==1?'#c0c0c0':index==2?'#cd7f32':'#e2e8f0'};color:white;font-weight:700;">
                                ${index + 1}
                            </span>
                        </td>
                        <td style="padding:16px; font-weight:700;">${item.name}</td>
                        <td style="padding:16px;">${item.level}</td>
                        <td style="padding:16px; color:var(--primary); font-weight:800;">${item.xp} XP</td>
                    </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    switchToScreen('leaderboard-screen');
}

function showStore() {
    const grid = document.getElementById('store-items-grid');
    const balance = document.getElementById('store-coin-total');
    if (balance) balance.textContent = state.coins;
    if (!grid) return;

    grid.innerHTML = STORE_ITEMS.map(item => {
        const isOwned = state.ownedItems.includes(item.id);
        return `
            <div class="store-item">
                <div class="item-visual">${item.icon}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-price">${isOwned ? 'Đã sở hữu' : '🪙 ' + item.price + ' xu'}</div>
                <button class="btn-buy" id="buy-${item.id}" ${isOwned ? 'disabled style="opacity:0.5; cursor:not-allowed"' : ''}>
                    ${isOwned ? 'Hợp lệ' : 'Đổi ngay'}
                </button>
            </div>
        `;
    }).join('');

    STORE_ITEMS.forEach(item => {
        const isOwned = state.ownedItems.includes(item.id);
        if (!isOwned) {
            const btn = document.getElementById(`buy-${item.id}`);
            if (btn) btn.onclick = () => buyItem(item.id, item.price);
        }
    });

    renderInventory();
    switchToScreen('store-screen');
}

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;

    if (state.ownedItems.length === 0) {
        grid.innerHTML = '<div class="empty-inventory">Bạn chưa có quà tặng nào. Hãy chăm chỉ học tập để nhận nhiều quà nhé! 🐿️🎁</div>';
        return;
    }

    grid.innerHTML = state.ownedItems.map(itemId => {
        const item = STORE_ITEMS.find(i => i.id === itemId);
        if (!item) return '';
        
        let isEquipped = false;
        if (item.type === 'avatar' && state.equippedAvatar === item.icon) isEquipped = true;
        if (item.type === 'theme' && state.theme === 'dark') isEquipped = true;

        return `
            <div class="inventory-item ${isEquipped ? 'equipped' : ''}">
                <div class="item-visual">${item.icon}</div>
                <div class="item-name">${item.name}</div>
                <button class="btn-use" id="use-${item.id}">${isEquipped ? 'Đang dùng' : 'Sử dụng'}</button>
            </div>
        `;
    }).join('');

    state.ownedItems.forEach(itemId => {
        const btn = document.getElementById(`use-${itemId}`);
        if (btn) btn.onclick = () => useItem(itemId);
    });
}

function buyItem(id, price) {
    if (state.coins >= price) {
        state.coins -= price;
        state.ownedItems.push(id);
        saveProgress();
        updateUI();
        showStore();
        showMascotMessage("Chúc mừng! Bạn đã đổi thành công vật phẩm! 🎁", 3000);
    } else {
        showMascotMessage("Opps! Bạn chưa đủ xu rồi, hãy học thêm nhé! 🐿️", 3000);
    }
}

function useItem(id) {
    const item = STORE_ITEMS.find(i => i.id === id);
    if (!item) return;

    if (item.type === 'avatar') {
        state.equippedAvatar = item.icon;
        showMascotMessage(`Đã thay đổi diện mạo thành ${item.name}! ✨`, 2000);
    } else if (item.type === 'theme') {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('dark-theme', state.theme === 'dark');
        showMascotMessage(`Đã thay đổi giao diện! 🌙`, 2000);
    } else if (item.type === 'badge') {
        showMascotMessage(`Bạn đang mang huy hiệu ${item.name}! 🏆`, 2000);
    }

    saveProgress();
    updateUI();
    renderInventory();
}

function showMascotMessage(msg, duration = 3000) {
    const bubble = document.getElementById('mascot-speech');
    if (bubble) {
        bubble.textContent = msg;
        bubble.classList.add('active');
        
        // Auto-scroll to mascot if needed or ensure visibility
        if (state.isChatOpen) return; // Don't hide bubble if chat is open might be annoying? Actually bubble is outside.
        
        setTimeout(() => {
            bubble.classList.remove('active');
        }, duration);
    }
}

// --- AI CHAT LOGIC ---

function toggleAIChat() {
    state.isChatOpen = !state.isChatOpen;
    const modal = document.getElementById('ai-chat-modal');
    if (modal) {
        modal.classList.toggle('active', state.isChatOpen);
        if (state.isChatOpen) {
            const input = document.getElementById('chat-input');
            if (input) input.focus();
            showMascotMessage("Mình ở đây nè! 🐿️✨");
        }
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const container = document.getElementById('chat-messages');
    if (!input || !container) return;

    const text = input.value.trim();
    if (!text) return;

    // Add user message
    const userMsg = { role: 'user', text };
    state.chatHistory.push(userMsg);
    renderMessage(userMsg);
    input.value = '';
    
    // Auto-scroll
    container.scrollTop = container.scrollHeight;

    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message system loading';
    loadingDiv.textContent = 'Sóc đang suy nghĩ...';
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;

    // Get AI response
    const response = await askSmartSquirrel(text, state.chatHistory.slice(0, -1));
    
    // Remove loading
    container.removeChild(loadingDiv);

    // Add AI message
    const aiMsg = { role: 'model', text: response };
    state.chatHistory.push(aiMsg);
    renderMessage(aiMsg);
    container.scrollTop = container.scrollHeight;
}

function renderMessage(msg) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = `message ${msg.role === 'user' ? 'user' : 'system'}`;
    div.textContent = msg.text;
    container.appendChild(div);
}

// --- NAVIGATION HANDLERS ---

function showProfile() {
    document.getElementById('profile-name').textContent = state.user.fullName || state.user.name;
    document.getElementById('profile-email').textContent = `${state.user.email} • ${state.user.location || 'Chưa rõ'}`;
    document.getElementById('profile-xp').textContent = state.xp;
    document.getElementById('profile-level').textContent = state.level;
    document.getElementById('profile-grade').textContent = state.currentGrade;
    
    // Simple achievement check
    const container = document.getElementById('achievement-container');
    if (container) {
        container.innerHTML = '';
        const achievements = [
            { icon: '🏅', name: 'Mới bắt đầu', condition: true },
            { icon: '🔥', name: 'Cấp độ 5', condition: state.level >= 5 },
            { icon: '💎', name: 'Đại gia XP (500+)', condition: state.xp >= 500 },
            { icon: '🎓', name: 'Tốt nghiệp lớp 9', condition: state.currentGrade >= 9 }
        ];
        
        achievements.forEach(a => {
            const div = document.createElement('div');
            div.className = `achievement-item ${a.condition ? '' : 'locked'}`;
            div.innerHTML = `<span>${a.icon}</span> ${a.name}`;
            container.appendChild(div);
        });
    }
    
    switchToScreen('profile-screen');
}

function showRoadmap() {
    const container = document.getElementById('roadmap-path');
    if (container) {
        container.innerHTML = '';
        const steps = [
            { id: 1, icon: '🐣', label: 'Bắt đầu' },
            { id: 2, icon: '🚲', label: 'Tập đi' },
            { id: 3, icon: '🎒', label: 'Đến trường' },
            { id: 4, icon: '📚', label: 'Chăm học' },
            { id: 5, icon: '🦁', label: 'Mạnh mẽ' },
            { id: 6, icon: '🚀', label: 'Bay xa' }
        ];
        
        steps.forEach(s => {
            const div = document.createElement('div');
            const isActive = state.level >= s.id;
            const isCompleted = state.level > s.id;
            
            div.className = `roadmap-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
            div.innerHTML = s.icon;
            div.title = s.label;
            container.appendChild(div);
        });
    }
    
    switchToScreen('roadmap-screen');
}

function showGradeSelection() {
    const container = document.getElementById('grade-container');
    if (!container) return;
    container.innerHTML = '';
    
    for (let i = 1; i <= 9; i++) {
        const btn = document.createElement('button');
        btn.className = `grade-btn ${state.currentGrade === i ? 'active' : ''}`;
        btn.textContent = `Lớp ${i}`;
        btn.onclick = () => {
            state.currentGrade = i;
            saveProgress();
            updateUI();
            switchToScreen('dashboard-screen');
            showMascotMessage(`Bắt đầu học chương trình Lớp ${i} nào!`);
        };
        container.appendChild(btn);
    }
    switchToScreen('grade-selection-screen');
}

function handleSubjectSelect(subjectKey) {
    state.currentSubject = subjectKey;
    const sub = SUBJECTS_DATA[subjectKey];
    const titleEl = document.getElementById('current-subject-title');
    if (titleEl) titleEl.textContent = sub.title;
    
    const container = document.getElementById('topic-container');
    if (!container) return;
    container.innerHTML = '';
    
    const topics = sub.getTopics(state.currentGrade);
    topics.forEach((topic, idx) => {
        const div = document.createElement('div');
        div.className = 'topic-item';
        div.innerHTML = `
            <div>
                <span class="topic-num">${idx + 1}</span>
                <span class="topic-title">${topic.title}</span>
            </div>
            <span class="chevron">→</span>
        `;
        div.onclick = () => handleTopicSelect(topic);
        container.appendChild(div);
    });
    
    switchToScreen('topics-screen');
    showMascotMessage("Lựa chọn rất đúng đắn!");
}

function handleTopicSelect(topic) {
    state.currentTopic = topic;
    const titleEl = document.getElementById('current-topic-title');
    if (titleEl) titleEl.textContent = topic.title;
    
    const container = document.getElementById('lesson-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Use actual lessons from topic data if available, otherwise fallback to generic 8
    const lessonList = (topic.lessons && Array.isArray(topic.lessons)) ? topic.lessons : Array.from({length: 8}, (_, k) => ({ id: k + 1, title: `Bài ${k + 1}` }));
    
    lessonList.forEach((lesson, index) => {
        const div = document.createElement('div');
        div.className = 'lesson-card';
        div.innerHTML = `
            <div class="lesson-icon">📖</div>
            <h4>${lesson.title || `Bài ${index + 1}`}</h4>
        `;
        div.onclick = () => startQuiz(lesson.id || index + 1);
        container.appendChild(div);
    });
    
    switchToScreen('lessons-screen');
}

// --- QUIZ LOGIC ---

function startQuiz(lessonNum) {
    state.currentLesson = lessonNum;
    state.currentQuestions = generateQuestions(state.currentSubject, state.currentTopic.id, lessonNum, state.currentGrade);
    state.questionIndex = 0;
    state.score = 0;
    
    renderQuestion();
    switchToScreen('quiz-screen');
    showMascotMessage("Cố gắng đạt điểm tối đa nhé!");
}

function renderQuestion() {
    const q = state.currentQuestions[state.questionIndex];
    const qText = document.getElementById('question-text');
    const qCounter = document.getElementById('quiz-counter');
    const progressFill = document.getElementById('quiz-progress-fill');
    
    if (qText) qText.textContent = q.q;
    if (qCounter) qCounter.textContent = `${state.score}/20 điểm`;
    
    const progress = (state.score / 20) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    
    const optionsContainer = document.getElementById('options-container');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';
    
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => handleAnswer(opt, btn);
        optionsContainer.appendChild(btn);
    });
    
    const nextBtn = document.getElementById('btn-next-question');
    if (nextBtn) nextBtn.disabled = true;
}

async function handleAnswer(selected, btn) {
    const q = state.currentQuestions[state.questionIndex];
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);
    
    if (selected === q.answer) {
        btn.classList.add('correct');
        const oldLevel = state.level;
        state.score++;
        state.xp += 10; // More XP for correct answer
        state.level = Math.floor(state.xp / 100) + 1;
        
        if (state.level > oldLevel) {
            showMascotMessage(`BẠN ĐÃ LÊN CẤP ${state.level}! 🎉`, 4000);
        } else {
            const encouragements = [
                "Chính xác! +10 XP",
                "Quá giỏi luôn! ✨",
                "Tiếp tục thế nhé! 🐿️",
                "Bạn thông minh quá!"
            ];
            const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
            showMascotMessage(msg, 1500);
        }
    } else {
        btn.classList.add('wrong');
        const quizBody = document.querySelector('.quiz-body');
        if (quizBody) {
             quizBody.classList.add('wrong-animation');
             setTimeout(() => quizBody.classList.remove('wrong-animation'), 300);
        }
        
        state.score = Math.max(0, state.score - 1);
        allBtns.forEach(b => {
            if (b.textContent == q.answer) b.classList.add('correct');
        });
        
        // AI Hint when wrong
        const hint = await getHintOrEncouragement(`Học sinh vừa làm sai bài toán/tiếng anh lớp ${state.currentGrade}. Câu hỏi là: ${q.q}. Đáp án đúng là: ${q.answer}.`);
        showMascotMessage(hint, 4000);
    }
    
    const nextBtn = document.getElementById('btn-next-question');
    if (nextBtn) nextBtn.disabled = false;
    
    saveProgress();
    updateUI();
    
    // Update progress bar immediately after answer
    const progress = (state.score / 20) * 100;
    const progressFill = document.getElementById('quiz-progress-fill');
    const qCounter = document.getElementById('quiz-counter');
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (qCounter) qCounter.textContent = `${state.score}/20 điểm`;
}

function nextQuestion() {
    if (state.score >= 20) {
        finishQuiz();
        return;
    }

    state.questionIndex++;
    // If we run out of pre-generated questions, generate more
    if (state.questionIndex >= state.currentQuestions.length) {
        const moreQuestions = generateQuestions(state.currentSubject, state.currentTopic.id, state.currentLesson, state.currentGrade);
        state.currentQuestions = state.currentQuestions.concat(moreQuestions);
    }
    
    renderQuestion();
}

function finishQuiz() {
    const earnedXpEl = document.getElementById('earned-xp');
    if (earnedXpEl) earnedXpEl.textContent = `+${state.score} XP`;
    
    // Record study date for reminder logic
    state.lastLessonDate = new Date().toDateString();
    saveProgress();
    
    switchToScreen('result-screen');
    showMascotMessage("Rất tốt! Cùng xem thành quả nào.");
}

function showStats() {
    const totalLessons = document.getElementById('stats-total-lessons');
    const streak = document.getElementById('stats-current-streak');
    const avgScore = document.getElementById('stats-avg-score');

    if (totalLessons) totalLessons.textContent = state.completedLessons.length;
    if (streak) streak.textContent = state.streak;
    if (avgScore) avgScore.textContent = state.completedLessons.length > 0 ? "85%" : "0%"; 

    switchToScreen('stats-screen');
}

// --- GAMES LOGIC ---

function startMathGame() {
    state.mathGame.score = 0;
    state.mathGame.timeLeft = 30;
    state.mathGame.combo = 0;
    document.getElementById('math-score').textContent = '0';
    document.getElementById('math-timer').textContent = '30';
    
    // UI showing high score
    const scoreDisplay = document.getElementById('math-score');
    if (scoreDisplay) scoreDisplay.innerHTML = `0 <small style="font-size: 0.6em; opacity: 0.7;">(Kỷ lục: ${state.mathGame.highScore})</small>`;
    
    if (state.mathGame.timer) clearInterval(state.mathGame.timer);
    
    state.mathGame.timer = setInterval(() => {
        state.mathGame.timeLeft--;
        const timerEl = document.getElementById('math-timer');
        if (timerEl) {
            timerEl.textContent = state.mathGame.timeLeft;
            // Pulse timer red when low
            if (state.mathGame.timeLeft <= 5) timerEl.style.color = '#ef4444';
            else timerEl.style.color = '';
        }
        
        if (state.mathGame.timeLeft <= 0) {
            clearInterval(state.mathGame.timer);
            
            let message = `Hết giờ! Bạn đạt được ${state.mathGame.score} điểm. 🐿️✨`;
            if (state.mathGame.score > state.mathGame.highScore) {
                state.mathGame.highScore = state.mathGame.score;
                message = `KỶ LỤC MỚI! Bạn đạt ${state.mathGame.score} điểm. Quá xuất sắc! 🏆`;
            }
            showMascotMessage(message, 4000);
            
            // Reward
            if (state.mathGame.score > 0) {
                const xpGain = state.mathGame.score * 2;
                const coinGain = Math.floor(state.mathGame.score / 5);
                state.xp += xpGain;
                state.coins += coinGain;
                saveProgress();
                updateUI();
            }
            
            setTimeout(() => switchToScreen('games-screen'), 2000);
        }
    }, 1000);
    
    nextMathProblem();
    switchToScreen('math-game-screen');
}

function nextMathProblem() {
    const display = document.getElementById('math-problem-display');
    const container = document.querySelector('.math-input-grid');
    if (!display || !container) return;

    let a, b, answer, op;
    const grade = state.currentGrade;
    const difficultyBoost = Math.floor(state.mathGame.score / 50); // Harder as you score

    if (grade <= 2) {
        a = Math.floor(Math.random() * (10 + difficultyBoost)) + 1;
        b = Math.floor(Math.random() * (10 + difficultyBoost)) + 1;
        const isAdd = Math.random() > 0.4;
        op = isAdd ? '+' : '-';
        if (!isAdd) { a = Math.max(a, b); b = Math.min(a, b); }
        answer = isAdd ? (a + b) : (a - b);
    } else if (grade <= 5) {
        const type = Math.floor(Math.random() * 3);
        if (type === 0) {
            a = Math.floor(Math.random() * (50 + difficultyBoost*5)) + 10;
            b = Math.floor(Math.random() * (50 + difficultyBoost*5)) + 10;
            op = '+'; answer = a + b;
        } else if (type === 1) {
            a = Math.floor(Math.random() * (10 + difficultyBoost)) + 2;
            b = Math.floor(Math.random() * (10 + difficultyBoost)) + 2;
            op = '×'; answer = a * b;
        } else {
            b = Math.floor(Math.random() * 10) + 2;
            answer = Math.floor(Math.random() * 10) + 2;
            a = b * answer;
            op = '÷';
        }
    } else {
        const type = Math.floor(Math.random() * 2);
        if (type === 0) {
            a = Math.floor(Math.random() * (12 + difficultyBoost)) + 2;
            b = Math.floor(Math.random() * (12 + difficultyBoost)) + 2;
            op = '×'; answer = a * b;
        } else {
            a = Math.floor(Math.random() * 100) + 50;
            b = Math.floor(Math.random() * 80) + 20;
            op = '-'; answer = a - b;
        }
    }

    state.mathGame.currentAnswer = answer;
    display.textContent = `${a} ${op} ${b} = ?`;
    
    // Animation for new problem
    display.animate([
        { transform: 'scale(0.8)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
    ], { duration: 200 });

    // Generate options
    let options = [answer];
    while (options.length < 4) {
        const range = Math.max(5, Math.floor(Math.abs(answer)*0.2));
        const off = Math.floor(Math.random() * (range*2)) - range;
        const opt = answer + (off === 0 ? 3 : off);
        if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    container.innerHTML = options.map(opt => `<button class="math-opt">${opt}</button>`).join('');
    
    const btns = container.querySelectorAll('.math-opt');
    btns.forEach(btn => {
        btn.onclick = () => checkMathAnswer(parseInt(btn.textContent), btn);
    });
}

function checkMathAnswer(val, btn) {
    if (val === state.mathGame.currentAnswer) {
        btn.classList.add('correct');
        state.mathGame.combo++;
        
        // Dynamic points based on combo
        const basePoints = 10;
        const comboBonus = Math.floor(state.mathGame.combo / 3) * 5;
        state.mathGame.score += (basePoints + comboBonus);
        
        const scoreEl = document.getElementById('math-score');
        if (scoreEl) scoreEl.innerHTML = `${state.mathGame.score} <small style="font-size:0.6em; opacity:0.7;">(Kỷ lục: ${state.mathGame.highScore})</small>`;
        
        // Show combo text
        if (state.mathGame.combo >= 3) {
            showComboEffect(btn, `x${state.mathGame.combo}`);
        }
        
        setTimeout(nextMathProblem, 200);
    } else {
        btn.classList.add('wrong');
        state.mathGame.combo = 0;
        // Shake animation
        const problem = document.getElementById('math-problem-display');
        problem.animate([
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
        ], { duration: 200 });
        
        setTimeout(nextMathProblem, 500);
    }
}

function showComboEffect(target, text) {
    const effect = document.createElement('div');
    effect.className = 'combo-popup';
    effect.textContent = `Combo ${text}! 🔥`;
    effect.style.position = 'absolute';
    effect.style.left = '50%';
    effect.style.top = '-40px';
    effect.style.transform = 'translateX(-50%)';
    effect.style.color = '#f97316';
    effect.style.fontWeight = '900';
    effect.style.fontSize = '1.2rem';
    effect.style.pointerEvents = 'none';
    
    target.style.position = 'relative';
    target.appendChild(effect);
    
    effect.animate([
        { transform: 'translate(-50%, 0) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -40px) scale(1.5)', opacity: 0 }
    ], { duration: 600, easing: 'ease-out' }).onfinish = () => effect.remove();
}

function startEnglishGame() {
    state.englishGame.score = 0;
    state.englishGame.currentIndex = 0;
    state.englishGame.combo = 0;
    document.getElementById('english-score').textContent = '0';
    
    const scoreDisplay = document.getElementById('english-score');
    if (scoreDisplay) scoreDisplay.innerHTML = `0 <small style="font-size:0.6em; opacity:0.7;">(Kỷ lục: ${state.englishGame.highScore})</small>`;
    
    nextEnglishWord();
    switchToScreen('english-game-screen');
}

function nextEnglishWord() {
    if (state.englishGame.currentIndex >= ENGLISH_WORDS.length) {
        let message = `Bạn đã hoàn thành thử thách Tiếng Anh! 🎉`;
        if (state.englishGame.score > state.englishGame.highScore) {
            state.englishGame.highScore = state.englishGame.score;
            message = `Tuyệt vời! Bạn lập kỷ lục mới với ${state.englishGame.score} điểm! 🏆`;
        }
        showMascotMessage(message, 4000);
        
        state.xp += state.englishGame.score;
        state.coins += Math.floor(state.englishGame.score / 5);
        saveProgress();
        updateUI();
        setTimeout(() => switchToScreen('games-screen'), 2000);
        return;
    }

    const data = ENGLISH_WORDS[state.englishGame.currentIndex];
    const visual = document.getElementById('eng-word-visual');
    const word = document.getElementById('eng-word-text');
    const container = document.getElementById('eng-options');

    if (visual) {
        visual.textContent = data.visual;
        visual.animate([{ transform: 'translateY(-20px)' }, { transform: 'translateY(0)' }], { duration: 500, easing: 'ease-out' });
    }
    if (word) word.textContent = data.word;

    // Shuffle options
    const options = [...data.options].sort(() => Math.random() - 0.5);
    container.innerHTML = options.map(opt => `<button class="eng-opt">${opt}</button>`).join('');

    const btns = container.querySelectorAll('.eng-opt');
    btns.forEach(btn => {
        btn.onclick = () => checkEnglishAnswer(btn.textContent, btn);
    });
}

function checkEnglishAnswer(val, btn) {
    const data = ENGLISH_WORDS[state.englishGame.currentIndex];
    if (val === data.answer) {
        btn.classList.add('correct');
        state.englishGame.combo++;
        
        const comboBonus = Math.floor(state.englishGame.combo / 2) * 5;
        state.englishGame.score += (10 + comboBonus);
        
        document.getElementById('english-score').innerHTML = `${state.englishGame.score} <small style="font-size:0.6em; opacity:0.7;">(Kỷ lục: ${state.englishGame.highScore})</small>`;
        
        if (state.englishGame.combo >= 2) {
            showComboEffect(btn, `x${state.englishGame.combo}`);
        }
        
        state.englishGame.currentIndex++;
        setTimeout(nextEnglishWord, 800);
    } else {
        btn.classList.add('wrong');
        state.englishGame.combo = 0;
        
        // Show correct answer
        const btns = document.querySelectorAll('.eng-opt');
        btns.forEach(b => {
             if (b.textContent === data.answer) b.classList.add('correct');
        });
        
        state.englishGame.currentIndex++;
        setTimeout(nextEnglishWord, 1500);
    }
}

// --- MEMORY GAME LOGIC ---

function startMemoryGame() {
    state.memoryGame.score = 0;
    state.memoryGame.timeLeft = 45;
    state.memoryGame.matched = 0;
    state.memoryGame.flipped = [];
    document.getElementById('memory-score').textContent = '0';
    document.getElementById('memory-timer').textContent = '45';

    // Prepare cards
    const cardSet = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS];
    state.memoryGame.cards = cardSet.sort(() => Math.random() - 0.5);

    const grid = document.getElementById('memory-grid');
    grid.innerHTML = state.memoryGame.cards.map((emoji, idx) => `
        <div class="memory-card" id="card-${idx}" onclick="handleCardClick(${idx})">
            <div class="card-front">❓</div>
            <div class="card-back">${emoji}</div>
        </div>
    `).join('');

    if (state.memoryGame.timer) clearInterval(state.memoryGame.timer);
    
    state.memoryGame.timer = setInterval(() => {
        state.memoryGame.timeLeft--;
        const timerEl = document.getElementById('memory-timer');
        if (timerEl) timerEl.textContent = state.memoryGame.timeLeft;
        
        if (state.memoryGame.timeLeft <= 0) {
            endMemoryGame("Hết giờ rồi! Hãy cố gắng nhanh hơn nhé. 🐿️");
        }
    }, 1000);

    switchToScreen('memory-game-screen');
}

function handleCardClick(idx) {
    if (state.memoryGame.flipped.length === 2) return;
    const card = document.getElementById(`card-${idx}`);
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    state.memoryGame.flipped.push(idx);

    if (state.memoryGame.flipped.length === 2) {
        setTimeout(checkMemoryMatch, 600);
    }
}

function checkMemoryMatch() {
    const [idx1, idx2] = state.memoryGame.flipped;
    const card1 = document.getElementById(`card-${idx1}`);
    const card2 = document.getElementById(`card-${idx2}`);
    const emoji1 = state.memoryGame.cards[idx1];
    const emoji2 = state.memoryGame.cards[idx2];

    if (emoji1 === emoji2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        state.memoryGame.matched += 2;
        state.memoryGame.score += 20;
        document.getElementById('memory-score').textContent = state.memoryGame.score;

        if (state.memoryGame.matched === state.memoryGame.cards.length) {
            endMemoryGame("Tuyệt vời! Bạn đã tìm thấy tất cả cặp hình! 🐿️🎆");
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    state.memoryGame.flipped = [];
}

function endMemoryGame(msg) {
    clearInterval(state.memoryGame.timer);
    showMascotMessage(msg, 4000);
    
    if (state.memoryGame.score > 0) {
        state.xp += state.memoryGame.score;
        state.coins += Math.floor(state.memoryGame.score / 4);
        saveProgress();
        updateUI();
    }
    
    setTimeout(() => switchToScreen('games-screen'), 2000);
}

// --- SCRAMBLE GAME LOGIC ---

function startScrambleGame() {
    state.scrambleGame.score = 0;
    state.scrambleGame.currentIndex = 0;
    document.getElementById('scramble-score').textContent = '0';
    nextScrambleWord();
    switchToScreen('scramble-game-screen');
}

function nextScrambleWord() {
    if (state.scrambleGame.currentIndex >= SCRAMBLE_WORDS.length) {
        showMascotMessage("Tuyệt vời! Bạn đã hoàn thành thử thách Xếp chữ! 🐿️🎆", 4000);
        state.xp += 40;
        state.coins += 15;
        saveProgress();
        updateUI();
        setTimeout(() => switchToScreen('games-screen'), 2000);
        return;
    }

    const data = SCRAMBLE_WORDS[state.scrambleGame.currentIndex];
    const hint = document.getElementById('scramble-hint');
    const lettersBox = document.getElementById('scrambled-letters-box');
    const inputBox = document.getElementById('scramble-input-box');

    state.scrambleGame.currentInput = '';
    inputBox.innerHTML = '';
    hint.textContent = `Gợi ý: ${data.hint}`;

    const letters = data.word.split('').sort(() => Math.random() - 0.5);
    lettersBox.innerHTML = letters.map((l, i) => `<button class="scramble-letter" id="letter-${i}">${l}</button>`).join('');

    const btns = lettersBox.querySelectorAll('.scramble-letter');
    btns.forEach(btn => {
        btn.onclick = () => {
            if (btn.disabled) return;
            btn.disabled = true;
            btn.style.opacity = '0.3';
            state.scrambleGame.currentInput += btn.textContent;
            
            const char = document.createElement('span');
            char.textContent = btn.textContent;
            char.className = 'scramble-char';
            inputBox.appendChild(char);

            if (state.scrambleGame.currentInput.length === data.word.length) {
                checkScrambleAnswer();
            }
        };
    });
}

function checkScrambleAnswer() {
    const data = SCRAMBLE_WORDS[state.scrambleGame.currentIndex];
    const inputBox = document.getElementById('scramble-input-box');
    
    if (state.scrambleGame.currentInput === data.word) {
        inputBox.style.color = '#22c55e';
        state.scrambleGame.score += 20;
        document.getElementById('scramble-score').textContent = state.scrambleGame.score;
        state.scrambleGame.currentIndex++;
        setTimeout(nextScrambleWord, 800);
    } else {
        inputBox.style.color = '#ef4444';
        setTimeout(() => {
            inputBox.style.color = '';
            state.scrambleGame.currentInput = '';
            inputBox.innerHTML = '';
            const btns = document.querySelectorAll('.scramble-letter');
            btns.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
            });
        }, 800);
    }
}

// --- TRIVIA GAME LOGIC ---

function startTriviaGame() {
    state.triviaGame.score = 0;
    state.triviaGame.currentIndex = 0;
    document.getElementById('trivia-score').textContent = '0';
    nextTriviaQuestion();
    switchToScreen('trivia-game-screen');
}

function nextTriviaQuestion() {
    if (state.triviaGame.currentIndex >= TRIVIA_QUESTIONS.length) {
        showMascotMessage("Chúc mừng bạn đã hoàn thành Đố vui! 🐿️🏆", 4000);
        state.xp += 60;
        state.coins += 25;
        saveProgress();
        updateUI();
        setTimeout(() => switchToScreen('games-screen'), 2000);
        return;
    }

    const data = TRIVIA_QUESTIONS[state.triviaGame.currentIndex];
    const cat = document.getElementById('trivia-category');
    const text = document.getElementById('trivia-question-text');
    const options = document.getElementById('trivia-options');

    cat.textContent = data.cat;
    text.textContent = data.q;

    const opts = [...data.options].sort(() => Math.random() - 0.5);
    options.innerHTML = opts.map(o => `<button class="trivia-opt">${o}</button>`).join('');

    const btns = options.querySelectorAll('.trivia-opt');
    btns.forEach(btn => {
        btn.onclick = () => {
            if (btn.textContent === data.answer) {
                btn.className += ' correct';
                state.triviaGame.score += 25;
                document.getElementById('trivia-score').textContent = state.triviaGame.score;
                state.triviaGame.currentIndex++;
                setTimeout(nextTriviaQuestion, 800);
            } else {
                btn.className += ' wrong';
                const correct = Array.from(btns).find(b => b.textContent === data.answer);
                if (correct) correct.className += ' correct';
                state.triviaGame.currentIndex++;
                setTimeout(nextTriviaQuestion, 1500);
            }
        };
    });
}

// --- NEW GENERIC GAMES LOGIC ---

function startGenericGame(type) {
    state.activeGame.type = type;
    state.activeGame.score = 0;
    state.activeGame.currentIndex = 0;
    
    document.getElementById('generic-options-score').textContent = '0';
    document.getElementById('generic-input-score').textContent = '0';

    if (type === 'compare') nextCompareRound();
    else if (type === 'missing') nextMissingRound();
    else if (type === 'multi') nextMultiRound();
    else if (type === 'fraction' || type === 'geometry' || type === 'sequence' || type === 'synonym') {
        const gradeLevel = state.currentGrade >= 9 ? 9 : (state.currentGrade >= 5 ? 5 : 1);
        state.activeGame.data = [...(KNOWLEDGE_BASE[type][gradeLevel] || KNOWLEDGE_BASE[type][1])].sort(() => Math.random() - 0.5);
        nextGenericRound();
    } else if (type === 'antonym') { state.activeGame.data = [...ANTONYMS_DATA].sort(() => Math.random() - 0.5); nextGenericRound(); }
    else if (type === 'fill') { state.activeGame.data = [...FILL_DATA].sort(() => Math.random() - 0.5); nextGenericRound(); }
    else if (type === 'spelling') { state.activeGame.data = [...SPELLING_DATA].sort(() => Math.random() - 0.5); nextGenericRound(); }
    else if (type === 'sort') startSortGame();
    else if (type === 'sentence') startSentenceGame();
}

function startSortGame() {
    switchToScreen('generic-options-game-screen'); // Using generic screen for now, custom later if needed
    const gradeLevel = state.currentGrade >= 9 ? 9 : (state.currentGrade >= 5 ? 5 : 1);
    const data = KNOWLEDGE_BASE.sort[gradeLevel];
    state.activeGame.data = data;
    
    const display = document.getElementById('generic-question-display');
    const container = document.getElementById('generic-options-grid');
    
    display.innerHTML = `<h3>Phân loại vào nhóm: <span style="color:var(--primary)">${data.categories[0]}</span></h3>`;
    
    const items = [...data.items].sort(() => Math.random() - 0.5);
    container.innerHTML = items.map(item => `<button class="btn-gen" onclick="checkSort('${item.t}', '${item.c}', '${data.categories[0]}', this)">${item.t}</button>`).join('');
}

window.checkSort = (text, category, target, btn) => {
    if (category === target) {
        btn.classList.add('correct');
        state.activeGame.score += 25;
        document.getElementById('generic-options-score').textContent = state.activeGame.score;
        if (state.activeGame.score >= 100) {
            showMascotMessage("Bé phân loại rất giỏi! 🐿️🗂️");
            setTimeout(() => switchToScreen('games-screen'), 1500);
        }
    } else {
        btn.classList.add('wrong');
    }
};

function startSentenceGame() {
    switchToScreen('scramble-game-screen'); // Reusing scramble UI for sentence building
    const gradeLevel = state.currentGrade >= 9 ? 9 : (state.currentGrade >= 5 ? 5 : 1);
    state.activeGame.data = [...KNOWLEDGE_BASE.sentence[gradeLevel]];
    nextSentenceRound();
}

function nextSentenceRound() {
    if (state.activeGame.currentIndex >= state.activeGame.data.length) {
        showMascotMessage("Câu cú của bé rất chuẩn xác! 🐿️✍️");
        setTimeout(() => switchToScreen('games-screen'), 1500);
        return;
    }
    const data = state.activeGame.data[state.activeGame.currentIndex];
    const hint = document.getElementById('scramble-hint');
    const lettersBox = document.getElementById('scrambled-letters-box');
    hint.textContent = `Sắp xếp câu đúng nghĩa của: ${data.a}`;
    
    const words = [...data.q].sort(() => Math.random() - 0.5);
    lettersBox.innerHTML = words.map(w => `<button class="scramble-letter" style="width:auto; padding:0 20px;">${w}</button>`).join('');
    
    const inputBox = document.getElementById('scramble-input-box');
    inputBox.innerHTML = '';
    let currentSentence = [];

    lettersBox.querySelectorAll('.scramble-letter').forEach(btn => {
        btn.onclick = () => {
            btn.disabled = true;
            btn.style.opacity = '0.3';
            currentSentence.push(btn.textContent);
            inputBox.innerHTML += `<span>${btn.textContent} </span>`;

            if (currentSentence.length === data.q.length) {
                if (currentSentence.join(' ') === data.a) {
                    inputBox.style.color = '#22c55e';
                    state.activeGame.score += 50;
                    state.activeGame.currentIndex++;
                    setTimeout(nextSentenceRound, 1000);
                } else {
                    inputBox.style.color = '#ef4444';
                    setTimeout(() => {
                        inputBox.style.color = '';
                        nextSentenceRound(); // retry
                    }, 1000);
                }
            }
        };
    });
}

function nextGenericRound() {
    if (state.activeGame.currentIndex >= state.activeGame.data.length) {
        showMascotMessage("Bé quá tuyệt vời! Bài học Tiếng Anh đã xong. 🐿️✨", 4000);
        state.xp += state.activeGame.score;
        state.coins += Math.floor(state.activeGame.score / 5);
        saveProgress();
        updateUI();
        setTimeout(() => switchToScreen('games-screen'), 2000);
        return;
    }

    switchToScreen('generic-options-game-screen');
    const data = state.activeGame.data[state.activeGame.currentIndex];
    const display = document.getElementById('generic-question-display');
    const container = document.getElementById('generic-options-grid');

    display.innerHTML = `<h2 style="font-size: 3rem; font-weight:900;">${data.q}</h2>`;
    const opts = [...data.options].sort(() => Math.random() - 0.5);
    container.innerHTML = opts.map(o => `<button class="eng-opt btn-gen">${o}</button>`).join('');

    container.querySelectorAll('.btn-gen').forEach(btn => {
        btn.onclick = () => {
            if (btn.textContent === data.answer) {
                btn.classList.add('correct');
                state.activeGame.score += 20;
                document.getElementById('generic-options-score').textContent = state.activeGame.score;
                state.activeGame.currentIndex++;
                setTimeout(nextGenericRound, 800);
            } else {
                btn.classList.add('wrong');
                const correct = Array.from(container.querySelectorAll('.btn-gen')).find(b => b.textContent === data.answer);
                if (correct) correct.classList.add('correct');
                state.activeGame.currentIndex++;
                setTimeout(nextGenericRound, 1500);
            }
        };
    });
}

function nextCompareRound() {
    switchToScreen('generic-options-game-screen');
    const a = Math.floor(Math.random() * 50);
    const b = Math.floor(Math.random() * 50);
    const display = document.getElementById('generic-question-display');
    const container = document.getElementById('generic-options-grid');

    display.innerHTML = `<div style="font-size: 4rem; font-weight:900; display:flex; gap:30px; justify-content:center; align-items:center;">
        <span>${a}</span> <span style="color:var(--primary); font-size: 0.7em;">?</span> <span>${b}</span>
    </div>`;

    const ops = ['>', '<', '='];
    const answer = a > b ? '>' : (a < b ? '<' : '=');
    container.innerHTML = ops.map(o => `<button class="math-opt btn-gen" style="font-size: 3rem;">${o}</button>`).join('');

    container.querySelectorAll('.btn-gen').forEach(btn => {
        btn.onclick = () => {
            if (btn.textContent === answer) {
                btn.classList.add('correct');
                state.activeGame.score += 10;
                document.getElementById('generic-options-score').textContent = state.activeGame.score;
                setTimeout(nextCompareRound, 500);
            } else {
                btn.classList.add('wrong');
                setTimeout(nextCompareRound, 800);
            }
            if (state.activeGame.score >= 100) {
               showMascotMessage("Tuyệt vời! Bé đã nắm vững bài so sánh số. 🐿️💎");
               state.xp += 30; state.coins += 10;
               saveProgress(); updateUI();
               setTimeout(() => switchToScreen('games-screen'), 1000);
            }
        };
    });
}

function nextMissingRound() {
    switchToScreen('generic-input-game-screen');
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const isFirst = Math.random() > 0.5;
    const answer = isFirst ? a : b;
    const sum = a + b;

    const display = document.getElementById('generic-input-question-display');
    const container = document.getElementById('generic-input-options');

    display.innerHTML = `<div style="font-size: 3.5rem; font-weight:900;">
        ${isFirst ? '?' : a} + ${isFirst ? b : '?'} = ${sum}
    </div>`;

    let options = [answer];
    while(options.length < 4) {
        const o = Math.floor(Math.random() * 30);
        if(!options.includes(o)) options.push(o);
    }
    options.sort(() => Math.random() - 0.5);

    container.innerHTML = options.map(o => `<button class="math-opt btn-gen">${o}</button>`).join('');
    container.querySelectorAll('.btn-gen').forEach(btn => {
        btn.onclick = () => {
            if (parseInt(btn.textContent) === answer) {
                btn.classList.add('correct');
                state.activeGame.score += 15;
                document.getElementById('generic-input-score').textContent = state.activeGame.score;
                setTimeout(nextMissingRound, 500);
            } else {
                btn.classList.add('wrong');
                setTimeout(nextMissingRound, 800);
            }
            if (state.activeGame.score >= 150) {
                showMascotMessage("Siêu nhân toán học! Khám phá số ẩn thành công. 🐿️🚀");
                state.xp += 50; state.coins += 20;
                saveProgress(); updateUI();
                setTimeout(() => switchToScreen('games-screen'), 1000);
            }
        };
    });
}

function nextMultiRound() {
    switchToScreen('generic-input-game-screen');
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 9) + 1;
    const answer = a * b;

    const display = document.getElementById('generic-input-question-display');
    const container = document.getElementById('generic-input-options');

    display.innerHTML = `<div style="font-size: 3.5rem; font-weight:900;">
        ${a} × ${b} = ?
    </div>`;

    let options = [answer];
    while(options.length < 4) {
        const o = (Math.floor(Math.random() * 9) + 1) * (Math.floor(Math.random() * 9) + 1);
        if(!options.includes(o)) options.push(o);
    }
    options.sort(() => Math.random() - 0.5);

    container.innerHTML = options.map(o => `<button class="math-opt btn-gen">${o}</button>`).join('');
    container.querySelectorAll('.btn-gen').forEach(btn => {
        btn.onclick = () => {
            if (parseInt(btn.textContent) === answer) {
                btn.classList.add('correct');
                state.activeGame.score += 20;
                document.getElementById('generic-input-score').textContent = state.activeGame.score;
                setTimeout(nextMultiRound, 500);
            } else {
                btn.classList.add('wrong');
                setTimeout(nextMultiRound, 800);
            }
            if (state.activeGame.score >= 200) {
                showMascotMessage("Kỹ năng nhân của bạn thật đáng nể! 🐿️🏆");
                state.xp += 60; state.coins += 30;
                saveProgress(); updateUI();
                setTimeout(() => switchToScreen('games-screen'), 1000);
            }
        };
    });
}

window.handleCardClick = handleCardClick;

// --- MISSIONS LOGIC ---

function updateMissions(type, count = 1) {
    let changed = false;
    state.missions.forEach(mission => {
        if (!mission.completed && mission.type === type) {
            mission.current = Math.min(mission.current + count, mission.target);
            if (mission.current === mission.target) {
                mission.completed = true;
                showMascotMessage(`Bạn đã hoàn thành nhiệm vụ: ${mission.title}! 🐿️💎`, 3000);
            }
            changed = true;
        }
    });
    if (changed) {
        saveProgress();
        updateUI();
    }
}

function renderMissions() {
    const list = document.getElementById('missions-list');
    const indicator = document.getElementById('mission-count');
    if (!list || !indicator) return;

    const completed = state.missions.filter(m => m.completed).length;
    indicator.textContent = `${completed}/${state.missions.length}`;

    list.innerHTML = state.missions.map(m => `
        <div class="mission-item ${m.completed ? 'completed' : ''}">
            <div class="mission-icon">${m.type === 'math_play' ? '🧮' : m.type === 'english_play' ? '📖' : '🔥'}</div>
            <div class="mission-info">
                <span class="mission-title">${m.title}</span>
                <span class="mission-reward">🎁 ${m.reward} xu</span>
                <div class="mission-progress">
                    <div class="mission-bar" style="width: ${(m.current / m.target) * 100}%"></div>
                </div>
            </div>
            <button class="btn-claim" ${!m.completed || m.claimed ? 'disabled' : ''} onclick="claimMissionReward('${m.id}')">
                ${m.claimed ? 'Đã nhận' : 'Nhận quà'}
            </button>
        </div>
    `).join('');
}

function claimMissionReward(id) {
    const mission = state.missions.find(m => m.id === id);
    if (mission && mission.completed && !mission.claimed) {
        mission.claimed = true;
        state.coins += mission.reward;
        showMascotMessage(`Đã nhận ${mission.reward} xu quà tặng! 🐿️💰`, 2000);
        saveProgress();
        updateUI();
        renderMissions();
    }
}

window.claimMissionReward = claimMissionReward;

// --- EVENT LISTENERS ---

// Study Reminder Logic
function checkStudyReminder() {
    if (!state.user) return;
    
    const today = new Date().toDateString();
    if (state.lastLessonDate === today) return; // Already studied today
    
    const reminderToast = document.getElementById('study-reminder');
    const reminderMsg = document.getElementById('reminder-msg');
    
    if (!reminderToast || !reminderMsg) return;
    
    const hour = new Date().getHours();
    let message = "Đã đến lúc học bài rồi bạn ơi! 📚";
    
    if (hour < 10) message = "Chào buổi sáng! Cùng khởi đầu ngày mới bằng một bài học nhé? 🐿️☀️";
    else if (hour < 14) message = "Giờ nghỉ trưa rồi, làm vài câu đố cho minh mẫn nào! 🍎";
    else if (hour < 18) message = "Buổi chiều năng động, cùng Sóc vượt qua thử thách nhé! 🐿️💪";
    else message = "Buổi tối yên tĩnh, ôn tập lại kiến thức thôi! 🐿️🌙";
    
    reminderMsg.textContent = message;
    reminderToast.classList.add('active');
    
    // Auto hide after 10 seconds
    setTimeout(() => {
        reminderToast.classList.remove('active');
    }, 10000);
}

function hideReminder() {
    const reminderToast = document.getElementById('study-reminder');
    if (reminderToast) {
        reminderToast.classList.remove('active');
    }
}

function setupEventListeners() {
    const loginFn = () => {
        const emailInput = document.getElementById('email');
        const passInput = document.getElementById('password');
        if (!emailInput || !passInput) return;
        
        const email = emailInput.value;
        const pass = passInput.value;
        
        if (email && pass) {
            const users = JSON.parse(localStorage.getItem('soc_users') || '[]');
            const user = users.find(u => u.email === email && u.password === pass);
            
            if (user) {
                state.user = user;
                localStorage.setItem('soc_vui_hoc_user', JSON.stringify(user));
                loadUserData();
                updateUI();
            } else {
                alert("Tài khoản hoặc mật khẩu sai!");
            }
        }
    };

    const welcomeBtn = document.getElementById('btn-go-to-auth');
    if (welcomeBtn) welcomeBtn.onclick = () => switchToScreen('auth-screen');
    
    const loginBtn = document.getElementById('btn-login');
    if (loginBtn) loginBtn.onclick = loginFn;

    // Mission Trigger
    const missionBtn = document.getElementById('btn-show-missions');
    const missionsModal = document.getElementById('missions-modal');
    if (missionBtn) missionBtn.onclick = () => {
        renderMissions();
        missionsModal.classList.add('active');
    };

    const closeModalBtn = document.querySelector('.btn-close-modal');
    if (closeModalBtn) closeModalBtn.onclick = () => missionsModal.classList.remove('active');
    
    const roadmapTrigger = document.getElementById('roadmap-trigger');
    if (roadmapTrigger) roadmapTrigger.onclick = () => {
        updateNavActive('nav-roadmap');
        showRoadmap();
    };

    const notiBtn = document.getElementById('btn-notifications');
    const notiDropdown = document.getElementById('noti-dropdown');
    if (notiBtn && notiDropdown) {
        notiBtn.onclick = (e) => {
            e.stopPropagation();
            notiDropdown.classList.toggle('active');
        };
        document.addEventListener('click', () => notiDropdown.classList.remove('active'));
    }

    const profileBtn = document.getElementById('btn-go-profile');
    if (profileBtn) profileBtn.onclick = showProfile;
    
    // Games
    const playMathBtn = document.getElementById('btn-play-math-game');
    if (playMathBtn) playMathBtn.onclick = () => {
        startMathGame();
        updateMissions('math_play');
    };

    const playEngBtn = document.getElementById('btn-play-english-game');
    if (playEngBtn) playEngBtn.onclick = () => {
        startEnglishGame();
        updateMissions('english_play');
    };

    const playMemBtn = document.getElementById('btn-play-memory-game');
    if (playMemBtn) playMemBtn.onclick = startMemoryGame;

    const changeAvatarProfileBtn = document.getElementById('btn-change-avatar-profile');
    if (changeAvatarProfileBtn) changeAvatarProfileBtn.onclick = openAvatarModal;

    const closeAvatarModalBtn = document.getElementById('btn-close-avatar-modal');
    if (closeAvatarModalBtn) closeAvatarModalBtn.onclick = () => document.getElementById('avatar-modal').classList.remove('active');

    const editProfileNameBtn = document.getElementById('btn-edit-profile-name');
    if (editProfileNameBtn) editProfileNameBtn.onclick = editProfileName;

    const exportDataBtn = document.getElementById('btn-export-data');
    if (exportDataBtn) exportDataBtn.onclick = exportData;

    const importDataBtn = document.getElementById('btn-import-data');
    if (importDataBtn) importDataBtn.onclick = openSyncModal;

    const loginSyncBtn = document.getElementById('btn-login-sync');
    if (loginSyncBtn) loginSyncBtn.onclick = openSyncModal;

    const closeSyncModalBtn = document.getElementById('btn-close-sync-modal');
    if (closeSyncModalBtn) closeSyncModalBtn.onclick = closeSyncModal;

    const confirmSyncBtn = document.getElementById('btn-confirm-sync');
    if (confirmSyncBtn) {
        confirmSyncBtn.onclick = async (e) => {
            e.preventDefault();
            const originalText = confirmSyncBtn.textContent;
            confirmSyncBtn.textContent = "⏳ Đang xử lý...";
            confirmSyncBtn.disabled = true;

            // Small delay to let UI update
            await new Promise(r => setTimeout(r, 300));

            try {
                importData();
            } catch (err) {
                console.error("Sync error:", err);
                alert("Lỗi: " + err.message);
            } finally {
                confirmSyncBtn.textContent = originalText;
                confirmSyncBtn.disabled = false;
            }
        };
    }

    // Friends Event Listeners
    const btnDoSearch = document.getElementById('btn-do-search');
    const friendSearchInput = document.getElementById('friend-search-input');
    if (btnDoSearch) {
        btnDoSearch.onclick = searchFriends;
    }
    if (friendSearchInput) {
        friendSearchInput.onkeypress = (e) => {
            if (e.key === 'Enter') searchFriends();
        };
    }

    const copyCodeBtn = document.getElementById('btn-copy-code');
    if (copyCodeBtn) copyCodeBtn.onclick = copyBackupCode;

    const playScrambleBtn = document.getElementById('btn-play-scramble-game');
    if (playScrambleBtn) playScrambleBtn.onclick = startScrambleGame;

    const playTriviaBtn = document.getElementById('btn-play-trivia-game');
    if (playTriviaBtn) playTriviaBtn.onclick = startTriviaGame;

    const gameHooks = [
        { id: 'btn-play-compare-game', type: 'compare' },
        { id: 'btn-play-missing-game', type: 'missing' },
        { id: 'btn-play-multi-game', type: 'multi' },
        { id: 'btn-play-antonym-game', type: 'antonym' },
        { id: 'btn-play-fill-game', type: 'fill' },
        { id: 'btn-play-spelling-game', type: 'spelling' },
        { id: 'btn-play-fraction-game', type: 'fraction' },
        { id: 'btn-play-geometry-game', type: 'geometry' },
        { id: 'btn-play-sequence-game', type: 'sequence' },
        { id: 'btn-play-sort-game', type: 'sort' },
        { id: 'btn-play-synonym-game', type: 'synonym' },
        { id: 'btn-play-sentence-game', type: 'sentence' }
    ];

    gameHooks.forEach(hook => {
        const btn = document.getElementById(hook.id);
        if (btn) btn.onclick = () => startGenericGame(hook.type);
    });

    const clearScrambleBtn = document.getElementById('btn-clear-scramble');
    if (clearScrambleBtn) clearScrambleBtn.onclick = () => {
        state.scrambleGame.currentInput = '';
        document.getElementById('scramble-input-box').innerHTML = '';
        const btns = document.querySelectorAll('.scramble-letter');
        btns.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    };

    const leaderboardLink = document.getElementById('view-leaderboard-link');
    if (leaderboardLink) leaderboardLink.onclick = () => {
        updateNavActive('nav-leaderboard');
        showLeaderboard();
    };

    // Sidebar Nav Handlers
    const navHome = document.getElementById('nav-home');
    const navRoadmap = document.getElementById('nav-roadmap');
    const navGames = document.getElementById('nav-games');
    const navStats = document.getElementById('nav-stats');
    const navLeaderboard = document.getElementById('nav-leaderboard');
    const navStore = document.getElementById('nav-store');
    const navFriends = document.getElementById('nav-friends');
    const navProfile = document.getElementById('nav-profile');

    const updateNavActive = (activeId) => {
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(activeId);
        if (activeBtn) activeBtn.classList.add('active');
    };

    if (navHome) navHome.onclick = () => {
        updateNavActive('nav-home');
        switchToScreen('dashboard-screen');
    };

    if (navRoadmap) navRoadmap.onclick = () => {
        updateNavActive('nav-roadmap');
        showRoadmap();
    };

    if (navGames) navGames.onclick = () => {
        updateNavActive('nav-games');
        switchToScreen('games-screen');
    };

    if (navStats) navStats.onclick = () => {
        updateNavActive('nav-stats');
        showStats();
    };

    if (navLeaderboard) navLeaderboard.onclick = () => {
        updateNavActive('nav-leaderboard');
        showLeaderboard();
    };

    if (navStore) navStore.onclick = () => {
        updateNavActive('nav-store');
        showStore();
    };

    const tabBuy = document.getElementById('tab-buy');
    const tabInv = document.getElementById('tab-inventory');
    if (tabBuy && tabInv) {
        tabBuy.onclick = () => {
            tabBuy.classList.add('active');
            tabInv.classList.remove('active');
            document.getElementById('store-buy-view').classList.add('active');
            document.getElementById('store-inventory-view').classList.remove('active');
        };
        tabInv.onclick = () => {
            tabInv.classList.add('active');
            tabBuy.classList.remove('active');
            document.getElementById('store-inventory-view').classList.add('active');
            document.getElementById('store-buy-view').classList.remove('active');
            renderInventory();
        };
    }

    if (navFriends) navFriends.onclick = () => {
        updateNavActive('nav-friends');
        switchToScreen('friends-screen');
        renderFriends();
    };

    if (navProfile) navProfile.onclick = () => {
        updateNavActive('nav-profile');
        showProfile();
    };

    // Keep top profile link working
    const topProfileBtn = document.getElementById('btn-go-profile-top');
    if (topProfileBtn) topProfileBtn.onclick = () => {
        updateNavActive('nav-profile');
        showProfile();
    };

    document.getElementById('password')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginFn();
    });

    const regLink = document.getElementById('go-to-register');
    if (regLink) regLink.onclick = (e) => {
        e.preventDefault();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    };

    const loginLink = document.getElementById('go-to-login');
    if (loginLink) loginLink.onclick = (e) => {
        e.preventDefault();
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    };

    const regBtn = document.getElementById('btn-register');
    if (regBtn) regBtn.onclick = () => {
        const name = document.getElementById('reg-name').value;
        const fullName = document.getElementById('reg-full-name').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-password').value;
        const confirmPass = document.getElementById('reg-confirm-password').value;
        const grade = document.getElementById('reg-grade').value;
        const location = document.getElementById('reg-location').value;

        if (!name || !fullName || !email || !pass || !confirmPass || !location) {
            alert("Vui lòng điền đầy đủ thông tin!"); return;
        }

        if (pass !== confirmPass) {
            alert("Mật khẩu nhập lại không khớp!"); return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Email không hợp lệ!"); return;
        }

        const users = JSON.parse(localStorage.getItem('soc_users') || '[]');
        if (users.some(u => u.email === email)) {
            alert("Email đã tồn tại!"); return;
        }

        const newUser = { 
            name, 
            fullName, 
            email, 
            password: pass, 
            grade: parseInt(grade), 
            location,
            xp: 0,
            level: 1
        };
        users.push(newUser);
        localStorage.setItem('soc_users', JSON.stringify(users));

        state.user = newUser;
        state.currentGrade = newUser.grade;
        state.xp = 0;
        state.level = 1;
        state.completedLessons = [];

        localStorage.setItem('soc_vui_hoc_user', JSON.stringify(newUser));
        localStorage.setItem('soc_vui_hoc_grade', state.currentGrade);
        localStorage.setItem('soc_vui_hoc_xp', 0);
        localStorage.setItem('soc_vui_hoc_lessons', JSON.stringify([]));

        updateUI();
        switchToScreen('dashboard-screen');
        showMascotMessage(`Chào mừng ${fullName} đến với Sóc Vui Học!`, 4000);
    };

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) logoutBtn.onclick = () => {
        localStorage.removeItem('soc_vui_hoc_user');
        state.user = null;
        switchToScreen('welcome-screen');
    };

    const gradeDashBtn = document.getElementById('btn-change-grade-dash');
    if (gradeDashBtn) gradeDashBtn.onclick = showGradeSelection;

    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) themeBtn.onclick = () => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        document.body.className = state.theme + '-theme';
    };

    document.querySelectorAll('.subject-card').forEach(card => {
        card.onclick = () => handleSubjectSelect(card.dataset.subject);
    });

    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.onclick = () => {
            // Clear any active game timers
            if (state.mathGame.timer) {
                clearInterval(state.mathGame.timer);
                state.mathGame.timer = null;
            }
            if (state.memoryGame.timer) {
                clearInterval(state.memoryGame.timer);
                state.memoryGame.timer = null;
            }

            if (document.getElementById('topics-screen').classList.contains('active')) {
                switchToScreen('dashboard-screen');
            } else if (document.getElementById('lessons-screen').classList.contains('active')) {
                switchToScreen('topics-screen');
            } else {
                switchToScreen('dashboard-screen');
                updateNavActive('nav-home');
            }
        };
    });

    const nextQBtn = document.getElementById('btn-next-question');
    if (nextQBtn) nextQBtn.onclick = nextQuestion;
    
    const exitQuizBtn = document.getElementById('btn-exit-quiz');
    if (exitQuizBtn) exitQuizBtn.onclick = () => {
        if (confirm("Chưa xong đâu, thoát nhé?")) switchToScreen('dashboard-screen');
    };
    
    const backHomeBtn = document.getElementById('btn-back-home');
    if (backHomeBtn) backHomeBtn.onclick = () => switchToScreen('dashboard-screen');

    const mascotWrapper = document.querySelector('.mascot-image-wrapper');
    if (mascotWrapper) mascotWrapper.onclick = toggleAIChat;

    const hideReminderBtn = document.getElementById('btn-hide-reminder');
    if (hideReminderBtn) hideReminderBtn.onclick = hideReminder;

    const closeChatBtn = document.getElementById('btn-close-chat');
    if (closeChatBtn) closeChatBtn.onclick = toggleAIChat;

    const sendChatBtn = document.getElementById('btn-send-chat');
    if (sendChatBtn) sendChatBtn.onclick = sendChatMessage;

    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.onkeypress = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        };
    }
}

// Start the app
init();
