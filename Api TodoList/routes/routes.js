const pool = require('../config/dbConfig');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const auth = require('../middleware/auth');



const router = app => {

    app.get('/', (request, response) => {
        response.send({
            message: 'API is running'
        });
    });


    //#region  Users

    /// Вход Пользователя
    app.post('/userLogin', function (req, res) {
        var login = req.body.Login;
        var Password = req.body.Password;
        console.log(login);
        console.log(Password);
        //const configObject = JSON.parse(config);
        pool.query('select  * from users WHERE Login = ? AND Password = ?', [login, Password], function (err, resp) {
            if (err) console.log(err);
            
            if(resp && resp.length >0)
            {
                const payload = {
                    user: { id: resp[0].ID_User }
                }
                jwt.sign(payload, config.jwtSecret,
                (err, token) => {
                    if (err) throw err;
                    res.send(token);
                    console.log(token);
                });
            }
            else res.send(null);
            
            console.log(`Пользователь "${login}" вошел в систему.`)
        });
    });

    /// Проверка на оригинальность логина при создании
    app.post('/userCheck', function (req, res) {
        //const id = req.params.ID_User;
        const Login = req.body.Login;
        console.log(Login);
        pool.query('select * from users WHERE Login = ?', [Login], function (err, resp) {
            if (err) console.log(err);
            res.send(resp);
        });
    });

    /// Создание пользователя 
    app.post('/userAdd', function (req, res) {
        const Login = req.body.Login;
        const Password = req.body.Password;
        pool.query("INSERT INTO users (Login, Password) VALUES (?,?)", [Login, Password], (error, result) => {
            if (error) throw error;
            res.send(`user "${Login}" added`);
        });
    });

    //#endregion

  

    //#region  CommonTasks

    /// Загрузка задач
    app.post('/CommonTasks', auth, function (req, res) {
        const User = req.user.id
        pool.query("SELECT  ID_Task, Description, DealStatus FROM Tasks WHERE Date is Null And User = ?", [User], (error, resp) => {
            if (error) throw error;
            console.log(resp);
            res.send(resp);
        });
    });

    /// Создание задачи
    app.post('/CommonTasksAdd', auth, function (req, res) {
        const User = req.user.id
        const Description = req.body.Description;
        const DealStatus = req.body.DealStatus;
        const DateDeadline = req.body.DateDeadline
        pool.query("INSERT INTO Tasks (User, Description, DateDeadline, DealStatus) VALUES (?, ?, ?, ?)",
            [User, Description, DateDeadline, DealStatus], (error, resp) => {
                if (error) throw error;
                console.log(resp);
                res.send(resp);
            });
    });


    /// Загрузка определенной  общей задачи
    app.post('/CommonTaskGetOne', auth, function (req, res) {
        const ID_Task = req.body.ID_Task;
        pool.query("select  Description, DealStatus, User from Tasks where ID_Task = ?", [ID_Task], (error, resp) => {
            if (error) throw error;
            console.log(resp);
            res.send(resp);
        });
    });

    /// Редактирование общей задачи
    app.post('/CommonTaskUpdate', auth, function (req, res) {
        const ID_Task = req.body.ID_Task;
        const Description = req.body.Description;
        const User = req.user.id
        const DealStatus = req.body.DealStatus;
        pool.query("update Tasks set User = ?, Description = ?, dealstatus = ? where ID_Task = ?",
            [User, Description, DealStatus, ID_Task], (error, resp) => {
                if (error) throw error;
                console.log(resp);
                res.send(resp);
            });
    });


    /// Обновление статуса общей задачи
    app.post('/CommonTasksUpdateStatus', auth, function (req, res) {
        const ID_Task = req.body.ID_Task;
        const DealStatus = req.body.DealStatus;
        pool.query("update Tasks set  dealstatus = ? where ID_Task = ?",
            [DealStatus, ID_Task], (error, resp) => {
                if (error) throw error;
                console.log(resp);
                res.send(resp);
            });
    });
    /// Удаление общей задачи
    app.post('/CommonTaskDelete', auth, function (req, res) {
        const ID_Task = req.body.ID_Task;
        console.log(ID_Task);
        pool.query("delete  from Tasks where ID_Task = ?", [ID_Task], (error, resp) => {
            if (error) throw error;
            console.log(resp);
            res.send(resp);
        });
    });

    //#endregion

    //#region DailyTasks

    // Загрузка
    app.post('/TasksDay', auth, function (req, res) {
        const User = req.user.id;
        const dateCreateTask = req.body.Date;
        console.log(User, dateCreateTask);
        pool.query("select * from tasks where user = ? AND Date = ?", [User, dateCreateTask], (error, resp) => {
            if (error) throw error;
            console.log(resp);
            res.send(resp);
        });
    });

    // Добавление задачи
    app.post('/DailyTaskAdd', auth, function (req, res) {
        const User = req.user.id;
        const Date = req.body.Date;
        const Description = req.body.Description;
        const DateDeadline = req.body.DateDeadline;
        const DealStatus = req.body.DealStatus
        pool.query("insert into tasks (description, DateDeadline, Date, User, DealStatus) values (?, ?, ?, ?, ?) ",
            [Description, DateDeadline, Date, User, DealStatus], (error, resp) => {
                if (error) throw error;
                console.log(resp);
                res.send(resp);
            });
    });

    app.post('/DailyTaskGetOne', auth, function (req, res) {
        const ID_Task = req.body.ID_Task;
        pool.query("select  Description, DealStatus, DateDeadline, User from Tasks where ID_Task = ?", [ID_Task], (error, resp) => {
            if (error) throw error;
            console.log(resp);
            res.send(resp);
        });
    });

    /// Редактирование ежедневной задачи
    app.post('/DailyTaskUpdate', auth,  function (req, res) {
        const ID_Task = req.body.ID_Task;
        const Description = req.body.Description;
        const User = req.user.id;
        const DealStatus = req.body.DealStatus;
        const DateDeadline = req.body.DateDeadline;
        const Date = req.body.Date;
        pool.query("Update Tasks Set User = ?, Description = ?, DateDeadline = ?, dealstatus =?, Date = ? Where ID_Task =?",
            [User, Description, DateDeadline, DealStatus, Date, ID_Task], (error, resp) => {
                if (error) throw error;
                console.log(resp);
                res.send(resp);
            });
    });

    /// Обновление статуса ежедневной задачи
    app.post('/DailyTaskUpdateStatus',  auth, function (req, res) {
        const ID_Task = req.body.ID_Task;
        const DealStatus = req.body.DealStatus;
        pool.query("update tasks set DealStatus = ? WHERE ID_Task = ?",
            [DealStatus, ID_Task], (error, resp) => {
                if (error) throw error;
                console.log(resp);
                res.send(resp);
            });
    });

    /// Удаление ежедневной задачи
    app.post('/DailyTaskDelete', auth, function (req, res) {
        const ID_Task = req.body.ID_Task;
        console.log(ID_Task);
        pool.query("delete  from Tasks where ID_Task = ?", [ID_Task], (error, resp) => {
            if (error) throw error;
            console.log(resp);
            res.send(resp);
        });
    });

    //#endregion
}

module.exports = router;