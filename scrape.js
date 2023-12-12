const Scrappey = require("scrappey-wrapper");

const scrappey = new Scrappey("API_KEY");

const proxies = [
    "http://PROXY_URL",
]

let success = 0

let failed = 0

async function ex() {
    const proxy = proxies[Math.floor(Math.random() * proxies.length)]

    const session = await scrappey.createSession({
        proxy: proxy
    })

    const main = await scrappey.get({
        url: 'https://www.flyfrontier.com/',
        session: session.session,
        mouseMovements: true
    })

    // Only execute when the request was successful
    if (main.solution.verified) {

        const select = await scrappey.get({
            url: 'https://booking.flyfrontier.com/external/flightselect?o1=DEN&d1=PNS&dd1=2024-01-05&dd2=2024-01-05&r=true&ADT=1&inl=0&mon=true&s=true&utm_campaign=2023&utm_medium=metasearch&utm_source=googleflights',
            session: session.session,
            mouseMovements: true
        });

        // Only execute when the request was successful
        if (select.solution.verified) {

            // Create a cookie jar to store the cookies
            const cookieJar = {};

            // Extract and store all cookies in the cookie jar
            for (const cookie of select.solution.cookies) {
                Object.assign(cookieJar, {
                    key: cookie.name,
                    value: cookie.value,
                    domain: cookie.domain,
                    path: cookie.path
                })

                console.log(JSON.stringify(cookieJar, undefined, 4))

                await scrappey.destroySession(session.session)
            }
        }
    }
}

for (let i = 0; i < 1; i++) {
    ex().then(() => {
        console.log('success', success, 'failed', failed, 'total', success + failed, 'percentage success', (success / (success + failed)) * 100, 'time', new Date())
    })
}