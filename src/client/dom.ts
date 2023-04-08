export class ReflectElement extends HTMLElement {
	constructor() {
		const host: this = super()!
		const root = withNodes(
			host.attachShadow(host.constructor.shadow),
			host.constructor.shadow.root.cloneNode(true)
		)

		root.adoptedStyleSheets = host.constructor.styles

		host.state = new Proxy(
			host.state,
			{
				set(state, name: string, value) {
					if (state[name] !== value) {
						state[name] = value

						host.dispatchEvent(
							assign(new Event('statechange'), { name, value })
						)
					}

					return true
				}
			}
		)
	}

	state: Record<string, any> = {}

	static shadow: ShadowRootInit = {
		mode: 'open',
		root: document.createElement('slot')
	}

	declare ['constructor']: typeof ReflectElement
	declare static styles: CSSStyleSheet[]
	declare shadowRoot: ShadowRoot
}

const { assign } = Object

export function style(cssText: string) {
	const sheet = new CSSStyleSheet()

	sheet.replaceSync(cssText)

	return sheet
}

export const withAttrs = <T>(element: Element & T, attrs: Attrs): T => {
	for (const name in attrs) {
		const value = attrs[name]

		element[value === null || value === undefined || value === true || value === false ? 'toggleAttribute' : 'setAttribute'](name, value as never)
	}

	return element
}

export const withNodes = <T>(parentNode: ParentNode & T, ...nodes: ChildNode[]): T => (
	parentNode.append(...nodes),
	parentNode
)

const partsToSelector = (...parts: string[]) => parts.map(
	part => `[part~=${JSON.stringify(part)}]`
).join(',')

export const getPart = <T extends Element>(parentNode: ParentNode, ...parts: string[]): T | null => parentNode.querySelector(
	partsToSelector(...parts)
)

export const getParts = <T extends Element>(parentNode: ParentNode, ...parts: string[]): NodeListOf<T> => parentNode.querySelectorAll(
	partsToSelector(...parts)
)

export const getStyleRule = (root: DocumentOrShadowRoot, selectorText: string): CSSStyleRule | null => {
	for (const sheet of root.adoptedStyleSheets) {
		for (const cssRule of sheet.cssRules as any as CSSStyleRule[]) {
			if ('selectorText' in cssRule) {
				if (cssRule.selectorText === selectorText) {
					return cssRule
				}
			}
		}
	}

	return null
}

export const h = (name: string, attrs?: Attrs, ...children: ChildNode[]) => withNodes(
	withAttrs(
		document.createElement(name),
		Object(attrs)
	),
	...children
)

export class Fragment extends DocumentFragment {
	constructor(...children: ChildNode[]) {
		withNodes(super()!, ...children)
	}
}

export type ChildNode = Node | string

export interface Attrs {
	[name: string]: string | boolean | number | null | undefined
}

export interface ShadowRootInit extends globalThis.ShadowRootInit {
	root: Node
}
