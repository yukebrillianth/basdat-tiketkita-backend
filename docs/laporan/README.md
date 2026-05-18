# Laporan Progres TiketKita, Panduan Compile

## Cara Compile

### Menggunakan pdflatex (lokal)

```bash
cd docs/laporan
pdflatex laporan-progress.tex
pdflatex laporan-progress.tex  # jalankan 2x untuk daftar isi
```

### Menggunakan Overleaf

1. Upload seluruh isi folder `docs/laporan/` ke Overleaf
2. Set compiler ke **pdfLaTeX**
3. Klik Compile

## Dependensi LaTeX

- `texlive-latex-extra`
- `texlive-fonts-recommended`
- Package yang digunakan: `inputenc`, `fontenc`, `babel`, `graphicx`, `tikz`, `booktabs`, `longtable`, `listings`, `hyperref`, `xcolor`, `geometry`, `setspace`, `array`

## File yang Disertakan

- `laporan-progress.tex`, file utama laporan
- `logodepart.png`, logo Departemen Teknik Komputer ITS
- `screenshots/`, folder untuk screenshot (kosong, isi manual)

## Mengganti Screenshot Placeholder

Setelah punya screenshot, ganti TikZ placeholder di BAB IV dengan:

```latex
\includegraphics[width=\textwidth]{screenshots/dashboard.png}
```

File PNG taruh di folder `docs/laporan/screenshots/`.
