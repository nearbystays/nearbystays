function Person(pk, name, email) {
  this.pk = pk;
  this.name = name;
  this.email = email;
}

function Hotel(pk, name, address, guest) {
  this.pk = pk;
  this.name = name;
  this.address = address;
  this.guest = guest;
}

let jeremy = new Person(001, 'Jeremy Scott', 'jscott8@mail.sfsu.edu')
let hilton = new Hotel(002, 'Hilton Hotel Los Angeles' '124 Main St. Los Angeles California 90020');

console.log(jeremy);
console.log(hilton);
