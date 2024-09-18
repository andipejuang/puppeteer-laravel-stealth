<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class PuppeteerController extends Controller
{
    public function generateScreenshot()
    {
        try {
            // Path ke file screenshot.js
            $scriptPath = base_path('puppeteer/screenshot.js');

            // Jalankan skrip node
            $output = shell_exec("node $scriptPath 2>&1");

            // Periksa output untuk melihat jika ada error
            if ($output === null) {
                return response()->json(['status' => 'error', 'message' => 'Failed to run the script.']);
            }

            return response()->json(['status' => 'success', 'message' => 'Script ran successfully.', 'output' => $output]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

}
