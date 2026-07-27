'use strict';

import { formattingSettings } from 'powerbi-visuals-utils-formattingmodel';
import powerbi from 'powerbi-visuals-api';
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_FONT_FAMILY, DEFAULT_TEXT_COLOR } from '../utils/constants';

interface INumUpDownOptions {
    minValue?: { type: powerbi.visuals.ValidatorType.Min; value: number };
    maxValue?: { type: powerbi.visuals.ValidatorType.Max; value: number };
    step?: number;
}

// Карточка Subtotals
class SubtotalsCard extends formattingSettings.SimpleCard {
    public rowSubtotals = new formattingSettings.ToggleSwitch({
        name: 'rowSubtotals',
        displayName: 'Row subtotals',
        value: true
    });
    public columnSubtotals = new formattingSettings.ToggleSwitch({
        name: 'columnSubtotals',
        displayName: 'Column subtotals',
        value: true
    });
    public grandTotal = new formattingSettings.ToggleSwitch({
        name: 'grandTotal',
        displayName: 'Grand total',
        value: true
    });
    public nonGrandTotal = new formattingSettings.ToggleSwitch({
        name: 'nonGrandTotal',
        displayName: 'NonGrand total',
        value: false
    });

    public name = 'subTotals';
    public displayName = 'Subtotals';
    public slices = [this.rowSubtotals, this.columnSubtotals, this.grandTotal, this.nonGrandTotal];
}

// Hide empty
class HideEmptyColsCard extends formattingSettings.SimpleCard {
    public hideColsLabel = new formattingSettings.ToggleSwitch({
        name: 'hideColsLabel',
        displayName: 'Hide Empty Columns',
        value: false
    });

    public name = 'hideEmptyCols';
    public displayName = 'Hide Empty Columns';
    public slices = [this.hideColsLabel];
}

// Horizontal gridlines
class HorizontalGridlinesGroup extends formattingSettings.SimpleCard {
    public color = new formattingSettings.ColorPicker({
        name: 'horizontalColor',
        displayName: 'Color',
        value: { value: 'transparent' }
    });
    public width = new formattingSettings.NumUpDown({
        name: 'horizontalWidth',
        displayName: 'Width',
        value: 1,
        options: {
            minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
            maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 10 },
            step: 1
        } as INumUpDownOptions
    });

    public name = 'horizontalGroup';
    public displayName = 'Horizontal gridlines';
    public slices = [this.color, this.width];
}

// Vertical gridlines
class VerticalGridlinesGroup extends formattingSettings.SimpleCard {
    public color = new formattingSettings.ColorPicker({
        name: 'verticalColor',
        displayName: 'Color',
        value: { value: 'transparent' }
    });
    public width = new formattingSettings.NumUpDown({
        name: 'verticalWidth',
        displayName: 'Width',
        value: 1,
        options: {
            minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
            maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 10 },
            step: 1
        } as INumUpDownOptions
    });

    public name = 'verticalGroup';
    public displayName = 'Vertical gridlines';
    public slices = [this.color, this.width];
}

class OptionsGroup extends formattingSettings.SimpleCard {
    public rowPadding = new formattingSettings.NumUpDown({
        name: 'rowPadding',
        displayName: 'Row Padding',
        value: 5,
        options: {
            minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
            maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 50 },
            step: 1
        } as INumUpDownOptions
    });

    public name = 'optionsGroup';
    public displayName = 'Options';
    public slices = [this.rowPadding];
}

class GridCard extends formattingSettings.CompositeCard {
    public horizontalGroup = new HorizontalGridlinesGroup();
    public verticalGroup = new VerticalGridlinesGroup();
    public optionsGroup = new OptionsGroup();

    public name = 'grid';
    public displayName = 'Grid';
    public groups = [this.horizontalGroup, this.verticalGroup, this.optionsGroup];
}

