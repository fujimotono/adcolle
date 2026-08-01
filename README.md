# ADcolle Ver.7 — Apple-like Centered Layout

Ver.6で発生していた、画面幅による中央位置のずれと見出しの不自然な改行を修正しました。

## 主な修正

- ヒーロー全体をApple公式サイトのような中央1カラム構成へ変更
- PC・タブレット・スマートフォンですべて中央揃え
- 「集客を、／仕組みに変える。」の各行を途中で分断しない
- スマートフォン幅に応じて文字サイズを自動調整
- ヘッダーのロゴが左端で切れる問題を防止
- ダッシュボードを中央配置
- 横スクロールと画面外へのはみ出しを防止
- Safe Area対応

## 上書きするファイル

- `css/style.css`
- `README.md`

今回はHTMLとJavaScriptの変更はありません。

## GitHubへ反映

```bash
git add .
git commit -m "Center responsive layout in Apple style"
git push
```

## 確認幅

- 320px
- 390px
- 430px
- 768px
- 1024px
- 1440px
