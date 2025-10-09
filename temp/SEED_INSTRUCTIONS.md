# 🌱 Instruções para Popular o Banco de Dados

## Método 1: Via Supabase Studio (RECOMENDADO)

### Passo a Passo:

1. **Criar um Usuário Primeiro**
   - Acesse sua aplicação: http://localhost:3000/registro
   - Crie uma conta de teste (ex: teste@betterbuy.com)
   - Faça login

2. **Pegar seu User ID**
   - Abra: https://supabase.com/dashboard
   - Faça login
   - Selecione o projeto: `betterbuy-marketplace`
   - Vá em: **Authentication** → **Users**
   - Copie o **UUID** do usuário que você criou

3. **Preparar o Seed**
   - Abra o arquivo: `my-app/supabase/seed-simple.sql`
   - Procure por: `YOUR_USER_ID_HERE` (aparece 5 vezes)
   - Substitua TODAS as ocorrências pelo UUID que você copiou
   - Salve o arquivo

4. **Executar o Seed**
   - No Supabase Studio, vá em: **SQL Editor** → **New query**
   - Copie TODO o conteúdo do `seed-simple.sql` (já com seu UUID)
   - Cole no SQL Editor
   - Clique em **"Run"** (ou pressione Ctrl+Enter)

4. **Verificar Resultados**
   - Você verá mensagens de sucesso
   - Verifique as contagens:
     - Categories: 5
     - Businesses: 5
     - Products: 10
     - Product Images: 10
     - Services: 9

5. **Verificar no Table Editor**
   - Vá em "Table Editor"
   - Verifique as tabelas:
     - `categories`
     - `businesses`
     - `products`
     - `product_images`
     - `services`

---

## Método 2: Via CLI (Alternativo)

Se preferir usar a CLI, use aspas simples para evitar problemas com caracteres especiais:

```bash
cd my-app
supabase db push
```

Depois execute o seed separadamente no Supabase Studio.

---

## ⚠️ Notas Importantes

### ⚠️ IMPORTANTE: Use seu User ID Real

O seed **NÃO FUNCIONA** com IDs fictícios porque a tabela `profiles` tem uma foreign key para `auth.users`.

**Você DEVE:**
1. Criar um usuário via `/registro` primeiro
2. Copiar o UUID do Supabase Studio
3. Substituir `YOUR_USER_ID_HERE` no arquivo `seed-simple.sql`
4. Só então executar o seed

**Não pule esta etapa!** Caso contrário, você verá o erro:
```
ERROR: insert or update on table "businesses" violates foreign key constraint
```

### Adicionar Avaliações e Pedidos

Para testar completamente, você precisará:

1. **Criar alguns pedidos:**
   - Faça login
   - Adicione produtos ao carrinho
   - Complete o checkout
   - No Supabase Studio, atualize o status para 'delivered':
   ```sql
   UPDATE public.orders 
   SET status = 'delivered' 
   WHERE id = 'ORDER_ID';
   ```

2. **Criar avaliações:**
   - Acesse `/dashboard/pedidos`
   - Clique em um pedido entregue
   - Clique em "Avaliar" nos itens

3. **Adicionar favoritos:**
   - Navegue pelos produtos
   - Clique no ícone de coração

---

## 🧪 Após Popular o Banco

Use o checklist de testes: `TESTES_MANUAIS.md`

### Verificações Rápidas:

1. **Produtos aparecem na listagem?**
   - Acesse: http://localhost:3000/explorar/produtos
   - Deve mostrar 10 produtos

2. **Imagens carregam?**
   - Verifique se as imagens dos produtos aparecem
   - Todas usam URLs do Unsplash

3. **Busca funciona?**
   - Digite "notebook" na busca
   - Deve filtrar os resultados

4. **Detalhes funcionam?**
   - Clique em um produto
   - Deve mostrar página completa

---

## 🔄 Limpar e Repovoar

Se precisar limpar e repovoar o banco:

```sql
-- CUIDADO: Isso apaga TODOS os dados!
TRUNCATE TABLE public.favorites CASCADE;
TRUNCATE TABLE public.reviews CASCADE;
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.product_images CASCADE;
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.services CASCADE;
TRUNCATE TABLE public.businesses CASCADE;
TRUNCATE TABLE public.categories CASCADE;
```

Depois execute o seed.sql novamente.

---

## ✅ Checklist de Verificação

Após executar o seed, verifique:

- [ ] 5 categorias criadas
- [ ] 5 estabelecimentos criados
- [ ] 10 produtos criados
- [ ] 10 imagens de produtos criadas
- [ ] 9 serviços criados
- [ ] Produtos aparecem em `/explorar/produtos`
- [ ] Serviços aparecem em `/explorar/servicos`
- [ ] Estabelecimentos aparecem em `/explorar/estabelecimentos`
- [ ] Imagens carregam corretamente
- [ ] Busca funciona
- [ ] Filtros funcionam
- [ ] Detalhes dos produtos abrem

---

## 🆘 Problemas Comuns

### "Violação de chave estrangeira"
- Certifique-se de que o owner_id existe na tabela profiles
- Crie um usuário primeiro via `/registro`

### "Imagens não carregam"
- Verifique se os domínios estão em `next.config.ts` → `remotePatterns`
- Domínio usado: `images.unsplash.com`

### "Nenhum produto aparece"
- Verifique se o seed foi executado com sucesso
- Verifique no Table Editor se os dados estão lá
- Verifique o console do navegador por erros

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no console do navegador
2. Verifique os logs no Supabase Studio
3. Verifique se as RLS policies estão ativas
4. Tente fazer logout e login novamente
