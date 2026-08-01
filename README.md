# ADcolle Ver.10.2 — Hero Balance Fix

横配置時に左側のコピーが窮屈になり、見出しが3行化・画面外へずれて見える問題を修正しました。

## 修正内容

- 1280px以上だけ横2カラム
- 1025〜1279pxは中央1カラムへ自動切替
- PCの見出しを必ず2行に固定
- 左カラム幅を560px以上確保
- 見出しサイズを横配置向けに最適化
- CTA・説明文・特徴のはみ出し防止
- ダッシュボードの最大幅を520pxに制限
- 横スクロールを防止

## 上書きするファイル

- `css/style.css`
- `README.md`

## GitHubへ反映

```bash
git add .
git commit -m "Fix hero balance and desktop breakpoint"
git push
```
