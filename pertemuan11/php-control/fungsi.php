<?php
// Fungsi waktu
echo "Sekarang: " . date("Y-m-d H:i:s") . "<br>";
echo "Timestamp: " . time() . "<br>";

// Include file lain
include "halo.php";

// Fungsi string
$teks = "belajar php";
echo strtoupper($teks) . "<br>"; // jadi huruf besar

// Fungsi array
$angka = [1, 2, 3, 4];
echo "Jumlah array: " . count($angka);
?>