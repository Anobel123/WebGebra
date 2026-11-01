// Konten situs. Data level, kuis, dan lencana berasal dari repo gim (content-data.js).
export { LEVELS, QUIZ_SAMPLES, BADGES } from './content-data.js';

export const MARQUEE = ['Aljabar', 'Literasi Keuangan', 'Kurikulum Merdeka', 'Pembelajaran Mendalam', 'Android & Web', 'LIDM 2026'];

export const SCREENSHOTS = [
  { src: 'assets/img/hero/hero-1.webp', slotId: 'hero-1', title: 'Buat Profil Kasir', alt: 'Layar Masuk: pemain membuat profil baru dan menentukan kelas kasir' },
  { src: 'assets/img/hero/hero-2.webp', slotId: 'hero-2', title: 'Profil Saya', alt: 'Layar Profil Saya: data pemain, kartu pegawai, dan gelar kasir' },
  { src: 'assets/img/hero/hero-3.webp', slotId: 'hero-3', title: 'Pilih Tantangan', alt: 'Layar Pilih Tantangan: peta level tantangan mudah dan sulit' },
  { src: 'assets/img/hero/hero-4.webp', slotId: 'hero-4', title: 'Konsep Aljabar Kasir', alt: 'Layar Level 0: simulasi pencocokan kotak belanja dengan nominal uang' },
  { src: 'assets/img/hero/hero-5.webp', slotId: 'hero-5', title: 'Pesanan Pelanggan', alt: 'Layar Meja Kasir: menerjemahkan pesanan pelanggan dalam bentuk aljabar' }
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
  {
    num: '01',
    t: 'Aljabar Kontekstual',
    d: 'Variabel, koefisien, dan konstanta berasal langsung dari barang dagangan khas Jambi: dodol nanas (d), kue padamaran (j), gandus (e), dan tempoyak (o). Siswa bernalar secara intuitif mengapa pesanan suku sejenis seperti 3d + 4d = 7d dapat dijumlahkan, sedangkan komoditas berbeda seperti dodol nanas dan tempoyak (3d + 2o ≠ 5do) tidak dapat dilebur.'
  },
  {
    num: '02',
    t: 'Simulasi Kasir & Finansial',
    d: 'Pembelajaran aljabar terhubung utuh dengan literasi finansial nyata: menghitung total belanja pesanan, memeriksa nominal pecahan uang tunai di laci kasir, menghitung uang kembalian pas, menyusun pencatatan laba bersih di Buku Kas, serta menyisihkan keuntungan toko untuk infaq dana sosial kemanusiaan.'
  },
  {
    num: '03',
    t: 'Gamifikasi Prestasi',
    d: 'Membangun motivasi belajar mandiri melalui sistem capaian komprehensif: 20 lencana prestasi bertingkat (dari Si Teliti hingga Sultan Aljabar), kenaikan jenjang karier kasir dari Kasir Magang sampai Sultan Aljabar (serta gelar istimewa Pedagang Dermawan), dan Papan Kehormatan (Hall of Fame) bagi kasir terbaik.'
  }
];

export const MAPEL = [
  'Matematika: aljabar', 'Ekonomi: laba, kembalian, anggaran', 'PPKn: sumbangan sosial (gelar Pedagang Dermawan)',
  'Bahasa Indonesia: soal cerita kontekstual', 'Informatika: berpikir komputasional, gim', 'Muatan lokal Jambi: kuliner'
];

