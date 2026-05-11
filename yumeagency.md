# Yume Creative Lab — 2D Pixel Art Otonom Ajans Sistemi

> Bu dosya Claude Code için proje referans dökümantasyonudur. Tüm geliştirme kararları buradaki mimariye ve yol haritasına uygun olmalıdır.

---

## Proje Özeti

Web tabanlı, 2D piksel art grafiklere sahip, çoklu yapay zeka ajanlarının (Multi-Agent System) eşzamanlı ve asenkron çalıştığı bir dijital pazarlama ajansı simülasyonu ve otomasyon aracıdır. Sistem müşteri bazlı klasör mimarisiyle çalışır; ajanlar marka verilerini bu klasörlerden okuyarak üretim yapar.

---

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Frontend | React.js veya Next.js |
| 2D Grafik Motoru | Phaser.io (piksel art ofis, tıklanabilir masalar, HUD, çaycı NPC) |
| Backend / Orkestrasyon | Python + FastAPI + CrewAI (paralel çalışma ve Human-in-the-loop için) |
| Dosya Sistemi | Lokal klasör dizini — `/clients/<marka>/docs` ve `/clients/<marka>/outputs` |

---

## Klasör Yapısı

```
/clients/
  <marka_adi>/
    docs/        # Brifing, ton-of-voice, marka kılavuzu gibi girdiler
    outputs/     # Ajanların ürettiği metin, görsel ve raporlar
```

---

## UI / UX Gereksinimleri

### Ofis Tasarımı
- 2D izometrik veya top-down piksel art perspektif
- Ofis dekorasyonunda **zeytin ağacı saksıları** bulunmalı
- Masalarda **Mac Mini ve MacBook** donanımları görünmeli
- Her ajanın kendine ait odası / masası ve bilgisayarı olacak
- **Toplantı Odası:** Ajanların toplu çağrılabildiği ortak değerlendirme alanı
- **Çay Ocağı:** Atmosferik amaçlı, çaycı NPC'sinin başlangıç noktası

### Çaycı NPC
- Tamamen görsel/atmosferik; oyun mekaniğiyle ilgisi yok
- Her **2–3 dakikada bir** ofiste rastgele waypoint'lere giderek masalara çay bırakır
- Phaser.io ile otonom hareket mantığı kodlanır

### Sol HUD (Durum Paneli)
- Herhangi bir ajana tıklandığında sol tarafta açılır
- Gösterilecek bilgiler:
  - Hangi markaya çalışıyor (örn. "X Markası")
  - Mevcut görevi
  - İlerleme yüzdesi (progress bar)

### Sağ Chat / Çıktı Paneli
- İstenildiğinde açılıp kapanabilir
- Kullanıcı (Genel Müdür / Kurucu) ajanlarla birebir yazışabilir
- Toplantı odasına geçildiğinde tüm ajanlarla grup chat aktif olur
- Ajanların ürettiği metinler, görseller ve raporlar bu alanda render edilir

---

## Ajan Tanımları

> Tüm ajanlar **eşzamanlı (concurrent)** çalışabilmelidir. Örneğin Ajan 1 "A markası" için metin yazarken Ajan 3 "B markası" için görsel üretebilir.

### Ajan 1 — Metin ve İçerik Yazarı
- Marka klasöründeki brifingleri okur
- Güncel trendleri arama API'leriyle (Tavily / Serper) tarar
- Markanın ses tonuna (tone of voice) uygun blog, sosyal medya ve reklam metinleri yazar

### Ajan 2 — SEO Uzmanı
- Ajan 1'den gelen metinleri SEO kurallarına göre optimize eder
- Hedef web sitelerinin SEO skorlamasını yapar (Pagespeed API vb.)
- Yeni kurulacak siteler için site haritası ve on-page SEO stratejisi üretir

