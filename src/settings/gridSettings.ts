'use strict';

import { VisualSettings } from './settings';

export function applyGridSettings(container: HTMLElement, settings: VisualSettings): void {
    const table = container.querySelector('table');
    if (!table) return;

    const grid = settings.grid;
    if (!grid) return;

    const rows = table.rows;
    if (rows.length === 0) return;

    const hColor = grid.horizontalGroup?.color?.value?.value;
    const hWidth = grid.horizontalGroup?.width?.value;

    const vColor = grid.verticalGroup?.color?.value?.value;
    const vWidth = grid.verticalGroup?.width?.value;

    const rowPadding = grid.optionsGroup?.rowPadding?.value;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowClass = row.className;
        const levelAttr = row.getAttribute('data-level');

        // Нужна ли горизонтальная линия
        let applyHorizontal = false;
        if (rowClass.includes('midRow')) {
            applyHorizontal = true;
        } else if (rowClass.includes('topRow') && levelAttr !== null) {
            const levelNum = parseInt(levelAttr, 10);
            if (!isNaN(levelNum) && levelNum % 2 === 1) {
                applyHorizontal = true;
            }
        }

        // Проходим по ячейкам и применяем стили
        for (let j = 0; j < row.cells.length; j++) {
            const cell = row.cells[j] as HTMLElement;

            // vertical
            cell.style.borderRight = `${vWidth}px solid ${vColor}`;

            // gorizontal
            if (applyHorizontal) {
                cell.style.borderBottom = `${hWidth}px solid ${hColor}`;
            } else {
                cell.style.borderBottom = ''; 
            }

            // padding
            cell.style.paddingTop = `${rowPadding}px`;
            cell.style.paddingBottom = `${rowPadding}px`;
        }
    }
}
