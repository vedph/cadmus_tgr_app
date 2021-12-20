@echo off
echo NPM PUBLISH
echo Before continuing, ensure that:
echo - you are logged in (npm whoami)
echo - you have successfully rebuilt all the libraries (npm run build-all)
pause
cd .\dist\myrmidon\cadmus-tgr-core
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-tgr-part-gr-pg
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-tgr-part-gr-ui
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-tgr-part-ms-pg
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-tgr-part-ms-ui
call npm publish --access=public
cd ..\..\..
pause
echo ALL DONE
