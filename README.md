# Funcionamento geral do simulador

O simulador foi construído usando conceitos de linguagens formais: autômato finitos determinístico (AFD) e gramática livre de contexto (GLC). Foi dividida em fase como: análise lexica, sintática e semântica e por fim faz um processo de transpirador, pega o código da tabela e transforma e um array de instrução.
 
 # Modo de Usar
 
 ## Preencher a Nontuplas:
 ![image](https://user-images.githubusercontent.com/38994152/199786731-ba42e8e8-1e17-4beb-96c0-1b0f6474e54a.png)

Muito importante que coloque o alfaberto de fita, porque se caso colocar depois a programação feita na tabela será resertada.
O Estado sempre deve ser de q0 até qN, o pré-fixo pode ser "q" ou "Q"

## Codificar a tabela
![image](https://user-images.githubusercontent.com/38994152/199786858-792f48b1-bb94-40ca-bd2d-5a05be2ab5cb.png)

## Botões de Controles
![image](https://user-images.githubusercontent.com/38994152/199790211-7de7292e-00fd-4258-b71f-0a6326abcce0.png): Executa os comandos

![image](https://user-images.githubusercontent.com/38994152/199789779-d637e523-9e1c-46ba-8d8c-98b738d4101f.png): Parar a execução

![image](https://user-images.githubusercontent.com/38994152/199789884-a455752e-fc1f-447f-8a0b-079815283f60.png): Reserta os caracteres colocado na fita de entrada e sáida

![image](https://user-images.githubusercontent.com/38994152/199790016-2bd48f6b-8f1d-4f40-9f7f-455d84e32c23.png): Controla a velocidade de execução dos comandos

## Fita
Aqui será a entrada e saída do simulador. Para entrar com dados, basta selecionar uma célula e preencher com um caracter que deseja ler. Só é permitido um único caracteres e se caso quiser passar de uma célula de maneira rápida, basta apertar as tecla TAB para a próxima cédula e SHIFT + TAB para célula anterior.

## Cabeçote
Quando executa os comandos, o cabeçote da foto abaixo, vai indo de célula em célula, colocando ou tirando caracter de acordo com a programação que foi feita na tabela.

![image](https://user-images.githubusercontent.com/38994152/199788847-d4406f24-c4dd-459f-959c-4d362b0eeba0.png)

## Um Comando demo para rodar o simulador.
![image](https://user-images.githubusercontent.com/38994152/199786491-79cb14e6-d0aa-4348-b20a-f083bc126dcd.png)
