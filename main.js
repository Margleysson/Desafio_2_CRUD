'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    document.getElementById('modal').classList.remove('active')
    clearFields()

}


//const tempClient = {
    //nome: "Nicolas",
    //email: "Nicolas@gmail.com",
    //celular: "11984439005",
    //cidade: "São Paulo"
//}

const getLocalStorage = () => JSON.parse(localStorage.getItem("db_client")) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

//CRUD = CREATE READ UPDATE DELETE
const deleteClient = (index, client) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)

}

const readClient = (client) => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
    
}

const isValidFields = () => {
    return document.getElementById("form").reportValidity()

}

//Interacao cliente

const clearFields = () => {
    const fields = document.querySelectorAll(".modal-field")
    fields.forEach(field => field.value = "")
}

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            celular: document.getElementById("celular").value,
            cidade: document.getElementById("cidade").value
        }
        const index = document.getElementById("nome").dataset.index
        if (index == "new") {
            createClient(client)
            updateClient()
            closeModal()
        } else {
            //console.log ("Editando...")
            updateClient(index, client)
            updateTable()
            closeModal()
        }

        //createClient(client)
        //clearFields()
       // updateTable()
    //closeModal()
        
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement("tr")
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">editar</button>
            <button type="button" class="button red" id="delete-${index}">excluir</button>
        </td>
`
document.querySelector("#tableClient>tbody").appendChild(newRow)

}

const clearTable = () => {
    const rows = document.querySelectorAll("#tableClient>tbody tr")
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById("nome").value = client.nome
    document.getElementById("email").value = client.email
    document.getElementById("celular").value = client.celular
    document.getElementById("cidade").value = client.cidade
    document.getElementById("nome").dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
    //console.log (client)
}

const editDelete = () => {
    if (event.target.type == "button") {

        const [action, index] = event.target.id.split("-")

    //console.log (action, index)
        if (action == "edit") {
            editClient(index)
            //console.log ("editando o cliente")
        } else {
            const client = readClient()[index]
            const response = confirm (`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            //console.log ("deletando o cliente") 
            }
            
        }
    }
}

updateTable()

//eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector("#tableClient>tbody")
    .addEventListener("click", editDelete)