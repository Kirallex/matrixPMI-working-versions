'use strict';

import { DEFAULT_BACKGROUND_COLOR, DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, DEFAULT_TEXT_COLOR } from '../utils/constants';
import { VisualSettings } from './settings';

export function applyColumnHeadersSettings(container: HTMLElement, settings: VisualSettings): void {
    const table = container.querySelector('table');
    if (!table) return;

    const headers = settings.columnHeaders.columnHeadersGroup;
    if (!headers) return;

    const headerCells = table.querySelectorAll('thead th');
    if (headerCells.length === 0) return;

    // Применяем шрифтовые настройки ко всем заголовкам
    const fontFamily = headers.font?.fontFamily?.value ?? DEFAULT_FONT_FAMILY;
    const fontSize = headers.font?.fontSize?.value ?? DEFAULT_FONT_SIZE;
    const isBold = headers.font?.bold?.value ?? false;
    const isItalic = headers.font?.italic?.value ?? false;
    const isUnderline = headers.font?.underline?.value ?? false;

    const textColor = headers.textColor?.value?.value ?? DEFAULT_TEXT_COLOR;
    const bgColor = headers.backgroundColor?.value?.value ?? DEFAULT_BACKGROUND_COLOR;

    const headerAlignment = headers.headerAlignment?.value ?? 'left';
    const titleAlignment = headers.titleAlignment?.value ?? 'left';

    headerCells.forEach(cell => {
        const htmlCell = cell as HTMLElement;

        htmlCell.style.setProperty('font-family', fontFamily, 'important');
        htmlCell.style.setProperty('font-size', `${fontSize}px`, 'important');
        htmlCell.style.setProperty('font-weight', isBold ? 'bold' : 'normal', 'important');
        htmlCell.style.setProperty('font-style', isItalic ? 'italic' : 'normal', 'important');
        htmlCell.style.setProperty('text-decoration', isUnderline ? 'underline' : 'none', 'important');
        htmlCell.style.setProperty('color', textColor, 'important');
        htmlCell.style.setProperty('background-color', bgColor, 'important');
    });

    // Применяем выравнивание для заголовков строк (th.rowsHeader)
    const rowHeaderCells = table.querySelectorAll('thead th.rowsHeader');
    if (rowHeaderCells.length > 0) {
        rowHeaderCells.forEach(cell => {
            (cell as HTMLElement).style.setProperty('text-align', headerAlignment, 'important');
        });
    }

    // Применяем выравнивание для заголовков данных (th.formatColumnNodes)
    const columnHeaderCells = table.querySelectorAll('thead th.formatColumnNodes');

    if (columnHeaderCells.length > 0) {
        columnHeaderCells.forEach(cell => {
            (cell as HTMLElement).style.setProperty('text-align', titleAlignment, 'important');
        });
    }

    // Скрываем технические строки
    const techRow = table.querySelectorAll('tr.topRow[data-level="0"]');
    const shouldHide = settings.columnHeaders?.hideTechRowCard?.hideTechRowLabel?.value ?? false;

    techRow.forEach(row => {
        const htmlRow = row as HTMLElement;
        if (shouldHide) {
            htmlRow.style.display = 'none';
        } else {
            htmlRow.style.display = ''; // сброс, возвращаем стандартное отображение
        }
    });
}
