'use strict';

import { DEFAULT_BACKGROUND_COLOR, DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, DEFAULT_TEXT_COLOR } from '../utils/constants';
import { VisualSettings } from './settings';

export function applyRowHeadersSettings(container: HTMLElement, settings: VisualSettings): void {
    const table = container.querySelector('table');
    if (!table) return;

    const rowHeaders = settings.rowHeaders?.rowHeadersGroup;
    if (!rowHeaders) return;

    const rowHeaderCells = table.querySelectorAll('tbody tr.midRow th.formatRowNodes, tbody tr.totalRow th.formatRowNodes');
    if (rowHeaderCells.length === 0) return;

    // Шрифтовые настройки
    const fontFamily = rowHeaders.font?.fontFamily?.value ?? DEFAULT_FONT_FAMILY;
    const fontSize = rowHeaders.font?.fontSize?.value ?? DEFAULT_FONT_SIZE;
    const isBold = rowHeaders.font?.bold?.value ?? false;
    const isItalic = rowHeaders.font?.italic?.value ?? false;
    const isUnderline = rowHeaders.font?.underline?.value ?? false;

    rowHeaderCells.forEach(cell => {
        const htmlCell = cell as HTMLElement;
        htmlCell.style.setProperty('font-family', fontFamily, 'important');
        htmlCell.style.setProperty('font-size', `${fontSize}px`, 'important');
        htmlCell.style.setProperty('font-weight', isBold ? 'bold' : 'normal', 'important');
        htmlCell.style.setProperty('font-style', isItalic ? 'italic' : 'normal', 'important');
        htmlCell.style.setProperty('text-decoration', isUnderline ? 'underline' : 'none', 'important');
    });

    // Цвета
    const branded = rowHeaders.brandedRowColor?.value ?? false;

    if (branded) {
        // Используем цвета из ValuesGroup с учётом чётности строк
        const values = settings.values?.valuesGroup;
        if (values) {
            const primaryTextColor = values.textColor?.value?.value ?? DEFAULT_TEXT_COLOR;
            const primaryBgColor = values.backgroundColor?.value?.value ?? DEFAULT_BACKGROUND_COLOR;
            const altTextColor = values.altTextColor?.value?.value ?? DEFAULT_TEXT_COLOR;
            const altBgColor = values.altBackgroundColor?.value?.value ?? DEFAULT_BACKGROUND_COLOR;

            const tbodyRows = Array.from(table.querySelectorAll('tbody tr'));

            rowHeaderCells.forEach(cell => {
                const htmlCell = cell as HTMLElement;
                const parentRow = cell.closest('tr') as HTMLTableRowElement;

                if (parentRow) {
                    const rowIndex = tbodyRows.indexOf(parentRow);

                    if (rowIndex !== -1) {
                        const isPrimaryRow = (rowIndex % 2 === 0);
                        const currentTextColor = isPrimaryRow ? primaryTextColor : altTextColor;
                        const currentBgColor = isPrimaryRow ? primaryBgColor : altBgColor;

                        htmlCell.style.setProperty('color', currentTextColor, 'important');
                        htmlCell.style.setProperty('background-color', currentBgColor, 'important');
                    }
                }
            });
        }
    } else {
        const textColor = rowHeaders.textColor?.value?.value ?? DEFAULT_TEXT_COLOR;
        const bgColor = rowHeaders.backgroundColor?.value?.value ?? DEFAULT_BACKGROUND_COLOR;

        rowHeaderCells.forEach(cell => {
            const htmlCell = cell as HTMLElement;
            htmlCell.style.setProperty('color', textColor, 'important');
            htmlCell.style.setProperty('background-color', bgColor, 'important');
        });
    }

    // Выравнивание текста
    const alignment = rowHeaders.textAlignment?.value ?? 'left';
    
    rowHeaderCells.forEach(cell => {
        const textSpan = cell.querySelector('.row-header-text') as HTMLElement;
        if (textSpan) {
            textSpan.style.setProperty('text-align', alignment, 'important');
        }
    });
}
