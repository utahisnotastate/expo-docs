/**
 * @flow
 */

import React from 'react';
import Link from 'gatsby-link';
import { withRouter } from 'react-router';
import { ScrollContainer } from 'react-router-scroll';
import MenuIcon from 'react-icons/lib/md/menu';
import presets from 'glamor-media-query-presets';
import Helmet from 'react-helmet';
import ArrowIcon from 'react-icons/lib/md/keyboard-arrow-down';

import logoText from '../images/logo-text.svg';
import SidebarContent from '../components/sidebar';
import Header from '../components/header';
import Button from '../components/button';
import typography from '../utils/typography';
import { replaceVersionInUrl, LATEST_VERSION } from '../utils/url';
const rhythm = typography.rhythm;
const scale = typography.scale;
import '../css/layout.css';
import '../css/prism-coy.css';
import '../css/algolia.css';

// Load our typefaces
import 'typeface-source-sans-pro';
import 'typeface-source-code-pro';

import unversioned from '../data/unversioned.yaml';
import v21 from '../data/v21.yaml';
import v20 from '../data/v20.yaml';
import v19 from '../data/v19.yaml';
import v18 from '../data/v18.yaml';
import v17 from '../data/v17.yaml';
import v16 from '../data/v16.yaml';
import v15 from '../data/v15.yaml';

const versions = [
  `latest`,
  `v21.0.0`,
  `v20.0.0`,
  `v19.0.0`,
  `v18.0.0`,
  `v17.0.0`,
  `v16.0.0`,
  `v15.0.0`,
];

if (typeof window === 'object' && window.GATSBY_ENV === 'development') {
  versions.push(`unversioned`);
}

// NOTE(brentvatne): super ugly hack because navbar depends on us adding
// padding to the entire document which then breaks the regular anchor
// behaviour
function offsetAnchor() {
  if (location.hash.length !== 0) {
    window.scrollTo(window.scrollX, window.scrollY - 70);
  }
}

class Wrapper extends React.Component {
  constructor(props) {
    super();
    let version = props.location.pathname.split(`/`)[2];
    if (!version || versions.indexOf(version) === -1) {
      version = versions[0];
    }
    this.state = {
      sidebarOpen: false,
      activeVersion: version,
      activeRoutes: this.getRoutes(version),
    };
  }

  componentDidMount() {
    // Create references to html/body elements
    this.htmlElement = document.querySelector('html');
    this.bodyElement = document.querySelector('body');

    // This will capture hash changes while on the page
    window.addEventListener('hashchange', offsetAnchor);
  }

  getRoutes = version => {
    let routes;
    let version_ = version === 'latest' ? LATEST_VERSION : version;
    switch (version_) {
      case 'unversioned':
        routes = unversioned;
        break;
      case 'v21.0.0':
        routes = v21;
        break;
      case 'v20.0.0':
        routes = v20;
        break;
      case 'v19.0.0':
        routes = v19;
        break;
      case 'v18.0.0':
        routes = v18;
        break;
      case 'v17.0.0':
        routes = v17;
        break;
      case 'v16.0.0':
        routes = v16;
        break;
      case 'v15.0.0':
        routes = v15;
        break;
      default:
        routes = v21;
    }

    if (version === 'latest') {
      let newRoutes = [];
      routes.forEach(section => {
        var newSection = {
          index: replaceVersionInUrl(section.index, 'latest'),
          title: section.title,
          links: {},
        };
        Object.keys(section.links).forEach(
          title =>
            (newSection.links[title] = replaceVersionInUrl(
              section.links[title],
              'latest'
            ))
        );
        newRoutes.push(newSection);
      });
      routes = newRoutes;
    }

    return routes;
  };

  setVersion = version => {
    this.setState({
      activeVersion: version,
      activeRoutes: this.getRoutes(version),
    });

    const newRoute = `/versions/${version}/index.html`;
    this.props.history.push(newRoute);
  };