export const FEATURES = [
  {
    id: 'buku-kas',
    size: 'featured',
    t: 'Buku Kas & Kalkulator Kembalian Kasir',
    d: 'Mencatat seluruh laba kotor, modal belanja, dan pendapatan dari setiap pelanggan yang dilayani. Melatih ketepatan menghitung uang kembalian pecahan rupiah secara akurat.',
    badge: 'Struk Toko',
    receipt: {
      shop: 'ALGEBRA-MART JAMBI',
      no: 'NOTA-0428',
      items: [
        { name: 'Dodol Nanas (3d)', price: 'Rp9.000' },
        { name: 'Kue Padamaran (2j)', price: 'Rp4.000' },
        { name: 'Tempoyak Dus (1o)', price: 'Rp15.000' }
      ],
      total: 'Total Belanja: Rp28.000',
      pay: 'Tunai: Rp50.000 · Kembali: Rp22.000'
    }
  },
  {
    id: 'mode-kelas',
    size: 'compact',
    t: 'Mode Kelas & Kode Ruang Fasilitator',
    d: 'Guru dapat membuat kode ruang belajar 4 angka (PIN 1234), memantau ketuntasan level siswa secara langsung, dan mengunduh rekap rapor asesmen formatif.',
    badge: 'Fasilitator'
  },
  {
    id: 'kuis-c1c6',
    size: 'compact',
    t: 'Kuis Evaluasi Konsep di Akhir Level',
    d: 'Setiap level diakhiri kuis evaluasi pemahaman konsep bentuk aljabar dan literasi keuangan untuk memastikan siswa tidak sekadar menebak jawaban.',
    badge: 'Evaluasi'
  },
  {
    id: 'audio-kelontong',
    size: 'compact',
    t: 'Umpan Balik Suara Khas Toko Kelontong',
    d: 'Denting koin klinting saat kembalian tepat, pemindai barcode kasir saat pesanan dimasukkan, dan lonceng pintu warung yang berbunyi ketika pembeli baru datang.',
    badge: 'Suara Toko'
  }
];

export const LEARN_STEPS = [
  'Pilih avatar kasir dan isi nama kasir di papan nama toko.',
  'Pahami harga barang dan aturan aljabar di Level 0 (Pengantar).',
  'Layani pesanan pembeli: tuliskan rumus aljabar dan hitung kembalian uang rupiah.',
  'Jawab kuis evaluasi pemahaman dan raih kenaikan gelar kasir.'
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
  { no: 20, code: 'Siswa 20', initials: 'DAH', name: 'Muhammad Naufal Maulana', gender: 'M', item: 'kopiaaa.png', topic: 'Kepercayaan Diri Belajar Aljabar', text: 'Simulasi meja kasir membantu saya melihat bahwa bentuk aljabar itu dekat dengan belanja sehari-hari dan tidak rumit dipahami.' }
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
    { key: 'algebramart', title: 'Logo Algebra-Mart', badge: 'AM', src: 'assets/logo/logo-algebra-mart.png', alt: 'Logo produk Algebra-Mart', desc: 'Identitas resmi gim edukasi Algebra-Mart' },
    { key: 'tim', title: 'Logo Tim Pengembang', badge: 'TIM', src: 'assets/logo/logo-tim.png', alt: 'Logo Tim Pengembang Algebra-Mart', desc: 'Identitas tim pengembang LIDM 2026' },
    { key: 'kampus', title: 'Logo Universitas Jambi', badge: 'UNJA', src: 'assets/logo/logo-kampus.png', alt: 'Logo Universitas Jambi', desc: 'Perguruan tinggi asal tim pengembang' },
    { key: 'lidm', title: 'Logo LIDM 2026', badge: 'LIDM', src: 'assets/logo/logo-lidm.png', alt: 'Logo Lomba Inovasi Digital Mahasiswa 2026', desc: 'Ajang kompetisi nasional' }
  ]
};