// Border
class BorderSectionCard extends formattingSettings.SimpleCard {
    public positionTop: formattingSettings.ToggleSwitch;
    public positionBottom: formattingSettings.ToggleSwitch;
    public positionLeft: formattingSettings.ToggleSwitch;
    public positionRight: formattingSettings.ToggleSwitch;
    public color: formattingSettings.ColorPicker;
    public width: formattingSettings.NumUpDown;

    constructor(sectionName: string, displayName: string) {
        super();
        this.name = sectionName;
        this.displayName = displayName;

        this.positionTop = new formattingSettings.ToggleSwitch({
            name: `${sectionName}_top`,
            displayName: 'Top',
            value: false
        });
        this.positionBottom = new formattingSettings.ToggleSwitch({
            name: `${sectionName}_bottom`,
            displayName: 'Bottom',
            value: false
        });
        this.positionLeft = new formattingSettings.ToggleSwitch({
            name: `${sectionName}_left`,
            displayName: 'Left',
            value: false
        });
        this.positionRight = new formattingSettings.ToggleSwitch({
            name: `${sectionName}_right`,
            displayName: 'Right',
            value: false
        });
        this.color = new formattingSettings.ColorPicker({
            name: `${sectionName}_color`,
            displayName: 'Color',
            value: { value: DEFAULT_BACKGROUND_COLOR }
        });
        this.width = new formattingSettings.NumUpDown({
            name: `${sectionName}_width`,
            displayName: 'Width',
            value: 1,
            options: {
                minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
                maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 10 },
                step: 1
            } as INumUpDownOptions
        });
        this.slices = [
            this.positionTop,
            this.positionBottom,
            this.positionLeft,
            this.positionRight,
            this.color,
            this.width
        ];
    }
}

// Карточка Border
class BordersCard extends formattingSettings.CompositeCard {
    public allGroup: BorderSectionCard;
    public columnHeaderGroup: BorderSectionCard;
    public rowHeaderGroup: BorderSectionCard;
    public valuesGroup: BorderSectionCard;

    public groups: formattingSettings.Cards[];
    public name = 'borders';
    public displayName = 'Borders';

    constructor() {
        super();
        this.allGroup = new BorderSectionCard('all', 'All');
        this.columnHeaderGroup = new BorderSectionCard('columnHeader', 'Column header');
        this.rowHeaderGroup = new BorderSectionCard('rowHeader', 'Row header');
        this.valuesGroup = new BorderSectionCard('values', 'Values section');
        this.groups = [this.allGroup, this.columnHeaderGroup, this.rowHeaderGroup, this.valuesGroup];
    }
}

// Values
class ValuesGroup extends formattingSettings.SimpleCard {
    public font = new formattingSettings.FontControl({
        name: 'font',
        displayName: 'Font',
        fontFamily: new formattingSettings.FontPicker({
            name: 'fontFamily',
            value: DEFAULT_FONT_FAMILY
        }),
        fontSize: new formattingSettings.NumUpDown({
            name: 'fontSize',
            value: 9,
            options: {
                minValue: { type: powerbi.visuals.ValidatorType.Min, value: 8 },
                maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 72 },
                step: 1
            } as INumUpDownOptions
        }),
        bold: new formattingSettings.ToggleSwitch({ name: 'bold', value: false }),
        italic: new formattingSettings.ToggleSwitch({ name: 'italic', value: false }),
        underline: new formattingSettings.ToggleSwitch({ name: 'underline', value: false })
    });
    public textColor = new formattingSettings.ColorPicker({
        name: 'textColor',
        displayName: 'Text color',
        value: { value: DEFAULT_TEXT_COLOR }
    });
    public backgroundColor = new formattingSettings.ColorPicker({
        name: 'backgroundColor',
        displayName: 'Background color',
        value: { value: DEFAULT_BACKGROUND_COLOR }
    });
    public altTextColor = new formattingSettings.ColorPicker({
        name: 'altTextColor',
        displayName: 'Alternate text color',
        value: { value: DEFAULT_TEXT_COLOR }
    });
    public altBackgroundColor = new formattingSettings.ColorPicker({
        name: 'altBackgroundColor',
        displayName: 'Alternate background color',
        value: { value: DEFAULT_BACKGROUND_COLOR }
    });

    public name = 'valuesGroup';
    public displayName = 'Values';
    public slices = [this.font, this.textColor, this.backgroundColor, this.altTextColor, this.altBackgroundColor];
}

