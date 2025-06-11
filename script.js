document.addEventListener('DOMContentLoaded', () => {
    const voteButton = document.getElementById('voteButton');
    const showResultsButton = document.getElementById('showResultsButton');
    const resultsDiv = document.getElementById('results');
    const teamAVotesSpan = document.getElementById('teamAVotes');
    const teamBVotesSpan = document.getElementById('teamBVotes');
    const voterListUl = document.getElementById('voterList');
    const winnerMessage = document.getElementById('winnerMessage');
    const voterNameInput = document.getElementById('voterName');
    const resetButton = document.getElementById('resetButton');

    let votes = JSON.parse(localStorage.getItem('votes')) || { 'Time A': 0, 'Time B': 0 };
    let votersRaw = JSON.parse(localStorage.getItem('voters')) || [];
    let voters = [];
    if (votersRaw.length > 0) {
        if (typeof votersRaw[0] === 'object' && votersRaw[0] !== null && votersRaw[0].name) {
            voters = votersRaw.map(voterObj => voterObj.name);
        } else {
            voters = votersRaw;
        }
    }

    function updateResultsDisplay() {
        teamAVotesSpan.textContent = votes['Time A'];
        teamBVotesSpan.textContent = votes['Time B'];

        voterListUl.innerHTML = '';
        if (voters.length === 0) {
            voterListUl.innerHTML = '<li>Ninguém votou ainda.</li>';
        } else {
            voters.forEach(voterName => {
                const li = document.createElement('li');
                li.textContent = `${voterName} votou.`;
                voterListUl.appendChild(li);
            });
        }

        if (votes['Time A'] > votes['Time B']) {
            winnerMessage.textContent = 'A Equipe A está vencendo!';
        } else if (votes['Time B'] > votes['Time A']) {
            winnerMessage.textContent = 'A Equipe B está vencendo!';
        } else if (votes['Time A'] === 0 && votes['Time B'] === 0) {
            winnerMessage.textContent = 'Aguardando votos para determinar o vencedor.';
        }
        else {
            winnerMessage.textContent = 'Empate!';
        }
    }

    function saveData() {
        localStorage.setItem('votes', JSON.stringify(votes));
        localStorage.setItem('voters', JSON.stringify(voters));
    }

    voteButton.addEventListener('click', () => {
        const selectedTeam = document.querySelector('input[name="team"]:checked');
        const voterName = voterNameInput.value.trim();

        if (!selectedTeam) {
            alert('Por favor, selecione um time!');
            return;
        }

        if (voterName === '') {
            alert('Por favor, digite seu nome completo');
            return;
        }

        const hasVoted = voters.some(name => name.toLowerCase() === voterName.toLowerCase());
        if (hasVoted) {
            alert('Você já votou!');
            return;
        }

        const teamName = selectedTeam.value;
        votes[teamName]++;
        voters.push(voterName);

        saveData();
        alert(`Obrigado pelo seu voto, ${voterName}!`);

        selectedTeam.checked = false;
        voterNameInput.value = '';
    });

    showResultsButton.addEventListener('click', () => {
        resultsDiv.style.display = 'block';
        updateResultsDisplay();
    });

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja reiniciar a votação? Isso apagará todos os votos!')) {
                votes = { 'Time A': 0, 'Time B': 0 };
                voters = [];
                saveData();
                updateResultsDisplay();
                alert('Votação reiniciada! Todos os votos foram apagados.');
            }
        });
    }

    if (localStorage.getItem('votes') || localStorage.getItem('voters')) {
        updateResultsDisplay();
    }
});
