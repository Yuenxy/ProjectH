const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Port server Anda

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Menyajikan file HTML
app.use(express.static(path.join(__dirname, 'public')));

// Direktori tempat data akan disimpan
const dataDirectory = path.join(__dirname, 'data');
if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory);
}

// Path file untuk data
const fileName = `table_${getCurrentDate()}.json`;
const filePath = path.join(dataDirectory, fileName);

// Menyimpan data ke file dengan JSON.stringify
app.post('/save', (req, res) => {
    const jsonData = JSON.stringify(data);

    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Gagal menyimpan data.' });
        } else {
            console.log(`Data disimpan di ${filePath}`);
            res.json({ message: 'Data berhasil disimpan.' });
        }
    });
});

// Memuat data dari file dengan JSON.parse
app.get('/load', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Gagal memuat data.' });
        } else {
            try {
                // Menguraikan data JSON yang tersimpan
                const parsedData = JSON.parse(data);
                console.log(`Data dimuat dari ${filePath}`);
                res.json({ data: parsedData });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Gagal memuat data.' });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

// Fungsi untuk mendapatkan tanggal saat ini
function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Data akan disimpan dalam array 'data'
const data = [];

// Sisanya adalah bagian dari kode yang telah Anda sediakan sebelumnya
// yang berfungsi untuk menampilkan tabel, menghitung RDSRDT, dan sebagainya.
// Anda dapat menjaga bagian ini seperti sebelumnya jika tidak ada perubahan.
