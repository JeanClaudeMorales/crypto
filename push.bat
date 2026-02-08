@echo off
echo Intentando push a GitHub con credenciales de Windows...
cd /d c:\AppServ\www\zve
git push -u origin main
echo.
echo Codigo de salida: %ERRORLEVEL%
pause
