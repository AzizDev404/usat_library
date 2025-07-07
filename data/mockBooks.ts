export const mockBooks = [
  {
    id: 1,
    title: "Matematika asoslari",
    pages: 320,
    year: 2023,
    direction: "Matematika",
    department: "Aniq fanlar",
    topic: "Algebra",
    cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=400&q=60",
    isNew: true,
    author: "Abdulla Karimov",
    description: "Matematika fanining asosiy qoidalari va formulalari bilan tanishish uchun mo'ljallangan darslik."
  },
  {
    id: 2,
    title: "Fizika qonunlari",
    pages: 450,
    year: 2022,
    direction: "Fizika",
    department: "Aniq fanlar",
    topic: "Mexanika",
    cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=400&q=60",
    isNew: true,
    author: "Dilshod Salimov",
    description: "Fizika qonunlarini o'rganish va amaliy masalalar yechish bo'yicha qo'llanma."
  },
  {
    id: 3,
    title: "Kimyo elementlari",
    pages: 280,
    year: 2023,
    direction: "Kimyo",
    department: "Aniq fanlar",
    topic: "Organik kimyo",
    cover: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=400&q=60",
    isNew: true,
    author: "Zarnigor Ismoilova",
    description: "Organik kimyo asoslari va laboratoriya ishlarini bajarish bo'yicha darslik."
  },
  {
    id: 4,
    title: "Tarix darsligi",
    pages: 380,
    year: 2021,
    direction: "Tarix",
    department: "Gumanitar fanlar",
    topic: "O'zbekiston tarixi",
    cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=60",
    isNew: false,
    author: "Olimjon Abdurahmonov",
    description: "O'zbekiston tarixining muhim davrlari va voqealari haqida batafsil ma'lumot."
  },
  {
    id: 5,
    title: "Adabiyot nazariyasi",
    pages: 250,
    year: 2023,
    direction: "Adabiyot",
    department: "Gumanitar fanlar",
    topic: "Nazariya",
    cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=60",
    isNew: true,
    author: "Muzaffar Qosimov",
    description: "Adabiyot nazariyasining asosiy tushunchalari va tahlil usullari."
  },
  {
    id: 6,
    title: "Iqtisodiyot asoslari",
    pages: 400,
    year: 2022,
    direction: "Iqtisodiyot",
    department: "Ijtimoiy fanlar",
    topic: "Makroiqtisodiyot",
    cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=400&q=60",
    isNew: true,
    author: "Saida Rasulova",
    description: "Makroiqtisodiyot nazariyasi va amaliy masalalar yechish usullari."
  },
  ...Array.from({ length: 34 }, (_, i) => ({
    id: i + 7,
    title: `Kitob ${i + 7}`,
    pages: Math.floor(Math.random() * 400) + 200,
    year: 2020 + Math.floor(Math.random() * 4),
    direction: ["Matematika", "Fizika", "Kimyo", "Tarix", "Adabiyot", "Iqtisodiyot"][Math.floor(Math.random() * 6)],
    department: ["Aniq fanlar", "Gumanitar fanlar", "Ijtimoiy fanlar"][Math.floor(Math.random() * 3)],
    topic: ["Algebra", "Mexanika", "Organik kimyo", "O'zbekiston tarixi", "Nazariya", "Makroiqtisodiyot"][
      Math.floor(Math.random() * 6)
    ],
    cover: [
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=60"
    ][Math.floor(Math.random() * 6)],
    isNew: Math.random() > 0.7,
    author: `Muallif ${i + 7}`,
    description: `Bu kitob ${i + 7}-raqamli darslik bo'lib, o'quvchilar uchun mo'ljallangan.`
  }))
]