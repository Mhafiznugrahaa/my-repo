<?php

namespace app\exception;

use Throwable;
use PDOException;
use support\exception\Handler as BaseHandler;
use Webman\Http\Request;
use Webman\Http\Response;

/**
 * Custom exception handler.
 *
 * Tugasnya: mengubah error mentah (stack trace) menjadi halaman/JSON yang rapih
 * dan mudah dibaca. Semua error server ditangani di sini, dengan pesan khusus
 * untuk kegagalan koneksi database.
 */
class Handler extends BaseHandler
{
    public function render(Request $request, Throwable $exception): Response
    {
        // Tetap catat error ke log (biar bisa ditelusuri developer).
        // report() sudah dipanggil framework sebelum render(), jadi cukup fokus tampilan.

        $isDbError = $this->isDatabaseError($exception);

        // Status HTTP: 503 (Service Unavailable) untuk error DB, 500 untuk error umum.
        $status = $isDbError ? 503 : 500;

        // Judul & pesan ramah dalam Bahasa Indonesia.
        if ($isDbError) {
            $title   = 'Layanan Sedang Tidak Tersedia';
            $message = 'Aplikasi tidak dapat terhubung ke database. Kemungkinan server database sedang mati atau sibuk. Silakan coba beberapa saat lagi.';
        } else {
            $title   = 'Terjadi Kesalahan';
            $message = 'Maaf, terjadi kesalahan pada server saat memproses permintaan Anda. Silakan coba lagi.';
        }

        // Detail teknis hanya ditampilkan saat mode debug aktif.
        $detail = null;
        if ($this->debug) {
            $detail = [
                'type'    => get_class($exception),
                'message' => $exception->getMessage(),
                'file'    => $exception->getFile() . ':' . $exception->getLine(),
            ];
        }

        // Jika permintaan berupa AJAX/JSON, balas JSON yang rapih.
        if ($request->expectsJson()) {
            $json = [
                'code' => $status,
                'msg'  => $message,
            ];
            if ($detail) {
                $json['error'] = $detail;
            }
            return json($json)->withStatus($status);
        }

        // Selain itu, tampilkan halaman error bergaya.
        return view('error/error', [
            'title'   => $title,
            'message' => $message,
            'status'  => $status,
            'detail'  => $detail,
        ])->withStatus($status);
    }

    /**
     * Deteksi apakah exception disebabkan oleh kegagalan koneksi database.
     */
    protected function isDatabaseError(Throwable $e): bool
    {
        // Telusuri exception dan penyebab sebelumnya (previous).
        $current = $e;
        while ($current) {
            if ($current instanceof PDOException) {
                return true;
            }
            $msg = $current->getMessage();
            // Kode/pesan khas kegagalan koneksi MySQL.
            if (stripos($msg, 'SQLSTATE') !== false
                || stripos($msg, '2002') !== false
                || stripos($msg, 'connection') !== false
                || stripos($msg, 'refused') !== false) {
                return true;
            }
            $current = $current->getPrevious();
        }
        return false;
    }
}
