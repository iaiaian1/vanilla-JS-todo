// class person{
//     set(name){
//         this.name=name;
//     }
//     get(){
//         return name;
//     }
// }
// person = new person();
// person.set("jake");
// console.log(person.get());
let person = ['Jake','Yap', 20, 'May 23,2001'];
let firstName = person[0];
let lastName = person[1];
let age = person [2];
let birthday = person[3];
console.log(`My name is ${firstName}\nlast name is ${lastName}\nmy age is ${age}\nand my birthday is ${birthday}`);

class account{
    constructor(username,password){
        this.username = username;
        this.password = password;
    }
}
const UserAccount = new account(firstName,age);
console.log(UserAccount.password);

const speak = function() {
  console.log('hello');  
};