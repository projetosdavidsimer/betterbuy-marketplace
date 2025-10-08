# 🧪 Checklist de Testes Manuais - BetterBuy

## 📋 Instruções

Este documento contém todos os fluxos que devem ser testados manualmente na plataforma.
Marque com ✅ quando o teste passar e ❌ se encontrar algum problema.

---

## 1️⃣ Autenticação e Acesso

### Registro de Usuário
- [ ] Acessar `/registro`
- [ ] Preencher formulário com dados válidos
- [ ] Verificar se usuário é criado no Supabase
- [ ] Verificar se perfil é criado automaticamente
- [ ] Verificar redirecionamento após registro

### Login
- [ ] Acessar `/login`
- [ ] Fazer login com credenciais válidas
- [ ] Verificar redirecionamento para home
- [ ] Verificar se sidebar mostra dados do usuário
- [ ] Testar logout

### Proteção de Rotas
- [ ] Tentar acessar `/dashboard` sem login
- [ ] Verificar redirecionamento para `/login`
- [ ] Fazer login e verificar acesso liberado

---

## 2️⃣ Exploração e Busca

### Listagem de Produtos
- [ ] Acessar `/explorar/produtos`
- [ ] Verificar se produtos são carregados
- [ ] Verificar imagens, preços e ratings
- [ ] Verificar se cards são clicáveis

### Busca de Produtos
- [ ] Digitar termo na busca
- [ ] Verificar debounce (300ms)
- [ ] Verificar resultados filtrados
- [ ] Verificar contador de resultados
- [ ] Clicar no X para limpar busca

### Filtros
- [ ] Abrir painel de filtros
- [ ] Aplicar filtro de preço mínimo/máximo
- [ ] Aplicar filtro de avaliação
- [ ] Verificar chips de filtros ativos
- [ ] Remover filtro individual (X no chip)
- [ ] Clicar em "Limpar todos"

### Ordenação
- [ ] Ordenar por nome (A-Z)
- [ ] Ordenar por nome (Z-A)
- [ ] Ordenar por menor preço
- [ ] Ordenar por maior preço
- [ ] Ordenar por melhor avaliação

### Listagem de Serviços
- [ ] Acessar `/explorar/servicos`
- [ ] Repetir testes de busca, filtros e ordenação
- [ ] Verificar exibição de preço (range ou fixo)
- [ ] Verificar duração dos serviços

### Listagem de Estabelecimentos
- [ ] Acessar `/explorar/estabelecimentos`
- [ ] Verificar cards dos estabelecimentos
- [ ] Verificar localização e ratings
- [ ] Testar busca por nome/localização

---

## 3️⃣ Páginas de Detalhes

### Detalhes do Produto
- [ ] Clicar em um produto
- [ ] Verificar galeria de imagens
- [ ] Verificar preço e desconto
- [ ] Verificar informações de estoque
- [ ] Verificar link para estabelecimento
- [ ] Verificar seção de avaliações
- [ ] Verificar breadcrumb "Voltar"

### Detalhes do Serviço
- [ ] Clicar em um serviço
- [ ] Verificar informações completas
- [ ] Verificar preço e duração
- [ ] Verificar botões de ação

### Perfil do Estabelecimento
- [ ] Clicar em um estabelecimento
- [ ] Verificar cover e logo
- [ ] Verificar informações de contato
- [ ] Verificar produtos do estabelecimento
- [ ] Verificar serviços do estabelecimento
- [ ] Verificar avaliações

### Página 404
- [ ] Acessar URL inválida de produto
- [ ] Verificar página 404 customizada
- [ ] Verificar botão de voltar

---

## 4️⃣ Carrinho de Compras

### Adicionar ao Carrinho
- [ ] Clicar em "Adicionar" no card do produto
- [ ] Verificar se contador do botão flutuante aumenta
- [ ] Adicionar mesmo produto novamente
- [ ] Verificar se quantidade aumenta
- [ ] Adicionar produto na página de detalhes

### Visualizar Carrinho
- [ ] Clicar no botão flutuante do carrinho
- [ ] Verificar lista de itens
- [ ] Verificar imagens e preços
- [ ] Verificar cálculo de subtotal

### Gerenciar Itens
- [ ] Aumentar quantidade de um item
- [ ] Diminuir quantidade de um item
- [ ] Remover item individual
- [ ] Clicar em "Limpar carrinho"
- [ ] Verificar empty state

### Persistência
- [ ] Adicionar itens ao carrinho
- [ ] Recarregar página (F5)
- [ ] Verificar se itens permanecem
- [ ] Fechar e abrir navegador
- [ ] Verificar persistência

---

## 5️⃣ Checkout e Pedidos

### Processo de Checkout
- [ ] Adicionar produtos ao carrinho
- [ ] Clicar em "Finalizar Compra"
- [ ] Preencher dados pessoais
- [ ] Preencher endereço de entrega
- [ ] Preencher dados de pagamento
- [ ] Verificar resumo do pedido
- [ ] Verificar cálculo de frete
- [ ] Verificar cálculo de total

### Validação de Formulário
- [ ] Tentar enviar com campos vazios
- [ ] Verificar mensagens de erro
- [ ] Preencher email inválido
- [ ] Verificar validação

### Finalizar Pedido
- [ ] Preencher todos os campos
- [ ] Clicar em "Finalizar Compra"
- [ ] Verificar estado de loading
- [ ] Verificar redirecionamento para confirmação
- [ ] Verificar número do pedido
- [ ] Verificar se carrinho foi limpo

### Histórico de Pedidos
- [ ] Acessar `/dashboard/pedidos`
- [ ] Verificar lista de pedidos
- [ ] Verificar status coloridos
- [ ] Verificar datas formatadas
- [ ] Verificar valores corretos

