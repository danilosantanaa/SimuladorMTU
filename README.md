# Funcionamento geral do simulador

O simulador foi construído usando conceitos de linguagens formais: autômato finitos determinístico (AFD) e gramática livre de contexto (GLC). Foi dividida em fase como: análise lexica, sintática e semântica e por fim faz um processo de transpirador, pega o código da tabela e transforma em um array de instrução.
 
 # Modo de Usar
 ## Preencher a Nontuplas:
 ![image](https://user-images.githubusercontent.com/38994152/199786731-ba42e8e8-1e17-4beb-96c0-1b0f6474e54a.png)

Muito importante que coloque todos os alfaberto de fita, porque se caso colocar depois, a programação feita na tabela será resertada. Verifique antes se há algum alfaberto de fita marcador e coloque. Quando preencher novamente o alfaberto de fita ou alfaberto, a tabela será resertada. 
O Estado sempre deve ser de q0 até qN, o pré-fixo pode ser "q" ou "Q"

## Codificar a tabela
![image](https://user-images.githubusercontent.com/38994152/199786858-792f48b1-bb94-40ca-bd2d-5a05be2ab5cb.png)

## Botões de Controles
![image](https://user-images.githubusercontent.com/38994152/199790211-7de7292e-00fd-4258-b71f-0a6326abcce0.png): Executa os comandos

![image](https://user-images.githubusercontent.com/38994152/199789779-d637e523-9e1c-46ba-8d8c-98b738d4101f.png): Parar a execução

![image](https://user-images.githubusercontent.com/38994152/199789884-a455752e-fc1f-447f-8a0b-079815283f60.png): Reserta os caracteres colocado na fita de entrada e sáida

![image](https://user-images.githubusercontent.com/38994152/199790016-2bd48f6b-8f1d-4f40-9f7f-455d84e32c23.png): Controla a velocidade de execução dos comandos

## Fita
Aqui será a entrada e saída do simulador. Para entrar com dados, basta selecionar uma célula e preencher com um caracter que deseja ler. Só é permitido um único caracteres em cada célula e se caso quiser passar de uma célula para outra de maneira rápida, basta apertar as tecla TAB para ir para a próxima cédula e SHIFT + TAB para ir para a célula anterior.

## Cabeçote
Quando executar os comandos, o cabeçote da foto abaixo vai indo de célula em célula, colocando ou retirando caracter de acordo com a programação que foi feita na tabela.

![image](https://user-images.githubusercontent.com/38994152/199788847-d4406f24-c4dd-459f-959c-4d362b0eeba0.png)

## Console 
O Console funcionar como alerta, será nessa tela que será mostrado erros sintático na construções das instruções e avisos. No console, tem dois icones, de erros e aviso, mostrará a quantidade de erros e avisos encontrado na execuções das instruções. 

![image](https://user-images.githubusercontent.com/38994152/199791220-54fc7609-41e5-4e06-905e-69753571e42d.png): Erros ou Avisos

![image](https://user-images.githubusercontent.com/38994152/199791491-ae797298-6a31-44a0-a09d-3b473ac10ef6.png): Fechar ou Abre o console

### Tela do Console
![image](https://user-images.githubusercontent.com/38994152/199791818-6046cad5-9678-444f-a40f-2d1f3065864c.png)

## Um Comando demo para rodar o simulador.
![image](https://user-images.githubusercontent.com/38994152/199786491-79cb14e6-d0aa-4348-b20a-f083bc126dcd.png)
