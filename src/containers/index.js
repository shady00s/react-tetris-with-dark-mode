/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable  no-trailing-spaces */
/* eslint-disable  padded-blocks */
import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';

import Matrix from '../components/matrix';
import Decorate from '../components/decorate';
import Number from '../components/number';
import Next from '../components/next';
import Music from '../components/music';
import Pause from '../components/pause';
import Point from '../components/point';
import Logo from '../components/logo';
import Keyboard from '../components/keyboard';
import Guide from '../components/guide';

import { transform, lastRecord, speeds, i18n, lan } from '../unit/const';
import { visibilityChangeEvent, isFocus } from '../unit/';
import states from '../control/states';

class App extends React.Component {
  constructor() {
    super();

    // Check localStorage first, then URL for theme preference
    const storedTheme = localStorage.getItem('tetris_theme');
    const isDarkTheme = storedTheme ?
      storedTheme === 'dark' :
      window.location.search.includes('theme=dark');

    this.state = {
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
      darkTheme: isDarkTheme,
    };
    this.toggleLanguage = this.toggleLanguage.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
  }


  componentWillMount() {
    window.addEventListener('resize', this.resize.bind(this), true);
    // Apply the theme based on state (which was set from localStorage or URL)
    this.applyTheme(this.state.darkTheme);
  }
  componentDidMount() {
    if (visibilityChangeEvent) {
      document.addEventListener(visibilityChangeEvent, () => {
        states.focus(isFocus());
      }, false);
    }

    // Add theme script to head for immediate theme application
    this.addThemeScript();

    // Apply theme again after DOM is fully loaded
    setTimeout(() => {
      this.applyTheme(this.state.darkTheme);
    }, 100);

    if (lastRecord) {
      if (lastRecord.cur && !lastRecord.pause) {
        const speedRun = this.props.speedRun;
        let timeout = speeds[speedRun - 1] / 2;
        timeout = speedRun < speeds[speeds.length - 1] ? speeds[speeds.length - 1] : speedRun;
        states.auto(timeout);
      }
      if (!lastRecord.cur) {
        states.overStart();
      }
    } else {
      states.overStart();
    }
  }