class ValuesCard extends formattingSettings.CompositeCard {
    public valuesGroup = new ValuesGroup();
    public groups = [this.valuesGroup];
    public name = 'values';
    public displayName = 'Values';
}

class ColumnHeadersGroup extends formattingSettings.SimpleCard {
    public font = new formattingSettings.FontControl({
        name: 'font',
        displayName: 'Font',
        fontFamily: new formattingSettings.FontPicker({
            name: 'fontFamily',
            value: DEFAULT_FONT_FAMILY
        }),
        fontSize: new formattingSettings.NumUpDown({
            name: 'fontSize',
            value: 9,
            options: {
                minValue: { type: powerbi.visuals.ValidatorType.Min, value: 8 },
                maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 72 },
                step: 1
            } as INumUpDownOptions
        }),
        bold: new formattingSettings.ToggleSwitch({ name: 'bold', value: true }),
        italic: new formattingSettings.ToggleSwitch({ name: 'italic', value: false }),
        underline: new formattingSettings.ToggleSwitch({ name: 'underline', value: false })
    });
    public textColor = new formattingSettings.ColorPicker({
        name: 'textColor',
        displayName: 'Text color',
        value: { value: DEFAULT_TEXT_COLOR }
    });
    public backgroundColor = new formattingSettings.ColorPicker({
        name: 'backgroundColor',
        displayName: 'Background color',
        value: { value: DEFAULT_BACKGROUND_COLOR }
    });
    public headerAlignment = new formattingSettings.AlignmentGroup({
        name: 'headerAlignment',
        displayName: 'Header alignment',
        value: 'left',
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal
    });
    public titleAlignment = new formattingSettings.AlignmentGroup({
        name: 'titleAlignment',
        displayName: 'Title alignment',
        value: 'left',
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal
    });
    public name = 'columnHeadersGroup';
    public displayName = 'Text';
    public slices = [this.font, this.textColor, this.backgroundColor, this.headerAlignment, this.titleAlignment];
}

class ColumnHeadersRowHider extends formattingSettings.SimpleCard {
    public hideTechRowLabel = new formattingSettings.ToggleSwitch({
        name: 'hideTechRowLabel',
        displayName: 'Hide tech row',
        value: false
    });
    public name = 'hideTechRow';
    public displayName = 'Hide tech row';
    public slices = [this.hideTechRowLabel];
}

class ColumnHeadersCard extends formattingSettings.CompositeCard {
    public columnHeadersGroup = new ColumnHeadersGroup();
    public hideTechRowCard = new ColumnHeadersRowHider();
    public groups = [this.columnHeadersGroup, this.hideTechRowCard];
    public name = 'columnHeaders';
    public displayName = 'Column Headers';
}

class RowHeadersGroup extends formattingSettings.SimpleCard {
    public font = new formattingSettings.FontControl({
        name: 'font',
        displayName: 'Font',
        fontFamily: new formattingSettings.FontPicker({
            name: 'fontFamily',
            value: DEFAULT_FONT_FAMILY
        }),
        fontSize: new formattingSettings.NumUpDown({
            name: 'fontSize',
            value: 9,
            options: {
                minValue: { type: powerbi.visuals.ValidatorType.Min, value: 8 },
                maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 72 },
                step: 1
            } as INumUpDownOptions
        }),
        bold: new formattingSettings.ToggleSwitch({ name: 'bold', value: true }),
        italic: new formattingSettings.ToggleSwitch({ name: 'italic', value: false }),
        underline: new formattingSettings.ToggleSwitch({ name: 'underline', value: false })
    });

    public textColor = new formattingSettings.ColorPicker({
        name: 'textColor',
        displayName: 'Text color',
        value: { value: DEFAULT_TEXT_COLOR }
    });
    public backgroundColor = new formattingSettings.ColorPicker({
        name: 'backgroundColor',
        displayName: 'Background color',
        value: { value: DEFAULT_BACKGROUND_COLOR }
    });
    public brandedRowColor = new formattingSettings.ToggleSwitch({
        name: 'brandedRowColor',
        displayName: 'Branded row color',
        value: true
    });
    public textAlignment = new formattingSettings.AlignmentGroup({
        name: 'textAlignment',
        displayName: 'Alignment',
        value: 'left',
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal
    });
    public name = 'rowHeadersGroup';
    public displayName = 'Text';
    public slices = [this.font, this.textColor, this.backgroundColor, this.brandedRowColor, this.textAlignment];
}

