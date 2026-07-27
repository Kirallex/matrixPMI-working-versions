'use strict';

export class MatrixEmptyColumnsHider {
    public hideEmptyColsMethod(container: HTMLElement): void {
        const table = container.querySelector('.datagrid table');
        if (!table) {
            console.warn('Элемент .datagrid table не найден');
            return;
        }

        let midRows = table.getElementsByClassName('midRow');
        let topRows = table.getElementsByClassName('topRow');

        if (midRows.length === 0) return;

        let colCount: number = 0; // colCount - количество колонок с данными в строке
        for (let i = 0; i < midRows.length; i++) {
            const tds = midRows[i].querySelectorAll('td');
            if (tds.length > 0) {
                colCount = tds.length;
                break;
            }
        }

        if (colCount === 0) return;

        let emptyIds: string[] = [];

        // проверка колонок на пустоту
        for (let col = 0; col < colCount; col++) {
            let isEmpty = true;
            let lastCellInCol: HTMLTableCellElement | null = null;

            for (let i = 0; i < midRows.length; i++) {
                let currentRow = midRows[i].querySelectorAll('td');
                // существует ли ячейка по этому индексу
                if (col < currentRow.length) {
                    const cell = currentRow[col] as HTMLTableCellElement;
                    lastCellInCol = cell;

                    const content = cell.innerText
                        .replace(/\u00A0/g, '')
                        .replace(/&nbsp;/gi, '')
                        .trim();

                    if (content !== '') { // колонка не пустая
                        isEmpty = false;
                        break;
                    }
                }
            }

            // если пустая, проверка, что это не total
            if (isEmpty && lastCellInCol) {
                const isTotalColumn = lastCellInCol.classList.contains('totalColumn');
                
                if (!isTotalColumn && lastCellInCol.id) {
                    emptyIds.push(lastCellInCol.id);
                }
            }
        }

        // удаление пустых
        for (const cellId of emptyIds) {
            const elementsToRemove = table.querySelectorAll(`[id="${cellId}"]`);
            elementsToRemove.forEach(elem => elem.remove());
        }

        const zeroLevelChildrenNum = Math.max(0, colCount - emptyIds.length);

        for (let topRowNum = topRows.length - 1; topRowNum >= 0; topRowNum--) {
            const topRow = topRows[topRowNum];
            const dataLevel = topRow.getAttribute('data-level');

            if (dataLevel !== null && parseInt(dataLevel, 10) === 0) {
                topRow.setAttribute('data-children-num', zeroLevelChildrenNum.toString());
            } else {
                const dataChildrenNum = topRow.getAttribute('data-children-num');
                const childrenNums = dataChildrenNum !== null ? parseInt(dataChildrenNum, 10) : NaN;

                if (childrenNums === 0 || isNaN(childrenNums)) {
                    break;
                }

                const rawColSpan = zeroLevelChildrenNum / childrenNums;
                const currentHeadersColSpan = Math.max(1, Math.round(rawColSpan));

                const headersOfColumns = topRow.getElementsByClassName('formatColumnNodes');
                for (let headerNum = 0; headerNum < headersOfColumns.length; headerNum++) {
                    headersOfColumns[headerNum].setAttribute('colspan', currentHeadersColSpan.toString());
                }
            }
        }
    }
}
