function encryptMessage() {
    const message = document.getElementById('message').value;
    if (!message) return;

    fetch('/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    })
    .then(r => r.json())
    .then(data => {
        document.getElementById('output-section').classList.remove('hidden');
        document.getElementById('encrypted-results').classList.remove('hidden');
        document.getElementById('decrypted-results').classList.add('hidden');
        
        document.getElementById('iv-display').innerText = data.iv;
        document.getElementById('cipher-display').innerText = data.ciphertext;

        const dl = document.getElementById('download-container');
        dl.innerHTML = '';
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'aes_credentials.json';
        a.innerText = '↓ Download Security Credentials';
        dl.appendChild(a);
    });
}

function decryptMessage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            fetch('/decrypt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: event.target.result
            })
            .then(r => r.json())
            .then(data => {
                document.getElementById('output-section').classList.remove('hidden');
                document.getElementById('decrypted-results').classList.remove('hidden');
                document.getElementById('encrypted-results').classList.add('hidden');
                document.getElementById('plain-display').innerText = data.message;
            });
        };
        reader.readAsText(file);
    };
    input.click();
}