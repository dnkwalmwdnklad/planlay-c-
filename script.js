const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

// HATA BURADAYDI: Müfredatın içi yanlışlıkla boşaltılmıştı, tamamı geri yüklendi.
const syllabus = {
    "TYT": {
        "Türkçe": ["Sözcükte Anlam", "Cümlede Anlam", "Paragraf", "Ses Bilgisi", "Yazım Kuralları", "Noktalama İşaretleri", "Sözcük Türleri", "Fiiller", "Cümlenin Ögeleri", "Cümle Türleri", "Anlatım Bozuklukları"],
        "Matematik": ["Temel Kavramlar", "Sayı Basamakları", "Bölünebilme", "EBOB-EKOK", "Rasyonel Sayılar", "Basit Eşitsizlikler", "Mutlak Değer", "Üslü Sayılar", "Köklü Sayılar", "Çarpanlara Ayırma", "Oran Orantı", "Sayı Problemleri", "Kesir Problemleri", "Yaş Problemleri", "Yüzde Problemleri", "Kar-Zarar Problemleri", "Karışım Problemleri", "Hareket Problemleri", "İşçi Problemleri", "Grafik Problemleri", "Rutin Olmayan Problemler", "Mantık", "Kümeler", "Fonksiyonlar", "Polinomlar", "Permütasyon-Kombinasyon-Olasılık", "Veri-İstatistik"],
        "Geometri": ["Temel Kavramlar", "Üçgenler", "Çokgenler", "Dörtgenler", "Çember ve Daire", "Analitik Geometri", "Katı Cisimler"],
        "Fizik": ["Fizik Bilimine Giriş", "Madde ve Özellikleri", "Hareket ve Kuvvet", "İş, Güç ve Enerji", "Isı, Sıcaklık ve Genleşme", "Basınç", "Kaldırma Kuvveti", "Elektrik", "Manyetizma", "Dalgalar", "Optik"],
        "Kimya": ["Kimya Bilimi", "Atom ve Periyodik Sistem", "Etkileşimler", "Maddenin Hâlleri", "Doğa ve Kimya", "Hesaplamalar", "Karışımlar", "Asit, Baz ve Tuz", "Kimya Her Yerde"],
        "Biyoloji": ["Yaşam Bilimi", "Hücre", "Canlılar Dünyası", "Hücre Bölünmeleri", "Kalıtım", "Ekosistem Ekolojisi"],
        "Tarih": ["Tarih ve Zaman", "İlk Çağ Uygarlıkları", "İslam Tarihi", "Türk İslam Devletleri", "Osmanlı Tarihi", "İnkılap Tarihi"],
        "Coğrafya": ["Doğa ve İnsan", "Dünya'nın Şekli ve Hareketleri", "Harita Bilgisi", "İklim Bilgisi", "Yerleşmeler", "Nüfus", "Doğal Afetler"],
        "Felsefe/Din": ["Felsefeyi Tanıma", "Bilgi Felsefesi", "Varlık Felsefesi", "Ahlak Felsefesi", "Siyaset Felsefesi", "Din Felsefesi"]
    },
    "AYT": {
        "Matematik": ["Fonksiyonlarda Uygulamalar", "Parabol", "Eşitsizlikler", "Trigonometri", "Logaritma", "Diziler", "Limit ve Süreklilik", "Türev", "İntegral"],
        "Geometri": ["Trigonometri", "Analitik Geometri", "Çemberin Analitiği"],
        "Fizik": ["Vektörler", "Bağıl Hareket", "Newton Yasaları", "Atışlar", "İş ve Enerji", "Momentum", "Tork", "Basit Makineler", "Elektrik ve Manyetizma", "Çembersel Hareket", "Basit Harmonik Hareket", "Dalga Mekaniği", "Modern Fizik"],
        "Kimya": ["Modern Atom Teorisi", "Gazlar", "Sıvı Çözeltiler", "Kimyasal Tepkimelerde Enerji", "Hız", "Denge", "Kimya ve Elektrik", "Karbon Kimyası", "Organik Bileşikler"],
        "Biyoloji": ["Sinir Sistemi", "Endokrin Sistem", "Duyu Organları", "Destek ve Hareket", "Sindirim", "Dolaşım", "Solunum", "Üriner Sistem", "Üreme Sistemi", "Komünite ve Popülasyon", "Genden Proteine", "Canlılarda Enerji", "Bitki Biyolojisi"]
    }
};

