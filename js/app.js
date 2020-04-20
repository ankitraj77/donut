// SCALING OPTIONS
// scaling can have values as follows with full being the default
// "fit"	sets canvas and stage to dimensions and scales to fit inside window size
// "outside"	sets canvas and stage to dimensions and scales to fit outside window size
// "full"	sets stage to window size with no scaling
// "tagID"	add canvas to HTML tag of ID - set to dimensions if provided - no scaling

const scaling = 'full' // this will resize to fit inside the screen dimensions
const width = 1024
const height = 768
const color = light // ZIM colors like green, blue, pink, faint, clear, etc.
const outerColor = dark // any HTML colors like "violet", "#333", etc. are fine to use
const path = 'assets/'
const assets = ['donut-logo.png']

const frame = new Frame(scaling, width, height, color, outerColor, assets, path)
frame.on('ready', () => {
	// ES6 Arrow Function - like function(){}
	zog('ready from ZIM Frame') // logs in console (F12 - choose console)

	const stage = frame.stage
	let stageW = frame.width
	let stageH = frame.height

	// see https://zimjs.com/learn.html for video and code tutorials
	// see https://zimjs.com/docs.html for documentation
	// see https://zimjs.com/bits.html for 64 Interactive Media techniques

	// put your code here (you can delete this sample code)

	// with chaining - can also assign to a variable for later access
	// make pages (these would be containers with content)
	const delay = 100
	const defaultTime = 20 // 1 minute
	const margin = 20
	const winScore = 555
	let level = 0
	let isGameOver = false
	let time = defaultTime
	let delayCounter = 100
	let score = 0
	let home = new Rectangle(stageW, stageH, '#2E3038')
	let configure = new Rectangle(stageW, stageH, 'green')

	let pages = new Pages({
		pages: [
			// imagine pages to the left, right, up and down
			// swipe:["to page on left", "to page on right", etc.s]
			{ page: home, swipe: [null, configure, null, null] },
			{ page: configure, swipe: [home, null, null, null] },
		],
		transition: 'slide',
		speed: 300, // slower than usual for demonstration
	}).addTo()

	// handle any events inserted into the swipe arrays
	pages.on('info', function () {
		zog('info requested')
	})
	// handle any custom requirements when arriving at a page
	// the event gives you the page object
	// so add a name properties just make it easier to manage
	home.name = 'home'
	configure.name = 'configure'
	pages.on('page', function () {
		zog(pages.page.name) // now we know which page we are on
	})

	// TARGET CIRCLE
	let target = new Circle({
		radius: 41,
		borderColor: '#54E69D',
		borderWidth: 2,
	}).centerReg()

	let targetAnimation = target.animate({
		props: {
			x: target.x + 10,
		},
		time: 800,
		loop: true,
		rewind: true,
	})
	// CIRCLE
	let circle = new Circle(20, '#E66A54').centerReg().pos(100, 100).drag()

	// SCORE BOARD
	let scoreBoard = new Rectangle({
		width: stageW,
		height: 100,
		color: 'rgba(255,255,255,0.03)',
	})
		.centerReg()
		.pos(0, 0)
	// SCORE LABEL
	new Label({
		text: 'SCORE',
		color: '#ffffff',
		size: 14,
	})
		.centerReg(scoreBoard)
		.pos(20, 30, RIGHT)
	// LEVEL LABEL
	new Label({
		text: 'LEVEL',
		color: '#ffffff',
		size: 14,
	})
		.centerReg(scoreBoard)
		.pos(20, 60, RIGHT)
	// SCORE
	let scoreLabel = new Label({
		text: score,
		color: '#ffffff',
		align: 'right',
		size: 26,
	})
		.centerReg(scoreBoard)
		.pos(80, 25, RIGHT, TOP)
	// LEVEL
	let levelLabel = new Label({
		text: level,
		color: '#ffffff',
		align: 'right',
		size: 26,
	})
		.centerReg(scoreBoard)
		.pos(80, 55, RIGHT, TOP)
	// COUNTER LABEL
	let label = new Label({
		text: '',
		color: '#ffffff',
		align: 'center',
		backgroundColor: '#E66A54',
		corner: 14,
		padding: 20,
	})
		.centerReg(scoreBoard)
		.pos(null, 150)

	// TIMER LABEL
	let timerLabel = new Label({
		text: time,
		color: '#ffffff',
		align: 'center',
		size: 28,
	})
		.centerReg(scoreBoard)
		.pos(null, 40)

	// LOGO
	new asset('donut-logo.png').centerReg().pos(margin, 40)

	// PARTICLES
	let particles = new Emitter({
		obj: [new Circle(5, '#ffffff'), new Triangle(5, 5, 5, '#ffffff')],
		startPaused: true,
	}).centerReg(target)

	let xMultiplier = 0
	let yMultiplier = 0

	// TIMER
	let timer = interval(1000, () => {
		time--
	})

	// DEVICE ORIENTATION
	window.addEventListener('deviceorientation', handleOrientation, true)
	function handleOrientation(event) {
		yMultiplier = event.beta // In degree in the range [-180,180]
		xMultiplier = event.gamma // In degree in the range [-90,90]
		// newHue = event.alpha

		// newHue = newHue.toFixed(0)

		// Because we don't want to have the device upside down
		// We constrain the x value to the range [-90,90]
		if (yMultiplier > 90) {
			yMultiplier = 90
		}
		if (yMultiplier < -90) {
			yMultiplier = -90
		}

		// To make computation easier we shift the range of
		// x and y to [0,180]
		xMultiplier += 0
		yMultiplier += 0
		// Do stuff with the new orientation data
	}
	// ZIM TICKER
	Ticker.add(() => {
		// Update time, score
		timerLabel.text = time
		levelLabel.text = level
		scoreLabel.text = score

		if (time >= 0) {
			// Move circle based on orientation data
			circle.x += xMultiplier
			circle.y += yMultiplier

			// Check if circle goes beyond stage width and height
			if (circle.x > stageW) {
				circle.x = stageW
			} else if (circle.x < 0) {
				circle.x = 0
			}
			if (circle.y > stageH) {
				circle.y = stageH
			} else if (circle.y < 0) {
				circle.y = 0
			}

			// Hit test
			if (circle.hitTestReg(target)) {
				if (delayCounter > 0) {
					delayCounter--
					label.addTo()
					label.text = delayCounter
				} else {
					label.text = 'You Win'
					time = defaultTime
					level++
					score += winScore

					newGame()
					// target.animate = null
					// targetAnimation = target.animate({
					// 	props: {
					// 		x: target.x + 50,
					// 	},
					// 	time: 600,
					// 	loop: true,
					// 	rewind: true,
					// })
				}

				particles.pauseEmitter(false)
			} else {
				particles.pauseEmitter(true)
				delayCounter = delay
				if (!isGameOver) {
					label.removeFrom()
					label.text = ''
				}
			}
		} else {
			// TIME OVER
			isGameOver = true
			timer.pause(true)
			label.addTo()
			label.text = 'TIMEOUT'
			if (score > 0) score--
			if (isGameOver) newGameLabel('current')
			newGame()
		}
	})

	// ======================== FUNCTONS
	// GAME OVER
	async function gameOver() {
		// game over logic and procedure
		console.log('GAME OVER')

		score -= winScore
		// label.addTo()
		// label.text = 'GAME OVER'

		timeout(3000, () => {
			time = defaultTime
			newGameLabel('current')
		})
	}

	// GAME WIN
	function gameWin() {
		// game win procedure
		console.log('WON THE GAME')

		time = defaultTime
		score += winScore
		scoreLabel.text = score
		// newGameLabel('next')
	}

	// NEW GAME LABEL
	function newGameLabel(status) {
		// reset and next stage logic
		console.log('NEW GAME')
		timeout(3000, () => {
			isGameOver = false
			timer.pause(false) // start the timer
			time = defaultTime // reset the timer to default
		})
	}

	//NEW GAME NEXT STAGE
	function newGame() {
		// new game logic
		target.removeFrom()
		let x = rand(target.width, stageW - target.width)
		let y = rand(100, stageH - target.height)
		target.addTo().pos(x, y)
	}

	// Wiggle target -
	function wiggleTarget() {
		// increase the intensity as per the level
	}
	//
	stage.update() // this is needed to show any changes
}) // end of ready
