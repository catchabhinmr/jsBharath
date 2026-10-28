//object literal
const dog = {
  name: "Rex",
  speak() {
    return `${this.name} says woof`;
  },

};
dog.speak();
dog.age = 3;

//Class
class Dog {
  #tricks = [] // convey private with #
  constructor(name) {
    this.name = name;
  }
  learn(trick) {
    this.#tricks.push(trick);

  }
  get trickCount() { //getter
    return this.#tricks.length;
  }
}
const rex = new Dog("rex");
rex.learn("Sit");
rex.trickCount;


