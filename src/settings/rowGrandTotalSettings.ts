'use strict';

import { DEFAULT_BACKGROUND_COLOR, DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, DEFAULT_TEXT_COLOR } from '../utils/constants';
import { VisualSettings } from './settings';

export function applyRowGrandTotalSettings(container: HTMLElement, settings: VisualSettings): void {
    const table = container.querySelector('table');
    if (!table) return;

    const grandTotalSettings = settings.rowGrandTotal?.rowGrandTotalGroup;
    if (!grandTotalSettings) return;

    // Находим строку гранд-тотала (общий итог) – последняя строка с классом totalRow
    const grandTotalRow = table.querySelector('tbody tr.totalRow[data-level="0"]');
    if (!grandTotalRow) return;

    // Все ячейки данных (td) в этой строке
    const dataCells = grandTotalRow.querySelectorAll('td');
    if (dataCells.length === 0) return;

    const fontFamily = grandTotalSettings.font?.fontFamily?.value ?? DEFAULT_FONT_FAMILY;
    const fontSize = grandTotalSettings.font?.fontSize?.value ?? DEFAULT_FONT_SIZE;
    const isBold = grandTotalSettings.font?.bold?.value ?? false;
    const isItalic = grandTotalSettings.font?.italic?.value ?? false;
    const isUnderline = grandTotalSettings.font?.underline?.value ?? false;

    const applyToLabels = grandTotalSettings.applyToLabels?.value ?? false;
    const textColor = grandTotalSettings.textColor?.value?.value ?? DEFAULT_TEXT_COLOR;
    const bgColor = grandTotalSettings.backgroundColor?.value?.value ?? DEFAULT_BACKGROUND_COLOR;

    // Применяем к ячейкам данных
    const applyStyles = (cell: Element) => {
        const htmlCell = cell as HTMLElement;
        htmlCell.style.setProperty('font-family', fontFamily, 'important');
        htmlCell.style.setProperty('font-size', `${fontSize}px`, 'important');
        htmlCell.style.setProperty('font-weight', isBold ? 'bold' : 'normal', 'important');
        htmlCell.style.setProperty('font-style', isItalic ? 'italic' : 'normal', 'important');
        htmlCell.style.setProperty('text-decoration', isUnderline ? 'underline' : 'none', 'important');
        htmlCell.style.setProperty('color', textColor, 'important');
        htmlCell.style.setProperty('background-color', bgColor, 'important');
    };

    dataCells.forEach(applyStyles);

    // Если applyToLabels включено, применяем к заголовку строки (th.formatRowNodes в этой же строке)
    if (applyToLabels) {
        const labelCell = grandTotalRow.querySelector('th.formatRowNodes');
        if (labelCell) {
            applyStyles(labelCell);
        }
    }
}
