// ============================================================
// config.js — Semua teks, tanggal, dan pengaturan website
// Edit file ini untuk menyesuaikan konten website.
// ============================================================

export const config = {
  // ---- Identitas ----
  senderName: "Elvan",
  recipientName: "Patricia",
  nickname: "Cia",
  anniversaryDate: "2026-10-01", // Tanggal jadian (YYYY-MM-DD)
  birthdayDate: "10-27", // Bulan-Tanggal ulang tahun (MM-DD)
  timezone: "Asia/Jakarta",

  // ---- Musik ----
  musicFile: "/music/lagu-kita.mp3",
  musicVolume: 0.5,

  // ---- Judul Halaman ----
  pageTitle: "Untuk Cia 💖",
  metaDescription:
    "Sebuah kejutan spesial di hari ulang tahunmu. Dengan cinta, dari Elvan.",

  // ---- Section 0: Intro ----
  introTitle: "Ada sesuatu spesial untuk Cia 💌",
  introButton: "Buka Hadiah",

  // ---- Section 1: Love Meter ----
  heroTitle: "Selamat Ulang Tahun, Cia 🎂",
  heroSubtitle:
    "Sebelum masuk ke kejutannya, jawab satu pertanyaan dulu ya…",
  loveQuestion: "Seberapa besar cintamu sama Elvan?",
  loveReactions: {
    low: "Hmm, masih malu-malu ya? 🙈",
    medium: "Ayo dong, masa segitu doang 😏",
    high: "Nah, mulai jujur nih 😚",
    veryHigh: "Dikit lagi… tarik sampai mentok! 🔥",
    max: "Tuh kan, cinta banget sama aku 🥰",
  },
  evadingToasts: [
    "Eits, kurang mentok cintanya! 😉",
    "Tarik lagi slidernya, Cia sayang~ 💕",
    "Tombolnya malu, cintanya belum penuh 🙈",
    "Belum 100% lho, jangan bohong 😝",
    "Yaudah deh, aku kasih petunjuk: geser slidernya ke kanan banget 😆",
  ],
  nextButtonText: "NEXT",
  unlockButtonText: "Buka Kejutan 💖",

  // ---- Section 2: Gallery ----
  galleryTitle: "Perjalanan Kita",
  gallerySubtitle: "Baru sebentar, tapi sudah banyak yang ingin kusimpan ✨",
  galleryNextButton: "Lanjut 💌",

  // ---- Section 3: Letter ----
  letterSectionTitle: "Surat Untukmu",

  letterText: `Untuk Cia, perempuan yang paling kusayangi,

Selamat ulang tahun, sayang. 🤍

Hari ini aku ingin berhenti sejenak dan mengucap syukur. Bukan hanya karena usiamu bertambah, tapi karena aku diberi kesempatan untuk merayakannya bersamamu, sebagai pacarmu.

Kita bertemu di Tarumanagara, di tengah hari-hari kampus yang ramai, tanpa tahu bahwa pertemuan sederhana itu akan membawa kita sejauh ini. Kamu yang dulu hanya sebuah nama dan senyuman di antara banyak orang, sekarang jadi salah satu alasan terbesar aku tersenyum.

Ada banyak hal yang kusukai darimu. Kamu manja, dan jujur saja, aku suka sekali. Manjamu bikin aku merasa dibutuhkan dan membuat hari-hariku lebih hangat. Tapi di balik itu, kamu juga support system terbaik yang pernah kupunya. Kamu hadir, mendengarkan, dan percaya padaku, bahkan di saat aku sendiri belum yakin pada diriku.

Ada satu hal yang sampai sekarang membuatku merinding. Waktu 1 Oktober itu aku memberanikan diri menyatakan perasaanku, aku sama sekali tidak menyangka kamu ternyata sudah menunggu momen itu. Dan lebih dari itu, sebulan sebelumnya, kamu diam-diam berdoa kepada Tuhan, menanyakan apakah aku orangnya. Lalu sebulan kemudian, aku datang. Aku tidak tahu harus berkata apa selain terima kasih. Terima kasih sudah mempercayakan hatimu padaku, dan terima kasih sudah menjadikan aku bagian dari doamu. Aku akan menjaga kepercayaan itu sebaik-baiknya.

Kita memang baru memulai, tapi aku sudah tahu satu hal: aku ingin terus belajar jadi laki-laki yang lebih baik, lebih dewasa, dan lebih bertanggung jawab, bukan karena kamu menuntut, tapi karena kamu pantas mendapatkan yang terbaik. Aku tidak menjanjikan kesempurnaan, tapi aku janji akan terus berusaha dan terus memilihmu, setiap hari.

Di usiamu yang baru ini, doaku sederhana: semoga kamu selalu sehat, selalu bahagia, dan semoga semua mimpimu pelan-pelan jadi nyata. Dan semoga, di setiap pencapaianmu, aku masih boleh jadi orang yang pertama bertepuk tangan di sampingmu.

Aku bersyukur sekali memilikimu, Cia. Selamat ulang tahun. Aku sayang kamu, hari ini, besok, dan seterusnya.

Selalu milikmu,
Elvan 💌`,

  letterSkipButton: "Lewati animasi",
  letterNextButton: "Satu kejutan lagi 🎁",

  // ---- Section 4: Closing ----
  closingTitle: "Terima kasih sudah jadi bagian terbaik dari hidupku",
  closingCounterPrefix: "Kita sudah bersama",
  closingCounterSuffix: "hari",
  closingCounterZero: "Hari pertama kita 💖",
  closingSubtext: "Baru permulaan, dan aku sudah sebahagia ini.",
  closingSendButton: "Kirim Peluk & Cium ke Cowokmu 💌",
  closingSentMessages: [
    "Pelukan dan ciumanmu sudah sampai ke Elvan 🥹💕",
    "Elvan merasakan hangatnya peluk dari Cia 🤗💖",
    "Ciumannya sampai! Elvan senyum-senyum sendiri 💋✨",
    "Terima kasih, sayang. Aku sayang kamu juga 🥰❤️",
    "Peluk erat sudah diterima! Tidak mau dilepas 🫂💕",
  ],
  closingReplayButton: "Putar ulang dari awal 🔁",

  // ---- Caption Foto ----
  // Key = nama file (mis. "foto-01.jpg"), Value = caption
  // Jika tidak diisi, caption default yang manis akan ditampilkan otomatis.
  photoCaptions: {
    // "foto-01.jpg": "Pertama kali kita ketemu di kampus",
    // "foto-02.jpg": "Senyummu yang bikin aku jatuh hati",
  },
};

