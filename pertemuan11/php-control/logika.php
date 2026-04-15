<?php
$nilai = 75;

// If Else
if ($nilai >= 80) {
    echo "Grade A <br>";
} elseif ($nilai >= 70) {
    echo "Grade B <br>";
} else {
    echo "Grade C <br>";
}

// For loop
echo "<h3>Perulangan For</h3>";
for ($i = 1; $i <= 5; $i++) {
    echo "Angka ke-$i <br>";
}

// Foreach
echo "<h3>Perulangan Foreach</h3>";
$buah = ["Apel", "Jeruk", "Mangga"];

foreach ($buah as $item) {
    echo $item . "<br>";
}
?>