#!/bin/bash

# Script para executar diferentes tipos de teste k6

set -e

BASE_URL="http://localhost:3000"
INFLUX_URL="http://localhost:8086/k6"

echo "🚀 K6 Test Runner"
echo "=================="

# Função para verificar se a API está rodando
check_api() {
    echo "🔍 Verificando se a API está disponível..."
    if curl -f -s "$BASE_URL" > /dev/null; then
        echo "✅ API está rodando em $BASE_URL"
    else
        echo "❌ API não está disponível em $BASE_URL"
        echo "💡 Execute: docker-compose up -d api"
        exit 1
    fi
}

# Função para executar teste
run_test() {
    local test_file=$1
    local test_name=$2
    
    echo ""
    echo "🧪 Executando $test_name..."
    echo "📁 Arquivo: $test_file"
    echo "⏰ Iniciando em 3 segundos..."
    sleep 3
    
    if [ -n "$INFLUX_URL" ] && curl -f -s "http://localhost:8086/ping" > /dev/null; then
        echo "📊 Enviando métricas para InfluxDB..."
        k6 run --out influxdb="$INFLUX_URL" "k6-tests/$test_file"
    else
        echo "📊 Executando sem InfluxDB..."
        k6 run "k6-tests/$test_file"
    fi
}

# Verifica se a API está rodando
check_api

# Menu de opções
echo ""
echo "Escolha o tipo de teste:"
echo "1) Smoke Test (Teste básico - 1 usuário, 1 minuto)"
echo "2) Load Test (Teste de carga - 10 usuários, 5 minutos)"
echo "3) Stress Test (Teste de estresse - até 100 usuários, 15 minutos)"
echo "4) Spike Test (Teste de pico - picos de até 100 usuários)"
echo "5) Executar todos os testes em sequência"
echo "0) Sair"
echo ""

read -p "Digite sua escolha (0-5): " choice

case $choice in
    1)
        run_test "smoke-test.js" "Smoke Test"
        ;;
    2)
        run_test "load-test.js" "Load Test"
        ;;
    3)
        run_test "stress-test.js" "Stress Test"
        ;;
    4)
        run_test "spike-test.js" "Spike Test"
        ;;
    5)
        echo "🔄 Executando todos os testes em sequência..."
        run_test "smoke-test.js" "Smoke Test"
        echo "⏸️  Pausa de 30 segundos entre testes..."
        sleep 30
        run_test "load-test.js" "Load Test"
        echo "⏸️  Pausa de 30 segundos entre testes..."
        sleep 30
        run_test "stress-test.js" "Stress Test"
        echo "⏸️  Pausa de 30 segundos entre testes..."
        sleep 30
        run_test "spike-test.js" "Spike Test"
        echo "🎉 Todos os testes concluídos!"
        ;;
    0)
        echo "👋 Saindo..."
        exit 0
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo "✅ Teste concluído!"
echo "📊 Se estiver usando Grafana, acesse: http://localhost:3001"
echo "👤 Usuário: admin | Senha: admin"