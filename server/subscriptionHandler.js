const subscriptions = {};
var crypto = require('crypto');
const webpush = require('web-push');

const vapidKeys = {
    privateKey: 'ooJfdxGWevGVZ0_rGQSYYObDXyCa0rkjNHD9mkP8Nqo',
    publicKey: 'BJ8NQgeJk7p3gmZ0MMUw5kiStE0fLJNM9Qxj64YWeCPrHXGUNJyCf7fPhgzWZrK5wWpsK1SMO8zD1cZDZ75GThc'
};

webpush.setVapidDetails('mailto:letrananhkiet1010@gmail.org', vapidKeys.publicKey, vapidKeys.privateKey);

function createHash(input) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(Buffer.from(input));
    return md5sum.digest('hex');
}

function handlePushNotificationSubscription(req, res) {
    console.log("creating noti", req.body.data);
    const subscriptionRequest = req.body.data;
    const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
    subscriptions[susbscriptionId] = subscriptionRequest;
    res.status(201).json({ id: susbscriptionId });
}

function sendPushNotification(req, res) {
    const subscriptionId = req.params.id;
    const pushSubscription = subscriptions[subscriptionId];
    webpush
        .sendNotification(
            pushSubscription,
            JSON.stringify({
                title: 'New Product Available ',
                text: 'HEY! Take a look at this brand new t-shirt!',
                image: '/images/jason-leung-HM6TMmevbZQ-unsplash.jpg',
                tag: 'new-product',
                url: '/new-product-jason-leung-HM6TMmevbZQ-unsplash.html'
            })
        )
        .catch((err) => {
            console.log(err);
        });

    res.status(202).json({});
}

module.exports = { handlePushNotificationSubscription, sendPushNotification };
