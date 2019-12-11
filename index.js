const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const pdf = require("html-pdf");

async function writePDF() {
  try {
    const { username } = await inquirer.prompt({
      message: "What is your username?",
      name: "username"
    });
    const { favColor } = await inquirer.prompt({
      message: "What is your favorite color",
      name: "favColor"
    });
    const { data } = await axios.get(
      `https://api.github.com/users/${username}`
    );
    const name = data.name;
    const pageurl = data.html_url;
    const location = data.location;
    const followers = data.followers;
    const following = data.following;
    const repocount = data.public_repos;
    const imgURL = data.avatar_url;
    const bio = data.bio;
    // console.log(data);
    function generateHTML() {
      const newHTML = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <title>Github Profile Info</title>
        </head>
        <body style="box-sizing:content-box; background-color: ${favColor}">
          <div
            style="float: center; widows: 960px; background-color: #ffffff;
          margin-left: auto;
          margin-right: auto;
          margin-top: 1in;
          margin-bottom: 2in;
          border: 2px solid #dddddd;"
          >
            <img src="${imgURL}" height="300" width="300" />
            <h1 style="color: ${favColor};">${name}</h1>
            <h5>${bio}</h5>
            <a href="${pageurl}">Github Page</a>
            <div>${location}</div>
            <h4>Repositories: ${repocount}</h4>
            <h4>Following: ${following}</h4>
            <h4>Followers: ${followers}</h4>
            <h4>Location: ${location}</h4>
          </div>
        </body>
      </html>`;
      return newHTML;
    }
    const html = await generateHTML();

    var options = { format: "Letter" };
    pdf.create(html, options).toFile("./githubUser.pdf", function(err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
  } catch (err) {
    throw err;
  }
}

writePDF();