class RowHeadersCard extends formattingSettings.CompositeCard {
    public rowHeadersGroup = new RowHeadersGroup();
    public groups = [this.rowHeadersGroup];
    public name = 'rowHeaders';
    public displayName = 'Row Headers';
}

class ColumnGrandTotalGroup extends formattingSettings.SimpleCard {
    public font = new formattingSettings.FontControl({
        name: 'font',
        displayName: 'Font',
        fontFamily: new formattingSettings.FontPicker({
            name: 'fontFamily',
            value: 'Segoe UI'
        }),
        fontSize: new formattingSettings.NumUpDown({
            name: 'fontSize',
            value: 9,
            options: {
                minValue: { type: powerbi.visuals.ValidatorType.Min, value: 8 },
                maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 72 },
                step: 1
            } as INumUpDownOptions
        }),
        bold: new formattingSettings.ToggleSwitch({ name: 'bold', value: true }),
        italic: new formattingSettings.ToggleSwitch({ name: 'italic', value: false }),
        underline: new formattingSettings.ToggleSwitch({ name: 'underline', value: false })
    });
    public textColor = new formattingSettings.ColorPicker({
        name: 'textColor',
        displayName: 'Text color',
        value: { value: DEFAULT_TEXT_COLOR }
    });
    public backgroundColor = new formattingSettings.ColorPicker({
        name: 'backgroundColor',
        displayName: 'Background color',
        value: { value: DEFAULT_BACKGROUND_COLOR }
    });
    public applyToLabels = new formattingSettings.ToggleSwitch({
        name: 'applyToLabels',
        displayName: 'Apply to labels',
        value: false
    });
    public name = 'columnGrandTotalGroup';
    public displayName = 'Values';
    public slices = [this.font, this.textColor, this.backgroundColor, this.applyToLabels];
}

class ColumnGrandTotalCard extends formattingSettings.CompositeCard {
    public columnGrandTotalGroup = new ColumnGrandTotalGroup();
    public groups = [this.columnGrandTotalGroup];
    public name = 'columnGrandTotal';
    public displayName = 'Column grand total';
}

class RowGrandTotalGroup extends formattingSettings.SimpleCard {
    public font = new formattingSettings.FontControl({
        name: 'font',
        displayName: 'Font',
        fontFamily: new formattingSettings.FontPicker({
            name: 'fontFamily',
            value: DEFAULT_FONT_FAMILY
        }),
        fontSize: new formattingSettings.NumUpDown({
            name: 'fontSize',
            value: 9,
            options: {
                minValue: { type: powerbi.visuals.ValidatorType.Min, value: 8 },
                maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 72 },
                step: 1
            } as INumUpDownOptions
        }),
        bold: new formattingSettings.ToggleSwitch({ name: 'bold', value: true }),
        italic: new formattingSettings.ToggleSwitch({ name: 'italic', value: false }),
        underline: new formattingSettings.ToggleSwitch({ name: 'underline', value: false })
    });
    public textColor = new formattingSettings.ColorPicker({
        name: 'textColor',
        displayName: 'Text color',
        value: { value: DEFAULT_TEXT_COLOR }
    });
    public backgroundColor = new formattingSettings.ColorPicker({
        name: 'backgroundColor',
        displayName: 'Background color',
        value: { value: DEFAULT_BACKGROUND_COLOR }
    });
    public applyToLabels = new formattingSettings.ToggleSwitch({
        name: 'applyToLabels',
        displayName: 'Apply to labels',
        value: false
    });
    public name = 'rowGrandTotalGroup';
    public displayName = 'Values';
    public slices = [this.font, this.textColor, this.backgroundColor, this.applyToLabels];
}

