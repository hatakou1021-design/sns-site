# SNS Site

This directory contains a minimalist social networking service built with
only HTML, CSS and JavaScript. The aim is to provide a foundation you can
quickly modify and extend. The configuration is separated into a
`config.js` file and the visual styling uses CSS variables so you can
change the look and feel without touching the core logic.

## Features

- **Post creation:** Write a new post using the form at the top of the page.
- **Persistent storage:** Posts are saved to your browser's
  `localStorage`, so they stay on the page even if you reload or close
  the tab.
- **Reverse chronological feed:** Posts are displayed with the most
  recent first. Each post shows the timestamp formatted for the
  Japanese locale.
- **Customizable theme:** Edit `config.js` to change the site name and
  colours. The CSS in `styles.css` relies on variables so you can tune
  the design in one place.

## Running

No server-side code is required. Simply open `index.html` in your
browser and start using the app. If you're working in an environment
like GitHub Codespaces or wish to serve the files over HTTP, you can
run a simple static server. For example, using Python:

```bash
python3 -m http.server --directory sns_site
```

Then navigate to `http://localhost:8000/index.html` in your browser.

### Google 認証の設定

このサイトには Google アカウントでのログイン機能が含まれています。Google の認証を利用するには、
[Google Cloud Console](https://console.cloud.google.com/) で OAuth 2.0 用の
クライアント ID を取得し、`sns_site/auth.js` 内の `YOUR_GOOGLE_CLIENT_ID` をその値に
置き換えてください。認証に成功するとユーザー情報が `localStorage` に保存され、投稿フォームが
表示されるようになります。ログアウトボタンでユーザー情報を削除できます。

## Modifying

- To change the site title or colours, edit `config.js`. The
  configuration object is attached to `window.CONFIG` and consumed on
  page load.
- To adjust layout or typography, modify the CSS variables at the top
  of `styles.css` or add new rules.
- To extend functionality (e.g. comments, likes, user profiles), open
  `app.js` and build upon the existing functions. The code is kept
  deliberately simple to make this easy.
