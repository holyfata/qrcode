import { Component, Prop, State, h, Host, Watch } from '@stencil/core';
import { toCanvas, toDataURL, toString } from 'qrcode';

// Event name dispatched when the QR code generation is complete
const EVENT_READY = 'ready';

@Component({
  tag: 'hf-qrcode',
  shadow: true,
})
export class HfQrcode {
  // Input value for the QR code
  @Prop() value: string | undefined;

  // Options for QR code generation (e.g., error correction level, size)
  @Prop() options: object | undefined;

  // Tag type for rendering the QR code ('canvas', 'img', or 'svg')
  @Prop() tag: string = 'canvas';

  // Internal state to store the root element reference
  @State() private element: HTMLElement | null = null;

  // Lifecycle method: Called once the component is fully loaded
  componentDidLoad() {
    this.generate();
  }

  // Watch for changes in `value`, `options`, or `tag` props and regenerate the QR code
  @Watch('value')
  @Watch('options')
  @Watch('tag')
  handlePropChange() {
    if (this.element) {
      this.generate();
    }
  }

  // Generate the QR code based on the selected tag type
  private generate() {
    const options = this.options || {}; // Default to an empty object if no options are provided
    const value = String(this.value); // Ensure the value is a string

    // Callback to dispatch the ready event
    const done = () => {
      this.element?.dispatchEvent(new CustomEvent(EVENT_READY, { detail: this.element }));
    };

    // Handle QR code generation based on the tag type
    switch (this.tag) {
      case 'canvas': {
        const canvasTarget = this.element?.querySelector('canvas') as HTMLCanvasElement;
        if (canvasTarget) {
          toCanvas(canvasTarget, value, options, (error) => {
            if (error) {
              throw error;
            }
            done();
          });
        }
        break;
      }
      case 'img': {
        const imgTarget = this.element?.querySelector('img') as HTMLImageElement;
        if (imgTarget instanceof HTMLImageElement) {
          toDataURL(value, options, (error, url) => {
            if (error) {
              throw error;
            }
            imgTarget.src = url;
            imgTarget.onload = done;
          });
        }
        break;
      }
      case 'svg': {
        const svgTarget = this.element?.querySelector('svg') as SVGSVGElement;
        if (svgTarget instanceof SVGElement) {
          toString(value, options, (error, string) => {
            if (error) {
              throw error;
            }
            const div = document.createElement('div');
            div.innerHTML = string;
            const svg = div.querySelector('svg');
            if (svg) {
              // Copy attributes and child nodes from the generated SVG to the target SVG
              const { attributes, childNodes } = svg;
              Object.keys(attributes).forEach((key) => {
                const attribute = attributes[Number(key)];
                svgTarget?.setAttribute(attribute.name, attribute.value);
              });
              Object.keys(childNodes).forEach((key) => {
                const childNode = childNodes[Number(key)];
                svgTarget?.appendChild(childNode.cloneNode(true));
              });
              done();
            }
          });
        }
        break;
      }
      default:
        console.warn(`Unsupported tag type: ${this.tag}`);
    }
  }

  // Render the component based on the selected tag type
  render() {
    return (
      <Host>
        <div ref={(el) => (this.element = el as HTMLElement)}>
          {this.tag === 'canvas' && <canvas />}
          {this.tag === 'img' && <img />}
          {this.tag === 'svg' && <svg />}
        </div>
      </Host>
    );
  }
}
