// Import gambar secara eksplisit dari folder src/assets
import gambar1 from './assets/gambar1.jpg' // Sesuaikan path relatif ke folder assets kamu
import gambar2 from './assets/gambar2.jpg'
import gambar3 from './assets/gambar3.jpg'

const DEFAULTS = [gambar1, gambar2, gambar3]

export function imgSrc(image, id = 0) {
  // 1. Cek apakah image ada & berupa string yang tidak kosong
  if (image && typeof image === 'string' && image.trim() !== '' && image !== 'null') {
    return image
  }

  // 2. Ambil ID aman (mencegah NaN)
  const numericId = typeof id === 'number' ? id : parseInt(id, 10)
  const safeIndex = isNaN(numericId) ? 0 : Math.abs(numericId)

  // 3. Return gambar default dari array yang sudah di-import
  return DEFAULTS[safeIndex % DEFAULTS.length]
}