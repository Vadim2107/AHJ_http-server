const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

class Ticket {
    constructor(name, description) {
        this.id = uuidv4();
        this.name = name;
        this.description = description;
        this.status = false;
        this.created = new Date().toLocaleString();
    }

    async save() {
        const tickets = await Ticket.getAll();
        tickets.push(this.toJSON());
        return  new Promise((resolve, reject) =>{
            fs.writeFile(
                path.join(__dirname, 'public', 'db.json'),
                JSON.stringify(tickets),
                err => {
                    if(err){
                        reject(err)
                    }else{
                        resolve()
                    }

                }
            )
        })

    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            status: this.status,
            created: this.created,
            id: this.id,
        }
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, 'public', 'db.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err)
                    }else{
                        resolve(JSON.parse(content))
                    }
                }
            )
        })
    }

    static async getById(id) {
        const tickets = await Ticket.getAll();
        return tickets.find(elem => elem.id === id)
    }

    static async update(ticket){

        const tickets = await Ticket.getAll();
        const idx = tickets.findIndex(elem => elem.id === ticket.id);
        tickets[idx].name = ticket.name;
        tickets[idx].description = ticket.description;

        return  new Promise((resolve, reject) =>{
            fs.writeFile(
                path.join(__dirname, 'public', 'db.json'),
                JSON.stringify(tickets),
                err => {
                    if(err){
                        reject(err)
                    }else{
                        resolve()
                    }
                }
            )
        })
    }

    static async updateStatus(id){
        const tickets = await Ticket.getAll();
        const idx = tickets.findIndex(elem => elem.id === id);
        tickets[idx].status = !tickets[idx].status;

        return  new Promise((resolve, reject) =>{
            fs.writeFile(
                path.join(__dirname, 'public', 'db.json'),
                JSON.stringify(tickets),
                err => {
                    if(err){
                        reject(err)
                    }else{
                        resolve()
                    }
                }
            )
        })
    }

    static async delete(id){
        let tickets = await Ticket.getAll();
        tickets = tickets.filter(elem => elem.id !== id);

        return  new Promise((resolve, reject) =>{
            fs.writeFile(
                path.join(__dirname, 'public', 'db.json'),
                JSON.stringify(tickets),
                err => {
                    if(err){
                        reject(err)
                    }else{
                        resolve()
                    }
                }
            )
        })
    }

}

module.exports = Ticket;
