const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

const key = require('./privateSettings.json');

// TODO(you): Change the value of this string to the spreadsheet id for your
// GSA spreadsheet. See HW5 spec for more information.
const SPREADSHEET_ID = '14oTop6F-yNIMZCiwdH-Rcu5ZRXt2lInhTOgrnBDdR6U';

const app = express();
const jsonParser = bodyParser.json();
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);

app.use(express.static('public'));

async function onGet(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;
  console.log(rows);

  // TODO(you): Finish onGet.

  res.json( { status: rows} );
}
app.get('/api', onGet);

async function onPost(req, res) {
  const messageBody = req.body;
    console.log(messageBody);
  // TODO(you): Implement onPost.
  const result = await sheet.getRows();
  const rows = result.rows;
  var postresult = new Array();
  for(let i=0;i<rows[0].length;i++){
      postresult[i] = messageBody[rows[0][i]];
  }
  const presult = await sheet.appendRow(postresult);
  //  if(typeof delresult ==="undefined") resmessage = "success";
  //  else resmessage = delresult.response;
  res.json( { response :  presult.response} );
}
app.post('/api', jsonParser, onPost);

async function onPatch(req, res) {
  const column  = req.params.column;
  const value  = req.params.value;
  const messageBody = req.body;

  // TODO(you): Implement onPatch.

  res.json( { status: 'unimplemented'} );
}
app.patch('/api/:column/:value', jsonParser, onPatch);

async function onDelete(req, res) {
  const column  = req.params.column;
  const value  = req.params.value;
  console.log(column);
  console.log(value);
  const result = await sheet.getRows();
  const rows = result.rows;
  console.log(rows);
  // TODO(you): Implement onDelete.
    var targetColumn;
    var delresult;
    for(let i=0;i<rows[0].length;i++){
        if(rows[0][i] == column) targetColumn = i;
    }
    for(let i=0;i<rows.length;i++){
        if(rows[i][targetColumn] == value){
            delresult = await sheet.deleteRow(i);
            break;
        }
    }
    console.log(delresult);
    var resmessage;
    if(typeof delresult ==="undefined") resmessage = "success";
    else resmessage = delresult.response;
  res.json( { response :  resmessage} );
}
app.delete('/api/:column/:value',  onDelete);


// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
});
