# UI PR Checklist

Gunakan checklist ini untuk setiap PR yang mengubah UI, layout, styling, atau
flow user.

## Scope

- [ ] PR menjelaskan halaman/komponen yang berubah.
- [ ] PR menyebut user role yang terdampak: bidder, admin, atau keduanya.
- [ ] PR memakai komponen existing sebelum membuat komponen baru.
- [ ] Komponen baru punya alasan reuse atau perilaku domain jelas.

## Visual consistency

- [ ] Warna memakai token Tailwind/shadcn atau pola domain di
  `docs/ui-design-system.md`.
- [ ] Spacing mengikuti skala Tailwind yang sudah umum di repo.
- [ ] Typography menjaga hirarki title, section, body, caption.
- [ ] Status lelang/bid konsisten dengan halaman lain.
- [ ] Dark mode tetap terbaca.

## States

- [ ] Loading state tersedia bila data async.
- [ ] Empty state tersedia bila data bisa kosong.
- [ ] Error state memberi pesan yang bisa ditindaklanjuti.
- [ ] Disabled state menjelaskan aksi tidak bisa dilakukan.
- [ ] Success/confirmation state muncul setelah aksi penting.
- [ ] Realtime disconnected state dipertimbangkan untuk fitur live auction.

## Accessibility

- [ ] Semua elemen interaktif dapat diakses keyboard.
- [ ] Focus visible terlihat jelas.
- [ ] Touch target mobile minimal 44px.
- [ ] Form punya label dan pesan error dekat input.
- [ ] Ikon dekoratif tidak menggantikan teks penting.
- [ ] Status penting tidak bergantung pada warna saja.
- [ ] Dialog punya title, description, cancel, dan confirm action.
- [ ] Gambar punya `alt` yang bermakna.

## Responsive

- [ ] Bidder flow dicek pada lebar mobile sekitar 375px.
- [ ] Admin flow dicek pada desktop sekitar 1280px.
- [ ] Tabel admin tidak merusak layout pada layar kecil.
- [ ] CTA utama tetap mudah ditemukan di mobile.

## Bidding-specific safety

- [ ] Harga sekarang dan bid berikutnya mudah dibedakan.
- [ ] Bid confirmation menampilkan nominal final sebelum submit.
- [ ] Countdown/live state tidak ambigu.
- [ ] User bisa melihat apakah sedang winning atau outbid.
- [ ] Aksi destructive/admin butuh konfirmasi.

## Verification

- [ ] `npm run build` berhasil jika PR menyentuh React/TypeScript/CSS.
- [ ] `composer test` atau test relevan berhasil jika PR menyentuh backend flow.
- [ ] Screenshot before/after dilampirkan untuk perubahan visual besar.
- [ ] Catatan pre-existing issue ditulis bila ada kegagalan di luar scope PR.
