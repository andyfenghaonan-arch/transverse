// Global variables to store data
let molocData = null;
let currentChart = null;

// DOM elements
const geneSelect = document.getElementById('gene-select');
const diseaseSelect = document.getElementById('disease-select');
const exposureSelect = document.getElementById('exposure-select');
const vizTypeSelect = document.getElementById('visualization-type');
const generateBtn = document.getElementById('generate-viz');
const chartContainer = document.getElementById('chart-container');
const tableContainer = document.getElementById('table-container');
const infoContent = document.getElementById('info-content');

// Load Moloc data on page load
document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('Loading Moloc data...');
        
        // Parse the .moloc file
        const response = await fetch('Transverse.2MR.moloc');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const textData = await response.text();
        molocData = parseMolocData(textData);
        console.log('Moloc data loaded successfully:', molocData);
        populateDropdowns();
    } catch (error) {
        console.error('Error loading Moloc data:', error);
        infoContent.innerHTML = `<p style="color: red;">Error loading Moloc data: ${error.message}<br><br>
        <strong>Solutions:</strong><br>
        1. Make sure to serve this page through a web server (not file:// protocol)<br>
        2. Try: <code>python -m http.server 8000</code><br>
        3. Then visit: <code>http://localhost:8000</code></p>`;
    }
});

// Parse Moloc TSV data
function parseMolocData(textData) {
    const lines = textData.trim().split('\n');
    const headers = lines[0].split('\t');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split('\t');
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                const value = values[index];
                // Convert numeric values
                if (['nsnps', 'pp_a', 'pp_b', 'pp_ab', 'pp_c', 'pp_ac', 'pp_bc', 'pp_abc'].includes(header)) {
                    row[header] = parseFloat(value);
                } else {
                    row[header] = value;
                }
            });
            data.push(row);
        }
    }
    
    return {
        headers: headers,
        data: data,
        genes: [...new Set(data.map(d => d.gene))].sort(),
        diseases: [...new Set(data.map(d => d.diseases))].sort(),
        exposures: [...new Set(data.map(d => d.exposure))].sort()
    };
}

// Populate dropdowns with unique values
function populateDropdowns() {
    // Initial population with all options
    geneSelect.innerHTML = '<option value="">All genes...</option>';
    diseaseSelect.innerHTML = '<option value="">All diseases/traits...</option>';
    exposureSelect.innerHTML = '<option value="">All exposures...</option>';
    
    // Populate gene dropdown
    molocData.genes.forEach(gene => {
        const option = document.createElement('option');
        option.value = gene;
        option.textContent = gene;
        geneSelect.appendChild(option);
    });
    
    // Populate disease dropdown
    molocData.diseases.forEach(disease => {
        const option = document.createElement('option');
        option.value = disease;
        option.textContent = disease.replace(/_/g, ' ');
        diseaseSelect.appendChild(option);
    });
    
    // Populate exposure dropdown
    molocData.exposures.forEach(exposure => {
        const option = document.createElement('option');
        option.value = exposure;
        option.textContent = exposure;
        exposureSelect.appendChild(option);
    });
    
    // Auto-generate initial visualization with all data
    setTimeout(() => {
        generateVisualization();
    }, 100);
}

// Event listeners
geneSelect.addEventListener('change', function() {
    updateAvailableOptions();
    generateVisualization();
});

diseaseSelect.addEventListener('change', function() {
    updateAvailableOptions();
    generateVisualization();
});

exposureSelect.addEventListener('change', function() {
    updateAvailableOptions();
    generateVisualization();
});

generateBtn.addEventListener('click', generateVisualization);
vizTypeSelect.addEventListener('change', generateVisualization);

// Update available options based on selections (cascading filters)
function updateAvailableOptions() {
    const selectedGene = geneSelect.value;
    const selectedDisease = diseaseSelect.value;
    const selectedExposure = exposureSelect.value;
    
    console.log('Updating options for:', { selectedGene, selectedDisease, selectedExposure });
    
    // Get current filtered data based on all selections
    let baseFilteredData = molocData.data;
    
    if (selectedGene) {
        baseFilteredData = baseFilteredData.filter(d => d.gene === selectedGene);
    }
    if (selectedDisease) {
        baseFilteredData = baseFilteredData.filter(d => d.diseases === selectedDisease);
    }
    if (selectedExposure) {
        baseFilteredData = baseFilteredData.filter(d => d.exposure === selectedExposure);
    }
    
    // Update gene options based on disease and exposure filters
    updateGeneOptions(selectedGene, selectedDisease, selectedExposure);
    
    // Update disease options based on gene and exposure filters
    updateDiseaseOptions(selectedGene, selectedDisease, selectedExposure);
    
    // Update exposure options based on gene and disease filters
    updateExposureOptions(selectedGene, selectedDisease, selectedExposure);
}

