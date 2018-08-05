var WebSocketServer = require('ws').Server
let oo7 = require('oo7')

function serveBonds(servedBonds) {
	let wss = new WebSocketServer({port: 40510})
	let count = 0;

	wss.on('connection', function (ws) {
		let index = count++;
		var ready = {}
		var notReady = []
		let active = true;
		let dk = []
		let poll = () => {
			if (active) {
				console.log(`Updating host ${ws.url} (${index}) with ${key}`)
				try {
					let s = JSON.stringify(b._ready ? { key, value: b._value } : { key })
					ws.send(s)
				}
				catch (e) {
					console.log(`Error. Closing ${ws.url} (${index})`)
					active = false
					console.log(`Marked inactive ${index}`)
					try {
						ws.close()
						console.log(`Closed ${index}`)
					}
					catch (e) {
						console.log(`Error closing ${index}`)
					}
					Object.keys(servedBonds).forEach((key, i) => {
						if (servedBonds[key]._notifies[dk[i]]) {
							servedBonds[key].unnotify(dk[i])
						} else {
							console.warn(`Couldn't unnotify - already unnotified?!`)
						}
					})
					console.log(`Unnotified ${index}`)
				}
			} else {
				console.warn("Weird: poll called after close & unnotify")
			}
		}
		Object.keys(servedBonds).forEach(key => {
			let b = servedBonds[key]
			dk.push(b.notify(poll))
			if (b._ready) {
				ready[key] = b._value
			} else {
				notReady.push(key)
			}
		})
		let s = JSON.stringify({ init: true, notReady, ready })
		ws.send(s)
	})
	
	return wss
}

module.exports = { serveBonds }