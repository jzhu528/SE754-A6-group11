const questions = [
  {
    id: 1,
    topic: "Classes & Objects",
    question: "What is a Class in Java?",
    options: [
      "An instance of an object",
      "A blueprint for creating objects",
      "A tool to delete files",
      "A type of number"
    ],
    correctIndex: 1,
    explanation: "A class is like a blueprint — for example, a car design. Objects are the actual things built from it, like a real car."
  },
  {
    id: 2,
    topic: "Classes & Objects",
    question: "What is an object in Java?",
    options: [
      "A function inside a class",
      "A runtime error",
      "An instance of a class",
      "A Java keyword"
    ],
    correctIndex: 2,
    explanation: "An object is a real 'thing' created from a class. For example, if Animal is the class, then myDog is an object."
  },
  {
    id: 3,
    topic: "Classes & Objects",
    question: "Which keyword is used to create a new object in Java?",
    options: [
      "make",
      "create",
      "build",
      "new"
    ],
    correctIndex: 3,
    explanation: "The 'new' keyword creates objects in memory. Example: Dog myDog = new Dog();"
  },
  {
    id: 4,
    topic: "Classes & Objects",
    question: "What do we call the functions defined inside a class?",
    options: [
      "Variables",
      "Methods",
      "Packages",
      "Objects"
    ],
    correctIndex: 1,
    explanation: "In Object-Oriented Programming, functions that belong to a class are called 'methods'. They represent what the object can do."
  },
  {
    id: 5,
    topic: "Encapsulation",
    question: "Which access modifier makes a variable visible ONLY within its own class?",
    options: [
      "public",
      "private",
      "protected",
      "default"
    ],
    correctIndex: 1,
    explanation: "'private' hides the data from other classes. This is the main way to achieve Encapsulation in Java."
  },
  {
    id: 6,
    topic: "Encapsulation",
    question: "What does encapsulation mainly protect?",
    options: [
      "The number of classes in a project",
      "The internal state of an object",
      "The speed of the program",
      "The size of the compiled file"
    ],
    correctIndex: 1,
    explanation: "Encapsulation protects the internal data (state) of an object by hiding it and only allowing access through methods."
  },
  {
    id: 7,
    topic: "Inheritance",
    question: "Which keyword is used to inherit a class in Java?",
    options: [
      "inherits",
      "extends",
      "implements",
      "gets"
    ],
    correctIndex: 1,
    explanation: "To make a child class inherit from a parent class, use 'extends'. Example: class Cat extends Animal."
  },
  {
    id: 8,
    topic: "Inheritance",
    question: "Which OOP principle allows a child class to share behaviors from a parent class?",
    options: [
      "Encapsulation",
      "Inheritance",
      "Abstraction",
      "Compilation"
    ],
    correctIndex: 1,
    explanation: "Inheritance allows a child class to reuse and extend the fields and methods of a parent class."
  },
  {
    id: 9,
    topic: "Constructors",
    question: "Which of the following is TRUE about a constructor?",
    options: [
      "It must have the same name as the class",
      "It must return an integer",
      "It is used to delete an object",
      "Its name can be anything"
    ],
    correctIndex: 0,
    explanation: "A constructor's name must exactly match the class name, and it has no return type. It is used to initialize new objects."
  },
  {
    id: 10,
    topic: "Keywords",
    question: "What does the 'this' keyword refer to in Java?",
    options: [
      "The parent class",
      "A static method",
      "The current object",
      "The main method"
    ],
    correctIndex: 2,
    explanation: "'this' refers to the current object that is calling the method. It is used to distinguish class fields from local parameters."
  },
  {
    id: 11,
    topic: "Keywords",
    question: "Which keyword is used to call a method from the parent class?",
    options: [
      "parent",
      "super",
      "base",
      "top"
    ],
    correctIndex: 1,
    explanation: "The 'super' keyword refers to the parent class. It is used to call parent class methods or constructors."
  },
  {
    id: 12,
    topic: "Polymorphism",
    question: "If Cat is a subclass of Animal, which code is correct?",
    options: [
      "Animal a = new Cat();",
      "Cat c = new Animal();",
      "Animal a = Cat();",
      "Cat c = Animal();"
    ],
    correctIndex: 0,
    explanation: "A parent class reference can hold a child class object. This is Polymorphism — a Cat IS an Animal, but an Animal is not always a Cat."
  },
  {
    id: 13,
    topic: "Polymorphism",
    question: "What is method overloading?",
    options: [
      "Two methods with the same name but different parameters",
      "Two methods with different names but same parameters",
      "A method calling itself repeatedly",
      "A method that cannot be overridden"
    ],
    correctIndex: 0,
    explanation: "Method overloading means defining multiple methods with the same name but different parameter lists in the same class."
  },
  {
    id: 14,
    topic: "Polymorphism",
    question: "Which annotation is used when a child class overrides a parent class method?",
    options: [
      "@Overload",
      "@Change",
      "@Override",
      "@Update"
    ],
    correctIndex: 2,
    explanation: "@Override tells the compiler that the child class is replacing a method from its parent class. It also helps catch typos."
  },
  {
    id: 15,
    topic: "Abstraction",
    question: "What is abstraction in Java?",
    options: [
      "Hiding unnecessary details and showing only essential features",
      "Combining multiple classes into one",
      "Writing code without using classes",
      "Making all fields public"
    ],
    correctIndex: 0,
    explanation: "Abstraction means hiding complex implementation details and exposing only what is necessary to the user."
  }
];

module.exports = questions;
