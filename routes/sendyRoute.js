const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');

const Sendy = require('sendy-api')

const api_key = process.env.API_KEY;
const SENDY_URL = process.env.SENDY_URL;
const sendy = new Sendy(SENDY_URL, api_key);

const list_id_lgl = process.env.LIST_ID_LGL;
const list_id_pro = process.env.LIST_ID_PRO;
let emailLGL = process.env.LGL_EMAIL;


// NB : LAISSER EN COMMENTAIRE, CES METHODES ONT ETE UTLILISEES POUR LES TEST DES AUTRES METHODES DU PACKAGE SENDY-API QU'ON A PAS UTILISE (SAUF CELLE DE SUBSCRIBE QU'ON UTILISE), 
// const emailTest = 'jesuisdanslaliste@gmail.com';
// const mailOmar = 'boudraa.omar@gmail.com';

// active count route POUR TESTER SANS PASSER PAR SENDY-API PACKAGE (NPM), AVEC AXIOS POST (CLASSIQUE A PARTIR DE LA LIGNE 49) 
// router.post('/countActive', async (req, res) => {
//     // sendy.countActive({ list_id: list_id_lgl }, function (err, result) {
//     //     if (err) {
//     //         console.log(err.toString());
//     //         res.status(404).json(err.toString())
//     //     }
//     //     else {
//     //         console.log('Active subscribers: ' + result);
//     //         // res.status(200).json('Active subscribers: ' + result)
//     //     }
//     // });
//     // let { Name, Email, Description, Type, Siret, Telephone, Adresse, Horaires } = req.body;
//     // let paramsToSubscribe = {
//     //     email: Email,
//     //     name: Name,
//     //     'Name': Name,
//     //     'Email': Email,
//     //     'Description': Description,
//     //     'Type': Type,
//     //     'Siret': Siret,
//     //     'Telephone': Telephone,
//     //     'Adresse': Adresse,
//     //     'Horaires': Horaires,
//     //     list_id: list_id_lgl,
//     //     api_key: api_key
//     // };
//     // console.log(paramsToSubscribe);
//     // console.log(JSON.parse(Horaires));

//     let paramsForAxiosTest = { 
//         'api_key': api_key,
//         'email': emailLGL,
//         'list_id': list_id_lgl,
//     }
//     const dataToSend = qs.stringify(paramsForAxiosTest);
//     // console.log(dataToSend);

//     axios.post(`${SENDY_URL}api/subscribers/subscription-status.php`, dataToSend, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } }).then(res => {
//         console.log('Response SENDY WITH AXIOS CLASSIC POST IS ======>>>>>> ', res.data);
//     }).catch(err => { 
//         console.log('ERROR SENDY WITH AXIOS IS >>>>>>>>>>>>', err);  
//     })
// })
 
// GET STATUS OF EMAIL IN LIST (for test) NE PAS DECOMMENTER !!!! (POUR DES TESTS)
// router.post('/getStatus', async (req, res) => {n
//     console.log('Body_Request_is =======>>>>>>>>>>>> ', req.body);
//     try {
//         await sendy.status({ email: req.body.Email, list_id: list_id_lgl }, function (err, result) {
//             if (err) {
//                 console.log('error_status===>>>', err.toString()); 
//                 return res.status(404).json(err.toString())
//             } else {
//                 console.log(`Status of : ` + result);
//                 // res.json(`Status : ` + result)
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

router.post('/subscribe', async (req, res) => { 
    // console.log('Body_Request_is =======>>>>>>>>>>>> ', req.body);
    let { Name, Email, Description, Type, Siret, Telephone, Adresse, Horaires } = req.body;
    // const horairesParsed = JSON.parse(req.body.horaires);
    // const horairesParsed = req.body.Horaires;
    // console.log('les horaires from front ====> ', horairesParsed);
    let paramsToSubscribe = {
        email: Email,
        name: Name,
        'Name': Name,
        'Email': Email,
        'Description': Description, 
        'Type': Type,
        'Siret': Siret,
        'Telephone': Telephone,
        'Adresse': Adresse,
        'Horaires': Horaires,
        list_id: list_id_lgl,
        api_key: api_key
    };

    if (!Name || !Email || !Siret) {
        return res.status(404).json({ message: `Certains champs obligatoires manquent ` })
    }
    try {
        await sendy.subscribe(paramsToSubscribe, function (err, result) {
            if (err) {
                console.log(`ERROR_OF_SUBSCRIBE ${paramsToSubscribe.email}==>>`, err.toString());
                return res.status(404).json({ message: `${err.toString()}`, email: `${paramsToSubscribe.email}` })
            } else {
                console.log(`SUCCESS_FOR_SUBSCRIBE ${paramsToSubscribe.email} ==>> Subscribed succesfully`);
                return res.status(200).json({ message: `${paramsToSubscribe.email} Subscribed succesfully`, sendy_response: `${result}` });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router 