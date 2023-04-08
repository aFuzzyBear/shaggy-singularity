import type { ShadowRootInit } from '../../client/dom.ts'
import { ReflectElement, Fragment, style, h, getPart, getStyleRule } from '../../client/dom.ts'

export class DisclosureElement extends ReflectElement {
	constructor() {
		const host: this = super()!
		const root = host.shadowRoot
		const rule = getStyleRule(root, ':host::part(content)')!
		const trigger = getPart<HTMLSlotElement>(root, 'trigger')!

		trigger.addEventListener('click', event => {
			event.preventDefault()

			host.state.isExpanded = !host.state.isExpanded
		}, { capture: true })

		host.addEventListener('statechange', event => {
			switch (event.name) {
				case 'isExpanded':
					rule.style.display = event.value ? 'block' : 'none'
					break
			}
		})

		host.state.isExpanded = false
	}

	static shadow: ShadowRootInit = {
		mode: 'open',
		root: new Fragment(
			h('slot', { part: 'trigger', name: 'trigger' }),
			h('slot', { part: 'content' })
		)
	}

	static styles = [
		style(':host::part(content){}')
	]
}
