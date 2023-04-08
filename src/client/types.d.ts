interface HTMLElementEventMap {
	'statechange': StateEvent
}

interface StateEvent extends Event {
	name: string
	value: any
}
