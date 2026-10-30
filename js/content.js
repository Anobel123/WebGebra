// Konten situs. Data level, kuis, dan lencana berasal dari repo gim (content-data.js).
export { LEVELS, QUIZ_SAMPLES, BADGES } from './content-data.js';

export const MARQUEE = ['Aljabar', 'Literasi Keuangan', 'Kurikulum Merdeka', 'Pembelajaran Mendalam', 'Android & Web', 'LIDM 2026'];

export const SCREENSHOTS = [
  { src: 'assets/img/ss-profil.png', title: 'Profil Saya', alt: 'Layar Profil Saya: pemain mengisi nama, memilih avatar, dan melihat gelar' },
  { src: 'assets/img/ss-tantangan.png', title: 'Pilih Tantangan', alt: 'Layar Pilih Tantangan: lencana level bernomor dengan bintang' },
  { src: 'assets/img/ss-kasir-tutorial.png', title: 'Layar Kasir', alt: 'Layar Kasir dengan petunjuk tutorial cara bermain' },
  { src: 'assets/img/ss-kasir.png', title: 'Pesanan Pelanggan', alt: 'Pesanan pelanggan yang harus diterjemahkan menjadi bentuk aljabar' }
];

export const PHASES = [
  { id: 'f0', label: 'Level 0 · Pengantar', mode: 'Tutorial interaktif', levels: [0], note: 'Tutorial interaktif cara bermain.' },
  { id: 'f1', label: 'Fase 1 · Variabel murni', mode: 'Tantangan Mudah (C1-C3)', levels: [1, 2, 3] },
  { id: 'f2', label: 'Fase 2 · Dua variabel', mode: 'Tantangan Mudah (C1-C3)', levels: [4, 5, 6, 7] },
  { id: 'f3', label: 'Fase 3 · Sifat operasi', mode: 'Tantangan Mudah (C1-C3)', levels: [8, 9, 10] },
  { id: 'f4', label: 'Fase 4 · Substitusi nilai riil', mode: 'Tantangan Sulit (HOTS C4-C6)', levels: [11, 12, 13, 14, 15] },
  { id: 'f5', label: 'Fase 5 · Distributif (paket hajatan)', mode: 'Tantangan Sulit (HOTS C4-C6)', levels: [16, 17, 18, 19, 20] }
];

export const PILLARS = [
  { t: 'Kontekstual', d: 'Variabel adalah harga barang sehari-hari, termasuk kuliner lokal Jambi: padamaran, dodol nanas, gandus, dan tempoyak.' },
  { t: 'Pembelajaran mendalam', d: 'Pendekatan mindful, meaningful, joyful learning. Siswa bernalar, bukan menghafal.' },
  { t: 'Bertahap', d: '20 level dari C1 sampai C6 (taksonomi Bloom), dengan scaffolding dari variabel tunggal hingga sifat distributif.' },
  { t: 'Lintas mata pelajaran', d: 'Aljabar bertemu literasi keuangan, kewargaan, bahasa, informatika, dan muatan lokal.' },
  { t: 'Inklusif untuk daerah 3T', d: 'Berbasis web ringan dan APK Android. Aset gim dibundel lokal sehingga tetap berjalan dengan koneksi terbatas.' }
];

export const MAPEL = [
  'Matematika: aljabar', 'Ekonomi: laba, kembalian, anggaran', 'PPKn: sumbangan sosial (gelar Pedagang Dermawan)',
  'Bahasa Indonesia: soal cerita kontekstual', 'Informatika: berpikir komputasional, gim', 'Muatan lokal Jambi: kuliner'
];