class RowGrandTotalCard extends formattingSettings.CompositeCard {
    public rowGrandTotalGroup = new RowGrandTotalGroup();
    public groups = [this.rowGrandTotalGroup];
    public name = 'rowGrandTotal';
    public displayName = 'Row grand total';
}

export class MeasureCard extends formattingSettings.SimpleCard {
    // Header
    public headerTextColor: formattingSettings.ColorPicker;
    public headerBackgroundColor: formattingSettings.ColorPicker;
    public headerAlignment: formattingSettings.AlignmentGroup;
    // Total
    public totalTextColor: formattingSettings.ColorPicker;
    public totalBackgroundColor: formattingSettings.ColorPicker;
    public totalAlignment: formattingSettings.AlignmentGroup;
    // Values
    public valuesTextColor: formattingSettings.ColorPicker;
    public valuesBackgroundColor: formattingSettings.ColorPicker;
    public valuesAlignment: formattingSettings.AlignmentGroup;

    constructor(measureName: string, displayName: string) {
        super();
        this.name = measureName;        // 'measure_0'
        this.displayName = displayName; // '#, Quantity sold'
        const prefix = measureName;     // 'measure_0'

        // Header
        this.headerTextColor = new formattingSettings.ColorPicker({
            name: `${prefix}_header_textColor`,
            displayName: 'Header Text color',
            value: { value: DEFAULT_TEXT_COLOR }
        });
        this.headerBackgroundColor = new formattingSettings.ColorPicker({
            name: `${prefix}_header_backgroundColor`,
            displayName: 'Header Background color',
            value: { value: DEFAULT_BACKGROUND_COLOR }
        });
        this.headerAlignment = new formattingSettings.AlignmentGroup({
            name: `${prefix}_header_alignment`,
            displayName: 'Header Alignment',
            value: '', // left
            mode: powerbi.visuals.AlignmentGroupMode.Horizonal
        });

        // Total
        this.totalTextColor = new formattingSettings.ColorPicker({
            name: `${prefix}_total_textColor`,
            displayName: 'Total Text color',
            value: { value: DEFAULT_TEXT_COLOR }
        });
        this.totalBackgroundColor = new formattingSettings.ColorPicker({
            name: `${prefix}_total_backgroundColor`,
            displayName: 'Total Background color',
            value: { value: DEFAULT_BACKGROUND_COLOR }
        });
        this.totalAlignment = new formattingSettings.AlignmentGroup({
            name: `${prefix}_total_alignment`,
            displayName: 'Total Alignment',
            value: '', // left
            mode: powerbi.visuals.AlignmentGroupMode.Horizonal
        });

        // Values
        this.valuesTextColor = new formattingSettings.ColorPicker({
            name: `${prefix}_values_textColor`,
            displayName: 'Values Text color',
            value: { value: DEFAULT_TEXT_COLOR }
        });
        this.valuesBackgroundColor = new formattingSettings.ColorPicker({
            name: `${prefix}_values_backgroundColor`,
            displayName: 'Values Background color',
            value: { value: DEFAULT_BACKGROUND_COLOR }
        });
        this.valuesAlignment = new formattingSettings.AlignmentGroup({
            name: `${prefix}_values_alignment`,
            displayName: 'Values Alignment',
            value: '', // left
            mode: powerbi.visuals.AlignmentGroupMode.Horizonal
        });

        // All slices
        this.slices = [
            this.headerTextColor,
            this.headerBackgroundColor,
            this.headerAlignment,
            this.valuesTextColor,
            this.valuesBackgroundColor,
            this.valuesAlignment,
            this.totalTextColor,
            this.totalBackgroundColor,
            this.totalAlignment
        ];
    }
}

