# Moloc Data Visualization Platform

An interactive web platform for visualizing and analyzing Moloc (multi-locus colocalization analysis) data.

## 🌟 Features

- **Interactive Data Exploration**: Select genes, diseases/traits, and exposure factors through dropdown menus
- **Smart Cascading Filters**: When selecting one option, other options automatically filter to show only matching records
- **Record Count Display**: Each option shows the number of corresponding records, helping users understand data distribution
- **Multiple Visualization Types**:
  - Posterior Probability Chart: Compare probabilities of different colocalization hypotheses
  - Evidence Heatmap: Display distribution of evidence strength
  - Detailed Results Table: Complete tabular data view
  - SNP Evidence Plot: Analyze SNP frequency and average probabilities

## 📊 Data Description

This platform processes Moloc analysis results, including the following information:
- **PP A**: Probability that only trait A has a causal variant
- **PP B**: Probability that only trait B has a causal variant  
- **PP C**: Probability that only trait C has a causal variant
- **PP AB**: Probability that traits A and B share a causal variant
- **PP AC**: Probability that traits A and C share a causal variant
- **PP BC**: Probability that traits B and C share a causal variant
- **PP ABC**: Probability that all three traits share a causal variant

## 🚀 Live Demo

**GitHub Pages URL**: `https://andyfenghaonan-arch.github.io/transverse/`

## 📁 File Structure

```
eqtl-visualization/
├── index.html              # Main page
├── script.js              # JavaScript logic
├── style.css              # Stylesheet
├── Transverse.2MR.moloc   # Moloc data file
├── data.json              # JSON data file (if needed)
├── deploy.bat             # Windows deployment script
├── deploy.ps1             # PowerShell deployment script
└── README.md              # Project documentation
```

## 🔧 Local Development

1. Clone the repository locally
2. Start a local server (must use HTTP protocol, cannot open HTML files directly):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   ```
3. Visit `http://localhost:8000`

## 📋 Deploy to GitHub Pages

### Automatic Deployment (Recommended)
1. **Run the deployment script**:
   - Double-click `deploy.bat` (Windows)
   - Or run `deploy.ps1` with PowerShell
2. **The script will automatically**:
   - Initialize Git repository
   - Add all files and commit
   - Push to GitHub

### Manual Deployment
1. **Create GitHub repository**
2. **Upload all files**
3. **Enable GitHub Pages**:
   - Go to repository Settings page
   - Scroll to Pages section
   - Select Source as "Deploy from a branch"
   - Choose branch as "main"
   - Select folder as "/ (root)"
   - Click Save
4. **Wait for deployment** (usually 1-2 minutes)
5. **Access your website**: `https://andyfenghaonan-arch.github.io/transverse/`

## 💡 Usage Instructions

1. **Page Loading**: The webpage automatically loads Moloc data and displays initial visualization
2. **Select Filters**:
   - Select Gene: Other options will automatically filter
   - Select Disease/Trait: Other options will update accordingly
   - Select Exposure Factor: Other options will update accordingly
3. **Switch Visualization Types**: Use the "Visualization Type" dropdown menu
4. **View Details**: The right panel shows detailed analysis information for current selection

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Chart Libraries**: Chart.js, D3.js
- **Deployment**: GitHub Pages
- **Data Format**: TSV (Tab-Separated Values)

## 📈 Data Format Requirements

Moloc data file should contain the following columns:
- `exposure`: Exposure factor
- `outcome`: Outcome variable
- `gene`: Gene name
- `diseases`: Disease/trait name
- `nsnps`: Number of SNPs
- `pp_a`, `pp_b`, `pp_c`, `pp_ab`, `pp_ac`, `pp_bc`, `pp_abc`: Various posterior probabilities
- `best_SNP_*`: Best SNP information

## 🎨 Customization

You can customize the interface by modifying the following files:
- `style.css`: Modify colors, fonts, layout, etc.
- `script.js`: Modify visualization logic or add new features
- `index.html`: Modify page structure or add new elements

## 🔍 Example Usage

1. **Initial View**: All data displayed with default visualization
2. **Filter by Gene**: Select "GORAB" → other dropdowns show only related options
3. **Filter by Disease**: Select "FVC" → exposure options further filtered
4. **Visualization Types**: 
   - **Posterior Probabilities**: Bar chart comparing PP values
   - **Evidence Heatmap**: Bubble chart showing evidence strength
   - **Data Table**: Complete tabular view with highlighted maximum probabilities
   - **SNP Evidence**: Analysis of SNP frequency and average probabilities

## 📊 Interpretation Guide

- **High PP values (>0.7)**: Strong evidence for colocalization
- **Moderate PP values (0.3-0.7)**: Moderate evidence
- **Low PP values (<0.3)**: Weak evidence
- **PP ABC**: Strongest evidence for shared causal variants across all three traits

## 📞 Support

For questions or suggestions, please create an Issue.

## 📄 License

This project is open source and available under the MIT License.

---

**Note**: Due to browser security restrictions, this website must be accessed via HTTP(S) protocol and cannot be opened as a local HTML file directly. Deployment to GitHub Pages or using a local server is recommended.
