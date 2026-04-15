<?php
// Membuat cookie (berlaku 1 jam)
setcookie("user", "Andi", time() + 3600);

// Menampilkan cookie
if(isset($_COOKIE['user'])) {
    echo "User: " . $_COOKIE['user'];
} else {
    echo "Cookie belum dibuat";
}
?>