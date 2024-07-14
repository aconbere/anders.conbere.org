import { createMachine, assign} from 'https://cdn.skypack.dev/xstate';
import { createRoot } from "./xcom.js"

const rotatedInc = (val, max) => {
    const test = val + 1
    if (test >= max) {
        return 0;
    } else {
        return test;
    }
}

const rotatedDecr = (val, max) => {
    const test = val - 1
    if (test < 0) {
        return max-1;
    } else {
        return test;
    }
}

/*
 * The image carousel starts by rotating through a sequence of images. The
 * user can choose to move forward or backward through the sequence or to
 * "expand" an image to fill the viewport. 
 */
export const carouselMachine = createMachine({
    id: "carousel",
    initial: "loading",
    context: {
        images: [],
        index: 0,
    },
    states: {
        loading: {
            on: {
                loaded: {
                    actions: assign({
                        images: ({context, event}) => context.images = event.images
                    }),
                    target: "showing",
                }
            }
        },
        showing: {
            on: {
                next: {
                    actions: assign({
                        index: ({context}) => rotatedInc(context.index, context.images.length),
                    }),
                },
                previous: {
                    actions: assign({
                        index: ({context}) => rotatedDecr(context.index, context.images.length),
                    }),
                },
                expand: {
                    target: "expanded",
                },
            }
        },
        expanded: {
            on: {
                shrink: {
                    target: "showing",
                }
            }
        }

    },
})

export const {appRoot} = createRoot(
    {
        name: "photo-carousel",
        templateID: "photo-carousel-template",
        machine: carouselMachine,
        initFunction: (actor, shadow, el) => {
            const container = shadow.querySelector("#container");
            const links = el.querySelectorAll("a")

            const nextBtn = shadow.querySelector("#next");
            nextBtn.addEventListener("click", () => {
                actor.send({type: "next"})
            });

            const previousBtn = shadow.querySelector("#previous");
            previousBtn.addEventListener("click", () => {
                actor.send({type: "previous"})
            });

            const shrinkBtn = shadow.querySelector("#shrink");
            shrinkBtn.addEventListener("click", () => {
                actor.send({type: "shrink"})
            });

            const expandedImg = shadow.querySelector("#expanded-view img");
            expandedImg.addEventListener("click", () => {
                actor.send({type: "shrink"})
            });

            const images = Array.from(links).map((a) => {
                const img = a.querySelector("img");
                return {
                    fullURL: a.href,
                    smallURL: img.src,
                    img: img,
                }
            });

            images.forEach((image, i) => {
                if (i === 0) {
                    image.img.style.display = "";
                } else {
                    image.img.style.display = "none";
                }
                image.img.addEventListener("click", () => {
                    actor.send({type: "expand"})
                });
                container.appendChild(image.img);
            });

            actor.send({type: "loaded", images});
            el.style.display = "";
        },

        updateFunction: (actor, shadow) => {
            const stage = shadow.querySelector("#stage");
            stage.style.display = "";

            const expandedView = shadow.querySelector("#expanded-view");
            expandedView.style.display = "none";

            const expandedImg = expandedView.querySelector("img");

            const snapshot = actor.getSnapshot();

            if (snapshot.value === "showing") {
                stage.style.display = "";
                expandedView.style.display = "none";

                snapshot.context.images.forEach((img, i) => {
                    if (i === snapshot.context.index) {
                        img.img.style.display = "";
                    } else {
                        img.img.style.display = "none";
                    }
                });
            } else if (snapshot.value === "expanded") {
                expandedImg.src = snapshot.context.images[snapshot.context.index].fullURL;

                expandedView.style.display = "";
                stage.style.display = "none";
            }
        },
    }
)
