<?php
session_start();

// Menyimpan session
$_SESSION["nama"] = "Rachmat";

// Mengambil session
echo "Nama dari session: " . $_SESSION["nama"];
?>