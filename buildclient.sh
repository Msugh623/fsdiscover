cd fe 
npm install --legacy-peer-deps
npm run build 
rm -r ../public/assets
mv dist/* ../public
cd ../