class SpecificColumnCard extends formattingSettings.CompositeCard {
    public groups: formattingSettings.Cards[];
    public name = 'specificColumn';
    public displayName = 'Specific column';

    constructor() {
        super();
        const groups: MeasureCard[] = [];
        for (let i = 0; i < 30; i++) {
            groups.push(new MeasureCard(`measure_${i}`, `Measure ${i + 1}`));
        }
        this.groups = groups;
    }

    public updateGroups(measureNames: string[]): void {
        const groups = this.groups as MeasureCard[];
        // Сначала скрыть все карточки
        for (let i = 0; i < groups.length; i++) {
            groups[i].visible = false;
        }
        // Затем показать и переименовать только те, которые соответствуют реальным мерам
        for (let i = 0; i < measureNames.length && i < groups.length; i++) {
            groups[i].visible = true;
            groups[i].displayName = measureNames[i];
        }
    }
}

export class ColumnWidthCard extends formattingSettings.SimpleCard {
    public name = 'columnWidth';
    public displayName = 'Column Width';
    public slices: formattingSettings.Slice[] = [];

    private rowHeaderWidth: formattingSettings.NumUpDown;
    private measureWidths: formattingSettings.NumUpDown[] = [];

    constructor() {
        super();
        this.rowHeaderWidth = new formattingSettings.NumUpDown({
            name: 'rowHeader_width',
            displayName: 'Row header width',
            value: 300,
            options: {
                minValue: { type: powerbi.visuals.ValidatorType.Min, value: 50 },
                maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 500 },
                step: 5
            } as INumUpDownOptions
        });
        this.slices.push(this.rowHeaderWidth);

        for (let i = 0; i < 30; i++) {
            const widthSlice = new formattingSettings.NumUpDown({
                name: `measure_${i}_width`,
                displayName: `Measure ${i + 1} width`,
                value: 120,
                options: {
                    minValue: { type: powerbi.visuals.ValidatorType.Min, value: 50 },
                    maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 500 },
                    step: 5
                } as INumUpDownOptions
            });
            this.measureWidths.push(widthSlice);
            this.slices.push(widthSlice);
        }
    }

    public updateMeasureWidths(measureNames: string[]): void {
        for (let i = 0; i < this.measureWidths.length; i++) {
            if (i < measureNames.length) {
                // Используемые меры: показываем и обновляем имя
                this.measureWidths[i].displayName = `${measureNames[i]} width`;
                this.measureWidths[i].visible = true;
            } else {
                // Неиспользуемые меры: скрываем
                this.measureWidths[i].visible = false;
            }
        }
        // Пересобираем slices, чтобы скрытые срезы не отображались
        this.slices = [this.rowHeaderWidth, ...this.measureWidths];
    }

    public getRowHeaderWidth(): number {
        return this.rowHeaderWidth.value;
    }

    public getMeasureWidth(measureIndex: number): number {
        if (measureIndex < this.measureWidths.length) {
            return this.measureWidths[measureIndex].value;
        }
        return 120;
    }
}

// --- Основная модель ---
export class VisualSettings extends formattingSettings.Model {
    public subTotals = new SubtotalsCard();
    public hideEmptyCols = new HideEmptyColsCard();
    public grid = new GridCard();
    public borders = new BordersCard();
    public values = new ValuesCard();
    public columnHeaders = new ColumnHeadersCard();
    public rowHeaders = new RowHeadersCard();
    public columnGrandTotal = new ColumnGrandTotalCard();
    public rowGrandTotal = new RowGrandTotalCard();
    public specificColumn = new SpecificColumnCard();
    public columnWidth = new ColumnWidthCard();

    constructor() {
        super();
        this.cards = [
            this.subTotals,
            this.hideEmptyCols,
            this.grid,
            this.borders,
            this.values,
            this.columnHeaders,
            this.rowHeaders,
            this.columnGrandTotal,
            this.rowGrandTotal,
            this.specificColumn,
            this.columnWidth
        ];
    }
}
