import React from 'react';

export interface MultiPanelTheme {
    splitterColor: string;
    splitterHoverColor: string;
    splitterActiveColor: string;
}

const MultiPanelThemes = {
    light: {
        splitterColor: '#e8e8e8',
        splitterHoverColor: '#d9d9d9',
        splitterActiveColor: '#e8e8e8'
    } as MultiPanelTheme,
    dark: {
        splitterColor: '#434343',
        splitterHoverColor: '#595959',
        splitterActiveColor: '#434343'
    } as MultiPanelTheme
};

export interface PanelProps {
    children?: React.ReactNode;
    minSize?: number;
    defaultSize?: number;
    style?: React.CSSProperties;
}

export class Panel extends React.Component<PanelProps> {
    render() {
        const { children, style } = this.props;
        return (
            <div style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                ...style
            }}>
                {children}
            </div>
        );
    }
}

export interface MultiPanelProps {
    direction?: 'horizontal' | 'vertical';
    initialSizes?: number[]; 
    minSize?: number; 
    splitterSize?: number;
    children?: React.ReactNode;
    theme?: 'light' | 'dark' | MultiPanelTheme;
    onPaneSizesChange?: (sizes: number[]) => void;
    style?: React.CSSProperties; 
}

interface MultiPanelState {
    isDragging: boolean;
    activeSplitter: number | null;
    startPosition: number;
    startSizes: number[]; 
    paneSizes: number[];  
}

export class MultiPanel extends React.Component<MultiPanelProps, MultiPanelState> {
    private containerRef: React.RefObject<HTMLDivElement | null>;

    constructor(props: MultiPanelProps) {
        super(props);
        this.state = {
            isDragging: false,
            activeSplitter: null,
            startPosition: 0,
            startSizes: [],
            paneSizes: []
        };
        this.containerRef = React.createRef<HTMLDivElement | null>();
    }