let allWeeksData = JSON.parse(localStorage.getItem('flawlessWeeklyPlanner')) || {};
let reviewData = JSON.parse(localStorage.getItem('flawlessReviewPlan_V2')) || {};
let questionBank = JSON.parse(localStorage.getItem('flawlessQuestionBank_V3')) || {};
let pdfArchives = JSON.parse(localStorage.getItem('flawlessPdfArchives')) || [];

let displayedWeekStart = getMonday(new Date());
let currentSelectedDay = ""; let editingTaskId = null;

// --- AYARLAR VE DIŞA AKTARMA ---
const themeToggle = document.getElementById('theme-toggle');
if (localStorage.getItem('flawlessTheme') === 'dark') { document.body.setAttribute('data-theme', 'dark'); themeToggle.checked = true; }
themeToggle.addEventListener('change', (e) => { if (e.target.checked) { document.body.setAttribute('data-theme', 'dark'); localStorage.setItem('flawlessTheme', 'dark'); } else { document.body.removeAttribute('data-theme'); localStorage.setItem('flawlessTheme', 'light'); } });

const settingsModal = document.getElementById('settings-modal');
document.getElementById('open-settings-btn').onclick = () => settingsModal.classList.add('active');
document.getElementById('close-settings-modal').onclick = () => settingsModal.classList.remove('active');
document.getElementById('reset-tasks-btn').onclick = () => { if (confirm("Tüm haftalar silinecek. Emin misin?")) { localStorage.removeItem('flawlessWeeklyPlanner'); allWeeksData = {}; saveAndRender(); settingsModal.classList.remove('active'); } };
document.getElementById('reset-reviews-btn').onclick = () => { if (confirm("Tüm tekrarlar sıfırlanacak! Emin misin?")) { localStorage.removeItem('flawlessReviewPlan_V2'); reviewData = {}; settingsModal.classList.remove('active'); } };
document.getElementById('reset-questions-btn').onclick = () => { if (confirm("Tüm yüklediğin sorular ve PDF arşivin KALICI OLARAK silinecek! Emin misin?")) { localStorage.removeItem('flawlessQuestionBank_V3'); localStorage.removeItem('flawlessPdfArchives'); questionBank = {}; pdfArchives = []; settingsModal.classList.remove('active'); } };
document.getElementById('export-pdf-btn').onclick = () => { settingsModal.classList.remove('active'); setTimeout(() => { window.print(); }, 300); };
document.getElementById('export-csv-btn').onclick = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFFGün,Sınav ve Ders,Konu,Süre,Durum\n";
    days.forEach(day => { getCurrentWeekTasks()[day].forEach(t => { csvContent += `"${day}","${t.lesson}","${t.topic}","${t.time}","${t.completed ? "Tamamlandi" : "Bekliyor"}"\n`; }); });
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", `Haftalik_Plan_${getWeekKey(displayedWeekStart)}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link); settingsModal.classList.remove('active');
};


// ==========================================
// YAPAMADIĞIM SORULAR & GELİŞMİŞ AI SİSTEMİ
// ==========================================
const questionsModal = document.getElementById('questions-modal');
const folderContainer = document.getElementById('folder-container');
const dropZone = document.getElementById('question-drop-zone');
const fileInput = document.getElementById('question-file-input');
const aiProgressContainer = document.getElementById('ai-progress-container');
const aiProgressFill = document.getElementById('ai-progress-fill');
const aiProgressText = document.getElementById('ai-progress-text');
const dropZoneText = document.getElementById('drop-zone-text');
const dropZoneSubtext = document.getElementById('drop-zone-subtext');

document.getElementById('open-questions-btn').onclick = () => { switchTab('folders'); renderQuestionFolders(); questionsModal.classList.add('active'); };
document.getElementById('close-questions-modal').onclick = () => questionsModal.classList.remove('active');

window.switchTab = (tab) => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    if (tab === 'folders') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('tab-folders').classList.add('active');
        renderQuestionFolders();
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('tab-archives').classList.add('active');
        renderArchives();
    }
}

dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('dragover'); });
dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); processAIUploads(e.dataTransfer.files); });
fileInput.addEventListener('change', (e) => { processAIUploads(e.target.files); fileInput.value = ""; });

const compressImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width, h = img.height;
                if (w > 800 || h > 800) { const ratio = Math.min(800 / w, 800 / h); w *= ratio; h *= ratio; }
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = "#FFF"; ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