  render() {
    // Freeze the background when the overlay is open.
    if (this.htmlElement && this.bodyElement) {
      if (this.state.sidebarOpen) {
        this.htmlElement.style.overflow = 'hidden';
        this.bodyElement.style.overflow = 'hidden';
      } else {
        this.htmlElement.style.overflow = 'visible';
        this.bodyElement.style.overflow = 'visible';
      }
    }

    const Overlay = props =>
      <div
        {...props}
        css={{
          position: 'absolute',
          width: '100%',
          height: 'calc(100% + 200px)', // Add a 200px off-screen white padding so momentum scrolling doesn't show underlying page
          top: '-200px',
          paddingTop: '200px',
          background: 'white',
          zIndex: '10000',
          overflowY: 'scroll',
          WebkitOverflowScrolling: 'touch',
          display: props.open ? 'block' : 'none',
        }}
      />;

    return (
      <div>
        <Helmet
          title={`Expo ${this.state.activeVersion} documentation`}
          titleTemplate={`%s | Expo ${this.state.activeVersion} documentation`}
        />

        <Overlay
          open={this.state.sidebarOpen}
          onChange={open => this.setState({ sidebarOpen: open })}>
          <SidebarContent
            id="mobile-sidebar"
            activeRoutes={this.state.activeRoutes}
            activeVersion={this.state.activeVersion}
            router={this.props.history}
            versions={versions}
            setVersion={this.setVersion}
            close={() => this.setState({ sidebarOpen: false })}
          />
        </Overlay>

        <Header
          activeVersion={this.state.activeVersion}
          versions={versions}
          router={this.props.history}
          setVersion={this.setVersion}
        />

        <ScrollContainer scrollKey={`main content`}>
          <div
            css={{
              height: `100%`,
              overflow: `auto`,
              margin: `0 auto`,
              maxWidth: 1440,
              padding: rhythm(3 / 4),
              display: this.state.sidebarOpen ? 'none' : 'block',
              paddingTop: rhythm(2), // extra padding for top navbar on mobile
              [presets.Tablet]: {
                padding: rhythm(1),
                paddingTop: rhythm(2.5),
                paddingRight: rhythm(2.5),
              },
            }}>
            <SidebarContent
              id="sidebar"
              activeRoutes={this.state.activeRoutes}
              activeVersion={this.state.activeVersion}
              router={this.props.history}
              versions={versions}
              setVersion={this.setVersion}
              css={{
                display: `none`, // Hidden on mobile.
                float: `left`,
                height: `100%`,
                width: rhythm(10.25),
                borderRight: '1px solid #eee',
                [presets.Tablet]: {
                  display: `block`,
                  position: `fixed`,
                  height: `calc(100vh - 58px)`, // 58px is fixed height of header.
                  overflow: `scroll`,
                },
              }}
            />
            <div
              id="content"
              css={{
                paddingLeft: 0,
                [presets.Tablet]: {
                  display: `block`,
                  paddingLeft: rhythm(11.7),
                },
              }}>
              {this.props.children()}
            </div>
          </div>
        </ScrollContainer>

        <nav
          css={{
            display: `flex`,
            justifyContent: 'space-between',
            alignItems: 'center',
            background: `white`,
            position: 'fixed',
            padding: '20px',
            right: 0,
            top: 0,
            left: 0,
            zIndex: 1001,
            overflow: 'scroll',
            height: `calc(${rhythm(2)} - 1px)`,
            borderBottom: `1px solid #ccc`,
            [presets.Tablet]: {
              display: `none`,
            },
          }}>
          <Link to={`/versions/${this.state.activeVersion}/index.html`}>
            <img
              src={logoText}
              css={{
                marginBottom: rhythm(0),
                marginTop: 15,
                maxHeight: rhythm(1),
                width: 100,
              }}
            />
          </Link>

          <Button
            onClick={() => this.setState({ sidebarOpen: true })}
            value="Menu"
          />
        </nav>
      </div>
    );
  }
}
export default withRouter(Wrapper);
