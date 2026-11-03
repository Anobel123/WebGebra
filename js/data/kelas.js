// ============================================================================
//  data/kelas.js — Data 20 Karakter Ilustrasi "Kelas Algebra-Mart"
//  Catatan: Ubah `KELAS_SUMBER_DEFAULT` atau field `sumber` menjadi "nyata"
//  bila kelak diganti dengan masukan pemain uji coba sungguhan.
// ============================================================================

export const KELAS_SUMBER_DEFAULT = 'ilustrasi';

export const KELAS_LABELS = {
  ilustrasi: 'Karakter dan kutipan ini ilustrasi untuk menggambarkan pengalaman bermain, bukan testimoni siswa.',
  nyata: 'Masukan dari pemain uji coba Algebra-Mart.'
};

export const KELAS_DATA = [
  {
    id: 1,
    nama: 'Raka Pratama',
    inisial: 'RP',
    tag: 'Variabel = Harga Barang',
    bubble: 'Ternyata huruf d itu harga dodol nanas!',
    cerita: 'Dulu aku sering bingung kenapa di matematika tiba-tiba ada huruf di tengah angka. Pas jaga meja kasir di sini, baru ngeh kalau huruf d itu cuma singkatan dari harga sebatang dodol nanas yang belum diketahui!',
    sumber: 'ilustrasi',
    avatar: { gender: 'M', skin: '#fdba74', hair: '#1e293b', hijab: null, hairStyle: 'spiky', glasses: false }
  },
  {
    id: 2,
    nama: 'Nadia Putri',
    inisial: 'NP',
    tag: 'Suku Sejenis',
    bubble: 'Tambah 3 roti lalu batal 1? Tinggal 2r!',
    cerita: 'Pembeli di toko suka berubah pikiran: awalnya minta 4 bungkus roti, terus nambah 2 lagi, eh tiba-tiba batal 1 bungkus. Dari situ aku langsung lancar menjumlahkan dan mengurangkan suku sejenis karena barangnya sama-sama roti.',
    sumber: 'ilustrasi',
    avatar: { gender: 'F', skin: '#fed7aa', hair: '#1e293b', hijab: '#064937', hairStyle: 'hijab', glasses: false }
  },
  {
    id: 3,
    nama: 'Alya Maharani',
    inisial: 'AMJ',
    tag: 'Dua Variabel Berbeda',
    bubble: '3a + 2b nggak bisa digabung jadi 5ab!',
    cerita: 'Jangan sampai salah hitung kayak aku waktu pertama main ya! Tiga apel ditambah dua jeruk itu tetap ditulis 3a + 2b, nggak boleh digabung jadi satu suku karena harga tiap barangnya saja sudah beda.',
    sumber: 'ilustrasi',
    avatar: { gender: 'F', skin: '#fde68a', hair: '#3b2314', hijab: '#b45309', hairStyle: 'hijab', glasses: true }
  },
  {
    id: 4,
    nama: 'Bima Saputra',
    inisial: 'BS',
    tag: 'Sifat Komutatif',
    bubble: 'Beras dulu atau minyak dulu, hasilnya sama.',
    cerita: 'Tadi ada pembeli yang menyebutkan pesanan minyak goreng dulu baru beras, padahal di catatanku urutannya terbalik. Untung ada sifat komutatif, jadi 2b + 3i nilainya persis sama dengan 3i + 2b.',
    sumber: 'ilustrasi',
    avatar: { gender: 'M', skin: '#fed7aa', hair: '#292524', hijab: null, hairStyle: 'parted', glasses: false }
  },
  {
    id: 5,
    nama: 'Kezia Larasati',
    inisial: 'KL',
    tag: 'Koefisien Nol (0x = 0)',
    bubble: 'Kenapa 0x selalu bernilai 0 rupiah?',
    cerita: 'Pernah terpikir nggak kenapa 0 dikali x hasilnya selalu 0? Di gim ini jawabannya masuk akal banget: kalau pembeli batal membeli barang x alias pesanannya 0 buah, berapapun harga barang itu tagihannya tetap nol rupiah!',
    sumber: 'ilustrasi',
    avatar: { gender: 'F', skin: '#fbcfe8', hair: '#1e293b', hijab: null, hairStyle: 'ponytail', glasses: false }
  },
  {
    id: 6,
    nama: 'Fajar Ramadhan',
    inisial: 'FR',
    tag: 'Substitusi Nilai Rupiah',
    bubble: 'Ganti hurufnya dengan harga di daftar toko!',
    cerita: 'Langkah favoritku itu waktu rumus aljabarnya sudah jadi, terus kita cek papan harga barang di pojok kasir. Begitu huruf variabelnya diganti pakai angka rupiah asli, total belanja pelanggan langsung ketemu.',
    sumber: 'ilustrasi',
    avatar: { gender: 'M', skin: '#fdba74', hair: '#1c1917', hijab: null, hairStyle: 'curly', glasses: true }
  },
  {
    id: 7,
    nama: 'Sinta Oktaviani',
    inisial: 'SO',
    tag: 'Jebakan Soal Level 14',
    bubble: 'Hati-hati, Level 14 ada angka pengecohnya!',
    cerita: 'Level 14 itu seru sekaligus menjebak! Pelanggannya cerita panjang lebar sampai menyebut jam berangkat dan nomor rumah segala, jadi kita harus jeli memilah mana angka yang benar-benar jumlah belanjaan.',
    sumber: 'ilustrasi',
    avatar: { gender: 'F', skin: '#fed7aa', hair: '#1e293b', hijab: '#1e3a8a', hairStyle: 'hijab', glasses: false }
  },
  {
    id: 8,
    nama: 'Damar Wijaya',
    inisial: 'DW',
    tag: 'Distributif Paket Hajatan',
    bubble: 'Pesan 3 paket hajatan? Kalikan ke dalam kurung!',
    cerita: 'Waktu ada ibu-ibu pesan 3 paket bingkisan hajatan yang tiap paketnya berisi 2 kue gandus dan 1 kopi, aku nggak perlu menghitung satu-satu lagi. Tinggal pakai sifat distributif 3(2g + k) jadi 6g + 3k, beres!',
    sumber: 'ilustrasi',
    avatar: { gender: 'M', skin: '#fde68a', hair: '#3b2314', hijab: null, hairStyle: 'spiky', glasses: false }
  },
  {
    id: 9,
    nama: 'Tiara Kusuma',
    inisial: 'TK',
    tag: 'Distributif Pecahan',
    bubble: 'Setengah paket berarti dikali 1/2 semua.',
    cerita: 'Awalnya aku sempat kaget waktu lihat soal paket pecahan di fase akhir. Ternyata kalau pelanggan cuma beli setengah paket besar, kita tinggal mengalikan 1/2 ke setiap suku di dalam kurung satu per satu.',
    sumber: 'ilustrasi',
    avatar: { gender: 'F', skin: '#fed7aa', hair: '#1e293b', hijab: null, hairStyle: 'bob', glasses: true }
  },
  {
    id: 10,
    nama: 'Gilang Mahendra',
    inisial: 'GM',
    tag: 'Kembalian & Uang Rupiah',
    bubble: 'Jangan salah pilih pecahan uang kembalian!',
    cerita: 'Setelah berhasil menyusun rumus aljabar dan menghitung total belanja, tantangan belum selesai karena kita harus menyerahkan uang kembalian. Rasanya seru seperti menjaga laci kasir minimarket beneran.',
    sumber: 'ilustrasi',
    avatar: { gender: 'M', skin: '#fdba74', hair: '#1e293b', hijab: null, hairStyle: 'parted', glasses: false }
  },
  {
    id: 11,
    nama: 'Zahra Khairunnisa',
    inisial: 'ZK',
    tag: 'Buku Kas & Laba Toko',
    bubble: 'Cek Buku Kas buat lihat laba bersih toko.',
    cerita: 'Tiap selesai melayani pembeli, aku selalu mengintip menu Buku Kas. Dari situ aku belajar bedanya uang pemasukan kotor dengan laba bersih toko setelah dikurangi harga modal barang.',
    sumber: 'ilustrasi',
    avatar: { gender: 'F', skin: '#fde68a', hair: '#1e293b', hijab: '#0f766e', hairStyle: 'hijab', glasses: false }
  },
  {
    id: 12,
    nama: 'Rendy Setiawan',
    inisial: 'RS',
    tag: 'Gelar Sultan Aljabar',
    bubble: 'Dari Kasir Magang mengejar Sultan Aljabar!',
    cerita: 'Pertama mulai gelar kita masih Kasir Magang, lalu naik jadi Kasir Junior dan Pedagang Ahli. Targetku minggu ini mengumpulkan laba dan menyelesaikan 20 lencana supaya bisa menyandang gelar Sultan Aljabar!',
    sumber: 'ilustrasi',
    avatar: { gender: 'M', skin: '#fed7aa', hair: '#451a03', hijab: null, hairStyle: 'curly', glasses: false }
  },
  {
    id: 13,
    nama: 'Meisya Rahmawati',
    inisial: 'MR',
    tag: 'Pedagang Dermawan',
    bubble: 'Sisihkan laba toko untuk sumbangan sosial.',
    cerita: 'Di gim ini kita tidak cuma diajarkan mencari untung sebanyak-banyaknya. Kalau kita rajin menyisihkan sebagian laba untuk fitur sumbangan sosial, ada gelar khusus Pedagang Dermawan yang bikin bangga.',
    sumber: 'ilustrasi',
    avatar: { gender: 'F', skin: '#fbcfe8', hair: '#1e293b', hijab: '#78350f', hairStyle: 'hijab', glasses: false }
  },
  {
    id: 14,
    nama: 'Farhan Alfarizi',
    inisial: 'FA',
    tag: 'Kuliner Khas Jambi',
    bubble: 'Jadi kenal kue padamaran, gandus, dan tempoyak!',
    cerita: 'Barang dagangan di rak tokonya unik karena memakai kuliner khas Jambi seperti kue padamaran, dodol nanas, kue gandus, sampai tempoyak. Sambil berhitung aljabar, aku jadi ikut mengenal makanan tradisional daerah.',
    sumber: 'ilustrasi',
    avatar: { gender: 'M', skin: '#fdba74', hair: '#1e293b', hijab: null, hairStyle: 'spiky', glasses: true }
  },
  {
    id: 15,
    nama: 'Putri Anindya',
    inisial: 'PA',
    tag: 'Kejar 3 Bintang Penuh',
    bubble: 'Kurang 1 bintang? Aku ulangi sampai dapat 3!',
    cerita: 'Kalau di satu level aku cuma dapat dua bintang gara-gara kurang teliti membaca pesanan, rasanya penasaran banget. Aku pasti mengulang level itu sampai ketiga bintang emasnya menyala penuh.',
    sumber: 'ilustrasi',
    avatar: { gender: 'F', skin: '#fed7aa', hair: '#292524', hijab: null, hairStyle: 'ponytail', glasses: false }
  },
  {
    id: 16,
    nama: 'Bagas Prasetyo',
    inisial: 'BP',
    tag: 'Kuis Evaluasi Level',
    bubble: 'Kuis di akhir level menguji pemahaman kita.',
    cerita: 'Setelah antrean pelanggan di kasir selesai, selalu ada kuis evaluasi singkat untuk mengecek apakah kita benar-benar paham konsepnya. Jadi nggak bisa cuma asal tebak tombol saat melayani pembeli.',
    sumber: 'ilustrasi',
    avatar: { gender: 'M', skin: '#fde68a', hair: '#1e293b', hijab: null, hairStyle: 'parted', glasses: false }
  },
  {
    id: 17,
    nama: 'Citra Permata',
    inisial: 'CP',
    tag: 'Level 0 Pengantar',
    bubble: 'Mulai dari Level 0 biar nggak kaget!',
    cerita: 'Buat teman-teman yang baru pertama kali buka Algebra-Mart, jangan langsung loncat ke level tinggi ya. Ikuti dulu Level 0 Pengantar karena di sana dijelaskan langkah demi langkah cara membaca pesanan sampai menerima pembayaran.',
    sumber: 'ilustrasi',
    avatar: { gender: 'F', skin: '#fed7aa', hair: '#1e293b', hijab: '#d97706', hairStyle: 'hijab', glasses: false }
  },
  {
    id: 18,
    nama: 'Arka Nugraha',
    inisial: 'AN',
    tag: 'Mode Kelas Bersama Guru',
    bubble: 'Pakai kode ruang di Mode Kelas bareng guru.',
    cerita: 'Di sekolah tadi kami mencoba fitur Mode Kelas dengan memasukkan kode ruang dari guru matematika. Seru karena guru bisa langsung memantau siapa yang sudah naik fase dan membantu teman yang masih kesulitan.',
    sumber: 'ilustrasi',
    avatar: { gender: 'M', skin: '#fdba74', hair: '#3b2314', hijab: null, hairStyle: 'curly', glasses: false }
  },
  {
    id: 19,
    nama: 'Nabila Azzahra',
    inisial: 'NA',
    tag: 'Aplikasi Android',
    bubble: 'Tetap lancar dimainkan walau sinyal susah.',
    cerita: 'Di rumahku kadang sinyal internet suka hilang timbul, tapi waktu sudah dipasang di HP Android, gimnya tetap bisa dimainkan tanpa macet. Progres bintang dan buku kasku juga tetap tersimpan rapi.',
    sumber: 'ilustrasi',
    avatar: { gender: 'F', skin: '#fde68a', hair: '#1e293b', hijab: '#064937', hairStyle: 'hijab', glasses: true }
  },
  {
    id: 20,
    nama: 'Dimas Aditya',
    inisial: 'DA',
    tag: 'Paham Konsep, Bukan Hafal',
    bubble: 'Aku jadi paham alasannya, bukan cuma hafal!',
    cerita: 'Hal paling menyenangkan buatku itu perasaan "oh, begitu toh!" waktu melihat hubungan antara barang belanjaan dan bentuk aljabar. Sekarang kalau bertemu soal cerita di kelas, aku paham maknanya dan bukan sekadar menghafal rumus.',
    sumber: 'ilustrasi',
    avatar: { gender: 'M', skin: '#fed7aa', hair: '#1e293b', hijab: null, hairStyle: 'spiky', glasses: false }
  }
];

