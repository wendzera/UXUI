/**
 * Script de Acessibilidade para InfoCursos
 *
 * Gerencia a troca de tema de cores e o ajuste de tamanho da fonte,
 * salvando as preferências do usuário no localStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
    /**********************************/
    /* CONTROLE DE TEMA          */
    /**********************************/
    const themeSelector = document.getElementById('theme-selector');
    const body = document.body;

    const applyTheme = (themeName) => {
        body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
        if (themeName !== 'default') {
            body.classList.add(themeName);
        }
    };

    const saveThemePreference = (themeName) => {
        localStorage.setItem('colorTheme', themeName);
    };

    const loadThemePreference = () => {
        const savedTheme = localStorage.getItem('colorTheme') || 'default';
        if (themeSelector) {
            themeSelector.value = savedTheme;
        }
        applyTheme(savedTheme);
    };

    if (themeSelector) {
        themeSelector.addEventListener('change', (event) => {
            const selectedTheme = event.target.value;
            applyTheme(selectedTheme);
            saveThemePreference(selectedTheme);
        });
    }

    /**********************************/
    /* CONTROLE DE TAMANHO DE FONTE  */
    /**********************************/
    const html = document.documentElement;
    const increaseFontButton = document.getElementById('increase-font');
    const decreaseFontButton = document.getElementById('decrease-font');
    const resetFontButton = document.getElementById('reset-font');

    // Define os limites para o tamanho da fonte em pixels
    const minFontSize = 12;
    const maxFontSize = 20;
    const defaultFontSize = 16;
    const step = 1; // Incremento/decremento em pixels

    /**
     * Altera o tamanho da fonte base do documento.
     * @param {number} newSize - O novo tamanho da fonte em pixels.
     */
    const setFontSize = (newSize) => {
        // Garante que o tamanho da fonte permaneça dentro dos limites definidos
        const clampedSize = Math.max(minFontSize, Math.min(newSize, maxFontSize));
        html.style.fontSize = `${clampedSize}px`;
    };

    /**
     * Salva a preferência de tamanho da fonte no localStorage.
     * @param {number} size - O tamanho da fonte a ser salvo.
     */
    const saveFontSizePreference = (size) => {
        localStorage.setItem('fontSize', size);
    };

    /**
     * Carrega e aplica o tamanho da fonte salvo do localStorage.
     */
    const loadFontSizePreference = () => {
        const savedSize = localStorage.getItem('fontSize');
        // Se houver um tamanho salvo, aplica. Senão, usa o padrão.
        const initialSize = savedSize ? parseInt(savedSize, 10) : defaultFontSize;
        setFontSize(initialSize);
    };

    // Adiciona eventos de clique para os botões de controle de fonte
    if (increaseFontButton) {
        increaseFontButton.addEventListener('click', () => {
            const currentSize = parseFloat(getComputedStyle(html).fontSize);
            const newSize = currentSize + step;
            setFontSize(newSize);
            saveFontSizePreference(newSize);
        });
    }

    if (decreaseFontButton) {
        decreaseFontButton.addEventListener('click', () => {
            const currentSize = parseFloat(getComputedStyle(html).fontSize);
            const newSize = currentSize - step;
            setFontSize(newSize);
            saveFontSizePreference(newSize);
        });
    }

    if (resetFontButton) {
        resetFontButton.addEventListener('click', () => {
            setFontSize(defaultFontSize);
            saveFontSizePreference(defaultFontSize);
        });
    }

    // --- CARREGAMENTO INICIAL ---
    // Carrega as preferências do usuário assim que a página é carregada.
    loadThemePreference();
    loadFontSizePreference();
});