# CancelOrderUseCase

## Dados
* orderId: string
* userId: string

## Fluxo principal
1. Obter os dados do usuario que esta tentando cancelar o pedido ✅
2. Verificar se o usuario que esta tentando cancelar o pedido tem permissao para cancelar o pedido (ADMIN ou CROMO) ✅
<!-- 3. Obter os dados do pedido ✅ -->
4. Cancelar o pedido ✅

## Fluxo alternativo: Usuário não encontrado
1. Retornar erro. ✅

## Fluxo alternativo: Usuário não tem permissão para cancelar o pedido
2. Retornar erro. ✅

<!-- ## Fluxo alternativo: Pedido não encontrado
3. Retornar erro. ✅ -->
