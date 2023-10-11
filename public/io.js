const data = [];

function tampilkanTabel() {
    const table = document.getElementById("dataTable");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = ""; // Mengosongkan tbody sebelum menambahkan data baru
    
    data.forEach((row, index) => {
        const newRow = tbody.insertRow(-1);
        const cellDataKonsumen = newRow.insertCell(0);
        const cellStatus = newRow.insertCell(1);
        const cellInfo = newRow.insertCell(2);

        cellDataKonsumen.innerHTML = row.dataKonsumen;

        // Menampilkan select untuk memilih status
        const selectStatus = document.createElement("select");
        selectStatus.innerHTML = `
            <option value="Status" ${row.status === "Status" ? "selected" : ""}>Status</option>
            <option value="Input" ${row.status === "Input" ? "selected" : ""}>Input</option>
            <option value="Progress" ${row.status === "Progress" ? "selected" : ""}>Progress</option>
            <option value="Send" ${row.status === "Send" ? "selected" : ""}>Send</option>
            <option value="Pending" ${row.status === "Pending" ? "selected" : ""}>Pending</option>
        `;
        selectStatus.className = "form-control"; // Menambahkan kelas ke select
        selectStatus.onchange = (event) => {
            row.status = event.target.value;
            changeRowBackgroundColor(newRow, event.target.value);
        };
        cellStatus.appendChild(selectStatus);

        // Menampilkan info dengan tombol Edit dan Hapus
        const infoWithButtons = document.createElement("div");
        infoWithButtons.innerHTML = `
            <button onclick="editData(${index})" class="btn btn-success"><i class="fas fa-pencil-alt"></i></button>
        `;
        cellInfo.appendChild(infoWithButtons);

        // Set warna latar belakang baris sesuai dengan status
        changeRowBackgroundColor(newRow, row.status);  
        const totalData = document.getElementById("totalDataTable");
        totalData.textContent = data.length;
    });
}

function hitungRDSRDT() {
    const pengajuanFakturRDS = parseInt(document.getElementById('pfrds').value) || 0;
    const fakturTerimaRDS = parseInt(document.getElementById('ftrds').value) || 0;
    const fakturTerimaRDSa = parseInt(document.getElementById('ftrdsa').value) || 0;
    const bbnKemarinRDS = parseInt(document.getElementById('bbnkrds').value) || 0;
    const bbnHariIniRDS = parseInt(document.getElementById('bbnhrds').value) || 0;
    const pendingFakturRDS = parseInt(document.getElementById('prds').value) || 0;

    const pengajuanFakturRDT = parseInt(document.getElementById('pfrdt').value) || 0;
    const fakturTerimaRDT = parseInt(document.getElementById('ftrdt').value) || 0;
    const fakturTerimaRDTa = parseInt(document.getElementById('ftrdta').value) || 0;
    const bbnKemarinRDT = parseInt(document.getElementById('bbnkrdt').value) || 0;
    const bbnHariIniRDT = parseInt(document.getElementById('bbnhrdt').value) || 0;
    const pendingFakturRDT = parseInt(document.getElementById('prdt').value) || 0;

    let rdsCount = 0;
    let rdtCount = 0;

    data.forEach((row) => {
        const dataKonsumen = row.dataKonsumen.toLowerCase();
        rdsCount += (dataKonsumen.match(/rds/g) || []).length;
        rdtCount += (dataKonsumen.match(/rdt/g) || []).length;
    });

    const output2 = `${getCurrentDate()}
RDS
PENGAJUAN FAKTUR : ${pengajuanFakturRDS + rdsCount}
FAKTUR TERIMA : ${fakturTerimaRDS + fakturTerimaRDSa}
BBN : ${bbnKemarinRDS + bbnHariIniRDS}
PENDING FAKTUR : ${pendingFakturRDS}
FAKTUR HARI INI : ${rdsCount}
RDT
PENGAJUAN FAKTUR : ${pengajuanFakturRDT + rdtCount}
FAKTUR TERIMA : ${fakturTerimaRDT + fakturTerimaRDTa}
BBN : ${bbnKemarinRDT + bbnHariIniRDT}
PENDING FAKTUR : ${pendingFakturRDT}
FAKTUR HARI INI : ${rdtCount}`;
    //document.getElementById("outrds").value = `${rdsCount}`;
    //document.getElementById('outrdt').value = `${rdtCount}`;
    //document.getElementById("output1").value = `RDS : ${rdsCount}   RDT : ${rdtCount}`
    document.getElementById("output2").value = output2;
}

function copyOutput2Text() {
    const output2TextArea = document.getElementById("output2");
    output2TextArea.select();
    document.execCommand("copy");

    // Tampilkan notifikasi konfirmasi
    alert("Teks berhasil disalin!");
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString(undefined, options);
}

function countOccurrences(input, term) {
    const regex = new RegExp(term, 'gi'); // 'gi' berarti pencarian bersifat case-insensitive dan global
    const matches = input.match(regex);
    return matches ? matches.length : 0;
}

