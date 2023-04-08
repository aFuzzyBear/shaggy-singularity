import type { ShadowRootInit } from '../../client/dom.ts'
import { ReflectElement, Fragment, style, h, getPart, getStyleRule, withEvents } from '../../client/dom.ts'
import cssText from './Disclosure.css'

export class DisclosureElement extends ReflectElement {
	constructor() {
		const host: this = super()!
		const root = host.shadowRoot
		const rule = getStyleRule(root, ':host::part(content)')!
		const trigger = getPart<HTMLSlotElement>(root, 'trigger')!

		withEvents(trigger, {
			click(event: PointerEvent) {
				event.preventDefault()

				host.state.isExpanded = !host.state.isExpanded
			}
		}, { capture: true })

		withEvents(host, {
			statechange(event: StateEvent) {
				switch (event.name) {
					case 'isExpanded':
						rule.style.display = event.value ? 'block' : 'none'
						break
				}
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
		style(cssText)
	]
}
