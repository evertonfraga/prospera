
# Distribuição e emissão semi-automatizada da PCD

## Contabilizar depósitos de ether na PCD

O arquivo `deposits.js` busca por depósitos feitos em ether na faixa de blocos especificada nas variáveis `startBlock` e `endBlock`. O script acumula múltiplos depósitos efetuados pela mesma conta.

Comando que salva resultado em arquivo:

```
node 1_deposits.js > depositos-2018-01.txt
```

Requisito: especificar variáveis `startBlock` e `endBlock`.


## Emissão de tokens do período

Executar método mint() do contrato Minter. Esta operação calcula e emite os novos PRSP do mês para a conta que administra as transferencias.

## Cálculo de PRSP a receber para contribuintes

O arquivo `mintTokens.js` se vale da quantidade de PRSP da última emissão e calcula quanto cada contribuinte deve receber. Ao final ele gera o resultado em três formatos:

1. Dados tabulados simples
2. Código de transferência de token em Web3.js
3. Código para uso em `ProsperaToken.batchTransfer()`

O método de execução das transações fica a cargo do emissor.

```
node 2_mintTokens.js depositos-2018-01.txt
```

## Transferências de PRSP

O token PRSP possui um método especial que possibilita transferir o token para várias contas a partir de uma única transação. É o `batchTransfer`, que aceita dois parâmetros: 1) array de endereços e 2) array de valores.

Podemos utilizar a terceira opção oferecida no passo anterior, utilizando o `ProsperaToken.batchTransfer()`. Deve-se inserir os dados concatenando-os com vírgula no campo de execução do método `batchTransfer`. Use sua interface preferida, recomendo o https://remix.ethereum.org + Metamask.

```
["0x6267fba6ddadfdf23be26f5ada03e64d86c0d3ab", "0x186aed991950e4134c4c90d61bb472061742bd7d", "0x376f0eb80530ab03be79d34ea2f65efee8bf4e69"], [3891436306,1095529122,589762582]
```

Exemplo de transação bem sucedida que transfere para várias contas: https://etherscan.io/tx/0xe6dc34f8f47458e2a08a9267ce088a6ba9902d1d4e7586453ff522724dfb4e90


## Cálculo de ether a receber

Uma vez que os PRSP tenham sido transferidos para as contas com sucesso, devemos calcular a distribuição do Ether contido na PCD proporcionalmente entre os contribuintes. Isto é função do script `3_holders.js`.

Primeiro execute:

```
> node totalSupply.js
```

Ele retornará o total de PRSP existente. Copie e cole como parâmetro `totalSupply` do script seguinte:

```
node 3_holders.js --totalSupply 951884209596 > holders.txt
```

Ele salvará no arquivo `holders.txt` uma lista de endereços e valores. Tais transferências podem ser feitas manualmente, mas existem formas menos trabalhosas. Aqui contaremos com a ajuda de um smart contract já publicado na rede que auxilia a efetuar em torno de 20 transferências de ether por vez. Isso diminui a quantidade de transações de 176 para apenas 9.

## Multisend


