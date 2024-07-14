import { createActor } from 'https://cdn.skypack.dev/xstate';

/*
 * options: {
 *  name: String,
 *  templateID: String,
 *  machine: XState::Machine,
 *  initFunction: (actor: Actor, shadowRoot: HTML::ShadowRoot, el: HTMLElement) => {}
 *  updateFunction: (actor: Actor, shadowRoot: HTML::ShadowRoot, el: HTMLElement) => {}
 * }
 */
export const createRoot = (
    options
) => {
    const actor = createActor(options.machine, {systemID: "root-id"});

    customElements.define(
        options.name,
        class extends HTMLElement {
            constructor() {
                super();
                const template = document.getElementById(options.templateID);
                const shadowRoot = this.attachShadow({ mode: "open" });
                shadowRoot.appendChild(template.content.cloneNode(true));
                this._shadowRoot = shadowRoot;

                actor.start();
                this._actor = actor;
            }

            connectedCallback() {
                options.initFunction(this._actor, this._shadowRoot, this);
                options.updateFunction(this._actor, this._shadowRoot, this);
                this._actor.subscribe(() => {
                    options.updateFunction(this._actor, this._shadowRoot, this);
                });
            }
        },
    );

    return {
        appRoot:actor
    }
}


/*
 * options: {
 *  name: string,
 *  templateID: string,
 *  root: Actor,
 *  actorID: string,
 *  initFunction: (actor: Actor, shadowRoot: HTML::ShadowRoot, el: HTMLElement) => {}
 *  updateFunction: (actor: Actor, shadowRoot: HTML::ShadowRoot, el: HTMLElement) => {}
 * }
 */
export const createElement = (
    options
) => {
    return customElements.define(
        options.name,
        class extends HTMLElement {
            constructor() {
                super();
                const template = document.getElementById(options.templateID);
                const shadowRoot = this.attachShadow({ mode: "open" });
                shadowRoot.appendChild(template.content.cloneNode(true));
                this._shadowRoot = shadowRoot;

                const actor = options.root.system.get(options.actorID);

                if (actor === null || actor === undefined) {
                    throw `Actor ${options.actorID} not found`;
                }

                this._actor = actor
            }

            connectedCallback() {
                options.initFunction(this._actor, this._shadowRoot, this);
                options.updateFunction(this.actor, this._shadowRoot, this);
                this._actor.subscribe(() => {
                    options.updateFunction(this.actor, this._shadowRoot, this);
                });
            }
        },
    );
}

