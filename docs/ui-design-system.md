# Sistem BID UI Design System

Dokumen ini menjadi acuan berulang untuk pengembangan UI Sistem BID.
Tujuannya menjaga tampilan bidder dan admin tetap konsisten, mudah diakses,
dan tidak menambah komponen tanpa kebutuhan jelas.

## Prinsip

- Mulai dari komponen yang sudah ada di `resources/js/components/ui` dan
  `resources/js/components/app`.
- Pakai token Tailwind/shadcn yang sudah tersedia sebelum menambah class warna baru.
- Desain bidder mobile-first; desain admin desktop-first tetapi tetap usable
  di layar kecil.
- Semua status penting harus punya teks atau ikon, bukan hanya warna.
- Aksesibilitas minimal mengikuti WCAG AA.

## Fondasi visual

### Warna

Gunakan token semantik Tailwind/shadcn untuk UI umum:

- `background`, `foreground`, `muted`, `muted-foreground`
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `border`, `input`, `ring`
- `destructive`, `destructive-foreground`

Gunakan warna domain secara konsisten:

| Domain | Makna | Arahan UI |
| --- | --- | --- |
| Coffee/beans | Identitas produk | Pakai aksen hijau, amber, earth tone |
| Live auction | Aktivitas real-time | Badge, teks `Live`, harga jelas |
| Outbid | User kalah posisi | Pakai warning/destructive plus pesan eksplisit |
| Winning | User memimpin | Pakai success tone plus teks eksplisit |
| Closed | Lelang selesai | Redam visual, tampilkan pemenang/status final |

### Tipografi

- Font utama: Inter dari `@fontsource-variable/inter`.
- Gunakan hirarki tetap: title halaman, section title, body, caption.
- Hindari teks kecil untuk angka penting seperti harga, bid increment, dan countdown.
- Angka uang wajib pakai formatter dari `resources/js/lib/format.ts`.

### Spacing dan layout

- Base spacing mengikuti skala Tailwind: `gap-2`, `gap-3`, `gap-4`,
  `gap-6`, `p-4`, `p-6`.
- Bidder layout memakai batas mobile seperti `max-w-md` atau pola dari `AppShell`.
- Admin layout memakai `max-w-6xl` dan grid/table yang lapang.
- Jangan hard-code spacing baru kecuali ada alasan visual kuat.

### Motion

- Animasi harus singkat dan membantu pemahaman state.
- Jangan animasikan angka bid berlebihan karena bisa mengganggu keputusan
  user.
- Hormati `prefers-reduced-motion` untuk efek non-esensial.

## Komponen yang menjadi sumber utama

### Komponen UI generik

Pakai komponen di `resources/js/components/ui` untuk primitive:

- Button, badge, card, dialog, sheet, tooltip, skeleton, table, form input.
- Jangan membuat primitive baru bila komponen UI sudah menutup kebutuhan.
- Variant baru harus reusable di minimal dua tempat atau punya alasan domain jelas.

### Komponen domain aplikasi

Pakai komponen di `resources/js/components/app` untuk pola Sistem BID:

- `AuctionCard` untuk ringkasan lot/lelang.
- `AuctionStateBanner` untuk status waktu dan status lelang.
- `AuctionHeroMedia` dan `AuctionImage` untuk visual lot.
- `LiveCountdownPanel` dan `Countdown` untuk waktu lelang.
- `BidActionPanel`, `BidConfirmationDialog`, dan `CurrentPriceCard` untuk
  aksi bidding.
- `BidHistoryFeed`, `LeaderboardPanel`, dan `BidderPositionBanner` untuk
  state kompetisi.
- `MetricCard`, `ControlRoomCard`, dan `WinnerPreviewCard` untuk admin.
- `EmptyState`, `SectionCard`, `PageHeader`, `DataList`, dan `IconLabel`
  untuk layout reusable.

Jika halaman baru butuh pola mirip daftar, kartu, status, atau panel aksi,
cek komponen di atas dulu.

## State wajib untuk fitur UI

Setiap fitur UI baru harus mempertimbangkan state berikut:

- Default: data tersedia dan user bisa beraksi.
- Loading: gunakan skeleton/spinner sesuai konteks.
- Empty: gunakan `EmptyState` dengan instruksi singkat.
- Error: tampilkan pesan bisa ditindaklanjuti.
- Disabled: jelaskan kenapa aksi tidak tersedia.
- Success: beri feedback setelah aksi penting.
- Realtime disconnected: tampilkan status koneksi untuk fitur lelang live.

## Aksesibilitas

Checklist minimal:

- Contrast teks normal minimal 4.5:1.
- Semua elemen interaktif bisa dicapai keyboard.
- Focus state terlihat jelas memakai `focus-visible` atau ring token.
- Touch target minimal 44px pada mobile.
- Form input punya label dan pesan error dekat field.
- Update live penting memakai teks eksplisit; gunakan `aria-live` bila update
  perlu diumumkan.
- Dialog konfirmasi bid harus punya judul, deskripsi, tombol batal, dan tombol
  konfirmasi jelas.
- Gambar lot punya `alt` yang menjelaskan kopi/lot, bukan nama file.

## Responsive strategy

### Bidder

- Mobile-first.
- CTA utama harus mudah dijangkau jempol di layar kecil.
- Harga sekarang, bid berikutnya, dan countdown harus terlihat tanpa scroll
  panjang di room live.
- Hindari tabel lebar; pakai card/list.

### Admin

- Desktop-first.
- Dashboard boleh memakai grid dan table.
- Pada mobile, table harus punya scroll horizontal yang jelas atau card fallback.
- Aksi destructive wajib butuh konfirmasi.

## Developer handoff untuk fitur baru

Gunakan template ini di issue atau PR ketika fitur punya UI baru:

```md
## UI Spec: [Nama fitur]

### User goal

- ...

### Components reused

- ...

### States

- Default:
- Loading:
- Empty:
- Error:
- Disabled:
- Success:

### Responsive

- Mobile:
- Desktop:

### Accessibility

- Focus:
- Labels:
- Live updates:
- Contrast:

### Acceptance

- ...
```

## Kapan menambah komponen baru

Tambah komponen baru hanya jika salah satu benar:

- Pola dipakai ulang di dua halaman atau lebih.
- Pola punya perilaku domain spesifik, misalnya bid confirmation atau live
  auction state.
- Komponen membuat halaman lebih aman atau lebih mudah diakses.

Jangan tambah komponen baru untuk satu class wrapper kecil. Pakai markup lokal saja.
