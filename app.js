import express, { json, urlencoded } from 'express';
import https from 'https';
import mp from '@mailchimp/mailchimp_marketing';

const app = express();
// mailchimp api key: f5b321f382d3de25c7b739a01fe24004-us4
// list id: ee93e5115c

//first create JS object
//look for req body parameters from the docs and find whats REQUIRED
//make sure to JSON stringify the JS object
//do an https post req to send the data to mailchimp 

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
  const URL = "https://us4.api.mailchimp.com/3.0/lists/ee93e5115c"
  const options = {
    method: 'POST',
    auth: 'jonkoh:f5b321f382d3de25c7b739a01fe24004-us4'
  }

  const request = https.request(URL, options, (response) => {
    response.on("data", (d) => {
      console.log(JSON.parse(d));
      console.log(response.statusCode);
      if (response.statusCode === 200){
        res.redirect("/success");
      }
      else {
        res.redirect("/failure");
      }
    })
  })

  // request.write(jsonData);
  request.end();
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/success.html");
})

app.get("/failure", (req, res) => {
  res.sendFile(__dirname + "/failure.html");
})

app.post("/redirect", (req, res) => {
  res.redirect("/");
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.listen(3000, () => {
  console.log("listening");
});