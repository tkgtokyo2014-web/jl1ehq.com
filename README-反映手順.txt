jl1ehq.com — PHOTOページ 追加ぶんのファイル一式
================================================
更新: COLLECTION 02「オーロラ号 ウトロより出航」7枚を追加（合計22枚）

このフォルダの中身を JL1EHQ_HP（正データ）に上書きコピーし、
そこから GitHub へ push すれば反映されます。

  photo.html                  … 新規／更新（PHOTOページ本体）
  assets/photo.css            … 新規
  assets/photo.js             … 新規／更新（写真データもここ）
  images/photobook/*.jpg      … 新規（写真44ファイル＝22枚×サムネ+拡大用）
  index.html                  … 上書き（ナビに PHOTO、OFF DUTY セクション新設）

■ ターミナルでの手順

  # 1) 正データへ反映
  cp -R ~/Desktop/ORONKO_PHOTO_BOOK/jl1ehq-site-update/. ~/Desktop/JL1EHQ_HP/

  # 2) GitHub へ push
  export GH_TOKEN=$(cat ~/.config/gh_device_token)
  cd ~/Desktop
  rm -rf jl1ehq-push
  git clone https://x-access-token:${GH_TOKEN}@github.com/tkgtokyo2014-web/jl1ehq.com.git jl1ehq-push
  cp -R ~/Desktop/JL1EHQ_HP/. jl1ehq-push/
  cd jl1ehq-push
  git add -A && git commit -m "Add PHOTO page: Oronko flowers + Aurora out of Utoro" && git push origin main

  数十秒〜1分で https://jl1ehq.com/photo.html に反映されます。