    componentDidMount() {
        this.initializePaneSizes();
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    componentDidUpdate(prevProps: MultiPanelProps, prevState: MultiPanelState) {
        if (prevProps.children !== this.props.children) {
            this.initializePaneSizes();
        }

        if (prevProps.style !== this.props.style) {
            this.initializePaneSizes();
        }
    }

    getTheme = (): MultiPanelTheme => {
        const { theme = 'light' } = this.props;
        if (typeof theme === 'string') {
            return MultiPanelThemes[theme] || MultiPanelThemes.light;
        }
        return theme;
    }

    getPaneMinSizePercent = (index: number): number => {
        const children = React.Children.toArray(this.props.children);
        const child = children[index] as React.ReactElement;
        if (child && child.type === Panel) {
            return (child.props as PanelProps).minSize || 10; 
        }
        return this.props.minSize || 10; 
    }

    getPaneDefaultSizePercent = (index: number): number | undefined => {
        const children = React.Children.toArray(this.props.children);
        const child = children[index] as React.ReactElement;
        if (child && child.type === Panel) {
            return (child.props as PanelProps).defaultSize;
        }
        return undefined;
    }

    getPaneMinSizePixels = (index: number): number => {
        if (!this.containerRef.current) return 0;
        const containerSize = this.props.direction === 'horizontal'
            ? this.containerRef.current.offsetWidth
            : this.containerRef.current.offsetHeight;
        const minPercent = this.getPaneMinSizePercent(index);
        return (containerSize * minPercent) / 100;
    }

    initializePaneSizes = () => {
        const children = React.Children.toArray(this.props.children);
        const { initialSizes } = this.props;
        if (!this.containerRef.current) {
            setTimeout(this.initializePaneSizes, 50);
            return;
        }
        const containerSize = this.props.direction === 'horizontal'
            ? this.containerRef.current.offsetWidth
            : this.containerRef.current.offsetHeight;
        let paneSizes: number[];
        if (initialSizes && initialSizes.length === children.length) {
            paneSizes = [...initialSizes];
        } else {
            const defaultSizesPercent = children.map((_, index) =>
                this.getPaneDefaultSizePercent(index)
            );
            const hasDefaultSizes = defaultSizesPercent.some(size => size !== undefined);
            if (hasDefaultSizes) {
                const definedSizesSum = defaultSizesPercent
                    .filter(size => size !== undefined)
                    .reduce((sum: number, size) => sum + (size || 0), 0);
                const undefinedCount = defaultSizesPercent.filter(size => size === undefined).length;
                const remainingPercent = 100 - definedSizesSum;
                const equalSizeForUndefined = undefinedCount > 0 ? remainingPercent / undefinedCount : 0;
                const percentSizes = defaultSizesPercent.map((size, index) => {
                    if (size !== undefined) {
                        return size;
                    } else {
                        return equalSizeForUndefined;
                    }
                });
                paneSizes = percentSizes.map(percent => (containerSize * percent) / 100);
            } else {
                const equalSize = containerSize / children.length;
                paneSizes = Array(children.length).fill(equalSize);
            }
        }
        this.setState({ paneSizes }, () => {
            this.triggerPaneSizesChange();
        });
    }

    triggerPaneSizesChange = () => {
        const { onPaneSizesChange } = this.props;
        const { paneSizes } = this.state;
        if (onPaneSizesChange && paneSizes.length > 0) {
            onPaneSizesChange(paneSizes);
        }
    }

    handleMouseDown = (index: number, e: React.MouseEvent) => {
        e.preventDefault();
        const { paneSizes } = this.state;
        this.setState({
            isDragging: true,
            activeSplitter: index,
            startPosition: this.getClientPosition(e),
            startSizes: [...paneSizes]
        });
    }

    handleMouseMove = (e: MouseEvent) => {
        if (!this.state.isDragging) return;
        const { activeSplitter, startSizes } = this.state;
        const { direction = 'horizontal', onPaneSizesChange } = this.props;
        if (activeSplitter === null || !this.containerRef.current) return;
        const currentPosition = this.getClientPosition(e);
        const delta = currentPosition - this.state.startPosition;
        const newSizes = [...startSizes];
        const leftPaneIndex = activeSplitter;
        const rightPaneIndex = activeSplitter + 1;
        const newLeftSize = startSizes[leftPaneIndex] + delta;
        const newRightSize = startSizes[rightPaneIndex] - delta;
        const leftMinSize = this.getPaneMinSizePixels(leftPaneIndex);
        const rightMinSize = this.getPaneMinSizePixels(rightPaneIndex);
        if (newLeftSize >= leftMinSize && newRightSize >= rightMinSize) {
            newSizes[leftPaneIndex] = newLeftSize;
            newSizes[rightPaneIndex] = newRightSize;
            this.setState({ paneSizes: newSizes });
            if (onPaneSizesChange) {
                onPaneSizesChange(newSizes);
            }
        }
    }

    handleMouseUp = () => {
        this.setState({
            isDragging: false,
            activeSplitter: null,
            startPosition: 0,
            startSizes: []
        });
    }

    getClientPosition = (e: MouseEvent | React.MouseEvent): number => {
        const { direction = 'horizontal' } = this.props;
        return direction === 'horizontal' ? e.clientX : e.clientY;
    }

    setPaneSizes = (sizes: number[]) => {
        const children = React.Children.toArray(this.props.children);
        if (sizes.length === children.length) {
            this.setState({ paneSizes: sizes }, () => {
                this.triggerPaneSizesChange();
            });
        }
    }

    getPaneSizes = (): number[] => {
        return [...this.state.paneSizes];
    }

    getPaneSizesPercent = (): number[] => {
        if (!this.containerRef.current || this.state.paneSizes.length === 0) {
            return [];
        }
        const containerSize = this.props.direction === 'horizontal'
            ? this.containerRef.current.offsetWidth
            : this.containerRef.current.offsetHeight;
        return this.state.paneSizes.map(size => (size / containerSize) * 100);
    }

    render() {
        const { direction = 'horizontal', splitterSize = 2, children, style } = this.props;
        const { isDragging, paneSizes } = this.state;
        const childrenArray = React.Children.toArray(children);
        const baseContainerStyle: React.CSSProperties = {
            display: 'flex',
            width: '100%',
            height: '100%',
            flexDirection: direction === 'horizontal' ? 'row' : 'column',
            position: 'relative',
            overflow: 'hidden'
        };
        const containerStyle: React.CSSProperties = {
            ...baseContainerStyle,
            ...style
        };
        if (!this.containerRef.current) {
            return (
                <div
                    ref={this.containerRef}
                    style={containerStyle}
                >
                    {childrenArray.map((child, index) => (
                        <div key={index} style={{ flex: 1, overflow: 'hidden' }}>
                            {child}
                        </div>
                    ))}
                </div>
            );
        }
        const theme = this.getTheme();
        if (paneSizes.length === 0 || paneSizes.length !== childrenArray.length) {
            return (
                <div
                    ref={this.containerRef}
                    style={containerStyle}
                >
                    Loading...
                </div>
            );
        }
        return (
            <div
                ref={this.containerRef}
                style={containerStyle}
            >
                {childrenArray.map((child, index) => (
                    <React.Fragment key={index}>
                        <div
                            style={{
                                [direction === 'horizontal' ? 'width' : 'height']: `${paneSizes[index]}px`,
                                overflow: 'hidden',
                                flexShrink: 0,
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column'
                            } as React.CSSProperties}
                        >
                            {child}
                        </div>
                        {index < childrenArray.length - 1 && (
                            <div
                                style={{
                                    [direction === 'horizontal' ? 'width' : 'height']: `${splitterSize}px`,
                                    cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
                                    backgroundColor: isDragging ? theme.splitterActiveColor : theme.splitterColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    flexShrink: 0,
                                    userSelect: 'none',
                                    zIndex: 1
                                } as React.CSSProperties}
                                onMouseDown={(e) => this.handleMouseDown(index, e)}
                                onMouseEnter={(e) => {
                                    if (!isDragging) {
                                        e.currentTarget.style.backgroundColor = theme.splitterHoverColor;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isDragging) {
                                        e.currentTarget.style.backgroundColor = theme.splitterColor;
                                    }
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    }
}

export { MultiPanelThemes };