# matrixPMI

## Overview
MatrixPMI - custom PBI matrix visual

## Usage
1. Install dependencies:
```bash
npm install
```
2. Build visual
```bash
npm run package
```

3. If you see an error:
`'pbiviz' is not recognized as an internal or external command,
operable program or batch file`,
please install **powerbi-visuals-tools**:
```bash
npm install -g powerbi-visuals-tools
```
4. After successful build `.pbiviz` file will appear in the folder **dist**.
5. Open **Power BI Desktop**.

6. On **Visualizations** panel push on **(...)** and select
   **Import a visual from a file**.

7. Select built `.pbiviz` file.
8. New **matrixPMI** visual will appear on Visualizations panel and ready to use.
