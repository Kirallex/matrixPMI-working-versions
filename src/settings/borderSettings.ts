'use strict';

import { VisualSettings } from './settings';

interface BorderSettings {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
    color: string;
    width: number;
}

export function applyBorderSettings(container: HTMLElement, settings: VisualSettings): void {
    const table = container.querySelector('table');
    if (!table) return;

    const borders = settings.borders;
    if (!borders) return;

    const rows = Array.from(table.rows);
    if (rows.length === 0) return;

    const headerRowIndices = new Set<number>();
    rows.forEach((row, idx) => {
        if (row.parentElement?.tagName === 'THEAD') {
            headerRowIndices.add(idx);
        }
    });

    const getBorderConfig = (group: any): BorderSettings => ({
        top: group?.positionTop?.value ?? false,
        bottom: group?.positionBottom?.value ?? false,
        left: group?.positionLeft?.value ?? false,
        right: group?.positionRight?.value ?? false,
        color: group?.color?.value?.value ?? '#000000',
        width: group?.width?.value ?? 0
    });

    const allSettings = getBorderConfig(borders.allGroup);
    const colHeaderSettings = getBorderConfig(borders.columnHeaderGroup);
    const rowHeaderSettings = getBorderConfig(borders.rowHeaderGroup);
    const valuesSettings = getBorderConfig(borders.valuesGroup);

    let firstMidRowIdx = -1;
    let lastTotalRowIdx = -1;
    let levelZeroTopRowIdx = -1;
    let maxHeaderLevel = 0;

    rows.forEach((row, idx) => {
        if (row.classList.contains('midRow') && firstMidRowIdx === -1) {
            firstMidRowIdx = idx;
        }
        if (row.classList.contains('totalRow')) {
            lastTotalRowIdx = idx;
        }
        if (row.classList.contains('topRow') && row.getAttribute('data-level') === '0') {
            levelZeroTopRowIdx = idx;
        }

        // Вычисляем максимальный уровень заголовка
        if (headerRowIndices.has(idx)) {
            const levelAttr = row.getAttribute('data-level');
            const level = levelAttr ? parseInt(levelAttr, 10) : 0;
            if (level > maxHeaderLevel) maxHeaderLevel = level;
        }
    });

    const applyBorder = (
        cell: HTMLElement,
        config: BorderSettings,
        conditions: { top?: boolean; bottom?: boolean; left?: boolean; right?: boolean }
    ) => {
        if (config.width === 0) return;
        const borderStr = `${config.width}px solid ${config.color}`;

        if (conditions.top && config.top) {
            cell.style.setProperty('border-top', borderStr, 'important');
        }
        if (conditions.bottom && config.bottom) {
            cell.style.setProperty('border-bottom', borderStr, 'important');
        }
        if (conditions.left && config.left) {
            cell.style.setProperty('border-left', borderStr, 'important');
        }
        if (conditions.right && config.right) {
            cell.style.setProperty('border-right', borderStr, 'important');
        }
    };

    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        const row = rows[rowIdx];
        const isHeader = headerRowIndices.has(rowIdx);
        const isMidRow = row.classList.contains('midRow');
        const isTotalRow = row.classList.contains('totalRow');
        const isValuesRow = isMidRow || isTotalRow;
        const isLastRow = rowIdx === rows.length - 1;

        const cells = Array.from(row.cells);
        for (let colIdx = 0; colIdx < cells.length; colIdx++) {
            const cell = cells[colIdx] as HTMLElement;
            const isRowHeader = colIdx === 0;
            const isValuesCell = !isHeader && !isRowHeader;
            const isLastCol = colIdx === cells.length - 1;

            // все группы
            applyBorder(cell, allSettings, {
                top: rowIdx === 0,
                bottom: isLastRow,
                left: isRowHeader,
                right: isLastCol
            });

            // заголовки столбцов
            if (isHeader) {
                const levelAttr = row.getAttribute('data-level');
                const level = levelAttr ? parseInt(levelAttr, 10) : 0;
                applyBorder(cell, colHeaderSettings, {
                    left: isRowHeader,
                    right: isLastCol,
                    bottom: level === 0,
                    top: level === maxHeaderLevel
                });
            }

            // заголовки строк
            if (isRowHeader && isValuesRow) {
                applyBorder(cell, rowHeaderSettings, {
                    left: true,
                    right: true,
                    top: isMidRow && rowIdx === firstMidRowIdx,
                    bottom: isTotalRow && rowIdx === lastTotalRowIdx
                });
            }

            // значения
            if (isValuesCell) {
                applyBorder(cell, valuesSettings, {
                    left: colIdx === 1, // граница после заголовка строки
                    right: isLastCol,
                    top: isMidRow && rowIdx === firstMidRowIdx,
                    bottom: isTotalRow && rowIdx === lastTotalRowIdx
                });
            }
        }
    }

    if (allSettings.width > 0) {
        // Нижняя граница для topRow с data-level='0'
        if (levelZeroTopRowIdx !== -1) {
            const targetRow = rows[levelZeroTopRowIdx];
            Array.from(targetRow.cells).forEach(cell => {
                (cell as HTMLElement).style.setProperty('border-bottom', `${allSettings.width}px solid ${allSettings.color}`, 'important');
            });
        }

        // Вертикальная граница между первым и вторым столбцом для midRow и totalRow
        rows.forEach(row => {
            if (row.classList.contains('midRow') || row.classList.contains('totalRow')) {
                if (row.cells.length >= 2) {
                    const firstCell = row.cells[0] as HTMLElement;
                    const secondCell = row.cells[1] as HTMLElement;
                    firstCell.style.setProperty('border-right', `${allSettings.width}px solid ${allSettings.color}`, 'important');
                    secondCell.style.setProperty('border-left', `${allSettings.width}px solid ${allSettings.color}`, 'important');
                }
            }
        });
    }

    const thead = table.querySelector('thead');
    if (thead && borders.columnHeaderGroup) {
        const chTop = borders.columnHeaderGroup.positionTop?.value ?? false;
        const chBottom = borders.columnHeaderGroup.positionBottom?.value ?? false;
        const chLeft = borders.columnHeaderGroup.positionLeft?.value ?? false;
        const chRight = borders.columnHeaderGroup.positionRight?.value ?? false;
        const chColor = borders.columnHeaderGroup.color?.value?.value ?? '#000000';
        const chWidth = borders.columnHeaderGroup.width?.value ?? 0;

        if (chWidth > 0) {
            let borderDiv = thead.querySelector('.thead-border') as HTMLElement;
            if (!borderDiv) {
                borderDiv = document.createElement('div');
                borderDiv.className = 'thead-border';
                Object.assign(borderDiv.style, {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    boxSizing: 'border-box',
                    zIndex: '2000'
                });
                thead.appendChild(borderDiv);
            }

            const shadows: string[] = [];
            if (chTop) shadows.push(`inset 0 ${chWidth}px 0 ${chColor}`);
            if (chBottom) shadows.push(`inset 0 -${chWidth}px 0 ${chColor}`);
            if (chLeft) shadows.push(`inset ${chWidth}px 0 0 ${chColor}`);
            if (chRight) shadows.push(`inset -${chWidth}px 0 0 ${chColor}`);

            borderDiv.style.boxShadow = shadows.length ? shadows.join(', ') : 'none';
        }
    }
}
