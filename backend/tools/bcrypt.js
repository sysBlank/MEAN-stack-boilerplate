const _bcrypt = require('bcrypt');
const saltRounds = 10;

exports.bcrypt = async (password) => {
    
    return _bcrypt
    .genSalt(saltRounds)
    .then(salt => {
      return _bcrypt.hash(password, salt)
    })
    .then(hash => {
      return hash;
    })
    .catch(err => console.error(err.message))
}

exports.bcrypt_compare = async (password, hash) => {
    return _bcrypt
      .compare(password, hash)
      .then(res => {
        return res;
        console.log(res) // return true
      })
      .catch(err => console.error(err.message))        
}

