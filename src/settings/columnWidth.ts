'use strict';

import { ColumnWidthCard } from './settings';

export function applyColumnWidthsFromSettings(
    table: HTMLTableElement,
    columnWidthCard: ColumnWidthCard,
    measureNames: string[]
): void {
    if (!table || !columnWidthCard) {
        console.warn('applyColumnWidthsFromSettings: table or columnWidthCard is null');
        return;
    }

    // Ширина заголовка (первая колонка)
    const rowHeaderWidth = columnWidthCard.getRowHeaderWidth();
    if (rowHeaderWidth && rowHeaderWidth > 0) {
        const firstColCells = table.querySelectorAll('th:first-child, td:first-child');
        const rowHeaderPx = `${Number(rowHeaderWidth)}px`;

        firstColCells.forEach(cell => {
            const htmlCell = cell as HTMLElement;
            htmlCell.style.setProperty('width', rowHeaderPx, 'important');
            htmlCell.style.setProperty('min-width', rowHeaderPx, 'important');
            htmlCell.style.setProperty('max-width', rowHeaderPx, 'important');
        });
    }

    // Поиск нижней строки заголовков
    const headerRows = table.querySelectorAll('thead tr');
    const headerRow = headerRows.length ? headerRows[headerRows.length - 1] : null;
    if (!headerRow) {
        console.warn('[ColumnWidth] No header row found (thead tr:last-child)');
        return;
    }

    const headerCells = Array.from(headerRow.querySelectorAll('th')).slice(1); // пропуск первой колонки

    // Построение карты: индекс меры -> массив индексов колонок
    const measureColumnMap = new Map<number, number[]>();
    for (let i = 0; i < measureNames.length; i++) {
        const measureName = measureNames[i].trim();
        const indices: number[] = [];

        headerCells.forEach((cell, idx) => {
            const cellText = cell.textContent?.trim() || '';
            if (cellText === measureName) {
                indices.push(idx + 1); // +1 т.к. пропустили первую колонку
            }
        });

        if (indices.length > 0) {
            measureColumnMap.set(i, indices);
        } else {
            console.warn(`[ColumnWidth] No columns found for measure "${measureNames[i]}"`);
        }
    }

    const colWidthMap = new Map<number, string>();

    // Применяем ширину
    for (const [measureIdx, columnIndices] of measureColumnMap.entries()) {
        const widthValue = columnWidthCard.getMeasureWidth(measureIdx);
        if (widthValue || widthValue > 0) {
            const pxValue = `${Number(widthValue)}px`;
            for (const colIndex of columnIndices) {
                colWidthMap.set(colIndex, pxValue);
            }
        }
    }

    if (colWidthMap.size === 0) return;

    for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
        const row = table.rows[rowIndex];
        
        for (const [colIndex, pxValue] of colWidthMap.entries()) {
            const cell = row.cells[colIndex];
            if (cell) {
                const htmlCell = cell as HTMLElement;
                htmlCell.style.setProperty('width', pxValue, 'important');
                htmlCell.style.setProperty('min-width', pxValue, 'important');
                htmlCell.style.setProperty('max-width', pxValue, 'important');
            }
        }
    }
}