  // Add a script to the document head to apply theme immediately on page load
  addThemeScript() {
    // Add dark theme CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/dark-theme.css';
    document.head.appendChild(link);

    // Add script to apply theme class to body
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        var storedTheme = localStorage.getItem('tetris_theme');
        var isDarkTheme = storedTheme ?
          storedTheme === 'dark' :
          window.location.search.includes('theme=dark');

        if (isDarkTheme) {
          document.body.style.backgroundColor = '#333';
          document.body.classList.add('dark-theme');
        }
      })();
    `;
    document.head.appendChild(script);
  }
  toggleLanguage() {
    const newLan = lan === 'en' ? 'zh' : 'en';
    const currentTheme = this.state.darkTheme ? 'dark' : 'light';

    // Save current theme to localStorage before navigating
    localStorage.setItem('tetris_theme', currentTheme);

    // Create a hidden form and submit it to preserve the theme across page reloads
    const form = document.createElement('form');
    form.method = 'GET';
    form.action = window.location.pathname;

    // Add language parameter
    const lanInput = document.createElement('input');
    lanInput.type = 'hidden';
    lanInput.name = 'lan';
    lanInput.value = newLan;
    form.appendChild(lanInput);

    // Add theme parameter
    const themeInput = document.createElement('input');
    themeInput.type = 'hidden';
    themeInput.name = 'theme';
    themeInput.value = currentTheme;
    form.appendChild(themeInput);

    // Append form to body and submit it
    document.body.appendChild(form);
    form.submit();
  }

  toggleTheme() {
    const newTheme = !this.state.darkTheme;
    this.setState({ darkTheme: newTheme });
    this.applyTheme(newTheme);
    // Preserve the current language when updating the URL
    window.history.replaceState(null, '', `?lan=${lan}&theme=${newTheme ? 'dark' : 'light'}`);
  }

  applyTheme(isDark) {
    // Store the theme preference in localStorage so it persists across page reloads
    localStorage.setItem('tetris_theme', isDark ? 'dark' : 'light');

    if (isDark) {
      // Apply dark theme by adding class to body
      document.body.style.backgroundColor = '#333';
      document.body.classList.add('dark-theme');
      
      // Force immediate style application for specific elements
      document.querySelectorAll('._2iZA, ._2lJh').forEach(el => {
        el.style.color = 'black';
      });
      document.querySelectorAll('._1pg0._23pZ._2TvZ i, ._1pg0._23pZ._2TvZ span, ._1pg0._23pZ.p4fG i, ._1pg0._23pZ.p4fG span, .J9SA, .nVeA, .DOXx, ._1fjB').forEach(el => {
        el.style.backgroundColor = '#333';
        el.style.color = 'white';
      });
      document.querySelectorAll('.nVeA > *, .DOXx > *, ._1fjB > *').forEach(el => {
        el.style.color = '#fff';
      });
      document.querySelectorAll('._3Lk6').forEach(el => {
        el.style.backgroundColor = 'rgb(51, 51, 51)';
      });
      document.querySelectorAll('.c').forEach(el => {
        el.style.backgroundColor = 'white';
      });
      document.querySelectorAll('._3Lk6 span').forEach(el => {
        el.style.color = 'white';
      });
      document.querySelectorAll('._6pVK b').forEach(el => {
        el.style.backgroundColor = '';
        el.style.color = '';
      });
    } else {
      // Force immediate style application for specific elements
      document.querySelectorAll('._2iZA, ._2lJh, ._6pVK b').forEach(el => {
        el.style.color = 'black';
      });
      document.querySelectorAll('._6pVK b').forEach(el => {
        el.style.backgroundColor = 'black';
      });

      // Remove dark theme class from body
      document.body.style.backgroundColor = '#009688';
      document.body.classList.remove('dark-theme');

      // Reset styles directly on elements
      document.querySelectorAll('._1pg0._23pZ._2TvZ i, ._1pg0._23pZ._2TvZ span, ._1pg0._23pZ.p4fG i, ._1pg0._23pZ.p4fG span, .J9SA, .nVeA, .DOXx, ._1fjB').forEach(el => {
        el.style.backgroundColor = '';
        el.style.color = '';
      });
      document.querySelectorAll('.c').forEach(el => {
        el.style.backgroundColor = '';
      });
      document.querySelectorAll('.nVeA > *, .DOXx > *, ._1fjB > *').forEach(el => {
        el.style.color = '';
      });
      document.querySelectorAll('._3Lk6').forEach(el => {
        el.style.backgroundColor = '';
      });
      document.querySelectorAll('._3Lk6 span').forEach(el => {
        el.style.color = 'black';
      });
    }
  }

  resize() {
    this.setState({
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    });
  }

  render() {
    let filling = 0;
    const size = (() => {
      const w = this.state.w;
      const h = this.state.h;
      const ratio = h / w;
      let scale;
      let css = {};
      if (ratio < 1.5) {
        scale = h / 960;
      } else {
        scale = w / 640;
        filling = (h - (960 * scale)) / scale / 3;
        css = {
          paddingTop: Math.floor(filling) + 42,
          paddingBottom: Math.floor(filling),
          marginTop: Math.floor(-480 - (filling * 1.5)),
        };
      }
      css[transform] = `scale(${scale})`;
      return css;
    })();

    return (
      <div
        className={style.app}
        style={size}
      >
        <button
          className={style.languageToggle}
          onClick={this.toggleLanguage}
        >
          {lan === 'en' ? '中文' : 'EN'}
        </button>
        <button
          className={style.themeToggle}
          onClick={this.toggleTheme}
        >
          {this.state.darkTheme ? '☀️' : '🌙'}
        </button>
        <div className={classnames({ [style.rect]: true, [style.drop]: this.props.drop })}>
          <Decorate />
          <div className={style.screen}>
            <div className={style.panel}>
              <Matrix
                matrix={this.props.matrix}
                cur={this.props.cur}
                reset={this.props.reset}
              />
              <Logo cur={!!this.props.cur} reset={this.props.reset} />
              <div className={style.state}>
                <Point cur={!!this.props.cur} point={this.props.points} max={this.props.max} />
                <p>{ this.props.cur ? i18n.cleans[lan] : i18n.startLine[lan] }</p>
                <Number number={this.props.cur ? this.props.clearLines : this.props.startLines} />
                <p>{i18n.level[lan]}</p>
                <Number
                  number={this.props.cur ? this.props.speedRun : this.props.speedStart}
                  length={1}
                />
                <p>{i18n.next[lan]}</p>
                <Next data={this.props.next} />
                <div className={style.bottom}>
                  <Music data={this.props.music} />
                  <Pause data={this.props.pause} />
                  <Number time />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Keyboard filling={filling} keyboard={this.props.keyboard} />
        <Guide />
      </div>
    );
  }
}

App.propTypes = {
  music: propTypes.bool.isRequired,
  pause: propTypes.bool.isRequired,
  matrix: propTypes.object.isRequired,
  next: propTypes.string.isRequired,
  cur: propTypes.object,
  dispatch: propTypes.func.isRequired,
  speedStart: propTypes.number.isRequired,
  speedRun: propTypes.number.isRequired,
  startLines: propTypes.number.isRequired,
  clearLines: propTypes.number.isRequired,
  points: propTypes.number.isRequired,
  max: propTypes.number.isRequired,
  reset: propTypes.bool.isRequired,
  drop: propTypes.bool.isRequired,
  keyboard: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  pause: state.get('pause'),
  music: state.get('music'),
  matrix: state.get('matrix'),
  next: state.get('next'),
  cur: state.get('cur'),
  speedStart: state.get('speedStart'),
  speedRun: state.get('speedRun'),
  startLines: state.get('startLines'),
  clearLines: state.get('clearLines'),
  points: state.get('points'),
  max: state.get('max'),
  reset: state.get('reset'),
  drop: state.get('drop'),
  keyboard: state.get('keyboard'),
});

export default connect(mapStateToProps)(App);