### Detalhes do Pedido
- [ ] Clicar em um pedido
- [ ] Verificar informações completas
- [ ] Verificar lista de itens
- [ ] Verificar endereço de entrega
- [ ] Verificar resumo financeiro
- [ ] Verificar botão "Avaliar" (se entregue)

---

## 6️⃣ Sistema de Avaliações

### Criar Avaliação
- [ ] Acessar pedido com status "entregue"
- [ ] Clicar em "Avaliar" em um item
- [ ] Verificar preview do produto
- [ ] Selecionar estrelas (1-5)
- [ ] Verificar labels descritivos
- [ ] Digitar comentário
- [ ] Verificar contador de caracteres
- [ ] Enviar avaliação

### Validações
- [ ] Tentar avaliar sem selecionar estrelas
- [ ] Tentar avaliar com comentário curto (<10 chars)
- [ ] Verificar mensagens de erro
- [ ] Tentar avaliar produto não comprado
- [ ] Tentar avaliar produto já avaliado

### Listar Avaliações
- [ ] Acessar `/dashboard/avaliacoes`
- [ ] Verificar lista de avaliações
- [ ] Verificar estrelas e comentários
- [ ] Verificar datas
- [ ] Verificar botão "Ver Produto"
- [ ] Verificar botão "Excluir"

### Excluir Avaliação
- [ ] Clicar em "Excluir"
- [ ] Verificar se avaliação é removida
- [ ] Verificar atualização da lista

### Visualizar Avaliações
- [ ] Acessar página de detalhes do produto
- [ ] Verificar seção de avaliações
- [ ] Verificar avatares dos usuários
- [ ] Verificar estrelas e comentários
- [ ] Verificar datas formatadas

---

## 7️⃣ Sistema de Favoritos

### Adicionar aos Favoritos
- [ ] Clicar no coração em um produto
- [ ] Verificar preenchimento do ícone
- [ ] Verificar cor vermelha
- [ ] Adicionar na página de detalhes
- [ ] Adicionar um serviço

### Remover dos Favoritos
- [ ] Clicar no coração preenchido
- [ ] Verificar se ícone volta ao normal
- [ ] Remover na página de favoritos

### Listar Favoritos
- [ ] Acessar `/dashboard/favoritos`
- [ ] Verificar separação produtos/serviços
- [ ] Verificar contadores
- [ ] Verificar imagens e informações
- [ ] Verificar botão de favorito em cada card

### Persistência
- [ ] Adicionar favoritos
- [ ] Recarregar página
- [ ] Verificar se permanecem
- [ ] Fazer logout e login
- [ ] Verificar persistência

### Empty State
- [ ] Remover todos os favoritos
- [ ] Verificar empty state
- [ ] Verificar botão "Explorar Marketplace"

---

## 8️⃣ UI/UX e Responsividade

### Tema Claro/Escuro
- [ ] Alternar entre temas
- [ ] Verificar todas as páginas
- [ ] Verificar contraste
- [ ] Verificar legibilidade

### Sidebar
- [ ] Expandir/colapsar sidebar
- [ ] Verificar ícones e labels
- [ ] Verificar navegação
- [ ] Verificar dados do usuário

### Responsividade Mobile
- [ ] Testar em tela pequena (< 768px)
- [ ] Verificar sidebar mobile
- [ ] Verificar grids adaptáveis
- [ ] Verificar botões e formulários
- [ ] Verificar carrinho flutuante

### Loading States
- [ ] Verificar skeletons nas listagens
- [ ] Verificar spinners em botões
- [ ] Verificar estados de carregamento

### Empty States
- [ ] Carrinho vazio
- [ ] Sem pedidos
- [ ] Sem avaliações
- [ ] Sem favoritos
- [ ] Sem resultados de busca

---

## 9️⃣ Performance

### Imagens
- [ ] Verificar carregamento de imagens
- [ ] Verificar lazy loading
- [ ] Verificar qualidade das imagens
- [ ] Verificar fallbacks

### Navegação
- [ ] Verificar velocidade de navegação
- [ ] Verificar transições
- [ ] Verificar tempo de resposta

### Build
- [ ] Executar `npm run build`
- [ ] Verificar 0 erros
- [ ] Verificar 0 warnings
- [ ] Verificar tamanho dos bundles

---

## 🔟 Segurança

### RLS (Row Level Security)
- [ ] Tentar acessar pedidos de outro usuário
- [ ] Tentar acessar favoritos de outro usuário
- [ ] Tentar acessar avaliações de outro usuário
- [ ] Verificar se acesso é negado

### Validações
- [ ] Tentar SQL injection em campos
- [ ] Tentar XSS em comentários
- [ ] Verificar sanitização de inputs

---

## 📝 Bugs Encontrados

### Bug #1
**Descrição:**
**Passos para reproduzir:**
**Comportamento esperado:**
**Comportamento atual:**
**Prioridade:** Alta/Média/Baixa

### Bug #2
**Descrição:**
**Passos para reproduzir:**
**Comportamento esperado:**
**Comportamento atual:**
**Prioridade:** Alta/Média/Baixa

---

## 💡 Melhorias Sugeridas

### Melhoria #1
**Descrição:**
**Justificativa:**
**Prioridade:** Alta/Média/Baixa

### Melhoria #2
**Descrição:**
**Justificativa:**
**Prioridade:** Alta/Média/Baixa

---

## ✅ Resumo dos Testes

**Data:** ___/___/______
**Testador:** _________________
**Versão:** 2.0.0

**Total de Testes:** ___
**Testes Passados:** ___
**Testes Falhados:** ___
**Bugs Encontrados:** ___
**Melhorias Sugeridas:** ___

**Status Geral:** ⭐⭐⭐⭐⭐ (1-5 estrelas)

**Observações:**
