var express = require('express');
var router = express.Router();
const {OAuth2Client} = require('google-auth-library');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const {idToken} = req.query;
  // Verify the integrity of the ID Token using
  // https://developers.google.com/identity/one-tap/web/idtoken-auth#using-a-google-api-client-library
  const GOOGLE_YOLO_CLIENT_ID = process.env.GOOGLE_YOLO_CLIENT_ID;
  const client = new OAuth2Client(GOOGLE_YOLO_CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: GOOGLE_YOLO_CLIENT_ID,
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    res.json(payload);
  }
  verify().catch(console.error);
});

module.exports = router;
