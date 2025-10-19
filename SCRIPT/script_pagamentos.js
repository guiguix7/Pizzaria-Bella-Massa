// Script simples para a página de Pagamentos
// - Alterna entre Entrega e Retirada (habilita/desabilita campos de endereço)
// - Alterna sessão de cartão conforme forma de pagamento
// - Registra cada ação no console

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        // Modalidade: Entrega | Retirada
        const entregaRadio = document.getElementById('opt-entrega');
        const retiradaRadio = document.getElementById('opt-retirada');

        // Campos de endereço (selecionados por name, pois alguns não possuem id)
        const addressFieldNames = ['cep', 'endereco', 'numero', 'bairro', 'cidade'];
        const addressFields = addressFieldNames
            .map((name) => document.querySelector(`input[name="${name}"]`))
            .filter(Boolean);

        function setEntregaMode(isEntrega) {
            addressFields.forEach((el) => {
                el.disabled = !isEntrega;
                el.required = isEntrega;
                if (!isEntrega) {
                    el.value = '';
                }
            });
            console.log(`[Modalidade] ${isEntrega ? 'Entrega' : 'Retirada'} selecionada`);
        }

        if (entregaRadio) {
            entregaRadio.addEventListener('change', function () {
                if (entregaRadio.checked) setEntregaMode(true);
            });
        }
        if (retiradaRadio) {
            retiradaRadio.addEventListener('change', function () {
                if (retiradaRadio.checked) setEntregaMode(false);
            });
        }

        // Inicialização da modalidade com base no estado atual dos rádios
        if (entregaRadio?.checked) setEntregaMode(true);
        else if (retiradaRadio?.checked) setEntregaMode(false);

        // Forma de Pagamento: Cartão | PIX | Dinheiro
        const cartaoRadio = document.getElementById('pagto-cartao');
        const pixRadio = document.getElementById('pagto-pix');
        const dinheiroRadio = document.getElementById('pagto-dinheiro');
        const sessaoCartao = document.getElementById('sessao-cartao');

        const pixInput = document.getElementById('pix');

        function setCardFieldsEnabled(enabled) {
            if (!sessaoCartao) return;
            const inputs = sessaoCartao.querySelectorAll('input');
            inputs.forEach((el) => {
                el.disabled = !enabled;
                el.required = enabled;
                if (!enabled) el.value = '';
            });
        }

        function setPixEnabled(enabled) {
            if (!pixInput) return;
            pixInput.disabled = !enabled;
            pixInput.required = enabled;
            if (!enabled) pixInput.value = '';
        }

        function updatePagamentoSection() {
            if (cartaoRadio?.checked) {
                if (sessaoCartao) sessaoCartao.style.display = '';
                setCardFieldsEnabled(true);
                setPixEnabled(false);
                console.log('[Pagamento] Cartão selecionado');
            } else if (pixRadio?.checked) {
                if (sessaoCartao) sessaoCartao.style.display = 'none';
                setCardFieldsEnabled(false);
                setPixEnabled(true);
                console.log('[Pagamento] PIX selecionado');
            } else if (dinheiroRadio?.checked) {
                if (sessaoCartao) sessaoCartao.style.display = 'none';
                setCardFieldsEnabled(false);
                setPixEnabled(false);
                console.log('[Pagamento] Dinheiro selecionado');
            } else {
                // Estado inicial/desconhecido
                if (sessaoCartao) sessaoCartao.style.display = 'none';
                setCardFieldsEnabled(false);
                setPixEnabled(false);
                console.log('[Pagamento] Método não selecionado');
            }
        }

        [cartaoRadio, pixRadio, dinheiroRadio].forEach((el) => {
            if (!el) return;
            el.addEventListener('change', updatePagamentoSection);
        });

        // Inicialização da sessão de pagamento
        updatePagamentoSection();

        // Log de envio do formulário
        const form = document.getElementById('form-pagamento');
        if (form) {
            form.addEventListener('submit', function () {
                console.log('[Ação] Formulário de pagamento enviado');
            });
        }
    });
})();

