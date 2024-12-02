'use strict';

const fs = require('fs').promises;

class UserStorage{

  static #getUserInfo(data, id){
    const users = JSON.parse(data);
    const idx = users.id.indexOf(id);
    const userKeys = Object.keys(users);
    const userInfo = userKeys.reduce((newUsers, info) => {
      newUsers[info] = users[info][idx];
      return newUsers;
    }, {});
    return userInfo;
  }


  static getUsers(...fields){
    return fs.readFile('./src/databases/users.json')
    .then(data => {
      const users = JSON.parse(data);
      const newUsers = fields.reduce((newUsers, field) => {
        if(users.hasOwnProperty(field)){
          newUsers[field] = users[field];
        }
        return newUsers;
      }, {});
      return newUsers;
    }).catch(console.error);
  }

  static getUserInfo(id){
    return fs.readFile('./src/databases/users.json')
    .then(data => {
      return this.#getUserInfo(data, id);
    }).catch(console.error);
  }

  static async save(userInfo){
    const users = await this.getUsers('id', 'psword', 'name');
    if(users.id.includes(userInfo.id)){
      throw "이미 존재하는 아이디입니다.";
    }
    users.id.push(userInfo.id);
    users.psword.push(userInfo.psword);
    users.name.push(userInfo.name);
    fs.writeFile('./src/databases/users.json', JSON.stringify(users));
    return {success: true, msg: "회원가입을 완료하였습니다."}
  }
}

module.exports = UserStorage;