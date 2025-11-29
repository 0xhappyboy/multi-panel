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
    style?: React.CSSProperties;
}

export class Panel extends React.Component<PanelProps> {
    render() {
        const { children, style, minSize = 50 } = this.props;
        return (
            <div style={{
                width: '100%',
                height: '100%',
                minWidth: `${minSize}px`,
                minHeight: `${minSize}px`,
                overflow: 'auto',
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

    componentDidUpdate(prevProps: MultiPanelProps) {
        if (prevProps.children !== this.props.children) {
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

    initializePaneSizes = () => {
        const children = React.Children.toArray(this.props.children);
        const { initialSizes } = this.props;
        let paneSizes: number[];
        if (initialSizes && initialSizes.length === children.length) {
            paneSizes = [...initialSizes];
        } else {
            const equalSize = 100 / children.length;
            paneSizes = Array(children.length).fill(equalSize);
        }
        this.setState({ paneSizes });
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
        const { direction = 'horizontal', minSize = 50 } = this.props;
        if (activeSplitter === null || !this.containerRef.current) return;
        const currentPosition = this.getClientPosition(e);
        const delta = currentPosition - this.state.startPosition;
        const containerSize = direction === 'horizontal'
            ? this.containerRef.current.offsetWidth
            : this.containerRef.current.offsetHeight;
        const deltaPercent = (delta / containerSize) * 100;
        const newSizes = [...startSizes];
        const leftPaneIndex = activeSplitter;
        const rightPaneIndex = activeSplitter + 1;
        const newLeftSize = startSizes[leftPaneIndex] + deltaPercent;
        const newRightSize = startSizes[rightPaneIndex] - deltaPercent;
        const minSizePercent = (minSize / containerSize) * 100;
        if (newLeftSize >= minSizePercent && newRightSize >= minSizePercent) {
            newSizes[leftPaneIndex] = newLeftSize;
            newSizes[rightPaneIndex] = newRightSize;
            this.setState({ paneSizes: newSizes });
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

    render() {
        const { direction = 'horizontal', splitterSize = 2, children } = this.props;
        const { isDragging, paneSizes } = this.state;
        const childrenArray = React.Children.toArray(children);
        const containerStyle: React.CSSProperties = {
            display: 'flex',
            width: '100%',
            height: '100%',
            flexDirection: direction === 'horizontal' ? 'row' : 'column',
            position: 'relative',
            overflow: 'hidden'
        };
        const theme = this.getTheme();

        if (paneSizes.length === 0 || paneSizes.length !== childrenArray.length) {
            return <div ref={this.containerRef} style={containerStyle}>Loading...</div>;
        }

        return (
            <div ref={this.containerRef} style={containerStyle}>
                {childrenArray.map((child, index) => (
                    <React.Fragment key={index}>
                        <div
                            style={{
                                [direction === 'horizontal' ? 'width' : 'height']: `${paneSizes[index]}%`,
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
                                    backgroundColor: theme.splitterColor,
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