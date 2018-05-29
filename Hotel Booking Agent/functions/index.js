const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var firestrore = admin.firestore();


exports.webhook = functions.https.onRequest((request, response) => {

    console.log("request.body.result.parameters ", request.body.queryResult.parameters);
    


    switch(request.body.queryResult.action){

        case 'BookHotel':
            let params = request.body.queryResult.parameters;

            firestrore.collection('bookings').add(params)
                .then(() =>{       
                    response.send({
                        fulfillmentText: `Hello ${params.name}, your hotel booking request for ${params.RoomType} room
                        is forwarded for ${params.number} person/s. We will contact you on ${params.email} soon.`
                    });
                })
                .catch((e => {
                    console.log("error: ", e)
                    response.send({
                        fulfillmentText: `Something went wrong when writing in database`
                    });
                }))
            break;
             
        case 'CountBookings':
            
            firestrore.collection('bookings').get()
                .then((querySnapshot) => {

                    var bookings = []
                    querySnapshot.forEach((doc) => {bookings.push(doc.data() )});
    

                    response.send({
                        fulfillmentText: `You have ${bookings.length} bookings. Would you like to show them? \n`
                    });
                })
                .catch((err => {
                    console.log("Error: ", err);
                    response.send({
                        fulfillmentText: "Something went wrong"
                    })

                }))
            break;
   

        case 'ShowBookings':
            
            firestrore.collection('bookings').get()
                .then((querySnapshot) => {

                    var bookings = []
                    querySnapshot.forEach((doc) => {bookings.push(doc.data() )});

                    var fulfillmentText = `You have ${bookings.length} bookings \n`;

                    bookings.forEach((eachBooking, index) => {
                        fulfillmentText += `Number ${index + 1} is ${eachBooking.RoomType} room for ${eachBooking.number} persons,
                        booked by ${eachBooking.name}, contact email is ${eachBooking.email} \n`
                    })

                    response.send({
                        fulfillmentText: fulfillmentText
                    });
                })
                .catch((err => {
                    console.log("Error: ", err);
                    response.send({
                        fulfillmentText: "Something went wrong"
                    })

                }))
            break;
            
        default:
            response.send({
                fulfillmentText: "No action matched in webhook"
            })

    }




});
