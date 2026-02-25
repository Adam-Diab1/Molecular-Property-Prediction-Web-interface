function handleKeyPress(event) {
  // Check if the pressed key is Enter (key code 13)
  if (event.keyCode === 13) {
    predictProperties();
    event.preventDefault(); // Prevent form submission if in a form
  }
}

function predictProperties() {
  const smiles = document.getElementById('smilesInput').value.trim();
  const resultDiv = document.getElementById('result');

  if (!smiles) {
    resultDiv.innerHTML = "<span class='error'>Please enter a SMILES string</span>";
    return;
  }

  resultDiv.innerHTML = "Predicting...";

  fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ smiles })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        resultDiv.innerHTML = `<span class='error'>Error: ${data.error}</span>`;
        return;
      }
      
      resultDiv.innerHTML = `
        <div class="result-grid">
          <div class="result-row">
            <span class="result-label">SMILES:</span>
            <span class="result-value">${data.SMILES}</span>
          </div>
          <div class="result-row">
            <span class="result-label">Critical Pressure:</span>
            <span class="result-value">${data["Critical Pressure (Pa)"].toFixed(2)} Pa</span>
          </div>
          <div class="result-row">
            <span class="result-label">Critical Temperature:</span>
            <span class="result-value">${data["Critical Temperature (K)"].toFixed(2)} K</span>
          </div>
          <div class="result-row">
            <span class="result-label">Melting Point:</span>
            <span class="result-value">${data["Melting Point (K)"].toFixed(2)} K</span>
          </div>
          <div class="result-row">
            <span class="result-label">Boiling Point:</span>
            <span class="result-value">${data["Boiling Point (K)"].toFixed(2)} K</span>
          </div>
        </div>
      `;
    })
    .catch(err => {
      resultDiv.innerHTML = "<span class='error'>Error contacting prediction server</span>";
      console.error(err);
    });
}