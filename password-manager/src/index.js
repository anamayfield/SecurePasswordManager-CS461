const React = require('react');
const ReactDOMServer = require('react-dom/server');

const App = require('./App').default;

const html = ReactDOMServer.renderToString(
  React.createElement(React.StrictMode, null, React.createElement(App))
);