// Panduan Perangkat (Device Guide)
export const DEVICE_SPECS = {
  landscapeNotice: {
    title: "Putar Perangkat ke Mode Lanskap (Mendatar)",
    desc: "Algebra-Mart dirancang untuk rasio layar 16:9 agar simulasi meja kasir, struk belanja, rak barang, dan kalkulator aljabar dapat dioperasikan secara leluasa dan nyaman."
  },
  specs: [
    {
      category: "Laptop / Komputer (PC)",
      min: "Intel Celeron / Core i3, RAM 2 GB, Resolusi layar 1366×768",
      opt: "Intel Core i5 / AMD Ryzen, RAM 4 GB+, Resolusi Full HD 1920×1080"
    },
    {
      category: "Tablet / Smartphone",
      min: "Android 7.0 (Nougat), RAM 2 GB, Layar 5.5 inci",
      opt: "Android 10+, RAM 4 GB+, Tablet 10 inci untuk ruang kasir leluasa"
    },
    {
      category: "Peramban Web (Browser)",
      min: "Chrome 90+, Edge 90+, Firefox 88+, Safari 14+",
      opt: "Google Chrome atau Microsoft Edge versi terbaru"
    },
    {
      category: "Koneksi Internet",
      min: "Offline untuk Mode Solo (setelah aset termuat); 512 Kbps untuk Mode Kelas",
      opt: "1–2 Mbps stabil untuk sinkronisasi nilai & papan peringkat real-time"
    },
    {
      category: "Orientasi Layar",
      min: "Lanskap (Mendatar)",
      opt: "Lanskap Layar Penuh (Fullscreen)"
    }
  ]
};

// Langkah Cara Bermain (6 Langkah Utama Sesuai Infografis)
export const CARA_BERMAIN_PHASES = [
  { id: 'tahap-a', title: 'Tahap A · Persiapan & Profil', range: [0, 2], desc: 'Pilih platform, buka gim, dan buat profil kasir' },
  { id: 'tahap-b', title: 'Tahap B · Tantangan & Level', range: [3, 4], desc: 'Atur kelas dan pilih Level 0 Pengantar' },
  { id: 'tahap-c', title: 'Tahap C · Simulasi Kasir', range: [5, 5], desc: 'Layani pesanan pembeli dan susun rumus aljabar' }
];

export const CARA_BERMAIN = [
  {
    step: 1,
    phase: 'tahap-a',
    title: 'Pilih Platform & Buka Gim',
    desc: 'Buka Algebra-Mart langsung melalui peramban web modern di komputer/ponsel, atau pasang aplikasi resminya melalui Google Play Store untuk akses cepat tanpa mengetik URL.',
    badge: 'Persiapan',
    slotId: 'langkah-01',
    buttonAction: 'playStore'
  },
  {
    step: 2,
    phase: 'tahap-a',
    title: 'Gerbang Toko & Mulai Permainan',
    desc: 'Pada layar awal selamat datang Algebra-Mart, tekan tombol <strong>Mulai Game</strong> yang dilingkari untuk membuka pintu gerbang toko kelontong.',
    badge: 'Layar Awal',
    slotId: 'langkah-02'
  },
  {
    step: 3,
    phase: 'tahap-a',
    title: 'Tambah Profil Kasir Baru',
    desc: 'Jika baru pertama kali bermain, masukkan nama kasir, pilih jenis kelamin, serta isi kelasmu. Tekan tombol <strong>+ Tambah Kasir</strong> untuk menyimpan profil kasir.',
    badge: 'Pendaftaran Kasir',
    slotId: 'langkah-03'
  },
  {
    step: 4,
    phase: 'tahap-b',
    title: 'Profil Kasir & Mode Kelas',
    desc: 'Periksa kartu ID pegawai kasirmu, lihat gelar kasir dan rekor belanja. Hubungkan kode Mode Kelas jika ditugaskan guru, lalu tekan tombol <strong>Mulai Permainan</strong>.',
    badge: 'Profil & Kelas',
    slotId: 'langkah-04'
  },
  {
    step: 5,
    phase: 'tahap-b',
    title: 'Pilih Tantangan (Level 0 Pengantar)',
    desc: 'Pada layar pilihan tantangan, pilih <strong>Level 0 Pengantar</strong> untuk memahami konsep aljabar dasar kasir dan simulasi pencocokan harga sebelum melayani pelanggan.',
    badge: 'Peta Level',
    slotId: 'langkah-05'
  },
  {
    step: 6,
    phase: 'tahap-c',
    title: 'Layani Pesanan & Susun Rumus Aljabar',
    desc: 'Perhatikan balon dialog pesanan pelanggan (mis. harga dodol nanas <em>d</em> rupiah), susun rumus aljabar pada keypad kasir, lalu hitung pembayaran dan berikan kembalian uang tunai.',
    badge: 'Simulasi Kasir',
    slotId: 'langkah-06'
  }
];

