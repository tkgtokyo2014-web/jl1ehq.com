jl1ehq.com — PHOTO ページ追加ぶんのファイル一式
================================================

このフォルダの中身を、jl1ehq.com のリポジトリのルートに
そのまま上書きコピーすれば反映されます。

  photo.html                  … 新規（PHOTO ページ本体）
  assets/photo.css            … 新規
  assets/photo.js             … 新規
  images/photobook/*.jpg      … 新規（写真30ファイル／サムネ+拡大用）
  index.html                  … 上書き（ナビに PHOTO を追加、
                                 OFF DUTY セクションを新設）

■ ターミナルでの手順（リポジトリを ~/repo/jl1ehq.com と仮定）

  cd ~/repo/jl1ehq.com
  cp -R ~/Desktop/ORONKO_PHOTO_BOOK/jl1ehq-site-update/. .
  git add -A
  git commit -m "Add PHOTO page: ORONKO PHOTO BOOK"
  git push

■ GitHub の Web 画面から上げる場合

  リポジトリ画面 → Add file → Upload files で
  photo.html / assets / images / index.html をドラッグ＆ドロップ。
  （フォルダ構成が保たれるよう、フォルダごとドロップしてください）

