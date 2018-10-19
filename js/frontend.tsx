import * as $ from "jquery";
import "./OrbitControls.js";
import PatchHeightMap, {EnhanceStrategy} from "./PatchHeightMap";
import * as React from "react";
// @ts-ignore
import {Arwes, Button, createSounds, createTheme, Footer, Frame, Header, SoundsProvider, ThemeProvider, Appear, Link, Words, Logo, Image} from "arwes";
import injectSheet from "react-jss";
import ReactDOM = require("react-dom");
import {GithubCircleIcon} from 'mdi-react';


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
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    header: {
        padding: [5, 20]
    },
    headerTitle: {
        display: 'inline-block',
        margin: 0,
        textShadow: '0 0 4px rgba(172,249,251,0.65)'
    },
    logo: {
        position: 'relative',
        top: 4,
        height: '1em',
        width: '1em',
        marginRight: 5
    },
    headerControls: {
        display: 'inline-block',
        float: 'right',
        marginTop: 10
    },
    content: {
        margin: 20,
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
    renderer: {
        padding: 2,
        width: '100%',
        height: '100%'
    },
    footer: {
        padding: [0, 20]
    },
    credits: {
        float: 'right',
        margin: [10, 0],
        verticalAlign: 'center',

        '@global': {
            'a': {
                height: '1em',
                color: 'white',
                textDecoration: 'none',
                margin: [0, 10]
            },
            'svg': {
                position: 'relative',
                marginRight: 5,
                top: 5
            }
        }
    },
    arwesLogo: {
        width: 24,
        height: 24,
        top: '-1px !important'
    }
};

class CHeightGUI extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            strategy: EnhanceStrategy.RESOLUTION_BOUND,
            framed: false
        }
    }

    private switchStrategy(strategy: EnhanceStrategy) {
        this.setState({
            strategy: strategy
        });
    }

    public render() {
        const { classes } = this.props;
        const { strategy, framed } = this.state;

        return (
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
                        <Header className={classes.header}
                                animate
                                show={anim.entered}
                                animation={{
                                    onEntered: () => this.setState({ framed: true }),
                                    timeout: 500
                                }}>
                            <h1 className={classes.headerTitle}>
                                <img className={classes.logo} src={'/static/img/logo.png'} />
                                <Words animate>CHeight</Words>
                            </h1>
                            <div className={classes.headerControls}>
                                <Button animate onClick={(e: any) => {this.switchStrategy(EnhanceStrategy.FIFO)}} active={strategy == EnhanceStrategy.FIFO}>Auto</Button>
                                <Button animate onClick={(e: any) => {this.switchStrategy(EnhanceStrategy.EDGE)}} active={strategy == EnhanceStrategy.EDGE}>Edge</Button>
                                <Button animate onClick={(e: any) => {this.switchStrategy(EnhanceStrategy.MANUAL)}} active={strategy == EnhanceStrategy.MANUAL || strategy == EnhanceStrategy.RESOLUTION_BOUND}>Stop</Button>
                            </div>
                        </Header>
                        <Frame className={classes.content} animate show={framed} level={1} corners={3}>
                            {(anim2: any) => (
                              <Appear animate show={anim2.entered}>
                                <CHeightRender strategy={this.state.strategy} />
                              </Appear>
                            )}
                        </Frame>
                        <Footer className={classes.footer} animate show={anim.entered}>
                            <div className={classes.credits}>
                                <Link className='mdi mdi-github-circle' href='https://github.com/shylux/CHeightAPI'>
                                    <GithubCircleIcon />
                                    <Words animate>Source</Words>
                                </Link>
                                <Link href='https://arwesjs.org'>
                                    <Logo className={classes.arwesLogo} animate />
                                    <Words animate>Arwes</Words>
                                </Link>
                            </div>
                        </Footer>
                    </div>
                )}
            </Arwes>
        )
    }
}

// @ts-ignore
@injectSheet(styles)
class CHeightRender extends React.Component<any, any> {
    private map: PatchHeightMap;

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
            <div className={classes.renderer} />
        )
    }
}


function main() {
    const GUI = injectSheet(styles)(CHeightGUI);

    ReactDOM.render(<ThemeProvider theme={createTheme()}><SoundsProvider sounds={sounds}><GUI /></SoundsProvider></ThemeProvider>, document.querySelector('#container'));
}