import express, { json, urlencoded } from 'express';
import https from 'https';
require('dotenv').config();

const app = express();

app.use(urlencoded({extended: true}));
app.use(json());
app.use(express.static("public"));

app.post('/', (req, res) => {
  const {firstName, lastName, email} = req.body;
  console.log(firstName, lastName, email)
  
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      },
    ]
  }

  const jsonData = JSON.stringify(data);
  const URL = `https://us4.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`;
  const options = {
    method: 'POST',
    auth: `jonkoh:${process.env.MAILCHIMP_API_KEY}`
  }

  const request = https.request(URL, options, (response) => {
    response.on("data", (d) => {
      if (response.statusCode === 200){
        res.redirect("/success");
      }
      else {
        res.redirect("/failure");
      }
    })
  })

  request.write(jsonData);
  request.end();
});

app.get("/success", (req, res) => {
  res.sendFile("/build/success.html");
})

app.get("/failure", (req, res) => {
  res.sendFile("/build/failure.html");
})

app.post("/redirect", (req, res) => {
  res.redirect("/");
})

app.get('/', (req, res) => {
  res.sendFile("/build/signup.html");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("listening");
});