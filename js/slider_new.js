// Products Grid Module
// Este arquivo foi modificado para remover a funcionalidade de slider,
// substituindo-a por um grid estático para maior compatibilidade entre navegadores

class ProductsSlider {
    constructor() {
        // Não faz nada, já que o slider foi removido
        console.info('ProductsSlider: O slider foi substituído por um grid estático');
    }

    // Mantido apenas para compatibilidade com o código existente
    init() {
        console.info('ProductsSlider: Usando grid estático em vez do slider');
        // Nenhuma inicialização necessária
    }
}

// Inicializa o módulo quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Cria uma instância do ProductsSlider para manter compatibilidade
    window.productsSlider = new ProductsSlider();
});
