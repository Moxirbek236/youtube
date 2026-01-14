import express from 'express';
import { join } from 'path';
const app = express();
app.use(express.static(join(process.cwd(), 'public')));

app.get('/', (req, res) => {
    res.sendFile(join(process.cwd(), 'templates' , 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(join(process.cwd(), 'templates' , 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(join(process.cwd(), 'templates' , 'login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(join(process.cwd(), 'templates' , 'admin.html'));
});

app.get('/server/register.js', (req, res) => {
    res.sendFile(join(process.cwd(), 'server' , 'register.js'));
});

app.get('/server/login.js', (req, res) => {
    res.sendFile(join(process.cwd(), 'server' , 'login.js'));
});

app.get('/server/index.js', (req, res) => {
    res.sendFile(join(process.cwd(), 'server' , 'index.js'));
});

app.get('/server/admin.js', (req, res) => {
    res.sendFile(join(process.cwd(), 'server' , 'admin.js'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export default app;