// Caption default yang manis dan bervariasi
export const defaultCaptions = [
  "Momen kecil yang berarti besar 💕",
  "Senyummu, favoritku sepanjang masa ✨",
  "Bersamamu, waktu terasa begitu indah 🌸",
  "Terima kasih sudah jadi bagian ceritaku 💖",
  "Setiap detik bersamamu, berharga 🤍",
  "Kamu dan tawamu, obat terbaik untukku 😊",
  "Kenangan yang ingin kusimpan selamanya 📸",
  "Di antara sejuta orang, aku menemukan kamu 🌹",
  "Bersyukur, karena ada kamu di sampingku 🙏",
  "Kamu adalah rumah yang selalu ingin kutuju 🏡",
  "Momen sederhana, tapi penuh cinta 💗",
  "Tertawa bersamamu adalah kebahagiaan terbesar 😄",
  "Foto ini tidak bisa menangkap betapa cantiknya kamu 📷",
  "Setiap hari bersamamu adalah hadiah 🎁",
  "Kamu membuat duniaku lebih berwarna 🌈",
  "Aku ingin terus membuat kenangan indah denganmu 💫",
  "Wajah favoritku di seluruh dunia 🥰",
  "Terima kasih sudah selalu ada, Cia 💝",
  "Hari itu, aku tahu kamu spesial ⭐",
  "Cinta itu sederhana, seperti kita berdua 🤍",
];