function tambahData() {
    const inputData = document.getElementById("inputData").value;
    if (inputData) {
        const status = "Status"; // Status akan ditetapkan ke "Input" secara otomatis
        const info = "";
        data.push({ dataKonsumen: inputData, status, info });
        document.getElementById("inputData").value = ""; // Mengosongkan kolom input setelah data ditambahkan
        tampilkanTabel();
        hitungRDSRDT(); // Memanggil fungsi untuk menghitung RDS dan RDT
        updateSendBadge(); // Memanggil fungsi untuk memperbarui badge "Send"
    }
}

function editData(index) {
    const newData = prompt("Edit Data Konsumen:", data[index].dataKonsumen);
    if (newData !== null) {
        data[index].dataKonsumen = newData;
        tampilkanTabel();
        hitungRDSRDT(); // Memanggil fungsi untuk menghitung RDS dan RDT setelah mengedit data
        updateSendBadge(); // Memanggil fungsi untuk memperbarui badge "Send"
    }
}

function changeRowBackgroundColor(row, status) {
    // Menghapus semua kelas CSS yang mungkin ada sebelumnya
    row.classList.remove("table-warning", "table-danger", "table-info");

    if (status === "Input") {
        row.classList.add("table-warning"); // Menambahkan kelas table-warning
    } else if (status === "Pending") {
        row.classList.add("table-danger"); // Menambahkan kelas table-danger
    } else if (status === "Send") {
        row.classList.add("table-info"); // Menambahkan kelas table-info
    } else if (status === "Progress") {
        row.classList.add("table-success");
    }updateSendBadge();
}
// Menambahkan event listener ke input laporan
document.getElementById('pfrds').addEventListener('input', hitungRDSRDT);
document.getElementById('ftrds').addEventListener('input', hitungRDSRDT);
document.getElementById('ftrdsa').addEventListener('input', hitungRDSRDT);
document.getElementById('bbnkrds').addEventListener('input', hitungRDSRDT);
document.getElementById('bbnhrds').addEventListener('input', hitungRDSRDT);
document.getElementById('prds').addEventListener('input', hitungRDSRDT);

document.getElementById('pfrdt').addEventListener('input', hitungRDSRDT);
document.getElementById('ftrdt').addEventListener('input', hitungRDSRDT);
document.getElementById('ftrdta').addEventListener('input', hitungRDSRDT);
document.getElementById('bbnkrdt').addEventListener('input', hitungRDSRDT);
document.getElementById('bbnhrdt').addEventListener('input', hitungRDSRDT);
document.getElementById('prdt').addEventListener('input', hitungRDSRDT);

const copyTextButton = document.getElementById("copyText");
copyTextButton.addEventListener("click", copyOutput2Text);

function updateSendBadge() {
    const sendCount = data.filter(row => row.status === "Send").length;
    const inputCount = data.filter(row => row.status === "Input").length;
    const progressCount = data.filter(row => row.status === "Progress").length;
    const pendingCount = data.filter(row => row.status === "Pending").length;

    document.getElementById("sendBadge").textContent = sendCount;
    document.getElementById("inputBadge").textContent = inputCount;
    document.getElementById("progressBadge").textContent = progressCount;
    document.getElementById("pendingBadge").textContent = pendingCount;
    const saveButton = document.getElementById("simpanButton");
    saveButton.addEventListener("click", saveData);
}

function saveData() {
    const jsonData = JSON.stringify(data);

    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: jsonData }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        alert(data.message);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Gagal menyimpan data.');
    });
}

// Memanggil fungsi untuk menampilkan tabel
tampilkanTabel();

function filterTable(status) {
    const table = document.getElementById("dataTable");
    const tbody = table.querySelector("tbody");
    
    // Loop melalui semua baris dalam tabel
    for (let i = 0; i < tbody.rows.length; i++) {
        const row = tbody.rows[i];
        const cellStatus = row.cells[1]; // Kolom status ada di indeks 1
        
        if (cellStatus.querySelector("select").value === status) {
            // Tampilkan baris dengan status yang sesuai dengan filter
            row.style.display = "";
        } else {
            // Sembunyikan baris dengan status yang tidak sesuai
            row.style.display = "none";
        }
    }
}

function resetFilter() {
    // Set ulang opsi status di semua baris menjadi "Status"
    data.forEach((row) => {
        row.display = true;
    });
    tampilkanTabel();
    hitungRDSRDT();
    updateSendBadge();
}

const muatButton = document.getElementById("muatButton");
const muatInput = document.getElementById("muatInput");
muatButton.addEventListener("click", () => {
    muatInput.click();
});
muatInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const fileContents = e.target.result;
            // Split fileContents menjadi baris-baris
            const lines = fileContents.split("\n");

            // Tambahkan setiap baris ke dalam data
            lines.forEach((line) => {
                const trimmedLine = line.trim();
                if (trimmedLine) {
                    data.push({ dataKonsumen: trimmedLine, status: "Status", info: "" });
                }
            });

            // Tampilkan tabel dan perbarui badge "Send"
            tampilkanTabel();
            updateSendBadge();
            hitungRDSRDT();
        };

        reader.readAsText(file);
    }
});