### Ajan 3 — Görsel Üretim Uzmanı
- Ajan 1'in metinlerine ve özel gün takvimine göre görsel prompt'ları yazar
- DALL-E 3 veya Stable Diffusion API'leri üzerinden görseller üretir ve `/clients/<marka>/outputs` klasörüne kaydeder
- Web sitesi mockup görselleri oluşturabilir

### Ajan 4 — Reklam Yöneticisi
- Google Ads ve Meta Graph API'lerine **salt-okunur (read-only)** bağlanır
- Açık kampanyaların metriklerini çeker; CPA ve ROAS analizleri yapar
- Yeni kampanya yapıları ve hedef kitle önerileri sunar
- Ajan 1'in metinlerinin reklam politikalarına uygunluğunu denetler

### Ajan 5 — Genel Yönetici (Lead Agent)
- Tüm süreci koordine eder
- Ajan 1–4'ten gelen işleri derler ve son mantık kontrolünü yapar
- Kullanıcıya sunmadan önce gerekirse işi ilgili ajana geri gönderir (örn. "Görsel metinle uyuşmadı, revize et")
- Human-in-the-loop onay noktasını yönetir

---

## Geliştirme Yol Haritası

### Faz 1 — Backend ve Ajan Mimarisi (Görselsiz)

- [ ] FastAPI ile temel sunucuyu ayağa kaldır
- [ ] `/clients/...` klasör yapısını oluştur
- [ ] CrewAI (veya LangGraph) ile 5 ajanın profil ve system prompt'larını tanımla
- [ ] Terminal üzerinden klasörden veri okuyup çıktı üreten "Hello World" senaryosunu test et

### Faz 2 — 2D Pixel Art UI (Sadece Görsel)

- [ ] React + Phaser.io entegrasyonunu kur
- [ ] Statik asset'lerle izometrik / 2D ofis haritasını çizdir
- [ ] 5 ajanın masasını, toplantı odasını ve çay ocağını haritaya yerleştir
- [ ] Çaycı NPC'sinin rastgele waypoint gezinme mantığını kodla

### Faz 3 — UI ve Backend Entegrasyonu

- [ ] Masalara tıklandığında açılan Sol HUD sistemini yap
- [ ] FastAPI'den ajan status (`idle` / `working` / `%50`) verilerini çekip UI'a bağla
- [ ] Sağ Chat panelini tasarla; kullanıcı prompt'larını FastAPI üzerinden ilgili ajana ilet
- [ ] Ajan çıktılarının (metin vb.) Chat panelinde görünmesini sağla

### Faz 4 — Harici API'ler ve İleri Yetenekler

- [ ] Ajan 3 — Görsel üretim API'sini (OpenAI / Stable Diffusion) entegre et; görselleri sağ panelde render et
- [ ] Ajan 2 — SEO araçları (Ahrefs / Semrush / Pagespeed) API bağlantılarını kur
- [ ] Ajan 4 — Meta ve Google Ads sandbox veya read-only erişimlerini yapılandır
- [ ] Toplantı Odası — Tüm ajanların aynı context penceresinde tartışabildiği çoklu-ajan sohbet modunu aktifleştir

---

## GitHub Repo ve Versiyon Kontrol Kuralları

Bu proje bir GitHub reposuna bağlı olarak geliştirilecektir. Claude Code her anlamlı ilerlemenin ardından değişiklikleri commit edip push etmelidir.

### Repo Kurulumu

```bash
git init
git remote add origin <REPO_URL>
git branch -M main
git push -u origin main
```

### Commit Kuralları

Her fazın sonunda veya her bağımsız özellik tamamlandığında commit atılmalıdır. Commit mesajları aşağıdaki formatı takip etmeli:

```
<tip>(<kapsam>): <kısa açıklama>

Örnekler:
feat(backend): FastAPI temel sunucu kurulumu tamamlandı
feat(agents): CrewAI ile 5 ajan profili tanımlandı
feat(ui): Phaser.io ofis haritası eklendi
feat(hud): Sol HUD ajan durum paneli entegre edildi
fix(npc): Çaycı waypoint çakışması giderildi
chore(env): .env.example dosyası güncellendi
```

