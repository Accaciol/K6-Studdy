@echo off
setlocal enabledelayedexpansion

REM Script Windows para executar testes k6

set BASE_URL=http://localhost:3000
set INFLUX_URL=http://localhost:8086/k6

echo 🚀 K6 Test Runner
echo ==================

REM Verificar se a API está rodando
echo 🔍 Verificando se a API está disponível...
curl -f -s "%BASE_URL%" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ API não está disponível em %BASE_URL%
    echo 💡 Execute: docker-compose up -d api
    pause
    exit /b 1
)
echo ✅ API está rodando em %BASE_URL%

echo.
echo Escolha o tipo de teste:
echo 1^) Smoke Test ^(Teste básico - 1 usuário, 1 minuto^)
echo 2^) Load Test ^(Teste de carga - 10 usuários, 5 minutos^)
echo 3^) Stress Test ^(Teste de estresse - até 100 usuários, 15 minutos^)
echo 4^) Spike Test ^(Teste de pico - picos de até 100 usuários^)
echo 5^) Executar todos os testes em sequência
echo 0^) Sair
echo.

set /p choice="Digite sua escolha (0-5): "

if "%choice%"=="0" (
    echo 👋 Saindo...
    exit /b 0
)

if "%choice%"=="1" (
    call :run_test "smoke-test.js" "Smoke Test"
) else if "%choice%"=="2" (
    call :run_test "load-test.js" "Load Test"
) else if "%choice%"=="3" (
    call :run_test "stress-test.js" "Stress Test"
) else if "%choice%"=="4" (
    call :run_test "spike-test.js" "Spike Test"
) else if "%choice%"=="5" (
    echo 🔄 Executando todos os testes em sequência...
    call :run_test "smoke-test.js" "Smoke Test"
    echo ⏸️  Pausa de 30 segundos entre testes...
    timeout /t 30 /nobreak >nul
    call :run_test "load-test.js" "Load Test"
    echo ⏸️  Pausa de 30 segundos entre testes...
    timeout /t 30 /nobreak >nul
    call :run_test "stress-test.js" "Stress Test"
    echo ⏸️  Pausa de 30 segundos entre testes...
    timeout /t 30 /nobreak >nul
    call :run_test "spike-test.js" "Spike Test"
    echo 🎉 Todos os testes concluídos!
) else (
    echo ❌ Opção inválida!
    pause
    exit /b 1
)

echo.
echo ✅ Teste concluído!
echo 📊 Se estiver usando Grafana, acesse: http://localhost:3001
echo 👤 Usuário: admin ^| Senha: admin
pause
exit /b 0

:run_test
set test_file=%~1
set test_name=%~2

echo.
echo 🧪 Executando %test_name%...
echo 📁 Arquivo: %test_file%
echo ⏰ Iniciando em 3 segundos...
timeout /t 3 /nobreak >nul

REM Verificar se InfluxDB está disponível
curl -f -s "http://localhost:8086/ping" >nul 2>&1
if %errorlevel% equ 0 (
    echo 📊 Enviando métricas para InfluxDB...
    k6 run --out influxdb="%INFLUX_URL%" "k6-tests\%test_file%"
) else (
    echo 📊 Executando sem InfluxDB...
    k6 run "k6-tests\%test_file%"
)
goto :eof