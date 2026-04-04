
## NeYesem REST API Tasarımı

### Api Test Videosu
`https://www.youtube.com/watch?v=UiqVl0_fZXU`
---

## 1. Tarif Ekleme

- **Endpoint:** `POST /api/recipes`
- **Açıklama:** Kullanıcıların yeni tarif oluşturmasını sağlar.

### Request Body
{
  "title": "Menemen",
  "description": "Kolay ve lezzetli kahvaltılık tarif",
  "ingredients": [
    "2 adet domates",
    "2 adet yumurta",
    "1 adet biber",
    "1 yemek kaşığı zeytinyağı",
    "Tuz"
  ],
  "steps": [
    "Biberleri doğra ve tavada kavur.",
    "Domatesleri ekle ve pişir.",
    "Yumurtaları kır ve karıştır.",
    "Tuz ekleyip servis et."
  ],
  "category": "Kahvaltı",
  "videoUrl": "https://example.com/video"
}

### Response
{
  "message": "Tarif başarıyla oluşturuldu.",
  "recipe": {
    "id": "12345",
    "title": "Menemen",
    "description": "Kolay ve lezzetli kahvaltılık tarif",
    "ingredients": [
      "2 adet domates",
      "2 adet yumurta",
      "1 adet biber",
      "1 yemek kaşığı zeytinyağı",
      "Tuz"
    ],
    "steps": [
      "Biberleri doğra ve tavada kavur.",
      "Domatesleri ekle ve pişir.",
      "Yumurtaları kır ve karıştır.",
      "Tuz ekleyip servis et."
    ],
    "category": "Kahvaltı",
    "videoUrl": "https://example.com/video/menemen",
    "createdAt": "2026-03-16T12:00:00Z"
  }
}

---

## 2. Tarif Listeleme

- **Endpoint:** `GET /api/recipes`
- **Açıklama:** Sistemde bulunan tüm tarifleri listeler.

### Response
[
  {
    "id": "12345",
    "title": "Menemen",
    "category": "Kahvaltı",
    "description": "Kolay ve lezzetli kahvaltılık tarif"
  },
  {
    "id": "12346",
    "title": "Mercimek Çorbası",
    "category": "Çorba",
    "description": "Besleyici çorba"
  }
]

---

## 3. Tarif Detay Görüntüleme

- **Endpoint:** `GET /api/recipes/{recipeId}`
- **Açıklama:** Seçilen tarifin tüm detaylarını görüntüler.

### Response
{
  "id": "12345",
  "title": "Menemen",
  "description": "Kolay ve lezzetli kahvaltılık tarif",
  "ingredients": [
    "2 adet domates",
    "2 adet yumurta",
    "1 adet biber",
    "1 yemek kaşığı zeytinyağı",
    "Tuz"
  ],
  "steps": [
    "Biberleri doğra ve tavada kavur.",
    "Domatesleri ekle ve pişir.",
    "Yumurtaları kır ve karıştır.",
    "Tuz ekleyip servis et."
  ],
  "category": "Kahvaltı",
  "videoUrl": "https://example.com/video/menemen",
  "comments": [
    {
      "user": "Sude",
      "text": "Çok güzel oldu."
    }
  ]
}

---

## 4. Tarif Güncelleme

- **Endpoint:** `PUT /api/recipes/{recipeId}`
- **Açıklama:** Mevcut tarif üzerinde düzenleme yapılmasını sağlar.

### Request Body
{
  "title": "Acılı Menemen",
  "description": "Biraz daha baharatlı menemen tarifi",
  "ingredients": [
    "2 adet domates",
    "2 adet yumurta",
    "1 adet acı biber",
    "1 yemek kaşığı zeytinyağı",
    "Tuz"
  ],
  "steps": [
    "Biberleri doğra ve kavur.",
    "Domatesleri ekle.",
    "Yumurtaları kır.",
    "Baharat ekleyip servis et."
  ],
  "category": "Kahvaltı"
}

### Response
{
  "message": "Tarif başarıyla güncellendi"
}

---

## 5. Tarif Silme

- **Endpoint:** `DELETE /api/recipes/{recipeId}`
- **Açıklama:** Tarifin sistemden kaldırılmasını sağlar.

### Response
{
  "message": "Tarif başarıyla silindi"
}

---

## 6. Tarif Arama

- **Endpoint:** `GET /api/recipes/search?q={kelime}`
- **Açıklama:** Kullanıcıların başlık veya içerik bazlı tarif araması yapmasını sağlar.

{
  "q": "menemen"
}

 ### Response
[
  {
    "id": "12345",
    "title": "Menemen",
    "category": "Kahvaltı",
    "description": "Kolay ve lezzetli kahvaltılık tarif"
  }
]

---

## 7. Kategoriye Göre Listeleme

- **Endpoint:** `GET /api/recipes?category={categoryName}`
- **Açıklama:** Seçilen kategoriye ait tarifleri listeler.

{
  "category": "Kahvaltı"
}
### Response
[
  {
    "id": "12345",
    "title": "Menemen",
    "category": "Kahvaltı",
    "description": "Kolay ve lezzetli kahvaltılık tarif"
  }
]
---

## 8. Favorilere Ekleme

- **Endpoint:** `POST /api/favorites/{recipeId}`
- **Açıklama:** Kullanıcının bir tarifi favorilere eklemesini sağlar.

{
    "recipeId": "12345"
}
### Response
{
  "message": "Tarif favorilere eklendi"
}

---

## 9. Yorum Ekleme

- **Endpoint:** `POST /api/comments`
- **Açıklama:** Tariflere yorum yapılmasını sağlar.

### Request Body
{
  "recipeId": "12345",
  "user": "Sude",
  "text": "Tarif çok güzel oldu, teşekkürler."
}

### Response
{
  "message": "Yorum başarıyla eklendi"
}

---

## 10. Video Ekleme

- **Endpoint:** `POST /api/videos`
- **Açıklama:** Tariflere video eklenmesini sağlar.

### Request Body
{
  "recipeId": "12345",
  "videoUrl": "https://example.com/video"
}

### Response
{
  "message": "Video başarıyla eklendi"
}