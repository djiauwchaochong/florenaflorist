const { Bucket, Detail, Type, User, Transaction } = require('../models')
const generatePassword = require('password-generator');
const bcrypt = require('bcryptjs')
const { sumRp } = require('../helpers/rp.js');
const { Op } = require('sequelize')

class Controller {

    // BEFORE PENJEGALAN

    static createNewUser(req, res){
        var password = generatePassword()
        var {username, name, address, phone, gender} = req.body
        User.create({username, password, role: 'user'})
        .then(data => {
            var scanId = data.id
            Detail.create({name, address, phone, gender, UserId: scanId})
            .then(data => {
                res.render('showpassword', {username: username, password: password})
            })
            .catch(error => {
                error = error.errors.map(el => {
                    return el.message
                })    
                res.render('validationError', {error: error})
            })
        })
        .catch(error => {
            error = error.errors.map(el => {
                return el.message
            })
            res.render('validationError', {error: error})
        })
    }

    static login(req, res){
        var {username, password} = req.body
        User.findOne({
            where: {username: username}
        })
        .then(data => {
            if(data){
                const isValidPass = bcrypt.compareSync(password, data.password)
                if(isValidPass){
                    req.session.userID = data.id
                    req.session.userName = data.username
                    req.session.isBuying = data.isBuying
                    res.redirect('/bucket')
                }
                else{
                    res.redirect('/login?error=invalid-data')
                }
            }
            else{
                res.redirect('/login?error=invalid-data')
            }

        })
        .catch(error => {
            res.render('error', {error: error})
        })
    }

    // AFTER PENJEGALAN

    static logout(req, res){
        req.session.destroy(error => {
            if(error){
                res.render('error', {error: error})
            }
            else{
                res.redirect('/')
            }
        })
    }

    static getBucket(req, res){
        if(!req.query.search){
            Bucket.findAll({
                order: [['name', 'ASC']],
                include: Type,
                where: {
                    stock: {
                        [Op.gt]: 0
                    }
                }
            })
            .then(dataBucket => {
                User.findOne({
                    where: {id: req.session.userID}
                })
                .then(dataUser => {
                    res.render('bucketList', {dataBucket: dataBucket, dataUser: dataUser, username: req.session.userName})
                })
                .catch(error => {
                    res.render('error', {error: error})
                })
            })
            .catch(error => {
                res.render('error', {error: error})
            })
        }
        else{
            Bucket.findAll({
                order: [['name', 'ASC']],
                include: Type,
                where: {
                    stock: {
                        [Op.gt]: 0
                    },
                    name: {
                        [Op.iLike]: `%${req.query.search}%`
                    }
                }
            })
            .then(dataBucket => {
                User.findOne({
                    where: {id: req.session.userID}
                })
                .then(dataUser => {
                    res.render('bucketList', {dataBucket: dataBucket, dataUser: dataUser, username: req.session.userName})
                })
                .catch(error => {
                    res.render('error', {error: error})
                })
            })
            .catch(error => {
                res.render('error', {error: error})
            })
        }

    }

    static getBucketDetail(req, res){
        Bucket.findOne({
            include: Type,
            where: {id: req.params.id}
        })
        .then(data => {
            var username = req.session.userName
            var isbuying = req.session.isBuying
            res.render('bucketDetail', {data: data, sumRp, username: username, isbuying: isbuying})
        })
        .catch(error => {
            res.render('error', {error: error})
        })
    }

    static restock(req, res){
        Bucket.increment({
            stock: +1
        }, { where: {
            id: req.params.id
        }})
        .then(data => {
            res.redirect(`/bucket/${req.params.id}`)
        })
        .catch(error => {
            res.render('error', {error: error})
        })
    }

    static buy(req, res){
        User.update({isBuying: true}, {where: {id: req.session.userID}})
        .then(data => {
            Bucket.increment({stock: -1}, {where: {id: req.params.id}})
            .then(data => {
                Bucket.findOne({
                    where: {id: req.params.id,},
                    include: Type
                })
                .then(dataBucket => {
                    var price = dataBucket.price + dataBucket.Type.ongkos
                    Transaction.create({username: req.session.userName, name: dataBucket.name, price: price})
                    .then(data => {
                    req.session.isBuying = true
                    res.render('buyingSuccess', {dataBucket: dataBucket})
                    }) 
                    .catch(error => {
                        res.render('error', {error: error})
                    })
                })
                .catch(error => {
                    res.render('error', {error: error})
                })
            })
            .catch(error => {
                res.render('error', {error: error})
            })
        })
        .catch(error => {
            res.render('error', {error: error})
        })
    }

    // BONK MODE

    static listUser(req, res){
        User.findAll({
            include: Detail
        })
        .then(data => {
            res.render('listUser', {data: data})
        })
        .catch(error => {
            res.render('error', {error: error})
        })
    }

    static transaction(req, res){
        var dataOut
        Transaction.findAll()
        .then(data => {
            dataOut = data
            return Transaction.totalOmzet()
        })
        .then(omzet => {
            res.render('transaction', {data: dataOut, omzet: omzet})
        })
        .catch(error => {
            res.render('error', {error: error})
        })
    }

    static approve(req, res){
        User.update({isBuying: false}, {where: {username: req.params.username}})
        .then(data => {
            Transaction.update({isApproved: true}, {where: {id: req.params.id}})
            .then(data => {
                req.session.isBuying = false
                res.redirect('/admin/transaction')
            })
            .catch(error => {
                res.render('error', {error: error})
            })
        })
        .catch(error => {
            res.render('error', {error: error})
        })
    }

    static bucketEdit(req, res){
        Bucket.findAll({
            order: [['name', 'ASC']]
        })
        .then(data => {
            res.render('bucketEdit', {data: data})
        })
        .catch(error => {
            res.render('error', {error: error})
        })
    }

    static addBucketGet(req, res){
        res.render('addBucket', {})
    }

    static addBucketPost(req, res){
        var {name, price, stock, img, description, TypeId} = req.body

        Bucket.create({name, price, stock, img, description, TypeId})
        .then(data => {
            res.redirect('/admin/bucketEdit')
        })
        .catch(error => {
            error = error.errors.map(el => {
                return el.message
            })
            console.log(error);
            res.render('adminError', {error: error})
        })
    }

    static deleteBucket(req, res){
        Bucket.destroy({
            where: {id: req.params.id}
        })
        .then(data => {
            res.redirect('/admin/bucketEdit')
        })
        .catch(error => {
            res.render('error', {error: error})
        })
    }

    static editBucketGet(req, res){
        Bucket.findOne({
            where: {id: req.params.id}
        })
        .then(data => {
            res.render('editBucket', {data: data})
        })
        .catch(error => {
            res.render('error', {error: error})
        })
    }

    static editBucketPost(req, res){
        var {name, price, stock, img, description, TypeId} = req.body
        Bucket.update({name, price, stock, img, description, TypeId}, {where: {id: req.params.id}})
        .then(data => {
            res.redirect('/admin/bucketEdit')
        })
        .catch(error => {
            error = error.errors.map(el => {
                return el.message
            })
            res.render('adminError', {error: error})
        })
    }

}

module.exports = Controller