export const FEATURES = [
  { t: 'Mode Kasir interaktif', d: 'Terjemahkan pesanan menjadi bentuk aljabar, lalu layani pembayaran.', i: 'M4 7h16l-1.5 11a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 7zm4 0a4 4 0 0 1 8 0' },
  { t: 'Kuis evaluasi tiap level', d: 'Soal pilihan ganda untuk mengecek pemahaman.', i: 'M9 9a3 3 0 1 1 4.5 2.6c-1 .6-1.5 1.1-1.5 2.4M12 18h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z' },
  { t: 'Bintang 1-3 per level', d: 'Penilaian bintang setiap level selesai.', i: 'M12 2l3 6.5 7 .9-5.1 4.8 1.3 7L12 17.8 5.8 21.2l1.3-7L2 9.4l7-.9z' },
  { t: 'Buku Kas', d: 'Catatan laba toko dari transaksi yang dilayani.', i: 'M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4zm4 5h8M8 13h8' },
  { t: 'Prestasi', d: '20 lencana dalam 5 tier.', i: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3' },
  { t: 'Gelar', d: 'Kasir Magang, Kasir Junior, Pedagang Ahli, Juragan Pasar, Sultan Aljabar, dan Pedagang Dermawan bagi yang aktif menyumbang.', i: 'M3 8l4 4 5-7 5 7 4-4v11H3V8z' },
  { t: 'Mode Kelas untuk guru', d: 'Kode ruang, pantau siswa, rapor belajar, laporan asesmen cetak, dan peringatan dini siswa yang kesulitan.', i: 'M3 5h18v11H3zM8 21h8M12 16v5' },
  { t: 'Efek suara', d: 'Umpan balik suara yang menyenangkan saat bermain.', i: 'M4 9v6h4l5 4V5L8 9H4zm12 0a4 4 0 0 1 0 6' }
];

export const LEARN_STEPS = [
  'Isi profil dan pilih avatar.',
  'Ikuti Pengantar (Level 0).',
  'Layani pelanggan dan tulis rumus aljabarnya.',
  'Jawab kuis, kumpulkan bintang dan lencana.'
];

// Demo "Coba Jadi Kasir": soal diambil dari contoh level 2, 4, dan 11 (levels.js).
export const DEMO_QUESTIONS = [
  {
    level: 2, customer: 'Harga satu batang dodol nanas adalah <b>d</b> rupiah. Tolong 3 batang, eh tambah 4 batang lagi.',
    options: ['7d', '12d', 'd⁷', '3d + 4'], answer: 0,
    right: '3d + 4d adalah suku sejenis, jadi koefisiennya dijumlahkan menjadi 7d.',
    hint: 'Coba lagi. Ingat: d adalah harga satu batang, jadi 3 batang ditambah 4 batang tetap dihitung sebagai jumlah batang.',
    vars: [{ sym: 'd', name: 'dodol nanas', min: 1000, max: 7000, step: 500, value: 3000, coef: 7 }], pay: 50000
  },
  {
    level: 4, customer: 'Harga satu kue gandus adalah <b>e</b> rupiah, dan satu batang dodol nanas adalah <b>d</b> rupiah. Siapkan 4 kue gandus dan 2 batang dodol nanas ya.',
    options: ['4e + 2d', '6ed', '6e', '8ed'], answer: 0,
    right: 'Dua barang berbeda tidak bisa digabung. Hasilnya tetap 4e + 2d.',
    hint: 'Coba lagi. Gandus (e) dan dodol (d) harganya berbeda, jadi tidak bisa dijadikan satu suku.',
    vars: [{ sym: 'e', name: 'gandus', fixed: 1500, coef: 4 }, { sym: 'd', name: 'dodol nanas', min: 1000, max: 5000, step: 500, value: 3000, coef: 2 }], pay: 20000
  },
  {
    level: 11, customer: 'Harga satu kantong beras adalah <b>b</b> rupiah dan satu kantong minyak adalah <b>i</b> rupiah. Tolong bungkuskan 3 kantong beras dan 2 kantong minyak.',
    options: ['3b + 2i', '5bi', '5b', '6bi'], answer: 0,
    right: '3 kantong beras ditulis 3b, 2 kantong minyak ditulis 2i. Keduanya dijumlahkan menjadi 3b + 2i.',
    hint: 'Coba lagi. Koefisien menunjukkan jumlah kantong, huruf menunjukkan jenis barang.',
    vars: [{ sym: 'b', name: 'beras', min: 10000, max: 20000, step: 500, value: 15000, coef: 3 }, { sym: 'i', name: 'minyak goreng', min: 10000, max: 18000, step: 500, value: 14000, coef: 2 }], pay: 100000
  }
];

// 20 Responden Siswa SMP untuk karakter anak SMP interaktif & talk box otomatis
export const STUDENT_VOICES = [
  { no: 1, code: 'Siswa 1', initials: 'EN', name: 'Ela Nurhayati', gender: 'F', item: 'padamaran.png', topic: 'Makna Variabel & Koefisien', text: 'Gamenya bagus! Saya bisa belajar sesuai simulasi jadi kasir, dan saya jadi paham kalau huruf variabel itu mewakili harga satu barang, bukan sekadar huruf di papan tulis.' },
  { no: 2, code: 'Siswa 2', initials: 'EA', name: 'Eka Alya', gender: 'F', item: 'dodolnanas.png', topic: 'Penjumlahan Suku Sejenis', text: 'Gamenya bagus dan seru! Saya bisa belajar sesuai pesanan pelanggan, dan saya jadi paham cara menjumlahkan suku sejenis seperti 3d + 4d menjadi 7d tanpa bingung lagi.' },
  { no: 3, code: 'Siswa 3', initials: 'AMJ', name: 'Azahra Miftakhul Janah', gender: 'F', item: 'buku.png', topic: 'Pengurangan Suku Sejenis', text: 'Gamenya bagus banget! Saya bisa belajar sesuai alur cerita belanja, dan saya jadi paham kalau barang yang dibatalkan pembeli itu artinya pengurangan suku sejenis.' },
  { no: 4, code: 'Siswa 4', initials: 'GA', name: 'Ghaniyyu Annafis', gender: 'M', item: 'beras.png', topic: 'Dua Variabel Berbeda', text: 'Gamenya bagus! Saya bisa belajar sesuai level yang bertahap, dan saya jadi paham cara menuliskan bentuk aljabar untuk dua barang berbeda seperti 2b + 3i.' },
  { no: 5, code: 'Siswa 5', initials: 'NBA', name: 'Nlayra Barianola Nskhia', gender: 'F', item: 'gandus.png', topic: 'Suku Tidak Sejenis', text: 'Gamenya bagus! Saya bisa belajar sesuai contoh nyata di toko, dan saya jadi paham kenapa dua barang yang berbeda jenis tidak boleh digabung jadi satu suku.' },
  { no: 6, code: 'Siswa 6', initials: 'MH', name: 'Mazharul Haq', gender: 'M', item: 'kopiaaa.png', topic: 'Sifat Komutatif Aljabar', text: 'Gamenya bagus! Saya bisa belajar sesuai urutan transaksi kasir, dan saya jadi paham sifat komutatif bahwa urutan pesanan dibalik hasilnya tetap sama.' },
  { no: 7, code: 'Siswa 7', initials: 'RP', name: 'Ridho Pratama', gender: 'M', item: 'apel.png', topic: 'Makna Koefisien Nol', text: 'Gamenya bagus! Saya bisa belajar sesuai praktik langsung, dan saya jadi paham makna koefisien nol saat seluruh pesanan barang tertentu dibatalkan.' },
  { no: 8, code: 'Siswa 8', initials: 'FA', name: 'Feni Asdiyanti', gender: 'F', item: 'minyakgoreng.png', topic: 'Substitusi Nilai Rupiah', text: 'Gamenya bagus! Saya bisa belajar sesuai harga barang di daftar toko, dan saya jadi paham cara mensubstitusi nilai rupiah ke dalam variabel untuk menghitung total belanja.' },
  { no: 9, code: 'Siswa 9', initials: 'NS', name: 'Nayla Salsabila', gender: 'F', item: 'jeruk.png', topic: 'Menghitung Uang Kembalian', text: 'Gamenya bagus! Saya bisa belajar sesuai kegiatan jual-beli sehari-hari, dan saya jadi paham cara menghitung total tagihan aljabar sekaligus menyiapkan pecahan uang kembalian.' },
  { no: 10, code: 'Siswa 10', initials: 'SBA', name: 'Shagya Bilqis Adaha', gender: 'F', item: 'gula.png', topic: 'Memilah Informasi Soal Cerita', text: 'Gamenya bagus! Saya bisa belajar sesuai dialog pelanggan, dan saya jadi paham cara memilah informasi penting pada soal cerita tanpa terjebak angka pengecoh.' },
  { no: 11, code: 'Siswa 11', initials: 'RO', name: 'Reym Ofrizon', gender: 'M', item: 'roti.png', topic: 'Sifat Distributif Paket', text: 'Gamenya bagus! Saya bisa belajar sesuai tantangan paket hajatan, dan saya jadi paham sifat distributif aljabar seperti 3(2a + b) menjadi 6a + 3b.' },
  { no: 12, code: 'Siswa 12', initials: 'FNA', name: 'Farah Nur Aini', gender: 'F', item: 'tempoyak.png', topic: 'Mengenal Kuliner Lokal Jambi', text: 'Gamenya bagus! Saya bisa belajar sesuai suasana minimarket lokal, dan saya jadi paham aljabar sambil mengenal kuliner khas Jambi seperti padamaran, gandus, dan tempoyak.' },
  { no: 13, code: 'Siswa 13', initials: 'SN', name: 'Salma Nurhitmah', gender: 'F', item: 'tepung.png', topic: 'Suku Campuran Tiga Variabel', text: 'Gamenya bagus! Saya bisa belajar sesuai ritme saya sendiri dari Level 0, dan saya jadi paham cara mengelompokkan suku sejenis walaupun ada tiga variabel berbeda.' },
  { no: 14, code: 'Siswa 14', initials: 'MFM', name: 'M. Fathir Abdul Aziz', gender: 'M', item: 'pena.png', topic: 'Literasi Keuangan & Laba Toko', text: 'Gamenya bagus! Saya bisa belajar sesuai fitur Buku Kas di gim, dan saya jadi paham cara menghitung pendapatan, modal, serta laba bersih toko.' },
  { no: 15, code: 'Siswa 15', initials: 'PA', name: 'Assyifa Harahap', gender: 'F', item: 'sabun.png', topic: 'Berbagi & Sumbangan Sosial', text: 'Gamenya bagus! Saya bisa belajar sesuai nilai karakter di gim, dan saya jadi paham pentingnya menyisihkan sebagian laba toko untuk sumbangan sosial.' },
  { no: 16, code: 'Siswa 16', initials: 'MFR', name: 'Alia Arrami', gender: 'F', item: 'telur.png', topic: 'Distributif Pecahan', text: 'Gamenya bagus! Saya bisa belajar sesuai petunjuk visual yang jelas, dan saya jadi paham cara menghitung setengah paket pesanan menggunakan sifat distributif pecahan.' },
  { no: 17, code: 'Siswa 17', initials: 'AH', name: 'Ulfa Azmi Ashoka', gender: 'F', item: 'terong.png', topic: 'Evaluasi Kuis Tiap Level', text: 'Gamenya bagus! Saya bisa belajar sesuai kuis evaluasi di akhir level, dan saya jadi paham letak kesalahan saya sehingga lebih teliti menulis rumus aljabar.' },
  { no: 18, code: 'Siswa 18', initials: 'AA', name: 'Dara Alhaditsul Husna', gender: 'F', item: 'dodolnanas.png', topic: 'Pesanan Rombongan & Gabungan', text: 'Gamenya bagus! Saya bisa belajar sesuai tantangan yang makin seru, dan saya jadi paham cara menggabungkan pesanan dari beberapa pelanggan sekaligus ke bentuk aljabar.' },
  { no: 19, code: 'Siswa 19', initials: 'UAA', name: 'Novil Azis Permana', gender: 'M', item: 'beras.png', topic: 'Kurung Ganda & Operasi Bertingkat', text: 'Gamenya bagus! Saya bisa belajar sesuai tahapan dari mudah ke sulit, dan saya jadi paham cara menyelesaikan operasi aljabar bertingkat dengan kurung ganda.' },
  { no: 20, code: 'Siswa 20', initials: 'DAH', name: 'Muhammad Naufal Maulana', gender: 'M', item: 'kopiaaa.png', topic: 'Kepercayaan Diri Belajar Aljabar', text: 'Gamenya bagus! Saya bisa belajar sesuai cara bermain yang menyenangkan, dan saya jadi paham bahwa aljabar itu ternyata dekat dengan kehidupan sehari-hari dan tidak menakutkan.' }
];

// Data tim pengembang. Foto otomatis fallback ke inisial emas bila file belum ditaruh di assets/img/.
export const TEAM = [
  { name: 'Zakky Fahrul Gibran', role: 'Ketua Tim', prodi: 'Program Studi Pendidikan Matematika', photo: 'assets/img/tim-zakky.png', isLead: true, links: { github: '', instagram: '', email: '' } },
  { name: 'Ansharudin Sahid', role: 'Anggota Tim', prodi: 'Program Studi Pendidikan Matematika', photo: 'assets/img/tim-ansharudin.png', links: { github: 'https://github.com/ansharudinsahid', instagram: '', email: 'ansharudinsahid@gmail.com' } },
  { name: 'Jean Daniela', role: 'Anggota Tim', prodi: 'Program Studi Pendidikan Matematika', photo: 'assets/img/tim-jean.png', links: { github: '', instagram: '', email: '' } },
  { name: 'Alfredo Nobel Tambunan', role: 'Anggota Tim', prodi: 'Program Studi Informatika', photo: 'assets/img/tim-alfredo.png', links: { github: '', instagram: '', email: '' } }
];

// Pak Yogi dihilangkan sementara; Ibu Dr. Tria Gustiningsi, M.Pd. sebagai Dosen Pembimbing
export const VALIDATORS = [
  // { name: 'Yogi Perdana, M.Kom.', role: 'Validator ahli gim/media (informatika)', photo: 'assets/img/validator-yogi.png', links: {} },
  { name: 'Dr. Tria Gustiningsi, M.Pd.', role: 'Dosen Pembimbing', prodi: 'Program Studi Pendidikan Matematika', photo: 'assets/img/pembimbing-tria.png', links: {} }
];

export const INSTITUTION = {
  name: 'Universitas Jambi', detail: 'Kolaborasi Program Studi Pendidikan Matematika & Informatika',
  logos: [
    { key: 'algebramart', title: 'Logo Algebra-Mart', badge: 'AM', src: 'assets/img/logo-algebramart.png', alt: 'Logo produk Algebra-Mart', desc: 'Identitas resmi gim edukasi Algebra-Mart' },
    { key: 'tim', title: 'Logo Tim Pengembang', badge: 'TIM', src: 'assets/img/logo-tim.png', alt: 'Logo Tim Pengembang Algebra-Mart', desc: 'Identitas tim pengembang LIDM 2026' },
    { key: 'kampus', title: 'Logo Universitas Jambi', badge: 'UNJA', src: 'assets/img/logo-kampus.png', alt: 'Logo Universitas Jambi', desc: 'Perguruan tinggi asal tim pengembang' },
    { key: 'lidm', title: 'Logo LIDM 2026', badge: 'LIDM', src: 'assets/img/logo-lidm.png', alt: 'Logo Lomba Inovasi Digital Mahasiswa 2026', desc: 'Ajang kompetisi nasional' }
  ]
};

/** Validasi data startup; hanya ke console. */
export function validateContent(c) {
  const w = (m) => console.warn('[content]', m);
  const arr = (n, a) => { if (!Array.isArray(a) || !a.length) w(`${n} kosong/tidak valid`); return Array.isArray(a) ? a : []; };
  arr('LEVELS', c.LEVELS).forEach((l) => { if (typeof l.no !== 'number' || !l.title) w(`level tidak valid: ${JSON.stringify(l).slice(0, 60)}`); });
  arr('BADGES', c.BADGES).forEach((b) => { if (!b.name || !(b.tier >= 1 && b.tier <= 5)) w(`lencana tidak valid: ${b.id}`); });
  arr('QUIZ_SAMPLES', c.QUIZ_SAMPLES).forEach((q) => { if (!q.q || !Array.isArray(q.options) || typeof q.ans !== 'number') w('soal kuis tidak valid'); });
  arr('DEMO_QUESTIONS', c.DEMO_QUESTIONS).forEach((q) => { if (!q.options?.[q.answer] || !q.vars?.length) w('soal demo tidak valid'); });
  arr('STUDENT_VOICES', c.STUDENT_VOICES).forEach((s) => { if (!s.name || !s.text) w('data siswa tidak valid'); });
  arr('TEAM', c.TEAM).forEach((t) => { if (!t.name) w('anggota tim tanpa nama'); });
}