function updateGeneOptions(selectedGene, selectedDisease, selectedExposure) {
    // Filter data based on disease and exposure (but not gene)
    let filteredData = molocData.data;
    if (selectedDisease) {
        filteredData = filteredData.filter(d => d.diseases === selectedDisease);
    }
    if (selectedExposure) {
        filteredData = filteredData.filter(d => d.exposure === selectedExposure);
    }
    
    // Get available genes with counts
    const geneGroups = {};
    filteredData.forEach(d => {
        if (!geneGroups[d.gene]) {
            geneGroups[d.gene] = 0;
        }
        geneGroups[d.gene]++;
    });
    
    const availableGenes = Object.keys(geneGroups).sort();
    
    // Save current selection
    const currentValue = geneSelect.value;
    
    // Clear and repopulate
    geneSelect.innerHTML = '<option value="">All genes...</option>';
    availableGenes.forEach(gene => {
        const option = document.createElement('option');
        option.value = gene;
        option.textContent = `${gene} (${geneGroups[gene]} records)`;
        if (gene === currentValue) {
            option.selected = true;
        }
        geneSelect.appendChild(option);
    });
    
    console.log('Available genes:', availableGenes.length);
}

function updateDiseaseOptions(selectedGene, selectedDisease, selectedExposure) {
    // Filter data based on gene and exposure (but not disease)
    let filteredData = molocData.data;
    if (selectedGene) {
        filteredData = filteredData.filter(d => d.gene === selectedGene);
    }
    if (selectedExposure) {
        filteredData = filteredData.filter(d => d.exposure === selectedExposure);
    }
    
    // Get available diseases with counts
    const diseaseGroups = {};
    filteredData.forEach(d => {
        if (!diseaseGroups[d.diseases]) {
            diseaseGroups[d.diseases] = 0;
        }
        diseaseGroups[d.diseases]++;
    });
    
    const availableDiseases = Object.keys(diseaseGroups).sort();
    
    // Save current selection
    const currentValue = diseaseSelect.value;
    
    // Clear and repopulate
    diseaseSelect.innerHTML = '<option value="">All diseases/traits...</option>';
    availableDiseases.forEach(disease => {
        const option = document.createElement('option');
        option.value = disease;
        option.textContent = `${disease.replace(/_/g, ' ')} (${diseaseGroups[disease]} records)`;
        if (disease === currentValue) {
            option.selected = true;
        }
        diseaseSelect.appendChild(option);
    });
    
    console.log('Available diseases:', availableDiseases.length);
}

function updateExposureOptions(selectedGene, selectedDisease, selectedExposure) {
    // Filter data based on gene and disease (but not exposure)
    let filteredData = molocData.data;
    if (selectedGene) {
        filteredData = filteredData.filter(d => d.gene === selectedGene);
    }
    if (selectedDisease) {
        filteredData = filteredData.filter(d => d.diseases === selectedDisease);
    }
    
    // Get available exposures with counts
    const exposureGroups = {};
    filteredData.forEach(d => {
        if (!exposureGroups[d.exposure]) {
            exposureGroups[d.exposure] = 0;
        }
        exposureGroups[d.exposure]++;
    });
    
    const availableExposures = Object.keys(exposureGroups).sort();
    
    // Save current selection
    const currentValue = exposureSelect.value;
    
    // Clear and repopulate
    exposureSelect.innerHTML = '<option value="">All exposures...</option>';
    availableExposures.forEach(exposure => {
        const option = document.createElement('option');
        option.value = exposure;
        option.textContent = `${exposure} (${exposureGroups[exposure]} records)`;
        if (exposure === currentValue) {
            option.selected = true;
        }
        exposureSelect.appendChild(option);
    });
    
    console.log('Available exposures:', availableExposures.length);
}

