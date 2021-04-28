**Requisitos Funcionais - RF**
São as funcionalidades que nossa aplicação irá ter

**Requisitos Não Funcioanis - RNF**
São requisitos não ligados diretamente a RN.
Ex: Os dados devem ser armazenados em Database Postgres


**Regras de Negócio - RN**

São as regras por trás dos nossos requisitos

Ex: Não deve ser possivel listar os usuarios se o cliente não for um admin
____________________________

# Cadastro de 'Carro'
**RF**
[X] Deve ser possivel cadastrar um novo carro

**RN**

[X] Não deve ser possivel cadastrar um novo carro com license_plate já existente.
[X] Não deve ser possivel alterar a placa de um carro já cadastrado.
[X] O carro deve ser cadastrado, por padrão com Disponibilidade (Available)
[X] Não deve ser possivel cadastrar um carro se o usuário não for admin

# Listagem de Carros

**RF**
[X] Deve ser possivel listar todos os carros disponiveis
[X] Deve ser possivel listar todos os carros disponiveis pelo nome da categoria
[X] Deve ser possivel listar todos os carros disponiveis pelo nome da marca

**RN**
[X] O usuário não precisa estar logado no sistema.
____________________________

# Cadastro de Especificação no carro (Specifications_Cars)
**RF**

[X] Deve ser possivel cadastrar uma especificação para um carro;

**RN**

[X] Não deve ser possivel cadastrar uma especifição para um carro não cadastrado;
[X] Não deve ser possivel cadastrar uma especificação já existente para o mesmo carro;
[X] Não deve ser possivel cadastrar uma Especificação no carro se o usuário não for admin


# Cadastro de Imagens do Carro

**RF**
[] Deve ser possivel cadastrar a imagem do carro

**RNF**
[] Utilizar o multer para upload os arquivos

**RN**
[] O Usuario deve poder cadastrar mais de uma imagem para o mesmo carro
[] Não deve ser possivel cadastrar a imagem do carro se o usuário não for admin
[X] Não deve ser possivel cadastrar uma imagem para um carro não existente

# Aluguel de Carro

**RF**
[] Deve ser possivel cadastrar um aluguel

**RNF**

**RN**

[X] O aluguel deve ter duração minima de 24 horas
[X] Não deve ser possivel cadastrar um novo aluguel caso já exista um aluguel aberto para o mesmo usuário
[X] Não deve ser possivel cadastrar um novo aluguel caso já exista um aluguel aberto para o mesmo carro
[] O usuário deve estar logado na aplicação