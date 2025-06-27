import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDw2lfjaYz04az7s0iuWt4CSgniK1tns40",
  authDomain: "portfolio-362f4.firebaseapp.com",
  projectId: "portfolio-362f4",
  storageBucket: "portfolio-362f4.firebasestorage.app",
  messagingSenderId: "464310848455",
  appId: "1:464310848455:web:9342d947132f5653d527e2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const data = {
  projects: [
    {
      id: "1",
      Title: "Aplikasi IoT Kolam Lele",
      Description: "Aplikasi mobile monitoring kolam ikan berbasis Flutter yang terhubung dengan ESP32 menggunakan protokol MQTT. Data sensor dari 3 kolam dikirim secara real-time ke aplikasi melalui broker MQTT dan disimpan di Firebase. Aplikasi menampilkan suhu, pH, DO, dan status kolam dalam tampilan dashboard interaktif. Cocok untuk pemantauan budidaya ikan lele secara digital dan efisien.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/apk2.jpg?raw=true",
      Github: "https://github.com/Nugraa21/iot_kolam_ikan.git",
      TechStack: ["Flutter", "MQTT", "ESP32", "Dart", "Firebase"],
      Features: ["Monitoring kolam", "Real-time MQTT data", "Modern UI crypto-style"],
      category: "Project"
    },
    {
      id: "2",
      Title: "Aplikasi M-banking (BANK SAMPAH)",
      Description: "Aplikasi mobile monitoring kolam ikan berbasis Flutter yang terhubung dengan ESP32 menggunakan protokol MQTT. Data sensor dari 3 kolam dikirim secara real-time ke aplikasi melalui broker MQTT dan disimpan di Firebase. Aplikasi menampilkan suhu, pH, DO, dan status kolam dalam tampilan dashboard interaktif. Cocok untuk pemantauan budidaya ikan lele secara digital dan efisien.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/apk1.jpg?raw=true",
      Github: "https://github.com/Nugraa21/iot_kolam_ikan.git",
      TechStack: ["Flutter", "MQTT", "ESP32", "Dart", "Firebase"],
      Features: ["Transaksi sesama", "Menudahkan untuk Transparansi transaksi bank sampah", "Monitoring kompose", "Real-time MQTT data", "Modern UI crypto-style"],
      category: "Project"
    },
    {
      id: "3",
      Title: "Ilustrasi Ice",
      Description: "Karya manis bertema es krim yang saya ilustrasikan dengan Adobe Illustrator.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/public/images/i1.png?raw=true",
      Link: "https://github.com/Nugraa21/Nugra21/blob/main/public/images/i1.png?raw=true",
      TechStack: ["Adobe Illustrator"],
      category: "Ilustrasi"
    },
    {
      id: "4",
      Title: "Cara menggunakan Docker dan Nginx",
      Description: "Dokumentasi tutorial sederhana tentang cara deployment website ke dalam container Docker menggunakan Nginx sebagai reverse proxy.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/public/images/t1.jpg?raw=true",
      Link: "https://youtu.be/--IZaVqQkyk?si=tsD_WfxlDftmKC8u",
      TechStack: ["HTML", "CSS", "JavaScript", "PHP"],
      Features: [
        "Tutorial deploy website menggunakan Docker",
        "Penggunaan Nginx sebagai reverse proxy",
        "Pengenalan dasar Docker dan containerization",
        "Cocok untuk pemula di DevOps dan Web Hosting"
      ],
      category: "Materi"
    },
    {
      id: "5",
      Title: "Kumpulan modul belajar dasar PWC",
      Description: "Kumpulan Module praktikum dasar tentang HTML, CSS, JavaScript, dan PHP untuk pemula.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/public/images/w1.png?raw=true",
      Github: "https://github.com/Nugraa21/Belajar-HTML.git",
      Link: "https://nugraa21.github.io/Belajar-HTML/",
      TechStack: ["HTML", "CSS", "JavaScript", "PHP"],
      Features: [
        "Modul belajar HTML, CSS, JavaScript, dan PHP",
        "Materi praktikum dasar pemrograman web",
        "Struktur file dan project yang mudah dipahami",
        "Didesain untuk pemula dan pembelajaran mandiri"
      ],
      category: "Materi"
    },
    {
      id: "6",
      Title: "Game ULAR",
      Description: "Game web interaktif berbasis JavaScript yang mereplikasi permainan ular klasik sebagai proyek eksplorasi front-end.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/public/images/w3.png?raw=true",
      Github: "https://github.com/Nugraa21/Game-ular.git",
      Link: "https://nugraa21.github.io/Game-ular/",
      TechStack: ["HTML", "CSS", "JavaScript"],
      Features: ["Web-based snake game", "Interactive gameplay"],
      category: "Game"
    },
    {
      id: "7",
      Title: "Web Himatek",
      Description: "Website himpunan mahasiswa teknik komputer sebagai pusat informasi organisasi di kembangkan dengan HTML , CSS dan JS sederhana yang saya buat untuk Tugas PWC.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/public/images/w4.png?raw=true",
      Link: "https://nugraa21.github.io/HIMATEK/",
      Github: "https://github.com/Nugraa21/HIMATEK.git",
      TechStack: ["HTML", "CSS", "JavaScript"],
      Features: ["Student organization website", "Informational hub"],
      category: "Web"
    },
    {
      id: "8",
      Title: "Web HIMADIGI v2 Sederhana",
      Description: "Website himpunan mahasiswa Bisnis Digital (Web yang saya buat untuk Tugas teman saya) organisasi di kembangkan dengan HTML , CSS dan JS sederhana yang saya buat untuk Tugas PWC.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/public/images/w2.png?raw=true",
      Link: "https://nugraa21.github.io/HIMATEK/",
      Github: "https://github.com/Nugraa21/HIMATEK.git",
      TechStack: ["HTML", "CSS", "JavaScript"],
      Features: ["Student organization website", "Informational hub"],
      category: "Web"
    },
    {
      id: "9",
      Title: "Apa itu RC4 ",
      Description: "RC4 adalah salah satu algoritma stream cipher yang terkenal karena kesederhanaan dan kecepatannya dalam proses enkripsi dan dekripsi data. Algoritma ini terdiri dari dua tahap utama, yaitu Key-Scheduling Algorithm (KSA) yang berfungsi untuk menginisialisasi array kunci berdasarkan input key, dan Pseudo-Random Generation Algorithm (PRGA) yang menghasilkan byte pseudo-acak untuk digunakan dalam proses enkripsi atau dekripsi. Pada materi ini, dijelaskan konsep dasar RC4 beserta implementasinya menggunakan HTML, CSS, dan JavaScript untuk memberikan gambaran praktis kepada pengguna.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/m2.png?raw=true",
      Link: "https://youtu.be/ExipGvhvIWU?si=pGoRU3BCXSg4mJXF",
      Github: "https://github.com/Nugraa21/Metode-ENKRIPSI-RC4.git",
      TechStack: ["HTML", "CSS", "JavaScript"],
      Features: [
        "Implementasi enkripsi dan dekripsi dengan algoritma RC4",
        "Penjelasan tahap Key-Scheduling Algorithm (KSA) dan Pseudo-Random Generation Algorithm (PRGA)",
        "Contoh kode interaktif menggunakan HTML, CSS, dan JavaScript",
        "Visualisasi proses enkripsi untuk pemahaman lebih mudah"
      ],
      category: "Materi"
    },
    {
      id: "10",
      Title: "Portfolio Web v2",
      Description: "Portfolio web versi kedua yang dibangun menggunakan React dan JSX. Website ini berfungsi sebagai media perkenalan diri serta menampilkan informasi terkait organisasi mahasiswa. Dirancang dengan antarmuka sederhana dan responsif, project ini menunjukkan kemampuan dalam pengembangan front-end dengan pendekatan komponen modern.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/webinti.png?raw=true",
      Link: "https://nugra.my.id",
      TechStack: ["HTML", "CSS", "JavaScript", "React"],
      Features: [
        "Website portofolio dengan React & JSX",
        "Tampilan responsif dan clean UI",
        "Informasi tentang organisasi mahasiswa",
        "Menampilkan data dan deskripsi pribadi"
      ],
      category: "Web"
    },
    {
      id: "11",
      Title: "Portfolio Web v1",
      Description: "Versi pertama dari website portofolio pribadi yang dibuat menggunakan HTML, CSS, dan JavaScript murni. Website ini menampilkan informasi dasar tentang diri saya dan proyek-proyek awal, dengan desain sederhana dan fungsionalitas dasar sebagai pengenalan terhadap pengembangan web.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/portfolioawal.png?raw=true",
      Link: "https://nugraa21.github.io/My_dashboard",
      Github: "https://github.com/Nugraa21/My_dashboard.git",
      TechStack: ["HTML", "CSS", "JavaScript"],
      Features: [
        "Portofolio pribadi versi awal",
        "Dibuat tanpa framework (pure HTML/CSS/JS)",
        "Desain sederhana dan ringan",
        "Menampilkan biodata dan daftar proyek"
      ],
      category: "Web"
    },
    {
      id: "12",
      Title: "Web HIMADIGI v1 Sederhana",
      Description: "Website himpunan mahasiswa Bisnis Digital (Web yang saya buat untuk Tugas teman saya) organisasi di kembangkan dengan HTML , CSS dan JS sederhana yang saya buat untuk Tugas PWC.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/w5.png?raw=true",
      Link: "https://nugraa21.github.io/My_dashboard",
      Github: "https://github.com/Nugraa21/My_dashboard.git",
      TechStack: ["HTML", "CSS", "JavaScript"],
      Features: [
        "Portofolio pribadi versi awal",
        "Dibuat tanpa framework (pure HTML/CSS/JS)",
        "Desain sederhana dan ringan",
        "Menampilkan biodata dan daftar proyek"
      ],
      category: "Web"
    },
    {
      id: "13",
      Title: "Encryptify - Enkripsi File Password",
      Description: "Encryptify adalah aplikasi desktop berbasis Python yang menggunakan Tkinter sebagai antarmuka grafisnya. Aplikasi ini memungkinkan pengguna mengamankan file dengan enkripsi berbasis password. Fitur utama meliputi enkripsi dan dekripsi file yang mudah digunakan serta menjaga keamanan data dengan efektif.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/pjy.png?raw=true",
      Github: "https://github.com/Nugraa21/Encryptify---Password-Based-File-Encryption-with-Python---Tkinter.git",
      TechStack: ["Python", "Tkinter", "Cryptography"],
      Features: [
        "Enkripsi dan dekripsi file berbasis password",
        "Antarmuka sederhana menggunakan Tkinter",
        "Keamanan data terjaga"
      ],
      category: "Project"
    },
    {
      id: "14",
      Title: "Steganografi Gambar dengan Flask",
      Description: "Aplikasi web berbasis Flask untuk menyisipkan pesan teks ke dalam gambar (steganografi) tanpa mengubah tampilan gambar secara signifikan. Pengguna dapat mengunggah gambar, menyembunyikan pesan, dan membaca pesan tersembunyi dari gambar yang sudah diupload.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/stga.png?raw=true",
      Github: "https://github.com/Nugraa21/Steganografi-dengan-Flask.git",
      TechStack: ["Python", "Flask", "Steganografi"],
      Features: [
        "Menyisipkan pesan teks ke dalam gambar",
        "Membaca pesan tersembunyi dari gambar",
        "Antarmuka web sederhana dan mudah digunakan"
      ],
      category: "Project"
    },
    {
      id: "15",
      Title: "Ilustrasi Jeruk",
      Description: "Karya sepotong jeruk lemon yang sangat masam yang saya ilustrasikan dengan Adobe Illustrator.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/public/images/i3.png?raw=true",
      Link: "https://github.com/Nugraa21/Nugra21/blob/main/public/images/i3.png?raw=true",
      TechStack: ["Adobe Illustrator"],
      category: "Ilustrasi"
    },
    {
      id: "16",
      Title: "Autentikasi Email dengan PHPMailer",
      Description: "Proyek ini menggunakan library PHPMailer untuk mengirim email autentikasi seperti OTP, pemberitahuan, dan lain-lain. Sistem ini dibuat dengan PHP, menggunakan database MySQL dan server Apache. Dengan PHPMailer, pengiriman email dapat berjalan dengan mudah dan aman untuk aplikasi autentikasi sederhana.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/m1.png?raw=true",
      Link: "./PDF/Otentikasi.pdf",
      Github: "https://github.com/Nugraa21/Autentikasi-OTP-lewaat-email-dengan-PHP.git",
      TechStack: ["PHP", "MySQL", "Apache", "PHPMailer"],
      Features: [
        "Pengiriman email autentikasi (OTP, pemberitahuan)",
        "Integrasi dengan database MySQL",
        "Mudah digunakan dan dikembangkan",
        "Penggunaan library PHPMailer untuk pengiriman email yang andal"
      ],
      category: "Project"
    },
    {
      id: "17",
      Title: "Task Manager dalam Sistem Operasi",
      Description: "Materi tentang konsep dan implementasi Task Manager pada sistem operasi, termasuk pengelolaan proses, pengaturan prioritas, dan monitoring sumber daya sistem secara real-time.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/m4.png?raw=true",
      Link: "./PDF/task.pdf",
      TechStack: ["Sistem Operasi", "Manajemen Proses"],
      Features: [
        "Pengelolaan proses dan thread",
        "Pengaturan prioritas proses",
        "Monitoring penggunaan CPU dan memori",
        "Implementasi sederhana Task Manager"
      ],
      category: "Materi"
    },
    {
      id: "18",
      Title: "PPT Pendiri Tokopedia & Kisah Suksesnya",
      Description: "Materi presentasi yang membahas profil pendiri Tokopedia, perjalanan bisnis, dan kisah sukses Tokopedia sebagai salah satu startup e-commerce terbesar di Indonesia.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/m3.png?raw=true",
      Link: "./PDF/TOKPET.pdf",
      TechStack: ["Presentasi", "Bisnis", "Startup"],
      Features: [
        "Profil pendiri Tokopedia",
        "Perjalanan dan strategi bisnis",
        "Kisah sukses dan pelajaran berharga",
        "Analisis dampak Tokopedia di Indonesia"
      ],
      category: "Materi"
    },
    {
      id: "19",
      Title: "PPT ITIL Menggunakan LaTeX",
      Description: "Proyek pembuatan presentasi mengenai ITIL (Information Technology Infrastructure Library) menggunakan LaTeX. Materi membahas dasar-dasar ITIL dan disusun dalam format presentasi profesional dengan bantuan template LaTeX Beamer.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/PPTLTX.png?raw=true",
      Link: "https://github.com/Nugraa21/PPT-ITIL-LaTeX.git",
      Github: "https://github.com/Nugraa21/PPT-ITIL-LaTeX.git",
      TechStack: ["LaTeX", "Beamer", "Overlive"],
      Features: [
        "Presentasi profesional dengan LaTeX Beamer",
        "Pembahasan konsep ITIL (Information Technology Infrastructure Library)",
        "Struktur slide yang sistematis dan informatif",
        "Source code presentasi tersedia di GitHub"
      ],
      category: "Project"
    },
    {
      id: "20",
      Title: "Face Attendance App - Absensi Berbasis Pengenalan Wajah",
      Description: "Aplikasi web untuk mencatat kehadiran secara otomatis menggunakan teknologi pengenalan wajah. Dikembangkan dengan Python dan Flask, serta menyimpan data kehadiran dan pengguna dalam file JSON.",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/images/camera11.png?raw=true",
      Github: "https://github.com/Nugraa21/Intelligent-Facial-Recognition-Attendance---Monitoring.git",
      TechStack: ["Python", "Flask", "OpenCV", "Bootstrap 5"],
      Features: [
        "Pencatatan kehadiran otomatis dengan face recognition",
        "Tambah pengguna (nama dan foto) secara manual",
        "Dashboard monitoring kehadiran lengkap dengan tanggal dan jam",
        "UI modern dan responsif menggunakan Bootstrap 5",
        "Penyimpanan data pengguna dan absensi dalam file JSON"
      ],
      category: "Project"
    },
    {
      id: "21",
      Title: "TEST DATA",
      Description: "",
      Img: "----",
      Link: "----",
      Github: "----",
      TechStack: ["-", "-"],
      Features: ["--", "--"],
      category: "Project"
    }
  ],
  certificates: [
    {
      id: "certificate1",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/CTF/dicoding1.png?raw=true",
      title: "Learn Cloud Basics and Gen AI on AWS",
      description: "https://www.dicoding.com/certificates/RVZKWVLWOZD5",
      issuer: "Dicoding Indonesia | Amazon Web Services",
      date: "June 2025",
      Link: "https://www.dicoding.com/certificate/verify/123456789"
    },
    {
      id: "certificate2",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/CTF/dicoding2.png?raw=true",
      title: "Beginner Back-End Development with JavaScript",
      description: "https://www.dicoding.com/certificates/JMZVE6333PN9",
      issuer: "Dicoding Indonesia | Amazon Web Services",
      date: "June 2025",
      Link: "https://www.dicoding.com/certificate/verify/987654321"
    },
    {
      id: "certificate3",
      Img: "https://github.com/Nugraa21/Nugra21/blob/main/src/CTF/tofel1.png?raw=true",
      title: "TOEFL Daily",
      description: "Certification demonstrating proficiency in English for academic and professional contexts.",
      issuer: "Daily",
      date: "Oct 2024",
      Link: "----"
    }
  ]
};

async function importData() {
  try {
    // Impor projects
    for (const project of data.projects) {
      await addDoc(collection(db, "projects"), project);
    }
    console.log("Projects imported successfully");

    // Impor certificates
    for (const certificate of data.certificates) {
      await addDoc(collection(db, "certificates"), certificate);
    }
    console.log("Certificates imported successfully");
  } catch (error) {
    console.error("Error importing data:", error.message);
  }
}

importData();