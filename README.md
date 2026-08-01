# ADcolle Ver.6

Ver.5の文章改行とタイポグラフィを改善したバージョンです。

## 改善内容

- ヒーローコピーの不自然な自動改行を解消
- 問題提起セクションの見出しを意図した位置で改行
- お問い合わせ見出しの改行位置を調整
- PC・タブレット・スマートフォンごとに見出し幅を最適化
- 小さい画面でも1文字だけ次行に落ちる現象を防止
- 見出しの行間・最大幅・文字バランスを改善

## 反映方法

`adcolle-site` に次のファイルを上書きしてください。

- `index.html`
- `css/style.css`
- `README.md`

その後、VS Codeのターミナルで実行します。

```bash
git add .
git commit -m "Improve responsive typography and line breaks"
git push
```

## 確認ポイント

- 390px前後のスマートフォン
- 768px前後のタブレット
- 1440px前後のパソコン