// Generate visualization based on selections
function generateVisualization() {
    const selectedGene = geneSelect.value;
    const selectedDisease = diseaseSelect.value;
    const selectedExposure = exposureSelect.value;
    const vizType = vizTypeSelect.value;
    
    console.log('Selected filters:', { selectedGene, selectedDisease, selectedExposure });
    console.log('Total data records:', molocData?.data?.length);
    
    // If no filters are selected, use all data
    let filteredData = molocData.data;
    
    // Apply filters only if values are selected
    if (selectedGene) {
        filteredData = filteredData.filter(d => d.gene === selectedGene);
        console.log('After gene filter:', filteredData.length);
    }
    if (selectedDisease) {
        filteredData = filteredData.filter(d => d.diseases === selectedDisease);
        console.log('After disease filter:', filteredData.length);
    }
    if (selectedExposure) {
        filteredData = filteredData.filter(d => d.exposure === selectedExposure);
        console.log('After exposure filter:', filteredData.length);
    }
    
    console.log('Final filtered data:', filteredData.length);
    
    // If no specific filters are applied, show all data
    if (!selectedGene && !selectedDisease && !selectedExposure) {
        filteredData = molocData.data.slice(0, 20); // Show first 20 records for performance
    }
    
    if (filteredData.length === 0) {
        infoContent.innerHTML = `<p style="color: red;">No data found for the selected criteria.<br>
        <strong>Debug Info:</strong><br>
        Selected Gene: ${selectedGene || 'None'}<br>
        Selected Disease: ${selectedDisease || 'None'}<br>
        Selected Exposure: ${selectedExposure || 'None'}<br>
        Total records: ${molocData?.data?.length || 0}</p>`;
        return;
    }
    
    updateInfoPanel(filteredData);
    
    switch (vizType) {
        case 'posterior':
            createPosteriorProbabilityChart(filteredData);
            break;
        case 'heatmap':
            createEvidenceHeatmap(filteredData);
            break;
        case 'table':
            createDetailedTable(filteredData);
            break;
        case 'snp-evidence':
            createSNPEvidenceChart(filteredData);
            break;
    }
}

// Update information panel
function updateInfoPanel(data) {
    if (data.length === 0) return;
    
    const sample = data[0];
    infoContent.innerHTML = `
        <h4>Analysis Summary</h4>
        <p><strong>Records found:</strong> ${data.length}</p>
        <p><strong>Sample Gene:</strong> ${sample.gene}</p>
        <p><strong>Sample Exposure:</strong> ${sample.exposure}</p>
        <p><strong>Sample Outcome:</strong> ${sample.outcome}</p>
        <p><strong>Disease/Trait:</strong> ${sample.diseases.replace(/_/g, ' ')}</p>
        
        <h4>Moloc Interpretation</h4>
        <p><strong>PP A:</strong> Probability that only trait A has a causal variant</p>
        <p><strong>PP B:</strong> Probability that only trait B has a causal variant</p>
        <p><strong>PP C:</strong> Probability that only trait C has a causal variant</p>
        <p><strong>PP AB:</strong> Probability that traits A and B share a causal variant</p>
        <p><strong>PP AC:</strong> Probability that traits A and C share a causal variant</p>
        <p><strong>PP BC:</strong> Probability that traits B and C share a causal variant</p>
        <p><strong>PP ABC:</strong> Probability that all three traits share a causal variant</p>
    `;
}

// Create posterior probability chart
function createPosteriorProbabilityChart(data) {
    chartContainer.style.display = 'block';
    tableContainer.style.display = 'none';
    
    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }
    
    const ctx = document.getElementById('moloc-chart').getContext('2d');
    
    // Prepare data for posterior probabilities
    const labels = data.map((d, i) => `${d.gene}-${d.outcome.substring(0, 15)}${i + 1}`);
    const ppData = {
        labels: labels,
        datasets: [
            {
                label: 'PP A',
                data: data.map(d => d.pp_a),
                backgroundColor: 'rgba(255, 99, 132, 0.8)'
            },
            {
                label: 'PP B',
                data: data.map(d => d.pp_b),
                backgroundColor: 'rgba(54, 162, 235, 0.8)'
            },
            {
                label: 'PP C',
                data: data.map(d => d.pp_c),
                backgroundColor: 'rgba(255, 206, 86, 0.8)'
            },
            {
                label: 'PP AB',
                data: data.map(d => d.pp_ab),
                backgroundColor: 'rgba(75, 192, 192, 0.8)'
            },
            {
                label: 'PP AC',
                data: data.map(d => d.pp_ac),
                backgroundColor: 'rgba(153, 102, 255, 0.8)'
            },
            {
                label: 'PP BC',
                data: data.map(d => d.pp_bc),
                backgroundColor: 'rgba(255, 159, 64, 0.8)'
            },
            {
                label: 'PP ABC',
                data: data.map(d => d.pp_abc),
                backgroundColor: 'rgba(199, 199, 199, 0.8)'
            }
        ]
    };
    
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: ppData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Moloc Posterior Probabilities'
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Gene-Outcome Combinations'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Posterior Probability'
                    },
                    min: 0,
                    max: 1
                }
            }
        }
    });
}