export const TIPS_BERMAIN = [
  {
    icon: 'lightbulb',
    title: 'Perhatikan Huruf Simbol Barang',
    desc: 'Setiap barang punya huruf variabel sendiri yang tertera di balon pesanan (mis. d untuk dodol nanas, i untuk minyak goreng, j untuk kue padamaran). Jangan menjumlahkan huruf yang berbeda!'
  },
  {
    icon: 'star',
    title: 'Syarat 3 Bintang Sempurna',
    desc: 'Raih 3 bintang dengan 0 kesalahan rumus aljabar dan kembalian, serta skor kuis 100% sempurna. Jika melakukan maksimal 2 kesalahan dan kuis minimal 50%, kamu mendapat 2 bintang.'
  },
  {
    icon: 'book-open',
    title: 'Pelajari Konsep di Level 0',
    desc: 'Level 0 memuat pengantar interaktif konsep aljabar (koefisien pesanan, variabel harga barang, dan konstanta biaya kemasan) dengan tempo santai tanpa terburu-buru antrean, dianjurkan dicoba sebelum melayani pelanggan.'
  }
];

export const GURU_GUIDE = {
  title: 'Panduan Guru & Fasilitator (Mode Kelas)',
  badge: 'Fasilitator Kelas',
  pinNote: 'PIN Akses Menu Fasilitator resmi di dalam gim: 1234',
  steps: [
    {
      num: 1,
      title: 'Buka Pengaturan di Layar Login',
      desc: 'Pada layar login awal ("Siapa Kasir Kita Hari Ini?"), klik ikon gerigi di pojok kiri atas untuk membuka Pengaturan, lalu klik tombol <strong>Fasilitator</strong>.',
      slotId: 'guru-01'
    },
    {
      num: 2,
      title: 'Masukkan PIN Fasilitator',
      desc: 'Pada jendela masukan PIN, ketikkan 4 digit PIN keamanan (bawaan gim: <strong>1234</strong>) lalu klik tombol <strong>Masuk</strong>.',
      slotId: 'guru-02'
    },
    {
      num: 3,
      title: 'Buat Sesi Kelas Online',
      desc: 'Di halaman <strong>RUANG FASILITATOR</strong>, klik tombol <strong>Buat Sesi Kelas Online</strong>. Sistem membuat 6 karakter Kode Ruang unik (mis. ALJ7A1) yang tampil pada lencana "Sesi Live" dan tombol salin. Tombol selanjutnya berganti menjadi "Buat Ruang Baru".',
      slotId: 'guru-03'
    },
    {
      num: 4,
      title: 'Bagikan Kode Ruang ke Siswa',
      desc: 'Arahkan siswa membuka gim, masuk ke lobi kasir, klik tombol <strong>Gabung Kelas</strong>, ketikkan 6 karakter Kode Ruang, lalu klik <strong>Gabung</strong>.',
      slotId: 'guru-04'
    },
    {
      num: 5,
      title: 'Pantau Dashboard & Unduh Laporan',
      desc: 'Pantau statistik kelas (Rata-rata Level, skor kasir), daftar siswa aktif, sistem peringatan dini (EWS siswa yang perlu pendampingan), muat ulang sesi terdahulu lewat <strong>Muat Kelas</strong>, serta salin ringkasan ke WhatsApp atau cetak/simpan PDF.',
      slotId: 'guru-05'
    }
  ]
};

