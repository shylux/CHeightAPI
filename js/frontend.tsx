import * as $ from "jquery";
import "./OrbitControls.js";
import PatchHeightMap, {EnhanceStrategy} from "./PatchHeightMap";
import * as React from "react";
// @ts-ignore
import {Arwes, Button, createSounds, createTheme, Footer, Frame, Header, SoundsProvider, ThemeProvider} from "arwes";
import injectSheet from "react-jss";
import ReactDOM = require("react-dom");


$(main);

const sounds = createSounds({
    shared: { volume: 1, },
    players: {
        ask: { sound: { src: ['./static/sound/ask.mp3'] }, settings: { oneAtATime: true } },
        click: { sound: { src: ['./static/sound/click.mp3'] } },
        typing: { sound: { src: ['./static/sound/typing.mp3'] }, settings: { oneAtATime: true } },
        deploy: { sound: { src: ['./static/sound/deploy.mp3'] }, settings: { oneAtATime: true } },
        error: { sound: { src: ['./static/sound/error.mp3'] }, settings: { oneAtATime: true } },
        information: { sound: { src: ['./static/sound/information.mp3'] }, settings: { oneAtATime: true } },
        warning: { sound: { src: ['./static/sound/warning.mp3'] }, settings: { oneAtATime: true } },
    }
});

const styles: any = {
    '@global': {
        '*': {
            fontFamily: 'Monaco, Terminal, monospace',
        },
        'html, body': {
            margin: 0,
            padding: 0,
            backgroundColor: '#000',
            overflow: 'hidden'
        }
    },
    'container': {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    'headerTitle': {
        display: 'inline',
        margin: 0,
        padding: [5, 20]
    },
    'headerControls': {
        display: 'inline'
    },
    'content': {
        margin: '20px',
        flexBasis: '100%',
        flexShrink: 1,

        '@global': {
            'div:last-child': {
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            }
        }
    },
    'renderer': {
        padding: '2px',
        width: '100%',
        height: '100%'
    }
};

class CHeightGUI extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            strategy: EnhanceStrategy.RESOLUTION_BOUND
        }
    }

    private switchStrategy(strategy: EnhanceStrategy) {
        this.setState({
            strategy: strategy
        });
    }

    public render() {
        const { classes } = this.props;

        return (
            <ThemeProvider theme={createTheme()}><SoundsProvider sounds={sounds}>
                <Arwes
                    animate
                    animation={{appear: false, timeout: 0}}
                    pattern='./static/img/glow.png'
                    background={{
                        small: '/static/img/Discovery_Luzern_Zurich-original2.jpg',
                        medium: '/static/img/Discovery_Luzern_Zurich-original2.jpg',
                        large: '/static/img/Discovery_Luzern_Zurich-original2.jpg',
                        xlarge: '/static/img/Discovery_Luzern_Zurich-original2.jpg'
                    }}>
                    {(anim: any) => (
                        <div className={classes.container}>
                            <Header animate show={anim.entered}>
                                <h1 className={classes.headerTitle}>CHeight</h1>
                                <div className={classes.headerControls}>
                                    <Button onClick={(e: any) => {this.switchStrategy(EnhanceStrategy.FIFO)}}>Auto</Button>
                                    <Button animate onClick={(e: any) => {this.switchStrategy(EnhanceStrategy.EDGE)}}>Edge</Button>
                                </div>
                            </Header>
                            <Frame className={classes.content} animate show={anim.entered} level={1} corners={3}>
                                <CHeightRender strategy={this.state.strategy}></CHeightRender>
                            </Frame>
                            <Footer animate show={anim.entered}>
                                <p>Arwes details</p>
                            </Footer>
                        </div>
                    )}
                </Arwes>
            </SoundsProvider></ThemeProvider>
        )
    }
}

// @ts-ignore
@injectSheet(styles)
class CHeightRender extends React.Component<any, any> {
    private map: PatchHeightMap;

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        let node = $(ReactDOM.findDOMNode(this) as any);
        if (!this.map) this.map = new PatchHeightMap(node)
    }

    componentWillReceiveProps(newProps: any) {
        if (this.map) this.map.setEnhanceStrategy(newProps.strategy);
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.renderer}></div>
        )
    }
}


function main() {
    const container = $('#container');

    const GUI = injectSheet(styles)(CHeightGUI);

    ReactDOM.render(<GUI />, document.querySelector('#container'));


    if (false) {
        const map = new PatchHeightMap(container);
    }
}