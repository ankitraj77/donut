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

const frame = new Frame(scaling, width, height, color, outerColor)
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
	const delay = 10
	let delayCounter = 0
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
	let circle = new Circle(20, '#E65454').centerReg().pos(100, 100).drag()
	let label = new Label('hello', null, null, '#ffffff')
		.centerReg()
		.pos(null, 100)

	// PARTICLES
	let particles = new Emitter({
		obj: [new Circle(5, '#ffffff'), new Triangle(5, 5, 5, '#ffffff')],
		startPaused: true,
	}).centerReg(target)

	let xMultiplier = 0
	let yMultiplier = 0
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
		label.text = xMultiplier
	}
	// HIT TEST
	Ticker.add(() => {
		if (circle.x < stageW && circle.x > 0) {
			circle.x += xMultiplier
		} else {
			xMultiplier = stageW
		}
		if (circle.y < stageH && circle.y > 0) {
			circle.y += yMultiplier
		} else {
			yMultiplier = stageH
		}

		if (circle.hitTestReg(target)) {
			delayCounter++
			console.log('Hitting ' + delayCounter)
			particles.pauseEmitter(false)
		} else {
			delayCounter = 0
			particles.pauseEmitter(true)
		}
	})

	stage.update() // this is needed to show any changes
}) // end of ready
