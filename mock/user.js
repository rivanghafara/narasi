const User = require("../models/userModel");
const Project = require("../models/projectsModel");
const { faker } = require("@faker-js/faker");
const { ObjectId } = require("mongoose");

function randomize() {
  let users = [];

  for (let index = 0; index < 10; index++) {
    let user = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "pass1234",
      role: "user",
      images: faker.image.avatar(),
    };
    users.push(user);
  }
  return users;
}

function randomizeProject() {
  let projects = [];
  const locale = ["ar", "ae", "cz", "de", "id", "in", "us", "uk"];
  const ids = [
    "623ee20d28517500142abdfa",
    "623ee21a28517500142abdfb",
    "624453c55faba001b90d2f15",
    "625bffd45016e3666ef9c770",
    "625bffd45016e3666ef9c771",
    "625bffd45016e3666ef9c772",
  ];

  for (let index = 0; index < 10; index++) {
    let project = {
      project_name: `${faker.word.interjection()} ${faker.word.adjective()}`,
      target_fund: faker.datatype.number({ min: 1000000 }),
      description: faker.lorem.sentence(),
      location: locale[Math.floor(Math.random() * locale.length)],
      categories: faker.hacker.noun(),
      status: "drafted",
      apporval: {
        isApproved: false,
      },
      createdAt: Date.now(),
      target_end: Date.now(),
      creator: ids[Math.floor(Math.random() * ids.length)],
    };
    projects.push(project);
  }
  return projects;
}

const mockUsers = async () => {
  try {
    const users = randomize();
    const result = await User.insertMany(users);
    // const result = await User.create({
    //   name: "Marquis",
    //   email: "Vicente_Ratke93@hotmail.com",
    //   password: "pass1234",
    //   role: "user",
    //   images:
    //     "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/987.jpg",
    // });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const mockProjects = async () => {
  try {
    const projects = await randomizeProject();
    // const result = await Project.insertMany(projects);
    console.log(projects);
  } catch (error) {
    console.log(error);
  }
};

// mockUsers();
mockProjects();
