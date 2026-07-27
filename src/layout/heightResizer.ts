'use strict';

export class HeightResizer {
    private container: HTMLElement;
    private handle: HTMLElement | null = null;
    private isResizing: boolean = false;
    private startY: number = 0;
    private startHeight: number = 0;
    private readonly minHeight: number = 100;
    private onResizeCallback: ((height: number) => void) | null = null;

    constructor(container: HTMLElement, onResize?: (height: number) => void) {
        this.container = container;
        this.onResizeCallback = onResize || null;
        this.init();
    }

    public init(): void {
        if (getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }

        this.handle = document.createElement('div');
        this.handle.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 8px;
            cursor: ns-resize;
            background-color: transparent;
            z-index: 10000;
            pointer-events: auto;
        `;

        this.container.appendChild(this.handle);

        this.handle.addEventListener('mousedown', this.onPointerDown);
        document.addEventListener('mousemove', this.onPointerMove);
        document.addEventListener('mouseup', this.onPointerUp);

        this.handle.addEventListener('touchstart', this.onPointerDown, { passive: false });
        document.addEventListener('touchmove', this.onPointerMove, { passive: false });
        document.addEventListener('touchend', this.onPointerUp);
    }

    private onPointerDown = (e: MouseEvent | TouchEvent): void => {
        e.preventDefault();
        if (!this.container || !this.handle) return;

        this.isResizing = true;
        this.startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        this.startHeight = this.container.offsetHeight;

        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
    };

    private onPointerMove = (e: MouseEvent | TouchEvent): void => {
        if (!this.isResizing || !this.container) return;
        e.preventDefault();

        const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const diff = currentY - this.startY;
        const newHeight = Math.max(this.minHeight, this.startHeight + diff);

        this.container.style.height = `${newHeight}px`;

        if (this.onResizeCallback) {
            this.onResizeCallback(newHeight);
        }
    };

    private onPointerUp = (): void => {
        if (this.isResizing) {
            this.isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    };

    public destroy(): void {
        if (this.handle) {
            this.handle.removeEventListener('mousedown', this.onPointerDown);
            this.handle.removeEventListener('touchstart', this.onPointerDown);
            this.handle.remove();
            this.handle = null;
        }

        document.removeEventListener('mousemove', this.onPointerMove);
        document.removeEventListener('touchmove', this.onPointerMove);
        document.removeEventListener('mouseup', this.onPointerUp);
        document.removeEventListener('touchend', this.onPointerUp);

        this.container = null as any;
        this.onResizeCallback = null;
    }
}