// YENİ: DERİNLEMESİNE YAPAY ZEKA ANALİZ MOTORU
async function processAIUploads(files) {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    dropZoneText.style.display = 'none'; dropZoneSubtext.style.display = 'none';
    aiProgressContainer.style.display = 'block'; aiProgressFill.style.width = '0%';

    aiProgressText.innerText = "Yapay zeka (AI) okuma motoru başlatılıyor...";
    const worker = await Tesseract.createWorker('tur');

    for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        aiProgressFill.style.width = `${Math.round((i / validFiles.length) * 100)}%`;
        aiProgressText.innerText = `Derin analiz yapılıyor: ${i + 1}/${validFiles.length}...`;

        try {
            const imgDataUrl = await compressImage(file);
            const ret = await worker.recognize(imgDataUrl);
            const text = ret.data.text.toLowerCase();

            // Skor Tablosu
            const scores = {
                "Matematik": (text.match(/(sayı|rakam|toplam|çarpım|oran|orantı|denklem|fonksiyon|polinom|küme|olasılık|türev|integral|parabol|limit|eşitsizlik|mutlak değer|kök|üslü|kesir|yaş problemi|hız|yüzde|kâr|zarar|kombinasyon|permütasyon|fiyat|hacim|tl)/g) || []).length,
                "Geometri": (text.match(/(üçgen|açı|kenar|kare|dikdörtgen|çember|daire|hacim|alan|teğet|kiriş|paralelkenar|yamuk|prizma|silindir|koni|küre|hipotenüs|diklik|uzunluk|yarıçap)/g) || []).length,
                "Fizik": (text.match(/(kuvvet|ivme|sürtünme|elektrik|manyetik|iletken|volt|amper|direnç|tork|optik|ayna|mercek|dalga|frekans|enerji|basınç|kaldırma|kütle|yerçekimi|ısı|sıcaklık)/g) || []).length,
                "Kimya": (text.match(/(tepkime|mol|gaz|çözelti|asit|baz|bileşik|atom|molekül|periyodik|iyon|kovalent|metal|ametal|organik|karbon|entalpi|denge|elektroliz|ph|derişim|reaksiyon)/g) || []).length,
                "Biyoloji": (text.match(/(hücre|dna|rna|protein|enzim|sistem|canlı|bakteri|virüs|genetik|kalıtım|mitoz|mayoz|fotosentez|solunum|dolaşım|sindirim|sinir|hormon|bitki|ekosistem|kan)/g) || []).length,
                "Türkçe": (text.match(/(paragraf|cümle|anlatım|yazar|şiir|sözcük|edebiyat|noktalama|sıfat|zamir|zarf|fiil|edat|bağlaç|kafiye|redif|roman|hikaye|anlam|yüklem|özne)/g) || []).length,
                "Tarih": (text.match(/(tarih|osmanlı|savaş|antlaşma|devlet|padişah|inkılap|atatürk|meclis|fetih|imparatorluk|yüzyıl|dönem|anlaşma|beylik|ordu|asker|kuruluş)/g) || []).length,
                "Coğrafya": (text.match(/(iklim|harita|nüfus|coğrafya|bölge|dünya|enlem|boylam|dağ|ova|plato|fay|deprem|rüzgar|yağış|sıcaklık|toprak|tarım|bitki örtüsü)/g) || []).length,
                "Felsefe/Din": (text.match(/(din|ahlak|felsefe|düşünce|varlık|bilgi|tanrı|inanç|islam|peygamber|ayet|hadis|sure|kur'an|rasyonalizm|empirizm|ibadet)/g) || []).length
            };

            let detectedLesson = "Matematik";
            let maxScore = 0;

            for (const [lesson, score] of Object.entries(scores)) {
                if (score > maxScore) { maxScore = score; detectedLesson = lesson; }
            }

            if (!questionBank[detectedLesson]) questionBank[detectedLesson] = [];
            questionBank[detectedLesson].push({
                id: 'q_' + Date.now().toString() + Math.floor(Math.random() * 1000),
                dataUrl: imgDataUrl,
                isConverted: false
            });

        } catch (error) {
            console.error("Yapay zeka okuma hatası:", error);
            if (!questionBank["Matematik"]) questionBank["Matematik"] = [];
            questionBank["Matematik"].push({ id: 'q_' + Date.now().toString() + Math.floor(Math.random() * 1000), dataUrl: await compressImage(file), isConverted: false });
        }
    }

    await worker.terminate();
    localStorage.setItem('flawlessQuestionBank_V3', JSON.stringify(questionBank));

    aiProgressContainer.style.display = 'none'; dropZoneText.style.display = 'block'; dropZoneSubtext.style.display = 'block';
    renderQuestionFolders();
}

const lessonOptions = ["Matematik", "Geometri", "Fizik", "Kimya", "Biyoloji", "Türkçe", "Tarih", "Coğrafya", "Felsefe/Din"];

function renderQuestionFolders() {
    folderContainer.innerHTML = "";
    if (Object.keys(questionBank).length === 0) { folderContainer.innerHTML = "<p style='text-align:center; color:var(--text-muted); margin-top:20px;'>Henüz hiç soru yüklemedin.</p>"; return; }

    Object.keys(questionBank).forEach(lesson => {
        if (questionBank[lesson].length === 0) return;
        const newCount = questionBank[lesson].filter(q => !q.isConverted).length;

        const folder = document.createElement('div'); folder.className = 'subject-folder';

        folder.innerHTML = `
            <div class="folder-header" onclick="toggleFolder('${lesson}')">
                <i class="fa-solid fa-folder"></i> ${lesson}
                <span>${newCount} Yeni / Toplam ${questionBank[lesson].length}</span>
            </div>
            <div class="folder-content" id="folder-content-${lesson}">
                ${questionBank[lesson].map(q => `
                    <div class="q-gallery-item ${q.isConverted ? 'converted' : ''}">
                        <img src="${q.dataUrl}">
                        ${q.isConverted ? '<div class="q-badge converted-badge">PDF Yapıldı</div>' : '<div class="q-badge">YENİ</div>'}
                        <button class="q-delete-btn" onclick="deleteQuestion('${lesson}', '${q.id}', event)"><i class="fa-solid fa-xmark"></i></button>
                        <select class="q-lesson-select" onchange="changeQuestionLesson('${lesson}', '${q.id}', this.value, event)" title="Dersi değiştir">
                            ${lessonOptions.map(opt => `<option value="${opt}" ${opt === lesson ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </div>
                `).join('')}
            </div>
        `;
        folderContainer.appendChild(folder);
    });
}

window.toggleFolder = (lesson) => { document.getElementById(`folder-content-${lesson}`).classList.toggle('active'); };
window.deleteQuestion = (lesson, id, event) => { event.stopPropagation(); questionBank[lesson] = questionBank[lesson].filter(q => q.id !== id); if (questionBank[lesson].length === 0) delete questionBank[lesson]; localStorage.setItem('flawlessQuestionBank_V3', JSON.stringify(questionBank)); renderQuestionFolders(); };

window.changeQuestionLesson = (oldLesson, id, newLesson, event) => {
    event.stopPropagation();
    if (oldLesson === newLesson) return;

    const questionObj = questionBank[oldLesson].find(q => q.id === id);
    questionBank[oldLesson] = questionBank[oldLesson].filter(q => q.id !== id);
    if (questionBank[oldLesson].length === 0) delete questionBank[oldLesson];

    if (!questionBank[newLesson]) questionBank[newLesson] = [];
    questionBank[newLesson].push(questionObj);

    localStorage.setItem('flawlessQuestionBank_V3', JSON.stringify(questionBank));
    renderQuestionFolders();
    setTimeout(() => { const el = document.getElementById(`folder-content-${newLesson}`); if (el) el.classList.add('active'); }, 50);
}

// PDF OLUŞTURMA VE ARŞİVE EKLEME
document.getElementById('generate-questions-pdf-btn').onclick = async () => {
    let newQuestionsForPDF = [];
    let savedQuestionIds = [];

    Object.keys(questionBank).forEach(lesson => {
        questionBank[lesson].forEach(q => {
            if (!q.isConverted) {
                newQuestionsForPDF.push({ lesson: lesson, dataUrl: q.dataUrl, ref: q });
                savedQuestionIds.push({ lesson: lesson, id: q.id });
            }
        });
    });

    if (newQuestionsForPDF.length === 0) { alert("Dönüştürülecek 'YENİ' bir soru bulunamadı."); return; }

    const btn = document.getElementById('generate-questions-pdf-btn');
    btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> PDF Hazırlanıyor... Lütfen Bekleyin"; btn.disabled = true;

    await createAndDownloadPDF(newQuestionsForPDF, "Soru_Bankasi_Deneme_YENI.pdf");

    const newArchive = {
        archiveId: 'arc_' + Date.now().toString(),
        date: Date.now(),
        questionCount: savedQuestionIds.length,
        questions: savedQuestionIds
    };
    pdfArchives.push(newArchive);
    localStorage.setItem('flawlessPdfArchives', JSON.stringify(pdfArchives));

    newQuestionsForPDF.forEach(q => { q.ref.isConverted = true; });
    localStorage.setItem('flawlessQuestionBank_V3', JSON.stringify(questionBank));

    btn.innerHTML = "<i class='fa-solid fa-file-pdf'></i> Sadece YENİ Soruları PDF Yap & Arşive Ekle"; btn.disabled = false;
    renderQuestionFolders();
};

async function createAndDownloadPDF(questionsArray, fileName) {
    const { jsPDF } = window.jspdf; const doc = new jsPDF('p', 'mm', 'a4');
    const cols = 2, rows = 3, questionsPerPage = 6;
    const margin = 5, spacing = 5;
    const maxCellWidth = (210 - (2 * margin) - spacing) / cols; const maxCellHeight = (297 - (2 * margin) - (2 * spacing)) / rows;
    let itemsOnPage = 0;

    for (let i = 0; i < questionsArray.length; i++) {
        if (itemsOnPage === questionsPerPage) { doc.addPage(); itemsOnPage = 0; }
        const q = questionsArray[i];
        const img = new Image(); img.src = q.dataUrl;
        await new Promise(res => { img.onload = res; });

        const col = itemsOnPage % cols; const row = Math.floor(itemsOnPage / cols);
        const cellX = margin + (col * (maxCellWidth + spacing)); const cellY = margin + (row * (maxCellHeight + spacing));

        const ratio = Math.min(maxCellWidth / img.width, maxCellHeight / img.height);
        const finalW = img.width * ratio; const finalH = img.height * ratio;

        doc.setFontSize(8); doc.setTextColor(100); doc.text(q.lesson, cellX, cellY - 1);
        doc.addImage(img, 'JPEG', cellX + (maxCellWidth - finalW) / 2, cellY, finalW, finalH, undefined, 'FAST');
        itemsOnPage++;
    }
    doc.save(fileName);
}

// ARŞİV VE TEKRAR ARAYÜZÜ
function renderArchives() {
    const list = document.getElementById('archive-list');
    list.innerHTML = "";

    if (pdfArchives.length === 0) { list.innerHTML = "<p style='text-align:center; color:var(--text-muted); margin-top:20px;'>Geçmiş denemeniz bulunmuyor.</p>"; return; }

    const sortedArchives = [...pdfArchives].sort((a, b) => b.date - a.date);

    sortedArchives.forEach(arc => {
        const daysPassed = Math.floor((Date.now() - arc.date) / (1000 * 60 * 60 * 24));
        const needsReview = daysPassed >= 30;
        const alertHtml = needsReview ? `<div class="archive-alert-badge">🚨 Tekrar Vakti! (30 Günü Geçti)</div>` : '';

        const div = document.createElement('div');
        div.className = `archive-item ${needsReview ? 'alert' : ''}`;

        div.innerHTML = `
            <div class="archive-details">
                <div class="archive-title">Karma Deneme PDF (${arc.questionCount} Soru)</div>
                <div class="archive-date">Oluşturulma: ${new Date(arc.date).toLocaleDateString()} - <b>${daysPassed} Gün Önce</b></div>
                ${alertHtml}
            </div>
            <button class="re-download-btn" onclick="reDownloadArchive('${arc.archiveId}')"><i class="fa-solid fa-download"></i> Yeniden İndir</button>
        `;
        list.appendChild(div);
    });
}

window.reDownloadArchive = async (archiveId) => {
    const archive = pdfArchives.find(a => a.archiveId === archiveId);
    if (!archive) return;

    let questionsToPrint = [];
    archive.questions.forEach(qRef => {
        if (questionBank[qRef.lesson]) {
            const foundQ = questionBank[qRef.lesson].find(q => q.id === qRef.id);
            if (foundQ) questionsToPrint.push({ lesson: qRef.lesson, dataUrl: foundQ.dataUrl });
        }
    });

    if (questionsToPrint.length === 0) { alert("Bu arşivdeki sorular veritabanından silinmiş."); return; }

    const confirmMsg = confirm(`Bu arşivde toplam ${questionsToPrint.length} soru bulundu. Yeniden PDF olarak indirilsin mi?`);
    if (confirmMsg) { await createAndDownloadPDF(questionsToPrint, `Tekrar_Denemesi_${new Date(archive.date).toLocaleDateString()}.pdf`); }
}


// ==========================================
// TEKRAR SİSTEMİ MANTIĞI (DÜZELTİLEN YER)
// ==========================================
const reviewModal = document.getElementById('review-modal');
const reviewExamType = document.getElementById('review-exam-type');
const reviewLessonSelect = document.getElementById('review-lesson-select');
const reviewContainer = document.getElementById('review-topics-container');

document.getElementById('open-review-btn').onclick = () => { reviewExamType.value = ""; reviewLessonSelect.innerHTML = '<option value="" disabled selected>Ders Seç</option>'; reviewLessonSelect.disabled = true; reviewContainer.innerHTML = '<div class="review-placeholder">Ders seçtiğinizde konular listelenecektir.</div>'; reviewModal.classList.add('active'); };
document.getElementById('close-review-modal').onclick = () => reviewModal.classList.remove('active');
reviewExamType.addEventListener('change', function () {
    const exam = this.value;
    reviewLessonSelect.innerHTML = '<option value="" disabled selected>Ders Seç</option>';
    reviewLessonSelect.disabled = false;

    Object.keys(syllabus[exam]).forEach(lesson => {
        const opt = document.createElement('option'); opt.value = lesson; opt.textContent = lesson;
        reviewLessonSelect.appendChild(opt);
    });
});
reviewLessonSelect.addEventListener('change', renderReviewList);

function renderReviewList() {
    const exam = reviewExamType.value; const lesson = reviewLessonSelect.value;
    if (!exam || !lesson) return;

    // Artık 'syllabus' dolu olduğu için konular hatasızca çekilecek.
    const topics = syllabus[exam][lesson];
    reviewContainer.innerHTML = "";

    if (!reviewData[exam]) reviewData[exam] = {};
    if (!reviewData[exam][lesson]) reviewData[exam][lesson] = {};

    topics.forEach(topic => {
        if (!reviewData[exam][lesson][topic]) {
            reviewData[exam][lesson][topic] = { finishedWeek: null, finishedDate: null, reviews: [{ done: false, date: null }, { done: false, date: null }, { done: false, date: null }, { done: false, date: null }] };
        }

        const tData = reviewData[exam][lesson][topic];
        const row = document.createElement('div'); row.className = 'review-topic-row';

        let statusHTML = '';
        if (!tData.finishedWeek) {
            statusHTML = `<button class="finish-topic-btn" onclick="finishTopic('${exam}', '${lesson}', '${topic}')">Bitir</button>`;
        } else {
            statusHTML = `<span class="finished-badge" onclick="resetTopicInfo('${exam}', '${lesson}', '${topic}')" title="Sıfırlamak için tıkla">${tData.finishedWeek}. Hafta Bitirildi</span>`;
        }

        let circlesHTML = ''; let lastDate = tData.finishedDate; let isNextPendingFound = false;

        for (let i = 0; i < 4; i++) {
            const rev = tData.reviews[i]; let circleClass = 'locked'; let tooltip = 'Önce konuyu bitirmelisin.'; let clickAction = '';

            if (rev.done) {
                circleClass = 'active'; tooltip = `Tamamlandı. (Tarih: ${new Date(rev.date).toLocaleDateString()}) - İptal etmek için tıkla.`;
                lastDate = rev.date; clickAction = `onclick="toggleReview('${exam}', '${lesson}', '${topic}', ${i})"`;
            } else if (tData.finishedWeek && !isNextPendingFound) {
                circleClass = 'pending'; const daysPassed = lastDate ? Math.floor((Date.now() - lastDate) / (1000 * 60 * 60 * 24)) : 0;
                tooltip = `Bekliyor! Son işlemden bu yana ${daysPassed} gün geçti. İşaretlemek için tıkla.`;
                isNextPendingFound = true; clickAction = `onclick="toggleReview('${exam}', '${lesson}', '${topic}', ${i})"`;
            } else if (tData.finishedWeek) {
                tooltip = 'Önceki tekrarları tamamlamalısın.';
            }
            circlesHTML += `<div class="r-circle ${circleClass}" ${clickAction} title="${tooltip}"><i class="fa-solid fa-check"></i></div>`;
        }

        row.innerHTML = `<div class="review-topic-name">${topic}</div><div class="review-topic-status">${statusHTML}</div><div class="review-circles">${circlesHTML}</div>`;
        reviewContainer.appendChild(row);
    });
}
window.finishTopic = (exam, lesson, topic) => { const week = prompt(`"${topic}" konusunu programında kaçıncı haftada bitirdin? (Sadece sayı girin, Örn: 3)`); if (week && !isNaN(week)) { reviewData[exam][lesson][topic].finishedWeek = week.trim(); reviewData[exam][lesson][topic].finishedDate = Date.now(); localStorage.setItem('flawlessReviewPlan_V2', JSON.stringify(reviewData)); renderReviewList(); } };
window.resetTopicInfo = (exam, lesson, topic) => { if (confirm("Konuyu bitirme kaydını ve tüm tekrarları sıfırlamak istiyor musun?")) { reviewData[exam][lesson][topic] = null; localStorage.setItem('flawlessReviewPlan_V2', JSON.stringify(reviewData)); renderReviewList(); } };
window.toggleReview = (exam, lesson, topic, index) => { const rev = reviewData[exam][lesson][topic].reviews[index]; if (rev.done) { rev.done = false; rev.date = null; } else { rev.done = true; rev.date = Date.now(); } localStorage.setItem('flawlessReviewPlan_V2', JSON.stringify(reviewData)); renderReviewList(); };


// ==========================================
// HAFTALIK DERS PLANI MANTIĞI
// ==========================================
const board = document.getElementById('board'); const modal = document.getElementById('modal'); const taskExamType = document.getElementById('task-exam-type'); const taskLessonSelect = document.getElementById('task-lesson-select');
const manualTimeCheckbox = document.getElementById('manual-time-checkbox'); const manualTimeWrapper = document.getElementById('manual-time-wrapper'); const manualTimeInput = document.getElementById('manual-time-input');

manualTimeCheckbox.addEventListener('change', function () { if (this.checked) { manualTimeWrapper.style.display = 'block'; manualTimeInput.focus(); } else { manualTimeWrapper.style.display = 'none'; manualTimeInput.value = ''; } });
taskExamType.addEventListener('change', function () { const exam = this.value; taskLessonSelect.innerHTML = '<option value="" disabled selected>Ders Seçiniz</option>'; taskLessonSelect.disabled = false; Object.keys(syllabus[exam]).forEach(lesson => { const opt = document.createElement('option'); opt.value = lesson; opt.textContent = lesson; taskLessonSelect.appendChild(opt); }); });
function calculateEstimatedTime() { const length = parseInt(document.getElementById('task-video-length').value) || 0; const speed = parseFloat(document.getElementById('task-video-speed').value) || 1; if (length === 0) { document.getElementById('calculated-time').innerText = "0 dk"; return; } const totalMins = Math.round((length / speed) + ((length / 60) * 30)); const hours = Math.floor(totalMins / 60); const mins = totalMins % 60; document.getElementById('calculated-time').innerText = hours > 0 ? `${hours} Saat ${mins} Dk` : `${mins} Dk`; }
document.getElementById('task-video-length').addEventListener('input', calculateEstimatedTime); document.getElementById('task-video-speed').addEventListener('change', calculateEstimatedTime);

function getMonday(d) { const date = new Date(d); const day = date.getDay(); const diff = date.getDate() - day + (day === 0 ? -6 : 1); return new Date(date.setDate(diff)); }
function getWeekKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function updateWeekLabel() { const sunday = new Date(displayedWeekStart); sunday.setDate(sunday.getDate() + 6); const options = { day: 'numeric', month: 'long' }; document.getElementById('current-week-label').innerText = `${displayedWeekStart.toLocaleDateString('tr-TR', options)} - ${sunday.toLocaleDateString('tr-TR', options)} ${sunday.getFullYear()}`; }
function getCurrentWeekTasks() { const key = getWeekKey(displayedWeekStart); if (!allWeeksData[key]) { allWeeksData[key] = { "Pazartesi": [], "Salı": [], "Çarşamba": [], "Perşembe": [], "Cuma": [], "Cumartesi": [], "Pazar": [] }; } return allWeeksData[key]; }

function init() { updateWeekLabel(); renderBoard(); }
function renderBoard() { board.innerHTML = ""; days.forEach(day => { const col = document.createElement('div'); col.className = 'day-column'; col.innerHTML = `<div class="day-header"><h3>${day}</h3><button class="add-btn" onclick="openModal('${day}')"><i class="fa-solid fa-plus"></i></button></div><div class="task-list" id="list-${day}"></div>`; board.appendChild(col); renderTasks(day); }); updateProgress(); }
function renderTasks(day) { const list = document.getElementById(`list-${day}`); list.innerHTML = ""; getCurrentWeekTasks()[day].forEach(task => { const card = document.createElement('div'); card.className = `task-card ${task.completed ? 'completed' : ''}`; let timeHTML = task.time !== "0 dk" ? `<div class="task-time"><i class="fa-solid fa-clock"></i> ${task.time}</div>` : ""; card.innerHTML = `<div class="task-content" onclick="toggleTask('${day}', '${task.id}')"><div class="checkbox"><i class="fa-solid fa-check"></i></div><div class="task-details"><span class="task-badge">${task.lesson}</span><div class="task-text">${task.topic}</div>${timeHTML}</div></div><div class="task-actions"><button class="icon-btn edit-btn" onclick="openEditModal('${day}', '${task.id}')" title="Düzenle"><i class="fa-solid fa-pen"></i></button><button class="icon-btn delete-btn" onclick="deleteTask('${day}', '${task.id}')" title="Sil"><i class="fa-solid fa-trash-can"></i></button></div>`; list.appendChild(card); }); }
function updateProgress() { let total = 0, completed = 0; Object.values(getCurrentWeekTasks()).forEach(arr => { total += arr.length; completed += arr.filter(t => t.completed).length; }); const percent = total === 0 ? 0 : Math.round((completed / total) * 100); document.getElementById('progress-fill').style.width = `${percent}%`; document.getElementById('progress-percentage').innerText = `${percent}%`; }
function saveAndRender() { localStorage.setItem('flawlessWeeklyPlanner', JSON.stringify(allWeeksData)); updateWeekLabel(); renderBoard(); }

window.openEditModal = (day, id) => { currentSelectedDay = day; editingTaskId = id; const task = getCurrentWeekTasks()[day].find(t => t.id === id); document.getElementById('modal-title').innerText = `${day} - Görevi Düzenle`; document.getElementById('save-task-btn').innerText = "Güncelle"; const exam = task.lesson.split(' ')[0]; const lesson = task.lesson.substring(exam.length).trim(); taskExamType.value = exam; taskExamType.dispatchEvent(new Event('change')); taskLessonSelect.value = lesson; document.getElementById('task-topic').value = task.topic; manualTimeCheckbox.checked = true; manualTimeWrapper.style.display = 'block'; manualTimeInput.value = task.time; document.getElementById('calculated-time').innerText = task.time; modal.classList.add('active'); };
window.openModal = (day) => { currentSelectedDay = day; editingTaskId = null; document.getElementById('modal-title').innerText = `${day} - Yeni Görev`; document.getElementById('save-task-btn').innerText = "Görevi Ekle"; taskExamType.value = ""; taskLessonSelect.innerHTML = '<option value="" disabled selected>Önce Sınav Seç</option>'; taskLessonSelect.disabled = true; document.getElementById('task-topic').value = ""; document.getElementById('task-video-length').value = ""; document.getElementById('task-video-speed').value = "1"; document.getElementById('calculated-time').innerText = "0 dk"; manualTimeCheckbox.checked = false; manualTimeWrapper.style.display = 'none'; manualTimeInput.value = ''; modal.classList.add('active'); }
document.getElementById('close-modal').onclick = () => modal.classList.remove('active');
document.getElementById('save-task-btn').onclick = () => { const exam = taskExamType.value; const lessonName = taskLessonSelect.value; const topic = document.getElementById('task-topic').value.trim(); let time = manualTimeCheckbox.checked ? (manualTimeInput.value.trim() || "Süre belirtilmedi") : document.getElementById('calculated-time').innerText; if (exam && lessonName && topic) { if (editingTaskId) { const task = getCurrentWeekTasks()[currentSelectedDay].find(t => t.id === editingTaskId); task.lesson = `${exam} ${lessonName}`; task.topic = topic; task.time = time; } else { getCurrentWeekTasks()[currentSelectedDay].push({ id: Date.now().toString(), lesson: `${exam} ${lessonName}`, topic, time, completed: false }); } saveAndRender(); modal.classList.remove('active'); } else { alert("Sınav, Ders ve Konu boş bırakılamaz!"); } };
window.toggleTask = (day, id) => { const t = getCurrentWeekTasks()[day].find(x => x.id === id); if (t) { t.completed = !t.completed; saveAndRender(); } }
window.deleteTask = (day, id) => { getCurrentWeekTasks()[day] = getCurrentWeekTasks()[day].filter(t => t.id !== id); saveAndRender(); }
document.getElementById('prev-week').onclick = () => { displayedWeekStart.setDate(displayedWeekStart.getDate() - 7); saveAndRender(); };
document.getElementById('next-week').onclick = () => { displayedWeekStart.setDate(displayedWeekStart.getDate() + 7); saveAndRender(); };
document.getElementById('today-btn').onclick = () => { displayedWeekStart = getMonday(new Date()); saveAndRender(); };

init();
