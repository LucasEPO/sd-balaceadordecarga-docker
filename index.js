async function submitForm() {
    const aInput = document.getElementById('a');
    const bInput = document.getElementById('b');

    const formData = {
        a: aInput.value,
        b: bInput.value,
    };

    try {
        if(!formData.a || !formData.b) {
            window.alert('Preencha os dois campos!!');
            return;
        }

        //requisicao post para o balanceador
        //Sem axios pois nao estava funcionando como esperado
        const response = await fetch('http://localhost:9093/bc', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao enviar dados: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const service = data.microservice;
        
        window.alert('Dados enviados com sucesso!\nServico: ' + service);
        document.getElementById('a').value = '';
        document.getElementById('b').value = '';

        //adiciona o valor na tabela caso exista para não precisar fazer uma nova requisicao
        const table = document.getElementById('dataTable');
        if (table) {
            const tableOrder = ['_id', 'microservice', 'a', 'b', 'resultado', 'timestamp'];
            const newRow = document.createElement('tr');
            tableOrder.forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = data[key];
                newRow.appendChild(cell);
            });
            table.querySelector('tbody').appendChild(newRow);
        }

    } catch (error) {
        window.alert('Erro!\nNenhum servico disponivel');
    }
}

async function getData() {
    try {

        //requisição get para o balanceador
        const response = await fetch('http://localhost:9093/bc', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao obter os dados');
        }

        const data = await response.json();

        //cria a tabela
        const table = createTable(data);
        const dataContainer = document.getElementById('dataContainer');
        dataContainer.innerHTML = '';
        dataContainer.appendChild(table);

        //muda o botao
        const getDataButton = document.getElementById('getDataButton');
        getDataButton.textContent = 'Esconder Dados';
        getDataButton.onclick = toggleDataVisibility;
    } catch (error) {
        window.alert('Erro ao obter os dados: ' + error.message);
    }
}

function toggleDataVisibility() {
    const dataContainer = document.getElementById('dataContainer');
    const getDataButton = document.getElementById('getDataButton');
    if (dataContainer.innerHTML === '') {
        getData();
    } else {
        dataContainer.innerHTML = ''; 
        getDataButton.textContent = 'Ver Dados';
        getDataButton.onclick = toggleDataVisibility;
    }
}

document.getElementById("getDataButton").addEventListener("click", function() {
    this.classList.toggle("clicked");
    document.getElementById('dataContainer').classList.toggle("clicked");
});

function createTable(data) {
    const table = document.createElement('table');
    table.id = 'dataTable';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const tableOrder = ['_id', 'microservice', 'a', 'b', 'resultado', 'timestamp'];

    //cria o header da tabela com os dados na ordem escolhida
    tableOrder.forEach(key => {
        const headerCell = document.createElement('th');
        headerCell.textContent = key;
        headerRow.appendChild(headerCell);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    //cria o body da tabela
    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const row = document.createElement('tr');
        tableOrder.forEach(key => {
            const cell = document.createElement('td');
            cell.textContent = item[key];
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    return table;
}