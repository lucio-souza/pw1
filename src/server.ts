import express from 'express';
import {v4 as uuid}  from 'uuid';

const server =express();
server.use(express.json())
const port=8080;

type TransactionType={
    id:string,
    type:string,
    value:number,
    date:Date
}

type UserType={
    id:string,
    cpf:string,
    name:string,
    transactions:TransactionType[]
}

const users=[] as UserType[];

type bodytype ={
    cpf:string,
    name:string
}

//CRUD User
server.get('/user',(req,res)=>{
    res.status(201).json(users)
})

server.post('/user',(req,res)=>{
    const {cpf,name}=req.body as bodytype;
    const clientNew={
        cpf,
        name,
        id:uuid(),
        transactions:[]
    }
    users.push(clientNew);
    res.status(201).json("usuario cadatrado")
})

server.put('/user/:id',(req,res)=>{
    const {id}=req.params;
    const {cpf,name}=req.body

    const indice=users.findIndex(user=>user.id===id);
    if(indice<0){
        return res.status(404).json("erro ao atualizar")
    }
    users[indice]={
        id,
        cpf,
        name,
        transactions:users[indice].transactions
    }

})

server.delete('/user/:id',(req,res)=>{
    const {id}=req.params;
    const indice=users.findIndex(users=>users.id===id);
    if(indice<0) return res.status(404).json("erro ao deletar")
    users.splice(indice,1)
    res.status(200).json("usuario deletado")
})

//CRUD trnasações

type bodytransactions={
    type:string,
    value:number,
    date:Date

}

server.get('/transactions',(req,res)=>{
    res.status(201).json(users)
})

server.post('/transactions',(req,res)=>{
    const {value,type}=req.body as bodytransactions;
    const {id}=req.headers; 
    const cliente=users.find(client=>client.id===id);

    if(!cliente){
        return res.status(404).json("erro ao atualizar")
    }

    const transactions={
        id:uuid(),
        type,
        value,
        date:new Date()
    }
    if(transactions.type==="credit" || transactions.type==="debit"){
    cliente.transactions.push(transactions)
    res.status(201).json("usuario cadatrado")
    }else{
        res.send("tipo de transação invalida")
    }
})

server.put('/transactions/:idUser', (req, res) => {
    const { id } = req.headers;
    const {idUser}=req.params
    const { value} = req.body;

    const indexUser = users.findIndex(user => user.id === idUser);
    if(indexUser===-1){
        res.send(`${idUser} ${id}`)
    }

    const transactionIndex = users[indexUser].transactions.findIndex(trans => trans.id === id);
    if (transactionIndex === -1) {
        return res.status(404).json("Transação não encontrada.");
    }

    // Atualizando os dados da transação
    users[indexUser].transactions[transactionIndex].value = value;
    res.status(200).json("Transação atualizada com sucesso.");
});



server.delete('/transactions/:idUser',(req,res)=>{
    const {id}=req.headers
    const {idUser}=req.params;

    const indexUser=users.findIndex(users=>users.id===idUser);
    const transactionIndex = users[indexUser].transactions.findIndex(trans => trans.id === id);

    users[indexUser].transactions.splice(transactionIndex,1)
    res.status(200).json("usuario deletado")
})

server.listen(port,()=>{
    console.log("conexao feita");
    
})