//this is a function to reduce coping of code it catches errors

module.exports = (func) => {
    return function(req, res, next){
        func(req, res, next).catch(err => next(err))
    }
}