<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class ScreenshotController extends Controller
{
    public function capture(Request $request)
    {
        // Validasi input URL
        $request->validate([
            'url' => 'required|url',
        ]);

        $url = $request->input('url');
        $nodePath = 'C:\Program Files\nodejs\node.exe';
        $process = new Process([$nodePath, base_path('node_scripts/screenshot.js'), $url]);
        $process->run();

        // Periksa apakah proses berhasil
        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        // Ambil output dari skrip (path file screenshot)
        $screenshotPath = trim($process->getOutput());

        // Kembalikan file screenshot sebagai respons dan hapus setelah dikirim
        return response()->download($screenshotPath)->deleteFileAfterSend(true);
    }
}
