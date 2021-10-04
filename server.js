const http = require('http');
const path = require('path');
const Ticket = require('./ticket');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const cors = require('@koa/cors');
const app = new Koa();

// => Static file handling
const public = path.join(__dirname, '/public');
app.use(cors());
app.use(koaStatic(public));

// => Body Parsers
app.use(koaBody({
    urlencoded: true,
    multipart: true,
    text: true,
    json: true,
}));

app.use(async (ctx) => {
    const { method } = ctx.request;
    switch (method) {
        case "GET":
            if (ctx.request.query.method === "allTickets") {
                ctx.response.body = await Ticket.getAll();
                ctx.response.status = 200;
            } else if (ctx.request.query.method === "ticketById") {
                const ticketId = await Ticket.getById(ctx.request.query.id);
                ctx.response.body = ticketId;
            }
            break;
        case "POST":
            const ticketPost = new Ticket(
                ctx.request.body.name,
                ctx.request.body.description
            );
            await ticketPost.save();
            ctx.response.body = ticketPost;
            ctx.response.status = 200;
            return;
        case "PUT":
            if (ctx.request.body.status) {
                await Ticket.updateStatus(ctx.request.body.id);
            } else {
                await Ticket.update(ctx.request.body);
            }
            ctx.response.body = 'updated';
            ctx.response.status = 200;
            return;
        case "DELETE":
            await Ticket.delete(ctx.request.query.id);
            ctx.response.body = 'deleted';
            ctx.response.status = 204;
            return;
        default:
            ctx.response.status = 404;
            return;
    }
});


const port = process.env.PORT || 7070;
http.createServer(app.callback()).listen(port);