### .gitignore Zorunlulukları

Aşağıdakiler **kesinlikle** repoya girmemeli:

```
.env
/clients/*/outputs/
__pycache__/
node_modules/
*.pyc
.DS_Store
```

### Branch Stratejisi

| Dal | Amaç |
|---|---|
| `main` | Kararlı, çalışan sürüm |
| `dev` | Aktif geliştirme dalı |
| `faz-1`, `faz-2`, ... | Her faz kendi branch'inde geliştirilir, bitince `dev`'e merge edilir |

### Çalışma Akışı

1. Yeni bir faza başlamadan önce ilgili branch'i oluştur: `git checkout -b faz-1`
2. Faz tamamlanınca `dev`'e pull request aç ve merge et
3. `dev` kararlı hale gelince `main`'e merge et
4. Her push öncesinde `git status` ile takip dışı dosya kalmadığından emin ol

---

## Token Optimizasyon Kuralları

Claude Code bu projede maliyeti minimize etmek için aşağıdaki stratejileri kesin kural olarak uygulamalıdır.

### Model Seçimi

| Görev Türü | Kullanılacak Model |
|---|---|
| Planlama, dosya analizi, ne yapılacağına karar verme | `claude-haiku-4-5` |
| Kod yazma, refactor, hata ayıklama | `claude-sonnet-4-5` (varsayılan) |
| Kritik mimari kararlar, karmaşık çok-adımlı akıl yürütme | `claude-sonnet-4-5` |

Planlama aşamasını Haiku ile yap, kodu kendin yaz. Örnek akış:

```
1. [Haiku]  → "Bu faz için hangi dosyaları oluşturmam gerekiyor? Adımları listele."
2. [Sonnet] → Listedeki adımları sırayla kodla
3. [Haiku]  → "Yazdığım kodu gözden geçir, hata var mı özetle."
```

### Bağlam (Context) Yönetimi

- **`/compact`** komutunu sık kullan — uzun oturumlarda konuşma geçmişini sıkıştırır, gereksiz token tekrarını önler.
- Bir dosyayı **sadece gerçekten okuman gerektiğinde** oku; aynı oturumda ikinci kez okuma.
- Büyük dosyaları tümüyle context'e almak yerine **ilgili satır aralıklarını** hedef al.

### .claudeignore

Proje kökünde bir `.claudeignore` dosyası oluştur. Claude Code bu dosyalara bakmayacağından context dolmaz:

```
/clients/*/outputs/
node_modules/
__pycache__/
*.log
*.png
*.jpg
*.jpeg
*.gif
*.svg
dist/
build/
.git/
```

### Prompt Disiplini

- Her görev için **tek, net bir talimat** ver; belirsiz talimatlar gidip-gelme turlarına yol açar.
- "Önce planı yaz, onaylayayım, sonra kodla" akışını kullan — yarım kalan ve silinen kod bloklarından kaçın.
- Test ve lint adımlarını **tek komutta** zincirle: `pytest && ruff check .` gibi.

### Gereksiz Tekrarı Önle

- Aynı oturumda daha önce oluşturulan bir dosyayı yeniden yazdırma; sadece değişen kısmı `str_replace` ile güncelle.
- Hata ayıklarken önce **hatanın satırını ve mesajını** ver; tüm dosyayı yeniden okutma.

---

## Geliştirme Notları

- Her fazı tamamladıktan sonra UI/UX standartlarını test et; özellikle Phaser.io etkileşimlerinin mobil ve masaüstünde tutarlı davrandığını doğrula.
- Ajanlar arası veri akışında tip güvenliği için Pydantic modelleri kullan.
- Tüm API anahtarları `.env` dosyasında tutulmalı; repoya kesinlikle commit edilmemeli.
- Görsel üretim çıktıları büyük boyutlara ulaşabileceğinden `/clients/<marka>/outputs` klasörü için `.gitignore` kuralı ekle.