// FAQ (10 Pertanyaan Spesifik)
export const FAQ = [
  {
    id: 1,
    q: 'Apakah Algebra-Mart dapat dimainkan secara offline tanpa koneksi internet?',
    a: 'Ya! Seluruh permainan mandiri (Solo), materi pembelajaran, dan data progres tersimpan di penyimpanan lokal perangkat (localStorage). Koneksi internet hanya dibutuhkan saat pertama kali membuka web atau saat menggunakan Mode Kelas untuk sinkronisasi nilai dengan guru.'
  },
  {
    id: 2,
    q: 'Apakah gim Algebra-Mart ini gratis dan bebas iklan?',
    a: 'Benar, 100% gratis tanpa biaya langganan, tanpa iklan komersial, dan tanpa transaksi mikro (in-app purchases). Gim ini dikembangkan murni sebagai inovasi media pembelajaran digital pendidikan.'
  },
  {
    id: 3,
    q: 'Untuk jenjang kelas dan kurikulum apa gim ini dirancang?',
    a: 'Algebra-Mart dirancang spesifik untuk siswa SMP/MTs Kelas VII fase D sesuai Capaian Pembelajaran Kurikulum Merdeka, memadukan domain Aljabar dengan Literasi Keuangan dan Muatan Lokal.'
  },
  {
    id: 4,
    q: 'Bagaimana cara guru memantau perkembangan siswa di kelas secara langsung?',
    a: 'Guru dapat masuk ke menu Mode Kelas dengan memasukkan PIN fasilitator (1234) untuk membuat ruang kelas. Setelah siswa memasukkan kode ruang, guru dapat memantau perolehan bintang, skor kasir, dan tingkat kesulitan siswa secara langsung di papan leaderboard.'
  },
  {
    id: 5,
    q: 'Apa saja cakupan materi matematika yang dipelajari di dalam 20 level?',
    a: 'Materi terstruktur berjenjang dari C1 sampai C6 taksonomi Bloom: Level 1-3 (variabel tunggal & koefisien), Level 4-7 (dua variabel & suku sejenis), Level 8-10 (sifat komutatif & koefisien nol), Level 11-15 (substitusi nilai riil HOTS), hingga Level 16-20 (sifat distributif paket hajatan).'
  },
  {
    id: 6,
    q: 'Di mana saya dapat mengunduh atau memainkan gim ini?',
    a: 'Anda dapat langsung memainkannya melalui peramban web modern di komputer maupun ponsel, atau mengunduh aplikasi resminya melalui tautan Google Play Store yang tersedia di bagian Akses Gim.'
  },
  {
    id: 7,
    q: 'Mengapa layar gim meminta saya untuk memutar perangkat ke mode lanskap?',
    a: 'Tata letak antarmuka meja kasir dioptimalkan pada aspek rasio 16:9 agar simulasi kalkulator kasir, struk belanja, dan dialog pesanan pelanggan dapat terbaca secara proporsional dan nyaman diklik.'
  },
  {
    id: 8,
    q: 'Apakah progres permainan dan koleksi lencana saya akan hilang jika browser ditutup?',
    a: 'Tidak. Data akun kasir, skor, bintang per level, serta 20 koleksi lencana tersimpan aman di penyimpanan peramban (localStorage) perangkat Anda.'
  },
  {
    id: 9,
    q: 'Di mana saya bisa mendapat panduan lengkap?',
    a: 'Anda dapat membaca Buku Instruksi secara online melalui tautan interaktif atau mengunduhnya dalam format PDF pada kartu <a href="#buku-instruksi">Buku Instruksi</a> di bagian Akses Game untuk panduan menyeluruh mulai dari instalasi hingga strategi menyelesaikan level.'
  },
  // Pertanyaan 10 & 11 jika kosong/tampil:false otomatis disembunyikan oleh sistem FAQ
  {
    id: 10,
    q: 'Bagaimana cara mereset data akun kasir jika ingin mengulang dari awal?',
    a: '', // sengaja dikosongkan untuk pengujian penyembunyian otomatis
    tampil: false
  },
  {
    id: 11,
    q: 'Bagaimana cara melaporkan saran atau kendala teknis?',
    a: '', // sengaja dikosongkan untuk pengujian penyembunyian otomatis
    tampil: false
  }
];

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
