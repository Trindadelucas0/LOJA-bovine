# Iniciar a loja Medusa (rápido)

Detalhes completos em [GUIA.md](GUIA.md).

## Abrir o projeto no editor

**File → Open Folder...** → `D:\medusa-loja`

## Subir os serviços

```powershell
docker start medusa-postgres
```

```powershell
cd D:\medusa-loja\apps\backend
npm run dev
```

```powershell
cd D:\medusa-loja\apps\storefront
npm run dev
```

## Acessos

| O quê | URL / dado |
|-------|------------|
| Admin | http://localhost:9000/app |
| Login | `admin@avadesk.local` / `MedusaLocal123!` |
| Loja | http://localhost:8000 |
| Região padrão | Brasil (`br`) · moeda **BRL** |

## Checklist rápido (sua loja)

1. Idioma do Admin → Português  
2. Nome / logo da loja  
3. Produtos em portugues (preços em R$)  
4. Região BR / BRL / frete  
5. Pagamento (depois)  
6. Publishable key (já configurada)  
7. Editar páginas em `apps\storefront\src`  

## Parar

Ctrl+C nos terminais do backend e do storefront. O container `medusa-postgres` pode ficar Up.
