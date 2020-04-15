import Action from '../Core/Route/Action'

import * as randomNumber from 'random-number-csprng'
import * as sample from 'lodash/sample'

export default new class HelloWorldAction extends Action {
    async execute(req, res) {
        const content = [
            {
                logo: 'https://pbs.twimg.com/media/Dg6ldsUXcAAs7Cu.jpg',
                alt: 'Jesus is Watching you, sinner!'
            },
            {
                logo: 'https://d.wattpad.com/story_parts/427353787/images/15de2253db04bd4c173795538417.jpg',
                alt: 'Move along, Sir! Nothing to see here!'
            },
            {
                logo: 'https://i.ytimg.com/vi/OSqLXXOI2xE/maxresdefault.jpg',
                alt: 'Welcome, baby! Put your strap-on and do me, I\'m your slave!'
            },
            {
                logo: 'https://i.redd.it/01nu6nh8h0o11.png',
                alt: 'Oh. It\'s you.'
            }
        ]

        let lastRandomNumber = 0
        for (let i = 1; i <= content.length; i++) {
            lastRandomNumber = await randomNumber(i * 12, i * 16 + 1)
        }

        const modulo = lastRandomNumber % content.length

        if (modulo >= 0 && modulo < (content.length / 2)) {
            return {
                err: true,
                res: sample(content)
            }
        }

        return {
            err: false,
            res: 'Hello, World!'
        }
    }

    options(): object {
        return {
            auth: false
        }
    }
}
