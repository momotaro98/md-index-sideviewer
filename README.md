# page-contents-sidebar

Sidebar Extension for Markdown on Gist

![page-contents-sidebar_demo](https://github.com/momotaro98/my-project-images/blob/master/page-contents-sidebar/demo.gif)

## Features

* Display header title of Markdown file
* Jump to target area
* Change the depth of the display header
* Track and focus on current browsing points
* Change the sidebar width
* The sidebar can be hidden with a single button

## Future

Scheduled to support other sites such as GitHub and Confluence.

## Development

### Start development

```
$ cd page-contents-sidebar
$ npm install
```

### Build, run, and watch app

Modify `src` files and run and watch app by building with gulp

```
$ npm start
```

### Inspect app

Open `tmp/app` directory as extension in Chrome browser, [chrome://extensions/](chrome://extensions/)

## Deployment app to Chrome Extension

0. Update `version` of package.json
0. Run `npm run-script build` or `gulp build` and check `tmp/app` TODO: Use `npm dist` with zip the dir
0. Create a zip file of `tmp/app`
0. Go to [Chrome Ex Dashboard](https://chrome.google.com/webstore/developer/dashboard) and upload the zip file
0. Push update to master and create release and tag
