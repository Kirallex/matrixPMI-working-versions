'use strict';

import { IMeasureSettings } from './measureSettings';

export function applySpecificColumnSettings(
    container: HTMLElement,
    settings: IMeasureSettings,
    measureKey: string,
    measureName: string
): void {
    const table = container.querySelector('table');
    if (!table) {
        console.warn('Table not found in container');
        return;
    }

    const headerRows = table.querySelectorAll('thead tr');
    const headerRow = headerRows.length ? headerRows[headerRows.length - 1] : null;
    if (!headerRow) {
        console.warn('Header row (thead tr:last-child) not found');
        return;
    }

    // Все ячейки заголовков, исключая первый столбец (строки)
    const headerCells = Array.from(headerRow.querySelectorAll('th')).slice(1);

    const columnIndices: number[] = [];
    headerCells.forEach((cell, idx) => {
        const cellText = (cell.textContent || '').trim();
        const targetName = measureName.trim();
        if (cellText === targetName) {
            columnIndices.push(idx + 1); // +1 из-за пропущенного первого столбца
        }
    });

    if (columnIndices.length === 0) {
        console.warn(`No columns found for measure "${measureName}"`);
        return;
    }

    const midRows = table.querySelectorAll('tbody tr.midRow');
    const totalRows = table.querySelectorAll('tbody tr.totalRow');

    const applyStyles = (cell: HTMLElement, part: { textColor: string; backgroundColor: string; alignment: string }) => {
        cell.style.setProperty('color', part.textColor, 'important');
        cell.style.setProperty('background-color', part.backgroundColor, 'important');
        cell.style.setProperty('text-align', part.alignment, 'important');
    };

    columnIndices.forEach(colIndex => {
        // Заголовок (Header)
        if (settings.header) {
            const headerCell = headerRow.children[colIndex] as HTMLElement;
            if (headerCell) {
                applyStyles(headerCell, settings.header);
            }
        }

        // Значения (Values) – строки с классом midRow
        if (settings.values) {
            midRows.forEach(row => {
                const cell = (row as HTMLTableRowElement).cells[colIndex];
                if (cell) {
                    applyStyles(cell as HTMLElement, settings.values);
                }
            });
        }

        // Итог (Total) – строки с классом totalRow
        if (settings.total) {
            totalRows.forEach(row => {
                const cell = (row as HTMLTableRowElement).cells[colIndex];
                if (cell) {
                    applyStyles(cell as HTMLElement, settings.total);
                }
            });
        }
    });
}
