import type { ShadowRootInit } from '../../client/dom.ts'
import { ReflectElement, Fragment, style, h, getPart, getStyleRule, withEvents } from '../../client/dom.ts'
import cssText from './Panelset.css'

export class PanelsetElement extends ReflectElement {
	constructor() {
		const host: this = super()!
		const root = host.shadowRoot
		// const rule = getStyleRule(root, ':host::part(content)')!
		// const trigger = getPart<HTMLSlotElement>(root, 'trigger')!

		const sections: Section[] = []
		let section: Section = { content: [] } as any

		const contentSlot = h('slot')
		const content = h('span', { part: 'content' }, contentSlot)
		const tabs = h('span', { part: 'tabs' })

		for (const child of host.childNodes as any as (Element | Text)[]) {
			if (child instanceof HTMLHeadingElement) {
				sections.push(section = {
					heading: child,
					headingTab: withEvents(h('button', { part: 'tab' }), {
						click(event: PointerEvent) {
							event.preventDefault()

							contentSlot.assign(...thisSection.content)
						}
					}),
					slot: h('slot'),
					content: [],
				})

				section.headingTab.append(section.slot)

				tabs.append(section.headingTab)

				const thisSection = section
			} else {
				section.content.push(child)
			}
		}

		root.replaceChildren(tabs, content)

		for (const section of sections) {
			section.slot.assign(section.heading)
		}

		contentSlot.assign(...sections[0].content)

		// withEvents(trigger, {
		// 	click(event: PointerEvent) {
		// 		event.preventDefault()

		// 		host.state.isExpanded = !host.state.isExpanded
		// 	}
		// }, { capture: true })

		// withEvents(host, {
		// 	statechange(event: StateEvent) {
		// 		switch (event.name) {
		// 			case 'isExpanded':
		// 				rule.style.display = event.value ? 'block' : 'none'
		// 				break
		// 		}
		// 	}
		// })

		// host.state.isExpanded = false
	}

	static shadow: ShadowRootInit = {
		mode: 'open',
		slotAssignment: 'manual',
		root: new Fragment()
	}

	static styles = [
		style(cssText)
	]
}

interface Section {
	heading: HTMLHeadingElement
	headingTab: HTMLButtonElement
	slot: HTMLSlotElement
	content: (Element | Text)[]
}