// Create evidence heatmap
function createEvidenceHeatmap(data) {
    chartContainer.style.display = 'block';
    tableContainer.style.display = 'none';
    
    if (currentChart) {
        currentChart.destroy();
    }
    
    const ctx = document.getElementById('moloc-chart').getContext('2d');
    
    // Create a matrix-like view of the evidence
    const evidenceTypes = ['PP A', 'PP B', 'PP C', 'PP AB', 'PP AC', 'PP BC', 'PP ABC'];
    const labels = data.map((d, i) => `${d.gene.substring(0, 10)}...${i + 1}`);
    
    const datasets = evidenceTypes.map((type, typeIndex) => {
        const colorIntensity = (typeIndex + 1) * 30;
        return {
            label: type,
            data: data.map((d, i) => ({
                x: i,
                y: typeIndex,
                v: type === 'PP A' ? d.pp_a :
                   type === 'PP B' ? d.pp_b :
                   type === 'PP C' ? d.pp_c :
                   type === 'PP AB' ? d.pp_ab :
                   type === 'PP AC' ? d.pp_ac :
                   type === 'PP BC' ? d.pp_bc :
                   d.pp_abc
            })),
            backgroundColor: function(context) {
                const value = context.parsed.v;
                const alpha = value; // Use probability as alpha
                return `rgba(${colorIntensity}, ${100}, ${200}, ${alpha})`;
            },
            borderWidth: 1
        };
    });
    
    // Use scatter plot to simulate heatmap
    currentChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets.map(dataset => ({
                label: dataset.label,
                data: dataset.data.map(point => ({
                    x: point.x,
                    y: point.y,
                    r: Math.max(5, point.v * 20) // Radius based on probability
                })),
                backgroundColor: dataset.backgroundColor
            }))
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Moloc Evidence Heatmap'
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Analysis Index'
                    }
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Evidence Type'
                    },
                    ticks: {
                        callback: function(value) {
                            return evidenceTypes[Math.round(value)] || '';
                        }
                    }
                }
            }
        }
    });
}

// Create detailed results table
function createDetailedTable(data) {
    chartContainer.style.display = 'none';
    tableContainer.style.display = 'block';
    
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td title="${row.gene}">${row.gene}</td>
            <td title="${row.exposure}">${row.exposure.length > 20 ? row.exposure.substring(0, 20) + '...' : row.exposure}</td>
            <td title="${row.outcome}">${row.outcome.length > 20 ? row.outcome.substring(0, 20) + '...' : row.outcome}</td>
            <td>${row.nsnps}</td>
            <td>${row.best_SNP_a}</td>
            <td>${row.pp_a.toFixed(3)}</td>
            <td>${row.pp_b.toFixed(3)}</td>
            <td>${row.pp_ab.toFixed(3)}</td>
            <td>${row.pp_c.toFixed(3)}</td>
            <td>${row.pp_ac.toFixed(3)}</td>
            <td>${row.pp_bc.toFixed(3)}</td>
            <td>${row.pp_abc.toFixed(3)}</td>
        `;
        
        // Highlight the highest probability
        const probabilities = [row.pp_a, row.pp_b, row.pp_ab, row.pp_c, row.pp_ac, row.pp_bc, row.pp_abc];
        const maxProb = Math.max(...probabilities);
        const cells = tr.querySelectorAll('td');
        
        probabilities.forEach((prob, index) => {
            if (prob === maxProb && prob > 0.5) {
                cells[index + 5].style.backgroundColor = '#90EE90';
                cells[index + 5].style.fontWeight = 'bold';
            }
        });
        
        tableBody.appendChild(tr);
    });
}

// Create SNP evidence chart
function createSNPEvidenceChart(data) {
    chartContainer.style.display = 'block';
    tableContainer.style.display = 'none';
    
    if (currentChart) {
        currentChart.destroy();
    }
    
    const ctx = document.getElementById('moloc-chart').getContext('2d');
    
    // Group by best SNP
    const snpGroups = {};
    data.forEach(d => {
        const snp = d.best_SNP_a;
        if (!snpGroups[snp]) {
            snpGroups[snp] = [];
        }
        snpGroups[snp].push(d);
    });
    
    const snpLabels = Object.keys(snpGroups);
    const snpCounts = snpLabels.map(snp => snpGroups[snp].length);
    const avgPosterior = snpLabels.map(snp => {
        const group = snpGroups[snp];
        const avgPP = group.reduce((sum, d) => sum + Math.max(d.pp_a, d.pp_b, d.pp_ab, d.pp_c, d.pp_ac, d.pp_bc, d.pp_abc), 0) / group.length;
        return avgPP;
    });
    
    currentChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'SNP Evidence',
                data: snpLabels.map((snp, i) => ({
                    x: snpCounts[i],
                    y: avgPosterior[i],
                    r: Math.max(5, snpCounts[i] * 3)
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'SNP Evidence Summary (Bubble size = frequency)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const snp = snpLabels[context.dataIndex];
                            return `SNP: ${snp}, Count: ${context.parsed.x}, Avg PP: ${context.parsed.y.toFixed(3)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Associations'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Maximum Posterior Probability'
                    },
                    min: 0,
                    max: 1
                }
            }
        }
    });
}