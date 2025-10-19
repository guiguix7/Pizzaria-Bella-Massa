// Script para página "Monte sua própria pizza" (Faça.html)
// Requisito: ao selecionar "Meia", criar um novo card de sabor (Sabor 1 e Sabor 2).
// Ao selecionar "Inteira", manter apenas um card com o título original (sem numeração).
// Todas as ações são registradas via console.log.

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const radioMeia = document.getElementById('meia');
        const radioInteira = document.getElementById('inteira');
        if (!radioMeia || !radioInteira) return;

        // Encontra o <main> do card base de Sabor: é o próximo card após o card de Meia/Inteira
        function findBaseSaborMain() {
            const meiaMain = radioMeia.closest('main');
            if (!meiaMain) return null;
            let cur = meiaMain.nextElementSibling;
            while (cur) {
                const title = cur.querySelector('.titulo-opcoes h1');
                if (title && /Escolha o Sabor/i.test(title.textContent)) {
                    return cur;
                }
                cur = cur.nextElementSibling;
            }
            return null;
        }

        const saborMain = findBaseSaborMain();
        if (!saborMain) return;

        let saborClone = null; // manter referência do clone (Sabor 2)

        function setSaborHeader(mainEl, texto) {
            const h1 = mainEl.querySelector('.titulo-opcoes h1');
            if (h1) h1.textContent = texto;
        }

        function setSaborGroupName(mainEl, newName) {
            // Ajusta o name dos rádios para grupos distintos
            const radios = mainEl.querySelectorAll('input[type="radio"][name="recheio"], input[type="radio"][name^="recheio"]');
            radios.forEach((r) => {
                // Mantém os ids originais no card base; no clone vamos mudar ids
                r.name = newName;
            });
        }

        function buildCloneFromBase() {
            // Cria e prepara o clone (Sabor 2): ids/for únicos e group name distinto
            const clone = saborMain.cloneNode(true);
            setSaborHeader(clone, 'Escolha o Sabor 2:');

            // Atualiza todos os inputs/labels do clone
            const radios = clone.querySelectorAll('input[type="radio"]');
            radios.forEach((input) => {
                const oldId = input.id;
                // Gera novo id único
                const newId = oldId ? `${oldId}-s2` : `recheio-s2-${Math.random().toString(36).slice(2, 7)}`;
                input.id = newId;
                input.checked = false;
                input.name = 'recheio2';
                // Ajusta label associado, se existir
                if (oldId) {
                    const label = clone.querySelector(`label[for="${oldId}"]`);
                    if (label) label.setAttribute('for', newId);
                }
            });

            // Ajusta o botão limpar do clone para limpar apenas seus próprios campos (comportamento padrão do form já cobre)
            const cloneForm = clone.querySelector('form.grupo-opcoes');
            if (cloneForm) {
                const resetBtn = cloneForm.querySelector('button[type="reset"]');
                if (resetBtn) {
                    resetBtn.addEventListener('click', function () {
                        console.log('[Sabor 2] Limpar seleção');
                    });
                }
            }

            return clone;
        }

        function ensureCloneInserted() {
            if (saborClone && document.body.contains(saborClone)) return; // já inserido
            saborClone = buildCloneFromBase();
            // Título do card base vira "Sabor 1" e group name muda para recheio1
            setSaborHeader(saborMain, 'Escolha o Sabor 1:');
            setSaborGroupName(saborMain, 'recheio1');

            // Inserir clone logo após o card base de Sabor
            saborMain.parentNode.insertBefore(saborClone, saborMain.nextElementSibling);
            console.log('[Ação] Criado card "Sabor 2"');
        }

        function removeCloneIfAny() {
            if (saborClone && saborClone.parentNode) {
                saborClone.parentNode.removeChild(saborClone);
                saborClone = null;
                console.log('[Ação] Removido card "Sabor 2"');
            }
            // Restaurar título e group name do card base
            setSaborHeader(saborMain, 'Escolha o Sabor:');
            setSaborGroupName(saborMain, 'recheio');
        }

        // Listeners de mudança
        radioMeia.addEventListener('change', function () {
            if (radioMeia.checked) {
                console.log('[Seleção] Meia');
                ensureCloneInserted();
            }
        });

        radioInteira.addEventListener('change', function () {
            if (radioInteira.checked) {
                console.log('[Seleção] Inteira');
                removeCloneIfAny();
            }
        });

        // Estado inicial
        if (radioMeia.checked) {
            console.log('[Inicialização] Meia já selecionado');
            ensureCloneInserted();
        } else {
            console.log('[Inicialização] Inteira (padrão)');
            removeCloneIfAny();
        }
    });
})();

