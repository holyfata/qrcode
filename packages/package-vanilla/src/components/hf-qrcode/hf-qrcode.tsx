import { Component, Prop, State, h, Host, Watch } from '@stencil/core';
import { toCanvas, toDataURL, toString } from 'qrcode';

const EVENT_READY = 'ready';

@Component({
  tag: 'hf-qrcode',
  shadow: true,
})
export class HfQrcode {
  @Prop() value: string | undefined;
  @Prop() options: object | undefined;
  @Prop() tag: string = 'canvas';

  @State() private element: HTMLElement | null = null;

  componentDidLoad() {
    console.error('hyq---componentWillLoad', this.element);
    this.generate();
  }

  @Watch('value')
  @Watch('options')
  @Watch('tag')
  handlePropChange() {
    if (this.element) {
      this.generate();
    }
  }

  private generate() {
    const options = this.options || {};
    const value = String(this.value);
    const done = () => {
      this.element?.dispatchEvent(new CustomEvent(EVENT_READY, { detail: this.element }));
    };
    console.error('hyq---generate', this.element, value, options, this.tag);
    switch (this.tag) {
      case 'canvas':
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
      case 'img':
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
      case 'svg':
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
      default:
    }
  }

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
