

document.addEventListener('DOMContentLoaded', () => {
    const logoShenlong = document.getElementById('logo-shenlong');
    const searchBox = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    const resultsContainer = document.querySelector('.results-container');
    const suggestionsContainer = document.querySelector('.suggestions-container');

    // Redirecionamento ao clicar na logo do Shenlong
    logoShenlong.addEventListener('click', () => {
        window.location.href = ''; // Substitua pela URL correta
    });

    // Posiciona as sugestões logo abaixo da barra de pesquisa
    const positionSuggestions = () => {
        const searchBoxRect = searchBox.getBoundingClientRect();
        suggestionsContainer.style.position = 'absolute';
        suggestionsContainer.style.top = `${searchBoxRect.bottom + window.scrollY}px`;
        suggestionsContainer.style.left = `${searchBoxRect.left}px`;
        suggestionsContainer.style.width = `${searchBoxRect.width}px`;
    };

    // Função para buscar personagens com base na primeira letra
    const getCharacterSuggestions = async (prefix) => {
        if (prefix.length < 1) {
            suggestionsContainer.innerHTML = ''; // Limpar sugestões se o prefixo for menor que 1 letra
            return;
        }

        const url = `https://dragonball-api.com/api/characters/?name=${prefix}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Limpar sugestões anteriores
            suggestionsContainer.innerHTML = '';

            // Criar lista de sugestões com base nos resultados
            if (data.length > 0) {
                suggestionsContainer.style.width = `${searchBox.offsetWidth}px`; // Ajusta a largura das sugestões conforme a barra de pesquisa
                data.forEach(character => {
                    const suggestionItem = document.createElement('li');
                    suggestionItem.textContent = character.name;
                    suggestionItem.style.padding = '10px';
                    suggestionItem.style.textAlign = 'left';
                    suggestionItem.style.fontSize = '14px';
                    suggestionItem.addEventListener('click', () => {
                        searchBox.value = character.name; // Preenche a barra de pesquisa com o nome clicado
                        suggestionsContainer.innerHTML = ''; // Limpa as sugestões
                        searchCharacter(character.name); // Pesquisa o personagem
                    });
                    suggestionsContainer.appendChild(suggestionItem);
                });
                positionSuggestions(); // Atualiza a posição da lista de sugestões
            } else {
                suggestionsContainer.innerHTML = '<li>Nenhuma sugestão encontrada.</li>';
            }
        } catch (error) {
            console.error('Erro ao buscar sugestões:', error);
            suggestionsContainer.innerHTML = '<li>Erro ao buscar sugestões.</li>';
        }
    };

    // Função para buscar personagem na API
    const searchCharacter = async (name) => {
        const url = `https://dragonball-api.com/api/characters/?name=${name}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();

            // Limpar resultados anteriores
            resultsContainer.innerHTML = '';

            if (data.length > 0) {
                resultsContainer.style.display = 'grid';
                resultsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
                resultsContainer.style.gap = '10px';
                resultsContainer.style.justifyContent = 'center';
                resultsContainer.style.alignItems = 'center';
                resultsContainer.style.height = 'calc(100vh - 100px)'; // Mantém os cards na tela principal sem rolagem
                data.forEach(character => {
                    // Criar card para cada personagem
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.style.width = '600px';
                    card.style.height = '1000px';
                
                    // Adicionar informações ao card usando lista
                    card.innerHTML = `
                        <img src="${character.image}" alt="${character.name}" class="card-image" style="width: 170px; height: 63%; object-fit: top center;">
                        <h2 style="font-size: px; margin: 5px 0;">${character.name}</h2>
                        <ul style="font-size: 15px; font-weight: 600; text-align: left; padding: 0 15px;">
                            <li><strong>Raça:</strong> ${character.race}</li>
                            <li><strong>Gênero:</strong> ${character.gender}</li>
                            <li><strong>Ki:</strong> ${character.ki}</li>
                            <li><strong>Ki Máximo:</strong> ${character.maxKi}</li>
                            <li><strong>Origem:</strong> ${character.origin}</li>
                            <li><strong>Descrição:</strong> ${character.description.slice(0, 1000)}...</li> <!-- Primeiras 100 letras da descrição -->
                        </ul>
                    `;
                
                    resultsContainer.appendChild(card);
                });
                
            } else {
                resultsContainer.innerHTML = '<p>Nenhum personagem encontrado.</p>';
            }
        } catch (error) {
            console.error('Erro ao buscar personagem:', error);
            resultsContainer.innerHTML = '<p>Ocorreu um erro ao buscar os personagens.</p>';
        }
    };

    // Ação do botão de pesquisa
    searchButton.addEventListener('click', () => {
        const searchTerm = searchBox.value.trim();
        if (searchTerm) {
            searchCharacter(searchTerm);
            suggestionsContainer.innerHTML = ''; // Limpar sugestões após a pesquisa
        }
    });

    // Pesquisa ao pressionar Enter
    searchBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = searchBox.value.trim();
            if (searchTerm) {
                searchCharacter(searchTerm);
                suggestionsContainer.innerHTML = ''; // Limpar sugestões após a pesquisa
            }
        }
    });

    // Ação para sugerir nomes enquanto o usuário digita
    searchBox.addEventListener('input', (event) => {
        const searchTerm = searchBox.value.trim();
        getCharacterSuggestions(searchTerm); // Obter sugestões enquanto digita
    });

    // Ajustar a posição das sugestões ao redimensionar a janela
    window.addEventListener('resize', positionSuggestions);
});
