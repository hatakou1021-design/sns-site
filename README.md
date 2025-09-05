# SNS Site

This directory contains a minimalist social networking service built with only HTML, CSS and JavaScript. The aim is to provide a foundation you can quickly modify and extend. The configuration is separated into a `config.js` file and the visual styling uses CSS variables so you can change the look and feel without touching the core logic.

## Features

- **Post creation:** Write a new post using the form at the top of the page.
- **Persistent storage:** Posts are saved to your browser's `localStorage`, so they stay on the page even if you reload or close the tab.
- **Reverse chronological feed:** Posts are displayed with the most recent first. Each post shows the timestamp formatted for the Japanese locale.
- **User accounts:** Simple email/password registration and login using browser localStorage. Users must log in before posting. User names are displayed alongside posts.
- **Customizable theme:** Edit `config.js` to change the site name and colours. The CSS in `styles.css` relies on variables so you can tune the design in one place.

## Running

No server-side code is required. Simply open `index.html` in your browser and start using the app. If you're working in an environment like GitHub Codespaces or wish to serve the files over HTTP, you can run a simple static server. For example, using Python:

```bash
python3 -m http.server --directory sns_site
```

Then navigate to `http://localhost:8000/index.html` in your browser.

### ユーザー登録とログイン

このSNSはGoogle認証を使わず、メールアドレスとパスワードによる登録・ログイン機能を備えています。
初めてアクセスした際には「新規登録」のリンクからユーザー名・メールアドレス・パスワードを入力してアカウントを作成してください。
登録後はログインフォームにメールアドレスとパスワードを入力してログインします。
ログイン状態でのみ投稿フォームが表示され、投稿するとあなたのユーザー名と日時が表示されます。ログアウトするとローカルストレージに保存されたユーザー情報が削除されます。

## Modifying

- To change the site title or colours, edit `config.js`. The configuration object is attached to `window.CONFIG` and consumed on page load.
- To adjust layout or typography, modify the CSS variables at the top of `styles.css` or add new rules.
- To extend functionality (e.g. comments, likes, user profiles), open `app.js` and build upon the existing functions. The code is kept deliberately simple to make this easy.
