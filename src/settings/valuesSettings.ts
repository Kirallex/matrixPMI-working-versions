'use strict';

import { DEFAULT_BACKGROUND_COLOR, DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, DEFAULT_TEXT_COLOR } from '../utils/constants';
import { VisualSettings } from './settings';

export function applyValuesSettings(container: HTMLElement, settings: VisualSettings): void {
    const table = container.querySelector('table');
    if (!table) return;

    const valuesGroup = settings.values?.valuesGroup;
    if (!valuesGroup) return;

    const rows = table.querySelectorAll('tbody tr');
    if (rows.length === 0) return;

    const fontFamily = valuesGroup.font?.fontFamily?.value ?? DEFAULT_FONT_FAMILY;
    const fontSize = valuesGroup.font?.fontSize?.value ?? DEFAULT_FONT_SIZE;
    const isBold = valuesGroup.font?.bold?.value ?? false;
    const isItalic = valuesGroup.font?.italic?.value ?? false;
    const isUnderline = valuesGroup.font?.underline?.value ?? false;

    const primaryTextColor = valuesGroup.textColor?.value?.value ?? DEFAULT_TEXT_COLOR;
    const primaryBgColor = valuesGroup.backgroundColor?.value?.value ?? DEFAULT_BACKGROUND_COLOR;
    const altTextColor = valuesGroup.altTextColor?.value?.value ?? DEFAULT_TEXT_COLOR;
    const altBgColor = valuesGroup.altBackgroundColor?.value?.value ?? DEFAULT_BACKGROUND_COLOR;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const isPrimaryRow = (i % 2 === 0);

        const currentTextColor = isPrimaryRow ? primaryTextColor : altTextColor;
        const currentBgColor = isPrimaryRow ? primaryBgColor : altBgColor;

        const cells = row.querySelectorAll('td, th');
        
        cells.forEach(cell => {
            const htmlCell = cell as HTMLElement;
            const isDataCell = htmlCell.tagName.toLowerCase() === 'td';

            htmlCell.style.setProperty('color', currentTextColor, 'important');
            htmlCell.style.setProperty('background-color', currentBgColor, 'important');
           
            if (isDataCell) {
                htmlCell.style.setProperty('font-family', fontFamily, 'important');
                htmlCell.style.setProperty('font-size', `${fontSize}px`, 'important');
                htmlCell.style.setProperty('font-weight', isBold ? 'bold' : 'normal', 'important');
                htmlCell.style.setProperty('font-style', isItalic ? 'italic' : 'normal', 'important');
                htmlCell.style.setProperty('text-decoration', isUnderline ? 'underline' : 'none', 'important');
            }
        });
    }
}
