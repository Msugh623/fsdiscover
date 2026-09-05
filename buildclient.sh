cd fe 
npm install --legacy-peer-deps
npm run build 
rm -r ../public/client/assets
mv dist/* ../public/client
cd ../